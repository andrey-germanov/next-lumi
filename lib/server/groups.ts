// Shared-expense groups — server-side operations (next-lumi API routes).
// See money-tracker/docs/shared-groups-spec.md for the product rules.
//
// Everything that decides WHO is in a group, or whether someone may create /
// join one, happens here with the Admin SDK — clients can't write those fields
// (firestore.rules). Expenses and activity are client-written.
import { randomBytes } from "crypto";
import { FieldValue, Timestamp, type DocumentReference, type Firestore } from "firebase-admin/firestore";
import { adminDb } from "./firebaseAdmin";
import { HttpError } from "./http";
import { isPremium } from "./premium";
import { sendGroupPush, type PushType } from "./push";
import { computeBalances, expenseInBase, settleUp, totalSpent, type ExpenseLike } from "../groupMath";

export const MAX_MEMBERS = 50;
const PERSONAL_INVITE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O, 1/I/L
const MEMBER_COLORS = ["#6C63FF", "#34D399", "#F59E0B", "#EC4899", "#38BDF8", "#F87171", "#A78BFA", "#84CC16", "#FB923C", "#14B8A6"];
const GROUP_TYPES = ["trip", "home", "event", "other"];
const PUSH_BATCH_WINDOW_MS = 2 * 60 * 1000;

// ── Types ──────────────────────────────────────────────────────────────────

export interface MemberDoc {
  name: string;
  uid: string | null;
  status: "active" | "left";
  color: string;
  joinedAt: number;
  mergedInto?: string;
}

export interface GroupDoc {
  name: string;
  emoji: string;
  type: string;
  baseCurrency: string;
  currencyLocked: boolean;
  ownerUid: string;
  memberUids: string[];
  members: Record<string, MemberDoc>;
  memberOrder: string[];
  settings: { simplifyDebts: boolean };
  status: "active" | "frozen" | "archived";
  inviteCode: string | null;
  publicToken: string | null;
  schemaVersion: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActivityAt: Timestamp;
}

interface ExpenseDoc extends ExpenseLike {
  title: string;
  categoryKey: string;
  date: string;
  splitInput?: Record<string, number>;
  createdAt?: Timestamp;
  deletedAt?: null;
}

