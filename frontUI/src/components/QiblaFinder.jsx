import React, { useState } from "react";
import { Compass, Navigation, MapPin, Sparkles, RotateCw } from "lucide-react";
import { translations } from "../utils/api";

export default function QiblaFinder({ lang }) {
  const t = translations[lang] || translations.en;
  const [compassAngle, setCompassAngle] = useState(0);

  // Dar es Salaam to Kaaba bearing is ~12.8° (North-North-East)
  const QIBLA_BEARING = 12.8;
  const KAABA_DISTANCE_KM = 4150;

  const handleCalibrate = () => {
    setCompassAngle((prev) => (prev + 360) % 360);
  };

  return (
    <section id="qibla-section" style={{ padding: "5rem 0", background: "var(--bg-dark)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 3rem" }}>
          <div className="badge badge-gold" style={{ marginBottom: "0.85rem" }}>
            <Compass size={13} />
            <span>Kaaba Direction</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", marginBottom: "0.75rem" }}>
            {t.nav_qibla}
          </h2>
          <p style={{ fontSize: "0.95rem" }}>
            {lang === "sw"
              ? "Tambua mwelekeo sahihi wa Al-Kaaba Tukufu (Makkah) popote ulipo Tanzania."
              : "Locate the precise direction of the Holy Kaaba (Makkah) from your location in Tanzania."}
          </p>
        </div>

        {/* Compass Visual Card */}
        <div
          className="card"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "2.5rem 2rem",
            background: "var(--bg-card)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            textAlign: "center",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Compass Dial Outer Ring */}
          <div
            style={{
              position: "relative",
              width: "260px",
              height: "260px",
              margin: "0 auto 2rem",
              borderRadius: "50%",
              background: "#081A12",
              border: "2px solid var(--gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Cardinal Markers */}
            <span style={{ position: "absolute", top: "10px", fontSize: "0.9rem", fontWeight: 800, color: "var(--gold-light)" }}>N</span>
            <span style={{ position: "absolute", right: "12px", fontSize: "0.9rem", fontWeight: 800, color: "var(--text-muted)" }}>E</span>
            <span style={{ position: "absolute", bottom: "10px", fontSize: "0.9rem", fontWeight: 800, color: "var(--text-muted)" }}>S</span>
            <span style={{ position: "absolute", left: "12px", fontSize: "0.9rem", fontWeight: 800, color: "var(--text-muted)" }}>W</span>

            {/* Dial Ticks */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div
                key={deg}
                style={{
                  position: "absolute",
                  width: "2px",
                  height: deg % 90 === 0 ? "10px" : "6px",
                  backgroundColor: deg === 0 ? "var(--gold-light)" : "rgba(255, 255, 255, 0.25)",
                  transform: `rotate(${deg}deg) translateY(-125px)`,
                }}
              />
            ))}

            {/* Qibla Needle Pointing to 12.8° */}
            <div
              style={{
                position: "absolute",
                width: "4px",
                height: "200px",
                transform: `rotate(${QIBLA_BEARING}deg)`,
                transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* North / Kaaba Pointer (Gold) */}
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderBottom: "65px solid var(--gold)",
                  position: "absolute",
                  top: "10px",
                  left: "-6px",
                  filter: "drop-shadow(0 0 10px rgba(201, 162, 39, 0.6))",
                }}
              />

              {/* Kaaba Minaret Icon on top of needle */}
              <div
                style={{
                  position: "absolute",
                  top: "-22px",
                  left: "-11px",
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: "var(--gold-light)",
                  border: "2px solid #08140E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 15px rgba(229, 193, 88, 0.8)",
                }}
              >
                <div style={{ width: "8px", height: "8px", background: "#08140E", borderRadius: "1px" }} />
              </div>

              {/* South Tail (White/Subtle) */}
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "50px solid rgba(255, 255, 255, 0.25)",
                  position: "absolute",
                  bottom: "10px",
                  left: "-4px",
                }}
              />
            </div>

            {/* Center Pivot */}
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "var(--gold)",
                border: "3px solid #08140E",
                zIndex: 10,
                boxShadow: "0 0 8px rgba(0, 0, 0, 0.8)",
              }}
            />
          </div>

          {/* Compass Readout Numbers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.25rem",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "var(--radius-md)",
              padding: "1.25rem",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                {lang === "sw" ? "Pembe ya Mwelekeo" : "Qibla Bearing"}
              </span>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--gold-light)" }}>
                {QIBLA_BEARING}&deg; NNE
              </div>
            </div>

            <div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                {lang === "sw" ? "Umbali kwenda Kaaba" : "Distance to Kaaba"}
              </span>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#FFFFFF" }}>
                ~{KAABA_DISTANCE_KM.toLocaleString()} <small style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>km</small>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            <MapPin size={16} color="var(--gold-light)" />
            <span>Kinondoni, Dar es Salaam (6.7924&deg; S, 39.2083&deg; E)</span>
          </div>

          <button onClick={handleCalibrate} className="btn btn-outline" style={{ margin: "0 auto" }}>
            <RotateCw size={15} />
            <span>{lang === "sw" ? "Rekebisha Dira (Recalibrate)" : "Recalibrate Compass"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
