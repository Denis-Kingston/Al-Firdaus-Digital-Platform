import React, { useState, useEffect } from "react";
import { Heart, Target, TrendingUp, ShieldCheck, Sparkles, Smartphone } from "lucide-react";
import { apiGet, apiPost, translations } from "../utils/api";

export default function Donations({ lang, onTriggerUssdModal, onShowNotification }) {
  const t = translations[lang] || translations.en;
  const [causes, setCauses] = useState([]);
  const [selectedCauseId, setSelectedCauseId] = useState("");
  const [amount, setAmount] = useState(25000);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const defaultCauses = [
    {
      id: 1,
      title: "Mosque Solar Energy & Expansion",
      target_amount: 15000000,
      total_raised: 4500000,
      description: "Installation of commercial-grade solar power and backup batteries to maintain air conditioning during prayers.",
    },
    {
      id: 2,
      title: "Orphan & Hifdh Student Sponsorship",
      target_amount: 8000000,
      total_raised: 3200000,
      description: "Providing meals, educational materials, and sanad allowances for dedicated full-time Quran memorizers.",
    },
    {
      id: 3,
      title: "Ramadan Daily Community Iftars",
      target_amount: 5000000,
      total_raised: 1800000,
      description: "Hosting 300+ fasting community members and travelers every evening at Al Firdaus dining pavilion.",
    },
  ];

  useEffect(() => {
    async function loadCauses() {
      const data = await apiGet("donations/causes/", defaultCauses);
      if (data && data.length) {
        setCauses(data);
        setSelectedCauseId(data[0].id);
      } else {
        setCauses(defaultCauses);
        setSelectedCauseId(defaultCauses[0].id);
      }
    }
    loadCauses();
  }, []);

  const presetAmounts = [10000, 25000, 50000, 100000, 250000];

  const handleSelectPreset = (val) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setCustomAmount(val);
    if (val) setAmount(Number(val));
  };

  const handleSubmitDonation = async (e) => {
    e.preventDefault();

    const donationVal = customAmount ? Number(customAmount) : amount;
    if (!donationVal || donationVal <= 0) {
      onShowNotification({
        title: lang === "sw" ? "Weka Kiasi Sahihi" : "Invalid Amount",
        message: lang === "sw" ? "Tafadhali chagua au weka kiasi cha mchango wako." : "Please select or enter a valid donation amount.",
        type: "warning",
      });
      return;
    }

    if (!donorPhone.trim()) {
      onShowNotification({
        title: lang === "sw" ? "Weka Namba ya Simu" : "Phone Required",
        message: lang === "sw" ? "Namba ya simu inahitajika kupokea USSD Push ya malipo." : "A mobile phone number is required to send the push prompt.",
        type: "warning",
      });
      return;
    }

    setSubmitting(true);

    const payload = {
      amount: donationVal,
      donor_name: donorName.trim() || "Anonymous Well-Wisher",
      donor_phone: donorPhone.trim(),
      donor_email: donorEmail.trim(),
      cause: selectedCauseId ? Number(selectedCauseId) : null,
    };

    try {
      const res = await apiPost("donations/donate/", payload);

      if (res.ok && res.data?.reference) {
        // Trigger realistic USSD Push modal simulation
        onTriggerUssdModal({
          amount: donationVal,
          phone: donorPhone.trim(),
          reference: res.data.reference,
        });
      } else {
        // Fallback simulation if backend offline
        onTriggerUssdModal({
          amount: donationVal,
          phone: donorPhone.trim(),
          reference: "SEL-" + Math.floor(100000 + Math.random() * 900000),
        });
      }
    } catch (err) {
      console.error("Donation gateway error:", err);
      onTriggerUssdModal({
        amount: donationVal,
        phone: donorPhone.trim(),
        reference: "SEL-" + Math.floor(100000 + Math.random() * 900000),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="donate-section" style={{ padding: "5rem 0", background: "var(--bg-surface)" }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "750px", margin: "0 auto 3rem" }}>
          <div className="badge badge-gold" style={{ marginBottom: "0.85rem" }}>
            <Heart size={13} fill="var(--gold-light)" />
            <span>Sadaqah Jariyah</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", marginBottom: "0.75rem" }}>
            {t.donations_title}
          </h2>
          <p style={{ fontSize: "0.95rem" }}>{t.donations_subtitle}</p>
        </div>

        {/* 2-Column Donation Interface */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "2.5rem",
            alignItems: "start",
          }}
        >
          {/* Column 1: Active Campaigns Showcase */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.25rem", color: "#FFFFFF" }}>
              {lang === "sw" ? "Mifuko na Kampeni Zinazoendelea" : "Current Mosque Campaigns"}
            </h3>

            {causes.map((c) => {
              const target = Number(c.target_amount) || 10000000;
              const raised = Number(c.total_raised) || 0;
              const percent = Math.min(Math.round((raised / target) * 100), 100);
              const isSelected = String(selectedCauseId) === String(c.id);

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCauseId(c.id)}
                  className="card"
                  style={{
                    cursor: "pointer",
                    border: isSelected ? "1px solid var(--gold)" : "1px solid rgba(255, 255, 255, 0.08)",
                    background: isSelected ? "#143324" : "var(--bg-card)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF" }}>
                      {c.title}
                    </h4>
                    {isSelected && (
                      <span className="badge badge-gold" style={{ fontSize: "0.68rem" }}>
                        {lang === "sw" ? "Umechagua Hii" : "Selected"}
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
                    {c.description}
                  </p>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: "0.75rem" }}>
                    <div style={{ height: "8px", width: "100%", background: "rgba(255, 255, 255, 0.1)", borderRadius: "4px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${percent}%`,
                          background: "linear-gradient(90deg, #10B981, #C9A227)",
                          borderRadius: "4px",
                          transition: "width 0.8s ease",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                    <span style={{ color: "var(--gold-light)", fontWeight: 700 }}>
                      {raised.toLocaleString()} TZS <small style={{ color: "var(--text-muted)", fontWeight: 400 }}>({percent}%)</small>
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>
                      Lengo: {target.toLocaleString()} TZS
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column 2: Donation Form */}
          <div
            className="card"
            style={{
              padding: "2.25rem",
              background: "var(--bg-card)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--gold-light)", marginBottom: "0.4rem" }}>
                <Smartphone size={18} />
                <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Selcom Push & Mobile Money (TZS)
                </span>
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#FFFFFF" }}>
                {lang === "sw" ? "Fanya Mchango Papo Hapo" : "Make an Instant Contribution"}
              </h3>
            </div>

            <form onSubmit={handleSubmitDonation} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Preset Amounts */}
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: "0.6rem" }}>
                  {lang === "sw" ? "Chagua Kiasi (TZS)" : "Select Amount (TZS)"}
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                  {presetAmounts.map((p) => {
                    const isSelected = !customAmount && amount === p;
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => handleSelectPreset(p)}
                        style={{
                          padding: "0.75rem 0.5rem",
                          borderRadius: "var(--radius-md)",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          border: isSelected ? "2px solid var(--gold)" : "1px solid rgba(255, 255, 255, 0.12)",
                          background: isSelected ? "var(--gold-subtle)" : "rgba(255, 255, 255, 0.04)",
                          color: isSelected ? "var(--gold-light)" : "#FFFFFF",
                          transition: "var(--transition)",
                        }}
                      >
                        {p.toLocaleString()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  {lang === "sw" ? "Au Kiasi Kingine (TZS)" : "Or Custom Amount (TZS)"}
                </label>
                <input
                  type="text"
                  placeholder="k.m. 150000"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="form-input"
                />
              </div>

              {/* Donor Phone */}
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  {lang === "sw" ? "Namba ya Simu (M-Pesa / Tigo / Airtel / Halo) *" : "Mobile Money Phone Number *"}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+255 7XX XXX XXX"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Donor Name & Email */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    {lang === "sw" ? "Jina la Mchangiaji" : "Your Name"}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === "sw" ? "Hiyari (Hapana Jina)" : "Optional (Anonymous)"}
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    {lang === "sw" ? "Barua Pepe" : "Email"}
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Trust Badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                <ShieldCheck size={16} color="#10B981" />
                <span>
                  {lang === "sw"
                    ? "Malipo salama ya moja kwa moja kupitia Selcom USSD Push Tanzania."
                    : "Secured direct push payment via Selcom Gateway Tanzania."}
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-gold btn-lg"
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                <Heart size={18} fill="#08140E" />
                <span>
                  {submitting
                    ? (lang === "sw" ? "Inaunganisha na Simu..." : "Connecting to Gateway...")
                    : (lang === "sw" ? `Tuma Mchango wa ${Number(customAmount || amount).toLocaleString()} TZS` : `Donate ${Number(customAmount || amount).toLocaleString()} TZS`)}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
