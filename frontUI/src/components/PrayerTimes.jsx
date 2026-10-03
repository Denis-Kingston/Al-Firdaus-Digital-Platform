import React, { useState, useEffect } from "react";
import { Clock, Sun, Moon, Sunrise, Sunset, Calendar, CheckCircle } from "lucide-react";
import { apiGet, translations } from "../utils/api";

export default function PrayerTimes({ lang }) {
  const t = translations[lang] || translations.en;
  const [prayers, setPrayers] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default fallback prayer timings in Dar es Salaam
  const defaultPrayers = {
    fajr: "05:08 AM",
    sunrise: "06:18 AM",
    dhuhr: "12:28 PM",
    asr: "03:42 PM",
    maghrib: "06:33 PM",
    isha: "07:44 PM",
    date: new Date().toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    hijri_date: "19 Rabi' al-Awwal 1448 AH",
  };

  useEffect(() => {
    async function loadPrayers() {
      setLoading(true);
      const data = await apiGet("prayer-times/today/", defaultPrayers);
      setPrayers(data || defaultPrayers);
      setLoading(false);
    }
    loadPrayers();
  }, [lang]);

  const pData = prayers || defaultPrayers;

  const prayerItems = [
    { name: "Fajr", swName: "Alfajiri", time: pData.fajr || "05:08 AM", icon: Moon, note: "Iqamah +20 mins" },
    { name: "Sunrise", swName: "Mawio", time: pData.sunrise || "06:18 AM", icon: Sunrise, note: "Ishraq prayer" },
    { name: "Dhuhr", swName: "Adhuhuri", time: pData.dhuhr || "12:28 PM", icon: Sun, note: "Iqamah 01:00 PM" },
    { name: "Asr", swName: "Al-Asr", time: pData.asr || "03:42 PM", icon: Sun, note: "Iqamah 04:00 PM" },
    { name: "Maghrib", swName: "Magharibi", time: pData.maghrib || "06:33 PM", icon: Sunset, note: "Iqamah +10 mins" },
    { name: "Isha", swName: "Ishaa", time: pData.isha || "07:44 PM", icon: Moon, note: "Iqamah 08:00 PM" },
  ];

  return (
    <section id="prayers-section" style={{ padding: "5rem 0", background: "var(--bg-surface)" }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 3rem" }}>
          <div className="badge badge-gold" style={{ marginBottom: "0.85rem" }}>
            <Calendar size={13} />
            <span>{pData.hijri_date || "Hijri Calendar 1448 AH"}</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", marginBottom: "0.75rem" }}>
            {t.prayers_title}
          </h2>
          <p style={{ fontSize: "0.95rem" }}>{t.prayers_subtitle}</p>
        </div>

        {/* Prayer Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "1.25rem",
            marginBottom: "3rem",
          }}
        >
          {prayerItems.map((p, idx) => {
            const Icon = p.icon;
            const isHighlighted = p.name === "Dhuhr" || p.name === "Asr";

            return (
              <div
                key={idx}
                className="card"
                style={{
                  textAlign: "center",
                  padding: "1.5rem 1rem",
                  background: isHighlighted ? "#122E20" : "var(--bg-card)",
                  border: isHighlighted
                    ? "1px solid var(--gold)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: isHighlighted ? "var(--gold-subtle)" : "rgba(255, 255, 255, 0.05)",
                    border: isHighlighted ? "1px solid var(--gold-border)" : "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    color: isHighlighted ? "var(--gold-light)" : "var(--text-muted)",
                  }}
                >
                  <Icon size={22} />
                </div>

                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                  {lang === "sw" ? p.swName : p.name}
                </h4>

                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    color: isHighlighted ? "var(--gold-light)" : "var(--text-white)",
                    margin: "0.35rem 0",
                  }}
                >
                  {p.time}
                </div>

                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>
                  {p.note}
                </span>
              </div>
            );
          })}
        </div>

        {/* Jum'ah Mubarak Special Banner */}
        <div
          className="card"
          style={{
            background: "#0E2419",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "2rem 2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "rgba(201, 162, 39, 0.15)",
                border: "1.5px solid var(--gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--gold-light)",
              }}
            >
              <CheckCircle size={28} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gold-light)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {lang === "sw" ? "Sala ya Ijumaa" : "Friday Congregation"}
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0.2rem 0" }}>
                Jum'ah Khutbah: 12:45 PM &middot; Salah: 01:15 PM
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                {lang === "sw"
                  ? "Sehemu ya ndugu na dada inapatikana pamoja na maegesho salama Kinondoni."
                  : "Dedicated prayer halls for brothers and sisters with convenient parking available."}
              </p>
            </div>
          </div>

          <div className="badge badge-emerald" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>
            {lang === "sw" ? "Ukumbi wazi kwa wote" : "Open to All"}
          </div>
        </div>
      </div>
    </section>
  );
}