interface UserGroupsDoc {
  groups?: Record<string, { role: "owner" | "member"; name: string; joinedAt: number }>;
  keepActiveGroupId?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const db = (): Firestore => adminDb();
const groupRef = (groupId: string) => db().collection("groups").doc(groupId);
const userGroupsRef = (uid: string) => db().collection("userGroups").doc(uid);
const inviteRef = (code: string) => db().collection("invites").doc(code);

export function generateInviteCode(): string {
  return Array.from(randomBytes(8), (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

export const normalizeCode = (raw: string): string => raw.toUpperCase().replace(/[^A-Z0-9]/g, "");

const newMemberId = () => `m_${randomBytes(6).toString("hex")}`;

function str(value: unknown, field: string, max: number): string {
  if (typeof value !== "string") throw new HttpError(400, `invalid_${field}`);
  const clean = value.trim().replace(/\s+/g, " ");
  if (!clean || clean.length > max) throw new HttpError(400, `invalid_${field}`);
  return clean;
}

const memberIdOf = (group: GroupDoc, uid: string): string | null =>
  Object.entries(group.members).find(([, m]) => m.uid === uid && m.status === "active")?.[0] ?? null;

const colorFor = (group: Pick<GroupDoc, "memberOrder">) => MEMBER_COLORS[group.memberOrder.length % MEMBER_COLORS.length];

async function loadGroup(groupId: unknown): Promise<{ ref: DocumentReference; group: GroupDoc }> {
  if (typeof groupId !== "string" || !groupId) throw new HttpError(400, "invalid_group");
  const ref = groupRef(groupId);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpError(404, "group_not_found");
  return { ref, group: snap.data() as GroupDoc };
}

function requireMember(group: GroupDoc, uid: string): string {
  const memberId = memberIdOf(group, uid);
  if (!group.memberUids.includes(uid) || !memberId) throw new HttpError(403, "not_member");
  return memberId;
}

function limitDetails(doc: UserGroupsDoc | undefined) {
  return { groups: Object.entries(doc?.groups ?? {}).map(([id, g]) => ({ id, name: g.name })) };
}

/**
 * Free users: one group total, unless the group's creator is Premium.
 *   create / join a free creator's group → allowed only with zero memberships
 *   join a Premium creator's group        → always allowed
 */
async function assertCanJoinOrCreate(uid: string, ownerUid: string | null): Promise<void> {
  const checks = await Promise.all([isPremium(uid), ownerUid && ownerUid !== uid ? isPremium(ownerUid) : Promise.resolve(false)]);
  if (checks[0] || checks[1]) return;
  const doc = (await userGroupsRef(uid).get()).data() as UserGroupsDoc | undefined;
  if (Object.keys(doc?.groups ?? {}).length > 0) throw new HttpError(403, "group_limit", limitDetails(doc));
}

function activity(ref: DocumentReference, data: Record<string, unknown>) {
  return { ref: ref.collection("activity").doc(), data: { undoneBy: null, undoneAt: null, ...data, at: FieldValue.serverTimestamp() } };
}

// ── Create ─────────────────────────────────────────────────────────────────

export async function createGroup(uid: string, body: Record<string, unknown>) {
  const name = str(body.name, "name", 40);
  const ownerName = str(body.ownerName, "member_name", 30);
  const emoji = typeof body.emoji === "string" && body.emoji.length > 0 && body.emoji.length <= 8 ? body.emoji : "✈️";
  const type = typeof body.type === "string" && GROUP_TYPES.includes(body.type) ? body.type : "trip";
  if (typeof body.baseCurrency !== "string" || !/^[A-Z]{3}$/.test(body.baseCurrency)) throw new HttpError(400, "invalid_currency");
  const baseCurrency = body.baseCurrency;

  const premium = await isPremium(uid);
  const ref = db().collection("groups").doc();
  const code = generateInviteCode();
  const memberId = newMemberId();
  const now = Date.now();

  await db().runTransaction(async (tx) => {
    const ugSnap = await tx.get(userGroupsRef(uid));
    const ug = ugSnap.data() as UserGroupsDoc | undefined;
    if (!premium && Object.keys(ug?.groups ?? {}).length > 0) {
      throw new HttpError(403, "group_limit", limitDetails(ug));
    }
    const group: Omit<GroupDoc, "createdAt" | "updatedAt" | "lastActivityAt"> & Record<string, unknown> = {
      name,
      emoji,
      type,
      baseCurrency,
      currencyLocked: false,
      ownerUid: uid,
      memberUids: [uid],
      members: { [memberId]: { name: ownerName, uid, status: "active", color: MEMBER_COLORS[0], joinedAt: now } },
      memberOrder: [memberId],
      settings: { simplifyDebts: true },
      status: "active",
      inviteCode: code,
      publicToken: null,
      schemaVersion: 1,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      lastActivityAt: FieldValue.serverTimestamp(),
    };
    tx.set(ref, group);
    tx.set(inviteRef(code), { groupId: ref.id, memberId: null, createdBy: uid, createdAt: FieldValue.serverTimestamp(), expiresAt: null, revoked: false });
    tx.set(userGroupsRef(uid), { groups: { [ref.id]: { role: "owner", name, joinedAt: now } } }, { merge: true });
    const log = activity(ref, { type: "group_created", actorUid: uid, actorMemberId: memberId });
    tx.set(log.ref, log.data);
  });

  return { groupId: ref.id, memberId, inviteCode: code };
}

// ── Invite preview & join ──────────────────────────────────────────────────

async function resolveInvite(rawCode: unknown) {
  if (typeof rawCode !== "string") throw new HttpError(404, "invite_invalid");
  const code = normalizeCode(rawCode);
  if (code.length !== 8) throw new HttpError(404, "invite_invalid");
  const snap = await inviteRef(code).get();
  const invite = snap.data() as { groupId: string; memberId: string | null; revoked: boolean; expiresAt: Timestamp | null } | undefined;
  if (!invite || invite.revoked || (invite.expiresAt && invite.expiresAt.toMillis() < Date.now())) {
    throw new HttpError(404, "invite_invalid");
  }
  const groupSnap = await groupRef(invite.groupId).get();
  if (!groupSnap.exists) throw new HttpError(404, "invite_invalid");
  return { code, invite, group: groupSnap.data() as GroupDoc, groupId: invite.groupId };
}

export async function previewInvite(rawCode: string, uid: string | null) {
  const { invite, group, groupId } = await resolveInvite(rawCode);
  const ownerMemberId = memberIdOf(group, group.ownerUid);
  const active = group.memberOrder.filter((id) => group.members[id]?.status === "active");
  const result: Record<string, unknown> = {
    groupId,
    name: group.name,
    emoji: group.emoji,
    type: group.type,
    baseCurrency: group.baseCurrency,
    status: group.status,
    ownerName: ownerMemberId ? group.members[ownerMemberId].name : "",
    memberCount: active.length,
    members: active.map((id) => ({ id, name: group.members[id].name, color: group.members[id].color, hasAccount: !!group.members[id].uid })),
    placeholders: active.filter((id) => !group.members[id].uid).map((id) => ({ id, name: group.members[id].name })),
    targetMemberId: invite.memberId && !group.members[invite.memberId]?.uid ? invite.memberId : null,
    full: active.length >= MAX_MEMBERS,
  };
  if (uid) {
    result.alreadyMember = group.memberUids.includes(uid);
    if (!result.alreadyMember) {
      try {
        await assertCanJoinOrCreate(uid, group.ownerUid);
        result.limit = null;
      } catch (error) {
        if (error instanceof HttpError && error.code === "group_limit") result.limit = error.details;
        else throw error;
      }
    }
  }
  return result;
}

export async function joinGroup(uid: string, userName: string | undefined, body: Record<string, unknown>) {
  const { invite, group: initial, groupId } = await resolveInvite(body.code);
  const ref = groupRef(groupId);
  if (initial.memberUids.includes(uid)) {
    return { groupId, memberId: memberIdOf(initial, uid), alreadyMember: true };
  }

  const [userPremium, ownerPremium] = await Promise.all([isPremium(uid), isPremium(initial.ownerUid)]);
  const requested = typeof body.memberId === "string" ? body.memberId : invite.memberId;
  const now = Date.now();
  let joinedMemberId = "";

  await db().runTransaction(async (tx) => {
    const [groupSnap, ugSnap] = await Promise.all([tx.get(ref), tx.get(userGroupsRef(uid))]);
    if (!groupSnap.exists) throw new HttpError(404, "invite_invalid");
    const group = groupSnap.data() as GroupDoc;
    const ug = ugSnap.data() as UserGroupsDoc | undefined;

    if (group.memberUids.includes(uid)) {
      joinedMemberId = memberIdOf(group, uid) ?? "";
      return;
    }
    if (!userPremium && !ownerPremium && Object.keys(ug?.groups ?? {}).length > 0) {
      throw new HttpError(403, "group_limit", limitDetails(ug));
    }
    const activeCount = group.memberOrder.filter((id) => group.members[id]?.status === "active").length;

    const updates: Record<string, unknown> = {
      memberUids: FieldValue.arrayUnion(uid),
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (requested) {
      const target = group.members[requested];
      if (!target || target.status !== "active") throw new HttpError(404, "member_not_found");
      if (target.uid) throw new HttpError(409, "member_taken");
      updates[`members.${requested}.uid`] = uid;
      joinedMemberId = requested;
    } else {
      if (activeCount >= MAX_MEMBERS) throw new HttpError(409, "group_full");
      const name = str(body.name ?? userName ?? "", "member_name", 30);
      joinedMemberId = newMemberId();
      updates[`members.${joinedMemberId}`] = { name, uid, status: "active", color: colorFor(group), joinedAt: now };
      updates.memberOrder = FieldValue.arrayUnion(joinedMemberId);
    }

    tx.update(ref, updates);
    tx.set(userGroupsRef(uid), { groups: { [groupId]: { role: "member", name: group.name, joinedAt: now } } }, { merge: true });
    const log = activity(ref, { type: "member_joined", actorUid: uid, actorMemberId: joinedMemberId, memberId: joinedMemberId });
    tx.set(log.ref, log.data);
  });

  if (!ownerPremium) await applyOwnerPremiumPolicy(initial.ownerUid, false).catch(() => {});
  const fresh = (await ref.get()).data() as GroupDoc;
  await notifyMembers(groupId, fresh, uid, "member_joined").catch(() => {});
  return { groupId, memberId: joinedMemberId, alreadyMember: false };
}

// ── Members ────────────────────────────────────────────────────────────────

async function reassignExpenses(groupId: string, from: string, into: string): Promise<void> {
  const snap = await groupRef(groupId).collection("expenses").get();
  const move = (record?: Record<string, number>) => {
    if (!record || !(from in record)) return record ?? {};
    const out = { ...record };
    out[into] = (out[into] ?? 0) + out[from];
    delete out[from];
    return out;
  };
  let batch = db().batch();
  let pending = 0;
  for (const doc of snap.docs) {
    const e = doc.data() as ExpenseDoc;
    const touches = e.paidBy === from || from in (e.splits ?? {}) || from in (e.splitInput ?? {});
    if (!touches) continue;
    batch.update(doc.ref, {
      paidBy: e.paidBy === from ? into : e.paidBy,
      splits: move(e.splits),
      splitInput: move(e.splitInput),
      version: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    });
    if (++pending === 400) {
      await batch.commit();
      batch = db().batch();
      pending = 0;
    }
  }
  if (pending > 0) await batch.commit();
}

export async function memberOperation(uid: string, body: Record<string, unknown>) {
  const op = body.op;
  const { ref, group: snapshotGroup } = await loadGroup(body.groupId);
  const groupId = ref.id;
  let mergePlan: { from: string; into: string } | null = null;
  let resultMemberId: string | null = null;

  await db().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpError(404, "group_not_found");
    const group = snap.data() as GroupDoc;
    const me = requireMember(group, uid);
    const isOwner = group.ownerUid === uid;
    if (group.status === "archived") throw new HttpError(409, "group_archived");
    const targetId = typeof body.memberId === "string" ? body.memberId : null;
    const target = targetId ? group.members[targetId] : undefined;
    const updates: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
    let logType = "";

    switch (op) {
      case "add": {
        const active = group.memberOrder.filter((id) => group.members[id]?.status === "active").length;
        if (active >= MAX_MEMBERS) throw new HttpError(409, "group_full");
        const id = newMemberId();
        updates[`members.${id}`] = { name: str(body.name, "member_name", 30), uid: null, status: "active", color: colorFor(group), joinedAt: Date.now() };
        updates.memberOrder = FieldValue.arrayUnion(id);
        resultMemberId = id;
        logType = "member_added";
        break;
      }
      case "rename": {
        if (!target || !targetId) throw new HttpError(404, "member_not_found");
        if (!(target.uid === null || target.uid === uid || isOwner)) throw new HttpError(403, "forbidden");
        updates[`members.${targetId}.name`] = str(body.name, "member_name", 30);
        resultMemberId = targetId;
        logType = "member_renamed";
        break;
      }
      case "remove": {
        if (!target || !targetId || target.status !== "active") throw new HttpError(404, "member_not_found");
        if (target.uid === group.ownerUid) throw new HttpError(400, "cannot_remove_owner");
        // Name-only members: anyone. Members with an account: owner only.
        if (target.uid && !isOwner) throw new HttpError(403, "owner_only");
        updates[`members.${targetId}.status`] = "left";
        if (target.uid) {
          updates.memberUids = FieldValue.arrayRemove(target.uid);
          tx.set(userGroupsRef(target.uid), { groups: { [groupId]: FieldValue.delete() } }, { merge: true });
          // A removed person must not be able to walk back in with the old link.
          if (group.inviteCode) tx.set(inviteRef(group.inviteCode), { revoked: true }, { merge: true });
          const code = generateInviteCode();
          tx.set(inviteRef(code), { groupId, memberId: null, createdBy: uid, createdAt: FieldValue.serverTimestamp(), expiresAt: null, revoked: false });
          updates.inviteCode = code;
        }
        resultMemberId = targetId;
        logType = "member_removed";
        break;
      }
      case "leave": {
        if (isOwner) throw new HttpError(400, "owner_cannot_leave");
        updates[`members.${me}.status`] = "left";
        updates.memberUids = FieldValue.arrayRemove(uid);
        tx.set(userGroupsRef(uid), { groups: { [groupId]: FieldValue.delete() } }, { merge: true });
        resultMemberId = me;
        logType = "member_left";
        break;
      }
      case "unlink": {
        if (!isOwner) throw new HttpError(403, "owner_only");
        if (!target || !targetId || !target.uid) throw new HttpError(404, "member_not_found");
        if (target.uid === group.ownerUid) throw new HttpError(400, "cannot_remove_owner");
        updates[`members.${targetId}.uid`] = null;
        updates.memberUids = FieldValue.arrayRemove(target.uid);
        tx.set(userGroupsRef(target.uid), { groups: { [groupId]: FieldValue.delete() } }, { merge: true });
        resultMemberId = targetId;
        logType = "member_removed";
        break;
      }
      case "merge": {
        if (!isOwner) throw new HttpError(403, "owner_only");
        const intoId = typeof body.intoMemberId === "string" ? body.intoMemberId : null;
        const into = intoId ? group.members[intoId] : undefined;
        if (!target || !targetId || !into || !intoId || targetId === intoId) throw new HttpError(404, "member_not_found");
        if (target.uid && into.uid) throw new HttpError(400, "both_have_accounts");
        if (target.uid) updates[`members.${intoId}.uid`] = target.uid;
        updates[`members.${targetId}.status`] = "left";
        updates[`members.${targetId}.uid`] = null;
        updates[`members.${targetId}.mergedInto`] = intoId;
        mergePlan = { from: targetId, into: intoId };
        resultMemberId = intoId;
        logType = "member_merged";
        break;
      }
      default:
        throw new HttpError(400, "invalid_op");
    }

    tx.update(ref, updates);
    const log = activity(ref, { type: logType, actorUid: uid, actorMemberId: me, memberId: resultMemberId });
    tx.set(log.ref, log.data);
  });

  if (mergePlan) {
    const plan = mergePlan as { from: string; into: string };
    await reassignExpenses(groupId, plan.from, plan.into);
  }
  void snapshotGroup;
  return { groupId, memberId: resultMemberId };
}

// ── Delete group (owner only) ──────────────────────────────────────────────

async function deleteGroupInternal(groupId: string, group: GroupDoc, actorUid: string): Promise<void> {
  await notifyMembers(groupId, group, actorUid, "group_deleted").catch(() => {});
  const ref = groupRef(groupId);
  await db().recursiveDelete(ref);

  const [invites, links] = await Promise.all([
    db().collection("invites").where("groupId", "==", groupId).get(),
    db().collection("publicLinks").where("groupId", "==", groupId).get(),
  ]);
  const batch = db().batch();
  invites.docs.forEach((doc) => batch.delete(doc.ref));
  links.docs.forEach((doc) => batch.delete(doc.ref));
  const everyone = new Set([...group.memberUids, group.ownerUid]);
  everyone.forEach((memberUid) => batch.set(userGroupsRef(memberUid), { groups: { [groupId]: FieldValue.delete() } }, { merge: true }));
  await batch.commit();
}

export async function deleteGroup(uid: string, body: Record<string, unknown>) {
  const { ref, group } = await loadGroup(body.groupId);
  if (group.ownerUid !== uid) throw new HttpError(403, "owner_only");
  await deleteGroupInternal(ref.id, group, uid);
  return { deleted: true };
}

// ── Invites & public link ──────────────────────────────────────────────────

export async function inviteOperation(uid: string, body: Record<string, unknown>) {
  const { ref, group } = await loadGroup(body.groupId);
  requireMember(group, uid);
  const groupId = ref.id;

  if (typeof body.memberId === "string") {
    const target = group.members[body.memberId];
    if (!target || target.uid || target.status !== "active") throw new HttpError(404, "member_not_found");
    const code = generateInviteCode();
    await inviteRef(code).set({
      groupId,
      memberId: body.memberId,
      createdBy: uid,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: Timestamp.fromMillis(Date.now() + PERSONAL_INVITE_TTL_MS),
      revoked: false,
    });
    return { code, memberId: body.memberId };
  }

  if (body.rotate === true || !group.inviteCode) {
    if (body.rotate === true && group.ownerUid !== uid) throw new HttpError(403, "owner_only");
    const code = generateInviteCode();
    const batch = db().batch();
    if (group.inviteCode) batch.set(inviteRef(group.inviteCode), { revoked: true }, { merge: true });
    batch.set(inviteRef(code), { groupId, memberId: null, createdBy: uid, createdAt: FieldValue.serverTimestamp(), expiresAt: null, revoked: false });
    batch.update(ref, { inviteCode: code, updatedAt: FieldValue.serverTimestamp() });
    await batch.commit();
    return { code };
  }
  return { code: group.inviteCode };
}

export async function publicLinkOperation(uid: string, body: Record<string, unknown>) {
  const { ref, group } = await loadGroup(body.groupId);
  if (group.ownerUid !== uid) throw new HttpError(403, "owner_only");
  const batch = db().batch();
  if (group.publicToken) batch.set(db().collection("publicLinks").doc(group.publicToken), { revoked: true }, { merge: true });
  let token: string | null = null;
  if (body.enable === true) {
    token = randomBytes(16).toString("base64url");
    batch.set(db().collection("publicLinks").doc(token), { groupId: ref.id, revoked: false, createdAt: FieldValue.serverTimestamp() });
  }
  batch.update(ref, { publicToken: token, updatedAt: FieldValue.serverTimestamp() });
  await batch.commit();
  return { token };
}

// ── Premium lapse: freeze all but one of the owner's groups ────────────────

export async function applyOwnerPremiumPolicy(ownerUid: string, premium?: boolean): Promise<void> {
  const hasPremium = premium ?? (await isPremium(ownerUid));
  const owned = await db().collection("groups").where("ownerUid", "==", ownerUid).get();
  const candidates = owned.docs.filter((doc) => (doc.data() as GroupDoc).status !== "archived");
  if (candidates.length === 0) return;

  let keepId: string | null = null;
  if (!hasPremium && candidates.length > 1) {
    const preferred = ((await userGroupsRef(ownerUid).get()).data() as UserGroupsDoc | undefined)?.keepActiveGroupId;
    keepId =
      candidates.find((doc) => doc.id === preferred)?.id ??
      [...candidates].sort(
        (a, b) =>
          ((b.data() as GroupDoc).lastActivityAt?.toMillis?.() ?? 0) - ((a.data() as GroupDoc).lastActivityAt?.toMillis?.() ?? 0),
      )[0].id;
  }

  const batch = db().batch();
  let changes = 0;
  for (const doc of candidates) {
    const current = (doc.data() as GroupDoc).status;
    const next = hasPremium || candidates.length <= 1 || doc.id === keepId ? "active" : "frozen";
    if (current !== next) {
      batch.update(doc.ref, { status: next, updatedAt: FieldValue.serverTimestamp() });
      changes++;
    }
  }
  if (changes > 0) await batch.commit();
}

export async function keepActive(uid: string, body: Record<string, unknown>) {
  const { ref, group } = await loadGroup(body.groupId);
  if (group.ownerUid !== uid) throw new HttpError(403, "owner_only");
  await userGroupsRef(uid).set({ keepActiveGroupId: ref.id }, { merge: true });
  await applyOwnerPremiumPolicy(uid);
  return { groupId: ref.id };
}

// ── Account deletion ───────────────────────────────────────────────────────

export async function cleanupAccount(uid: string) {
  const doc = (await userGroupsRef(uid).get()).data() as UserGroupsDoc | undefined;
  for (const groupId of Object.keys(doc?.groups ?? {})) {
    const snap = await groupRef(groupId).get();
    if (!snap.exists) continue;
    const group = snap.data() as GroupDoc;
    if (group.ownerUid === uid) {
      await deleteGroupInternal(groupId, group, uid);
    } else {
      const memberId = memberIdOf(group, uid);
      const updates: Record<string, unknown> = { memberUids: FieldValue.arrayRemove(uid), updatedAt: FieldValue.serverTimestamp() };
      if (memberId) {
        updates[`members.${memberId}.status`] = "left";
        updates[`members.${memberId}.uid`] = null;
      }
      await groupRef(groupId).update(updates);
    }
  }
  await userGroupsRef(uid).delete();
  return { cleaned: true };
}

// ── Push after a client write ──────────────────────────────────────────────

async function notifyMembers(
  groupId: string,
  group: GroupDoc,
  actorUid: string,
  type: PushType,
  expense?: ExpenseDoc,
): Promise<void> {
  const actorMemberId = memberIdOf(group, actorUid) ?? Object.entries(group.members).find(([, m]) => m.uid === actorUid)?.[0];
  const actorName = actorMemberId ? group.members[actorMemberId].name : "Lumi";
  const recipients: string[] = [];

  for (const recipientUid of group.memberUids) {
    if (recipientUid === actorUid) continue;
    const prefs = (await db().collection("users").doc(recipientUid).collection("groupPrefs").doc(groupId).get()).data() as
      | { notifyLevel?: "all" | "involved" | "off" }
      | undefined;
    const level = prefs?.notifyLevel ?? "involved";
    if (type === "group_deleted") {
      recipients.push(recipientUid);
      continue;
    }
    if (level === "off") continue;
    const memberId = memberIdOf(group, recipientUid);
    const involved = !!expense && !!memberId && (expense.paidBy === memberId || memberId in (expense.splits ?? {}));
    if (level === "all" || involved) recipients.push(recipientUid);
  }
  if (recipients.length === 0) return;

  // A burst of expenses from one person during a trip → one push, "+N more".
  let suppressedCount = 0;
  if (type !== "group_deleted" && type !== "member_joined") {
    const throttleRef = db().collection("groupNotify").doc(`${groupId}_${actorUid}`);
    const proceed = await db().runTransaction(async (tx) => {
      const state = (await tx.get(throttleRef)).data() as { lastSentAt?: number; suppressed?: number } | undefined;
      const now = Date.now();
      if (state?.lastSentAt && now - state.lastSentAt < PUSH_BATCH_WINDOW_MS) {
        tx.set(throttleRef, { suppressed: (state.suppressed ?? 0) + 1 }, { merge: true });
        return false;
      }
      suppressedCount = state?.suppressed ?? 0;
      tx.set(throttleRef, { lastSentAt: now, suppressed: 0 });
      return true;
    });
    if (!proceed) return;
  }

  const base = expense ? expenseInBase(expense, group.baseCurrency, group.memberOrder) : null;
  await sendGroupPush(recipients, {
    type,
    groupId,
    groupName: group.name,
    groupEmoji: group.emoji,
    actorName,
    title: expense?.title,
    amountMinor: base?.total,
    currency: expense ? group.baseCurrency : undefined,
    suppressedCount,
  });
}

const ACTIVITY_TO_PUSH: Record<string, PushType | undefined> = {
  expense_added: "expense_added",
  expense_edited: "expense_edited",
  expense_deleted: "expense_deleted",
  expense_restored: "expense_restored",
  settlement_added: "settlement_added",
};

export async function notifyActivity(uid: string, body: Record<string, unknown>) {
  const { ref, group } = await loadGroup(body.groupId);
  requireMember(group, uid);
  if (typeof body.activityId !== "string") throw new HttpError(400, "invalid_activity");
  const log = (await ref.collection("activity").doc(body.activityId).get()).data() as
    | { type: string; actorUid: string; expenseId?: string }
    | undefined;
  if (!log || log.actorUid !== uid) throw new HttpError(404, "activity_not_found");
  const pushType = ACTIVITY_TO_PUSH[log.type];
  if (!pushType) return { sent: false };
  const expense = log.expenseId ? ((await ref.collection("expenses").doc(log.expenseId).get()).data() as ExpenseDoc | undefined) : undefined;
  await notifyMembers(ref.id, group, uid, pushType, expense);
  return { sent: true };
}

// ── Public live link (read-only, no auth) ──────────────────────────────────

export async function getPublicTrip(token: string) {
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(token)) throw new HttpError(404, "link_inactive");
  const link = (await db().collection("publicLinks").doc(token).get()).data() as { groupId: string; revoked: boolean } | undefined;
  if (!link || link.revoked) throw new HttpError(404, "link_inactive");
  const snap = await groupRef(link.groupId).get();
  if (!snap.exists) throw new HttpError(404, "link_inactive");
  const group = snap.data() as GroupDoc;
  if (group.publicToken !== token) throw new HttpError(404, "link_inactive");

  const expenseSnap = await snap.ref.collection("expenses").get();
  const expenses = expenseSnap.docs
    .map((doc) => ({ id: doc.id, ...(doc.data() as ExpenseDoc) }))
    .filter((e) => !e.deletedAt)
    .sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));

  const order = group.memberOrder;
  return {
    name: group.name,
    emoji: group.emoji,
    baseCurrency: group.baseCurrency,
    status: group.status,
    updatedAt: Date.now(),
    ownerMemberId: memberIdOf(group, group.ownerUid),
    members: order
      .filter((id) => group.members[id] && !group.members[id].mergedInto)
      .map((id) => ({ id, name: group.members[id].name, color: group.members[id].color, status: group.members[id].status })),
    expenses: expenses.map((e) => ({
      id: e.id,
      kind: e.kind,
      title: e.title,
      categoryKey: e.categoryKey,
      date: e.date,
      amountMinor: e.amountMinor,
      currency: e.currency,
      amountBaseMinor: expenseInBase(e, group.baseCurrency, order).total,
      paidBy: e.paidBy,
      splits: expenseInBase(e, group.baseCurrency, order).splits,
    })),
    balances: computeBalances(expenses, group.baseCurrency, order),
    transfers: settleUp(expenses, group.baseCurrency, order, group.settings?.simplifyDebts !== false),
    totalSpentMinor: totalSpent(expenses, group.baseCurrency, order),
  };
}
