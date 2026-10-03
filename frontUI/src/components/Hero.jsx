import React from "react";
import { ArrowRight, BookOpen, Clock, Heart, Sparkles, MapPin } from "lucide-react";
import { translations } from "../utils/api";

export default function Hero({ lang, setActiveTab, onOpenDonate, nextPrayerInfo }) {
  const t = translations[lang] || translations.en;

  return (
    <section
      style={{
        position: "relative",
        padding: "4.5rem 0 5.5rem",
        overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 20%, rgba(14, 38, 26, 0.95) 0%, rgba(5, 15, 10, 1) 100%)",
        borderBottom: "1px solid rgba(201, 162, 39, 0.18)",
      }}
    >
      {/* Decorative Golden Ambient Aura */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "400px",
          background: "radial-gradient(ellipse at center, rgba(201, 162, 39, 0.14) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            maxWidth: "880px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.3rem 0.85rem",
              borderRadius: "6px",
              background: "rgba(201, 162, 39, 0.12)",
              border: "1px solid rgba(201, 162, 39, 0.3)",
              color: "var(--gold-light)",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            <Sparkles size={13} color="var(--gold)" />
            <span>{t.hero_badge}</span>
          </div>

          {/* Arabic Bismillah with dedicated Arabic font */}
          <div
            dir="rtl"
            style={{
              fontFamily: "var(--font-arabic)",
              fontSize: "1.45rem",
              lineHeight: 1.5,
              color: "var(--gold-light)",
              marginBottom: "0.85rem",
            }}
          >
            بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              fontWeight: 800,
              lineHeight: 1.18,
              marginBottom: "1.25rem",
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              textWrap: "balance",
            }}
          >
            {t.hero_title_1}{" "}
            <span
              style={{
                color: "var(--gold-light)",
                display: "inline-block",
              }}
            >
              {t.hero_title_2}
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              color: "var(--text-secondary)",
              maxWidth: "680px",
              margin: "0 auto 2.25rem",
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            {t.hero_subtitle}
          </p>

          {/* Action CTAs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.85rem",
              flexWrap: "wrap",
              marginBottom: "3rem",
            }}
          >
            <button
              onClick={() => setActiveTab("institute")}
              className="btn btn-gold btn-lg"
            >
              <BookOpen size={18} />
              <span>{t.btn_explore_courses}</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => setActiveTab("prayers")}
              className="btn btn-outline btn-lg"
            >
              <Clock size={18} />
              <span>{t.btn_view_prayers}</span>
            </button>

            <button
              onClick={onOpenDonate}
              className="btn btn-emerald btn-lg"
            >
              <Heart size={18} fill="#FFFFFF" />
              <span>{t.btn_donate}</span>
            </button>
          </div>

          {/* Next Prayer Highlight Card */}
          {nextPrayerInfo && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "1.25rem",
                padding: "0.65rem 1.25rem",
                borderRadius: "8px",
                background: "#0D2218",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#10B981",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "var(--gold-light)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {t.next_prayer}:
                </span>
                <strong style={{ fontSize: "0.95rem", color: "#FFFFFF", fontWeight: 700 }}>
                  {nextPrayerInfo.name} ({nextPrayerInfo.time})
                </strong>
              </div>

              <div style={{ height: "16px", width: "1px", background: "rgba(255, 255, 255, 0.15)" }} />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: "var(--text-secondary)",
                  fontSize: "0.8rem",
                }}
              >
                <MapPin size={14} color="var(--gold)" />
                <span>Kinondoni, Dar es Salaam</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
