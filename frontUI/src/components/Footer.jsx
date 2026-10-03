import React from "react";
import { Heart, Compass, BookOpen, Clock, Mail, Phone, MapPin, ArrowUp } from "lucide-react";

export default function Footer({ lang, setActiveTab, onOpenDonate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{
        backgroundColor: "#050F0A",
        color: "var(--text-muted)",
        borderTop: "3px solid var(--gold)",
        padding: "4.5rem 0 2rem",
      }}
    >
      <div className="container">
        {/* Main Footer Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3.5rem",
          }}
        >
          {/* Brand Column */}
          <div style={{ maxWidth: "320px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "#142E22",
                  border: "1.5px solid var(--gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="#142E22" />
                  <path d="M24 10c-4 3.5-6 7.6-6 11.4 0 3.3 2.7 5.6 6 5.6s6-2.3 6-5.6c0-3.8-2-7.9-6-11.4Z" fill="#C9A227" />
                  <rect x="21.4" y="26" width="5.2" height="11" rx="1" fill="#C9A227" />
                  <path d="M10 38c1-6 6-10 14-10s13 4 14 10" stroke="#C9A227" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
              <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", color: "#FFFFFF" }}>
                Al Firdaus
              </strong>
            </div>

            <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
              {lang === "sw"
                ? "Kituo cha mafunzo ya Qur'an na Sunnah, ibada za jamaa, na huduma za maendeleo ya jamii Kinondoni, Dar es Salaam."
                : "A center of authentic Quranic scholarship, congregational worship, and holistic community service in Dar es Salaam, Tanzania."}
            </p>

            <button
              onClick={onOpenDonate}
              className="btn btn-gold btn-sm"
            >
              <Heart size={14} fill="#08140E" />
              <span>{lang === "sw" ? "Toa Sadaka / Mchango" : "Make a Contribution"}</span>
            </button>
          </div>

          {/* Programs & Learning */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
              {lang === "sw" ? "Elimu na Chuo" : "Programs & Study"}
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem" }}>
              <li>
                <a href="#institute" onClick={(e) => { e.preventDefault(); setActiveTab("institute"); }} style={{ color: "var(--text-secondary)" }}>
                  Quran & Tajweed (Makharij)
                </a>
              </li>
              <li>
                <a href="#institute" onClick={(e) => { e.preventDefault(); setActiveTab("institute"); }} style={{ color: "var(--text-secondary)" }}>
                  Arabic Language & Nahw
                </a>
              </li>
              <li>
                <a href="#institute" onClick={(e) => { e.preventDefault(); setActiveTab("institute"); }} style={{ color: "var(--text-secondary)" }}>
                  Islamic Jurisprudence (Fiqh)
                </a>
              </li>
              <li>
                <a href="#institute" onClick={(e) => { e.preventDefault(); setActiveTab("institute"); }} style={{ color: "var(--text-secondary)" }}>
                  Hifdh Memorization Tracks
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
              {lang === "sw" ? "Huduma za Msikiti" : "Mosque Services"}
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem" }}>
              <li>
                <a href="#prayers" onClick={(e) => { e.preventDefault(); setActiveTab("prayers"); }} style={{ color: "var(--text-secondary)" }}>
                  {lang === "sw" ? "Nyakati za Sala Leo" : "Daily Prayer Times"}
                </a>
              </li>
              <li>
                <a href="#zakat" onClick={(e) => { e.preventDefault(); setActiveTab("zakat"); }} style={{ color: "var(--text-secondary)" }}>
                  {lang === "sw" ? "Kikokotoo cha Zaka (TZS)" : "Zakat Calculator (TZS)"}
                </a>
              </li>
              <li>
                <a href="#qibla" onClick={(e) => { e.preventDefault(); setActiveTab("qibla"); }} style={{ color: "var(--text-secondary)" }}>
                  {lang === "sw" ? "Dira ya Qibla (Makkah)" : "Qibla Compass"}
                </a>
              </li>
              <li>
                <a href="#events" onClick={(e) => { e.preventDefault(); setActiveTab("events"); }} style={{ color: "var(--text-secondary)" }}>
                  {lang === "sw" ? "Matukio na RSVP" : "Community Events & RSVP"}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
              {lang === "sw" ? "Mawasiliano" : "Contact & Visit"}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MapPin size={15} color="var(--gold-light)" />
                <span>Kinondoni, Dar es Salaam, Tanzania</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Phone size={15} color="var(--gold-light)" />
                <span>+255 700 000 000</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Mail size={15} color="var(--gold-light)" />
                <span>info@alfirdaus.or.tz</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.8rem",
          }}
        >
          <p style={{ margin: 0, color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} Al Firdaus Digital Platform. All Rights Reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="btn btn-outline btn-sm"
          >
            <ArrowUp size={14} />
            <span>{lang === "sw" ? "Rudi Juu" : "Back to Top"}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
