---
name: announcement-visual
description: Create the hero image for an in-app announcement (the `image` field in web/announcements.json, shown in Lumi's "What's new" feed). Use whenever a news entry needs artwork — "картинка для новости", "hero for the announcement", "визуал для анонса", "make a banner for the release" — or when adding an entry to the announcements feed at all, since an entry without art renders text-only. Produces a 1200×675 @2x PNG in Lumi's design language, rendered from HTML via the Chrome already on this machine, ready to deploy to lumi.herman-apps.com.
metadata:
  version: 1.0.0
---

# Announcement hero images

The news feed (bell on Home → "What's new") renders `image` at **16:9 inside an
18px-radius card**, roughly 350×197pt on a phone. Ship **1200×675**, rendered at
@2x → 2400×1350. Everything about the feed itself — schema, fields, deploy — is
in `web/README.md`; this skill is only about making the picture.

## Files

- `template.html` — the canvas, Lumi's real palette as CSS tokens, and four
  ready subjects: `.headline`, `.browser`, `.phone`, `.badge`
- `render.sh` — `./render.sh in.html out.png`, uses `/Applications/Google Chrome.app`
  (no npm install, nothing added to the app's dependencies)

Working files go in `web/news/` next to the feed: `web/news/<id>.html` and
`web/news/<id>.png`, where `<id>` matches the announcement's `id`. Both get
deployed; the HTML is harmless and makes the next edit trivial.

## Procedure

1. **Know what the news is first.** Read the entry's `copy` — the hero has to
   show the thing the headline claims. A hero picked before the copy exists is
   decoration, and it looks like it.

2. **Ground it, don't invent it.** Load the `visual-design-reference` skill.
   For app-feature news the strongest reference is *the app itself*: take a
   real simulator screenshot (`ios-app-testing` skill) and drop it into
   `.phone` rather than mocking up a fake screen. A real screen beats a
   drawn approximation every time, and it can't misrepresent the feature.

3. **Pick exactly one subject.**

   | Subject | Use for |
   |---|---|
   | `.phone` + real screenshot | a new/changed screen in the app |
   | `.browser` | anything about the web version |
   | `.badge` | a logo or mark — a partner, a channel, an integration |
   | `.headline` | news with nothing to show: pricing, a milestone, a policy |

   Two subjects side by side reads as a collage. If you can't choose, the news
   is probably two announcements.

4. **Copy `template.html` to `web/news/<id>.html`, replace the contents of
   `.stage`, and render:**

   ```bash
   .claude/skills/announcement-visual/render.sh web/news/<id>.html web/news/<id>.png
   ```

   `render.sh` prints the dimensions and warns if they aren't 2400×1350 (that
   means `body`'s width/height got edited — put them back).

5. **Look at the PNG.** Read the rendered file, actually. Rendering is not
   verification: CSS that looks right in source routinely produces overlapping
   glass, a subject drifting off-centre, or a shadow clipped at the edge. This
   is also where the two most common problems show up — a subject too small to
   read at phone size, and text that collides with an orb.

6. **Check it at real size.** The card is ~350pt wide, so the image is displayed
   at under a third of its rendered width. Anything below ~28px in the 1200×675
   canvas is illegible on a phone. When in doubt, make the subject bigger and
   drop an element.

7. **Wire it up** — add `"image": "https://lumi.herman-apps.com/news/<id>.png"`
   to the entry in `web/announcements.json`, deploy both files together. An
   entry pointing at an image that isn't live yet renders text-only until the
   deploy lands (it degrades cleanly, but it does look broken-ish).

## Rules that keep these on-brand

- **Never repeat the copy in the image.** The card already shows title,
  subtitle and body directly under the hero. A hero with the headline burned
  into it says everything twice and goes stale the moment the copy is edited —
  and it can't be translated, while the copy around it is. `.headline` is for
  news that has *nothing else* to show, and even then keep it to a few words.
- **Palette is fixed.** Use the tokens in `template.html` — they're the app's
  real values from `src/contexts/ThemeContext.tsx`. Violet is the default;
  `--mint` for `improvement` news; a blue wash for `community`. A colour that
  isn't in the app makes the feed look like an ad.
- **Respect the safe area.** Keep content inside `.stage` (1000×500). The
  corners get clipped by the card radius.
- **Two orbs maximum.** Three starts to look like a screensaver.
- **No stock photography, no 3D renders, no emoji as the subject.** The
  in-app artwork is flat, geometric and glassy — a hero in a different idiom
  reads as pasted in from another product.

## Checklist

- [ ] Subject matches what the headline claims
- [ ] Exactly one subject
- [ ] No copy text burned into the image
- [ ] Rendered PNG actually looked at, not just produced
- [ ] Legible when mentally scaled to ~350pt wide
- [ ] 2400×1350, under ~1.5MB
- [ ] `web/news/<id>.html` and `.png` both saved, `image` URL added to the entry
