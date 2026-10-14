/* eslint-disable @next/next/no-img-element -- unDraw SVGs are static vector files; next/image adds nothing */
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQAccordion from "@/components/FAQAccordion";
import AppStoreButton from "@/components/AppStoreButton";
import AndroidBetaForm from "./AndroidBetaForm";
import TesterCount from "./TesterCount";
import { getAndroidBetaCopy } from "@/lib/androidBetaI18n";
import { SOCIAL_LINKS } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";

const STEP_ART = ["message-sent", "app-installation", "fixing-bugs"];

const PERK_ICONS = [
  // rocket — early access
  <path key="r" d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1zM12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2zM9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5" />,
  // chat — direct line
  <path key="c" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  // sparkles — shape the app
  <path key="s" d="M12 3l1.9 5.8L20 10.7l-6.1 1.9L12 18.5l-1.9-5.9L4 10.7l6.1-1.9zM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z" />,
  // shield — privacy
  <path key="p" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4" />,
];

/** /android and /[locale]/android — Google Play closed-test signup. */
export default function AndroidBetaBody({ locale }: { locale: Locale }) {
  const c = getAndroidBetaCopy(locale);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Header />
      <main className="relative overflow-hidden pt-24">
        <div className="hero-orb" style={{ top: -420, left: "50%", transform: "translateX(-50%)", opacity: 0.55 }} />

        {/* Hero + form */}
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-20 lg:pt-16">
          <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <p
                className="label inline-flex items-center gap-2"
                style={{ marginBottom: 20, color: "#3DDC84", background: "rgba(61,220,132,0.12)", padding: "6px 12px", borderRadius: 999 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#3DDC84" aria-hidden="true">
                  <path d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.66-.38l-1.86 3.22A11.4 11.4 0 0 0 12 8.1c-1.75 0-3.4.39-4.92 1.04L5.22 5.92a.38.38 0 0 0-.66.38L6.4 9.48A10.8 10.8 0 0 0 1 18h22a10.8 10.8 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
                </svg>
                <span style={{ color: "#0A8F5F" }}>{c.eyebrow}</span>
              </p>
              <h1
                style={{
                  fontSize: "clamp(34px, 5.2vw, 58px)",
                  fontWeight: 800,
                  letterSpacing: "-2px",
                  lineHeight: 1.04,
                  color: "#0A0A0A",
                  marginBottom: 20,
                }}
              >
                {c.title1}
                <br />
                <span style={{ color: "#6C63FF" }}>{c.title2}</span>
              </h1>
              <p className="lg:mb-8" style={{ fontSize: 17, lineHeight: 1.6, color: "#63636B", maxWidth: 520 }}>{c.subtitle}</p>
              <div className="hidden lg:block">
                <img src="/images/android-beta/android.svg" alt="" width={480} height={360} style={{ width: "100%", maxWidth: 440, height: "auto" }} />
              </div>
            </div>
            <div className="w-full max-w-md justify-self-center lg:justify-self-end">
              <AndroidBetaForm copy={c} locale={locale} />
            </div>
          </div>
        </section>

        {/* Why testers matter: Google's 12 × 14 rule */}
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pb-24">
          <div className="surface-dark rounded-3xl grid items-center gap-10 md:grid-cols-[1.2fr_1fr]" style={{ padding: "clamp(28px, 5vw, 56px)" }}>
            <div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.12, color: "#FFFFFF", marginBottom: 14 }}>
                {c.progressTitle}
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.65)", marginBottom: 28, maxWidth: 480 }}>{c.progressBody}</p>
              <div className="flex flex-wrap gap-3" style={{ marginBottom: 24 }}>
                {[
                  ["12", c.statTesters],
                  ["14", c.statDays],
                ].map(([n, unit]) => (
                  <div key={unit} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 20px", minWidth: 120 }}>
                    <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-1px", color: "#9C8FFF" }}>{n}</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginLeft: 8 }}>{unit}</span>
                  </div>
                ))}
              </div>
              <TesterCount template={c.progressCount} />
            </div>
            <img
              src="/images/android-beta/mobile-testing.svg"
              alt=""
              width={751}
              height={570}
              className="hidden md:block"
              style={{ width: "100%", maxWidth: 380, height: "auto", justifySelf: "center", background: "#FFFFFF", borderRadius: 24, padding: 24 }}
            />
          </div>
        </section>

        {/* Steps */}
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pb-24">
          <p className="label text-center" style={{ marginBottom: 12 }}>{c.stepsEyebrow}</p>
          <h2 className="text-center" style={{ fontSize: "clamp(26px, 3.4vw, 40px)", fontWeight: 800, letterSpacing: "-1.2px", color: "#0A0A0A", marginBottom: 48 }}>
            {c.stepsTitle}
          </h2>
          <ol className="grid gap-6 md:grid-cols-3">
            {c.steps.map((s, i) => (
              <li key={s.title} className="surface rounded-3xl flex flex-col" style={{ padding: 28 }}>
                <div className="flex items-center justify-center rounded-2xl" style={{ background: "#F7F7F8", height: 180, marginBottom: 24, padding: 20 }}>
                  <img src={`/images/android-beta/${STEP_ART[i]}.svg`} alt="" width={240} height={160} style={{ maxHeight: "100%", width: "auto" }} loading="lazy" />
                </div>
                <span
                  className="inline-flex items-center justify-center"
                  style={{ width: 32, height: 32, borderRadius: 10, background: "#6C63FF", color: "#FFFFFF", fontSize: 14, fontWeight: 800, marginBottom: 14 }}
                >
                  {i + 1}
                </span>
                <h3 style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.4px", color: "#0A0A0A", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "#63636B" }}>{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Perks */}
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <p className="label" style={{ marginBottom: 12 }}>{c.perksEyebrow}</p>
              <h2 style={{ fontSize: "clamp(26px, 3.4vw, 40px)", fontWeight: 800, letterSpacing: "-1.2px", lineHeight: 1.1, color: "#0A0A0A", marginBottom: 28 }}>
                {c.perksTitle}
              </h2>
              <img src="/images/android-beta/feedback.svg" alt="" width={520} height={400} loading="lazy" style={{ width: "100%", maxWidth: 420, height: "auto" }} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {c.perks.map((p, i) => (
                <div key={p.title} className="surface rounded-2xl" style={{ padding: 24 }}>
                  <span className="inline-flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(108,99,255,0.1)", marginBottom: 16 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {PERK_ICONS[i]}
                    </svg>
                  </span>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A", marginBottom: 6 }}>{p.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: "#63636B" }}>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative mx-auto max-w-2xl px-4 sm:px-6 pb-24">
          <h2 className="text-center" style={{ fontSize: "clamp(26px, 3.4vw, 40px)", fontWeight: 800, letterSpacing: "-1.2px", color: "#0A0A0A", marginBottom: 32 }}>
            {c.faqTitle}
          </h2>
          <FAQAccordion items={c.faq.map((f) => ({ question: f.q, answer: f.a }))} />
        </section>

        {/* Bottom */}
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pb-24">
          <div className="surface rounded-3xl text-center" style={{ padding: "clamp(32px, 6vw, 56px) clamp(20px, 5vw, 48px)" }}>
            <p style={{ fontSize: "clamp(22px, 2.6vw, 28px)", fontWeight: 800, letterSpacing: "-0.8px", color: "#0A0A0A", marginBottom: 8 }}>{c.bottomTitle}</p>
            <p style={{ fontSize: 15, color: "#63636B", marginBottom: 28 }}>{c.bottomBody}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <AppStoreButton location="android_beta" />
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition hover:bg-black/5"
                style={{ border: "1px solid rgba(0,0,0,0.12)", color: "#0A0A0A" }}
              >
                {c.tgCta}
              </a>
              <a href="#join" className="inline-flex items-center rounded-xl px-6 py-3 font-semibold hover:text-primary" style={{ color: "#63636B" }}>
                ↑ {c.bottomCta}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
