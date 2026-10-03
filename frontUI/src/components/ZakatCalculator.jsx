import React, { useState } from "react";
import { Calculator, Coins, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import { translations } from "../utils/api";

export default function ZakatCalculator({ lang, onPayZakat }) {
  const t = translations[lang] || translations.en;

  const [cash, setCash] = useState("");
  const [goldSilver, setGoldSilver] = useState("");
  const [businessAssets, setBusinessAssets] = useState("");
  const [receivables, setReceivables] = useState("");
  const [liabilities, setLiabilities] = useState("");

  // Silver Nisab benchmark in Tanzania (~1,450,000 TZS)
  const NISAB_THRESHOLD = 1450000;

  const numCash = Number(cash) || 0;
  const numGold = Number(goldSilver) || 0;
  const numBusiness = Number(businessAssets) || 0;
  const numReceivables = Number(receivables) || 0;
  const numLiabilities = Number(liabilities) || 0;

  const totalAssets = numCash + numGold + numBusiness + numReceivables;
  const netZakatableWealth = Math.max(0, totalAssets - numLiabilities);
  const isEligible = netZakatableWealth >= NISAB_THRESHOLD;
  const zakatPayable = isEligible ? Math.round(netZakatableWealth * 0.025) : 0;

  return (
    <section id="zakat-section" style={{ padding: "5rem 0", background: "var(--bg-surface)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: "750px", margin: "0 auto 3.5rem" }}>
          <div className="badge badge-gold" style={{ marginBottom: "0.85rem" }}>
            <Calculator size={13} />
            <span>Fardh Obligation</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", marginBottom: "0.75rem" }}>
            {t.zakat_title}
          </h2>
          <p style={{ fontSize: "0.95rem" }}>{t.zakat_subtitle}</p>
        </div>

        {/* 2-Column Calculator Box */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2.5rem",
            alignItems: "start",
          }}
        >
          {/* Inputs Column */}
          <div
            className="card"
            style={{
              padding: "2rem",
              background: "#081710",
              border: "1.5px solid var(--gold-border)",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.25rem", color: "#FFFFFF" }}>
              {lang === "sw" ? "Mali na Rasilimali Zako (TZS)" : "Your Assets & Liabilities (TZS)"}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                  {lang === "sw" ? "1. Fedha Taslimu na Benki" : "1. Cash in Hand & Bank Accounts"}
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={cash}
                  onChange={(e) => setCash(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                  {lang === "sw" ? "2. Thamani ya Dhahabu na Fedha (Vito/Mali)" : "2. Gold & Silver Jewelry/Bullion Value"}
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={goldSilver}
                  onChange={(e) => setGoldSilver(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                  {lang === "sw" ? "3. Thamani ya Bidhaa za Biashara na Hisa" : "3. Business Inventory & Trade Goods"}
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={businessAssets}
                  onChange={(e) => setBusinessAssets(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                  {lang === "sw" ? "4. Pesa Unazodai Watu (Zitakazolipwa)" : "4. Money Owed to You (Receivables)"}
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={receivables}
                  onChange={(e) => setReceivables(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#EF4444", marginBottom: "0.35rem" }}>
                  {lang === "sw" ? "5. Punguza: Madeni na Bili Zinazopaswa Kulipwa Sasa" : "5. Less: Immediate Debts & Liabilities"}
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={liabilities}
                  onChange={(e) => setLiabilities(e.target.value)}
                  className="form-input"
                  style={{ borderColor: "rgba(239, 68, 68, 0.3)" }}
                />
              </div>
            </div>
          </div>

          {/* Results Summary Column */}
          <div
            className="card"
            style={{
              padding: "2.25rem",
              background: "var(--bg-card)",
              border: "1px solid var(--gold)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="badge badge-gold" style={{ marginBottom: "1rem" }}>
              Nisab Threshold: ~{NISAB_THRESHOLD.toLocaleString()} TZS
            </div>

            <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1.5rem" }}>
              {lang === "sw" ? "Muhtasari wa Zaka Yako" : "Zakat Calculation Summary"}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>{lang === "sw" ? "Jumla ya Rasilimali:" : "Total Gross Assets:"}</span>
                <strong style={{ color: "#FFFFFF" }}>{totalAssets.toLocaleString()} TZS</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>{lang === "sw" ? "Punguzo la Madeni:" : "Less Liabilities:"}</span>
                <strong style={{ color: "#EF4444" }}>- {numLiabilities.toLocaleString()} TZS</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>{lang === "sw" ? "Mali Inayotozwa Zaka:" : "Net Zakatable Wealth:"}</span>
                <strong style={{ color: "var(--gold-light)" }}>{netZakatableWealth.toLocaleString()} TZS</strong>
              </div>

              {/* Status Eligibility Box */}
              <div
                style={{
                  padding: "0.85rem 1rem",
                  borderRadius: "var(--radius-md)",
                  background: isEligible ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)",
                  border: isEligible ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)",
                  fontSize: "0.82rem",
                  color: isEligible ? "#34D399" : "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {isEligible
                  ? (lang === "sw"
                    ? "Alhamdulillah! Mali yako imefikia kiwango cha Nisab. Zaka ni wajibu kwako (2.5%)."
                    : "Mali meets the Nisab threshold. 2.5% Zakat is obligatory upon this wealth.")
                  : (lang === "sw"
                    ? "Mali yako bado haijafikia kiwango cha chini cha Nisab (~1,450,000 TZS). Hujalazimika kulipa Zaka kwa sasa."
                    : "Your wealth is below the Nisab threshold (~1,450,000 TZS). Zakat is not mandatory.")}
              </div>
            </div>

            {/* Total Payable Block */}
            <div
              style={{
                background: "rgba(5, 15, 10, 0.75)",
                border: "1.5px solid var(--gold-border)",
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem",
                textAlign: "center",
                marginBottom: "1.5rem",
              }}
            >
              <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gold-light)" }}>
                {lang === "sw" ? "Kiasi cha Zaka Kinachopaswa Kulipwa (2.5%)" : "Total Zakat Payable (2.5%)"}
              </span>
              <div
                style={{
                  fontSize: "2.4rem",
                  fontWeight: 800,
                  color: isEligible ? "#FFFFFF" : "var(--text-muted)",
                  margin: "0.5rem 0",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {zakatPayable.toLocaleString()} <span style={{ fontSize: "1.2rem", color: "var(--gold)" }}>TZS</span>
              </div>
            </div>

            {isEligible && zakatPayable > 0 && (
              <button
                onClick={() => onPayZakat(zakatPayable)}
                className="btn btn-gold btn-lg"
                style={{ width: "100%" }}
              >
                <Heart size={18} fill="#08140E" />
                <span>{lang === "sw" ? `Lipa Zaka ya ${zakatPayable.toLocaleString()} TZS Sasa` : `Pay ${zakatPayable.toLocaleString()} TZS Zakat`}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
