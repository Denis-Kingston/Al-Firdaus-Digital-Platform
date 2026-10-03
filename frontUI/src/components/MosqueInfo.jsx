import React, { useState, useEffect } from "react";
import { Users, Building, Award, CheckCircle, GraduationCap, Sparkles } from "lucide-react";
import { apiGet, translations } from "../utils/api";

export default function MosqueInfo({ lang }) {
  const [teachers, setTeachers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [stats, setStats] = useState([]);

  const defaultStats = [
    { label: "Community Members", swLabel: "Waumini wa Kila Siku", value: "3,500+" },
    { label: "Students Enrolled", swLabel: "Wanafunzi wa Chuo", value: "480+" },
    { label: "Quran Sanad Graduates", swLabel: "Wahitimu wa Sanad", value: "65+" },
    { label: "Daily Congregation", swLabel: "Sala 5 za Jamaa", value: "100%" },
  ];

  const defaultTeachers = [
    {
      name: "Sheikh Abdallah Al-Kinani",
      title: "Chief Imam & Head of Qira'at",
      specialty: "Tajweed & Sanad Recitation",
      bio: "Graduate of Islamic University of Madinah with continuous transmission chain (Sanad) in the ten canonical recitations.",
    },
    {
      name: "Ustadh Salim Hassan",
      title: "Senior Arabic & Grammar Lecturer",
      specialty: "Arabic Linguistics & Nahw",
      bio: "Over 15 years instructing classical Arabic grammar, rhetoric (Balaghah), and foundational Islamic jurisprudence.",
    },
    {
      name: "Sheikh Muhammad Zubayr",
      title: "Scholar of Fiqh & Hadith",
      specialty: "Islamic Jurisprudence",
      bio: "Adviser to Al Firdaus Shariah council specializing in family counseling, inheritance (Mirath), and Islamic commercial ethics.",
    },
  ];

  const defaultFacilities = [
    {
      title: "Main Congregational Hall",
      swTitle: "Ukumbi Mkuu wa Sala",
      capacity: "1,500 Brothers",
      description: "Air-conditioned prayer hall equipped with acoustic amplification, natural light chandeliers, and carpeted interior.",
    },
    {
      title: "Sisters Dedicated Mezzanine",
      swTitle: "Sehemu Maalum ya Akina Mama",
      capacity: "500 Sisters",
      description: "Private, sound-synchronized mezzanine with separate elevator access, baby nursing room, and wudhu facilities.",
    },
    {
      title: "Islamic Reference Library",
      swTitle: "Maktaba ya Vitabu vya Kiislamu",
      capacity: "Study & Research",
      description: "Quiet research room featuring classical tafseer, hadith compendiums, modern Islamic finance texts, and study desks.",
    },
  ];

  useEffect(() => {
    async function loadInfo() {
      const [tData, fData, sData] = await Promise.all([
        apiGet("mosque-info/teachers/", defaultTeachers),
        apiGet("mosque-info/facilities/", defaultFacilities),
        apiGet("mosque-info/stats/", defaultStats),
      ]);
      setTeachers(tData && tData.length ? tData : defaultTeachers);
      setFacilities(fData && fData.length ? fData : defaultFacilities);
      setStats(sData && sData.length ? sData : defaultStats);
    }
    loadInfo();
  }, []);

  return (
    <div style={{ background: "var(--bg-dark)" }}>
      {/* 1. Live Stats Banner */}
      <section style={{ padding: "4rem 0", background: "linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-dark) 100%)", borderBottom: "1px solid var(--gold-border)" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  textAlign: "center",
                  padding: "1.75rem 1.25rem",
                  background: "rgba(14, 34, 25, 0.7)",
                  border: "1px solid rgba(201, 162, 39, 0.25)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    color: "var(--gold-light)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)" }}>
                  {lang === "sw" ? s.swLabel || s.label : s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Teachers & Imams */}
      <section style={{ padding: "5rem 0", background: "var(--bg-dark)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 3.5rem" }}>
            <div className="badge badge-gold" style={{ marginBottom: "0.85rem" }}>
              <GraduationCap size={13} />
              <span>Faculty & Leadership</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", marginBottom: "0.75rem" }}>
              {lang === "sw" ? "Masheikh na Walimu Wetu" : "Teachers & Resident Scholars"}
            </h2>
            <p style={{ fontSize: "0.95rem" }}>
              {lang === "sw"
                ? "Walimu wenye weledi na sifa stahiki wanaoongoza programu za msikiti na chuo."
                : "Dedicated educators guiding our community upon classical Islamic scholarship."}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {teachers.map((t, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  textAlign: "center",
                  padding: "2.25rem 1.75rem",
                }}
              >
                <div
                  style={{
                    width: "88px",
                    height: "88px",
                    borderRadius: "50%",
                    margin: "0 auto 1.25rem",
                    background: "linear-gradient(135deg, #142E22 0%, #0E2219 100%)",
                    border: "2px solid var(--gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    color: "var(--gold-light)",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <Users size={36} />
                </div>

                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.35rem" }}>
                  {t.name}
                </h3>
                <span style={{ fontSize: "0.8rem", color: "var(--gold-light)", fontWeight: 600, display: "block", marginBottom: "0.75rem" }}>
                  {t.title}
                </span>

                {t.specialty && (
                  <span className="badge badge-emerald" style={{ marginBottom: "1rem" }}>
                    {t.specialty}
                  </span>
                )}

                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {t.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Facilities */}
      <section style={{ padding: "5rem 0", background: "var(--bg-surface)", borderTop: "1px solid var(--gold-border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 3.5rem" }}>
            <div className="badge badge-gold" style={{ marginBottom: "0.85rem" }}>
              <Building size={13} />
              <span>Modern Infrastructure</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", marginBottom: "0.75rem" }}>
              {lang === "sw" ? "Majengo na Huduma za Msikiti" : "Mosque Facilities & Amenities"}
            </h2>
            <p style={{ fontSize: "0.95rem" }}>
              {lang === "sw"
                ? "Miundombinu ya kisasa inayowezesha ibada na masomo kwa utulivu na amani."
                : "Equipped with state-of-the-art facilities for worship, study, and reflection."}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {facilities.map((f, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: "2rem",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(201, 162, 39, 0.15)",
                    border: "1px solid var(--gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--gold-light)",
                    marginBottom: "1.25rem",
                  }}
                >
                  <Building size={22} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF" }}>
                    {lang === "sw" ? f.swTitle || f.title : f.title}
                  </h3>
                  <span className="badge badge-gold" style={{ fontSize: "0.68rem" }}>
                    {f.capacity}
                  </span>
                </div>

                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
