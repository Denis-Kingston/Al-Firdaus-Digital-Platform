import React, { useState, useEffect } from "react";
import { Mic, Volume2, Calendar, User, Play, Pause } from "lucide-react";
import { apiGet, translations } from "../utils/api";

export default function Khutbahs({ lang }) {
  const t = translations[lang] || translations.en;
  const [khutbahs, setKhutbahs] = useState([]);
  const [activeAudioIndex, setActiveAudioIndex] = useState(null);

  const defaultKhutbahs = [
    {
      id: 1,
      title: "The Virtues of Sincerity (Ikhlas) in Daily Action",
      speaker: "Sheikh Abdallah Al-Kinani",
      date: "Friday, 12 Sep 2026",
      audio: null,
      summary: "Understanding the spiritual necessity of purifying intention in prayer, charity, and social interactions.",
    },
    {
      id: 2,
      title: "Upholding Family Ties and Kinship in Islam",
      speaker: "Sheikh Muhammad Zubayr",
      date: "Friday, 05 Sep 2026",
      audio: null,
      summary: "The divine rewards of honoring parents, supporting relatives, and forgiving family misunderstandings.",
    },
    {
      id: 3,
      title: "Preparation for the Holy Month of Ramadan",
      speaker: "Sheikh Abdallah Al-Kinani",
      date: "Friday, 29 Aug 2026",
      audio: null,
      summary: "Spiritual routines, repentance (Tawbah), and voluntary fasts leading into the blessed month.",
    },
  ];

  useEffect(() => {
    async function loadKhutbahs() {
      const data = await apiGet("khutbahs/", defaultKhutbahs);
      setKhutbahs(data && data.length ? data : defaultKhutbahs);
    }
    loadKhutbahs();
  }, []);

  return (
    <section id="khutbahs-section" style={{ padding: "5rem 0", background: "var(--bg-surface)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 3.5rem" }}>
          <div className="badge badge-gold" style={{ marginBottom: "0.85rem" }}>
            <Mic size={13} />
            <span>Minbar Sermons</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", marginBottom: "0.75rem" }}>
            {lang === "sw" ? "Kumbukumbu ya Khutbah za Ijumaa" : "Friday Khutbah Archive"}
          </h2>
          <p style={{ fontSize: "0.95rem" }}>
            {lang === "sw"
              ? "Sikiliza na ujifunze kupitia mafunzo na khutbah za Ijumaa kutoka kwa masheikh wa Al Firdaus."
              : "Listen to and reflect upon authentic Friday sermons delivered by Al Firdaus resident scholars."}
          </p>
        </div>

        {/* Khutbah List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "880px", margin: "0 auto" }}>
          {khutbahs.map((k, idx) => {
            const isPlaying = activeAudioIndex === idx;

            return (
              <div
                key={k.id || idx}
                className="card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1.25rem",
                  padding: "1.75rem 2rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem", flex: 1, minWidth: "260px" }}>
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background: "rgba(201, 162, 39, 0.15)",
                      border: "1px solid var(--gold)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--gold-light)",
                      flexShrink: 0,
                    }}
                  >
                    <Volume2 size={24} />
                  </div>

                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.35rem" }}>
                      {k.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--gold-light)", fontWeight: 600 }}>
                        <User size={13} />
                        {k.speaker || "Resident Sheikh"}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <Calendar size={13} />
                        {k.date || "Recent Friday"}
                      </span>
                    </div>
                    {k.summary && (
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.5rem", lineHeight: 1.5 }}>
                        {k.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Audio Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {k.audio ? (
                    <audio controls src={k.audio} style={{ maxHeight: "40px" }} />
                  ) : (
                    <button
                      onClick={() => setActiveAudioIndex(isPlaying ? null : idx)}
                      className="btn btn-outline btn-sm"
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                      <span>{isPlaying ? (lang === "sw" ? "Inacheza..." : "Playing...") : (lang === "sw" ? "Sikiliza Sauti" : "Listen Recording")}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
