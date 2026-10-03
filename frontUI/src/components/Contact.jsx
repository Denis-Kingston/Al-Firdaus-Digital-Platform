import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { apiPost, translations } from "../utils/api";

export default function Contact({ lang, onShowNotification }) {
  const t = translations[lang] || translations.en;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim() || "General Inquiry",
      message: message.trim(),
    };

    try {
      const res = await apiPost("mosque-info/contact/", payload);

      if (res.ok) {
        onShowNotification({
          title: lang === "sw" ? "Ujumbe Umetumwa!" : "Message Sent Successfully!",
          message: lang === "sw"
            ? "Jazakallahu Khair! Ujumbe wako umepokelewa na uongozi wa Al Firdaus. Tutawasiliana nawe hivi punde."
            : "Jazakallahu Khair! Your message has been received by Al Firdaus management. We will get back to you promptly.",
          type: "success",
        });
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      } else {
        onShowNotification({
          title: lang === "sw" ? "Hitilafu ya Kutuma" : "Failed to Send",
          message: lang === "sw" ? "Haikuweza kutuma ujumbe. Tafadhali jaribu tena." : "Could not send message. Please try again.",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Contact error:", err);
      onShowNotification({
        title: lang === "sw" ? "Hitilafu ya Mtandao" : "Network Error",
        message: lang === "sw" ? "Kuna tatizo la mawasiliano na seva." : "Network connection failed.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact-section" style={{ padding: "5rem 0", background: "var(--bg-surface)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 3.5rem" }}>
          <div className="badge badge-gold" style={{ marginBottom: "0.85rem" }}>
            <Mail size={13} />
            <span>Get in Touch</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", marginBottom: "0.75rem" }}>
            {t.contact_title}
          </h2>
          <p style={{ fontSize: "0.95rem" }}>{t.contact_subtitle}</p>
        </div>

        {/* 2-Column Contact Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2.5rem",
            alignItems: "start",
          }}
        >
          {/* Mosque Contact Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="card" style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
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
                  flexShrink: 0,
                }}
              >
                <MapPin size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.2rem" }}>
                  {lang === "sw" ? "Mahali Tulipopo" : "Physical Address"}
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                  Kinondoni, Dar es Salaam, Tanzania
                </p>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {lang === "sw" ? "Karibu na kituo kikuu cha usafiri" : "Convenient wudhu & parking facilities"}
                </span>
              </div>
            </div>

            <div className="card" style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
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
                  flexShrink: 0,
                }}
              >
                <Phone size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.2rem" }}>
                  {lang === "sw" ? "Namba ya Simu" : "Phone & WhatsApp"}
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--gold-light)", fontWeight: 700, margin: 0 }}>
                  +255 700 000 000
                </p>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {lang === "sw" ? "Ofisi ya Utawala na Chuo" : "Administration & Admissions"}
                </span>
              </div>
            </div>

            <div className="card" style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
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
                  flexShrink: 0,
                }}
              >
                <Mail size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.2rem" }}>
                  {lang === "sw" ? "Barua Pepe" : "Email Enquiries"}
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                  info@alfirdaus.or.tz
                </p>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {lang === "sw" ? "Tunajibu ndani ya saa 24" : "Prompt responses within 24 hours"}
                </span>
              </div>
            </div>

            <div className="card" style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
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
                  flexShrink: 0,
                }}
              >
                <Clock size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.2rem" }}>
                  {lang === "sw" ? "Masaa ya Ofisi" : "Office Hours"}
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                  Sat &ndash; Thu, 9:00 AM &ndash; 5:00 PM
                </p>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {lang === "sw" ? "Ijumaa: Imefungwa wakati wa Sala" : "Friday: Closed during Jum'ah prayers"}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Message Form */}
          <div
            className="card"
            style={{
              padding: "2.5rem 2rem",
              background: "linear-gradient(135deg, #10261D 0%, #081710 100%)",
              border: "1.5px solid var(--gold-border)",
            }}
          >
            <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1.5rem" }}>
              {lang === "sw" ? "Tuandikie Ujumbe Wako" : "Send an Direct Inquiry"}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    {lang === "sw" ? "Jina Kamili *" : "Full Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === "sw" ? "Jina lako" : "Your name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    {lang === "sw" ? "Barua Pepe *" : "Email Address *"}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    {lang === "sw" ? "Namba ya Simu" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    placeholder="+255 7XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    {lang === "sw" ? "Mada / Subject" : "Subject"}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === "sw" ? "Kuhusu nini..." : "Topic..."}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  {lang === "sw" ? "Ujumbe Wako *" : "Your Message *"}
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder={lang === "sw" ? "Tueleze jinsi tunavyoweza kukusaidia..." : "How can we assist you today?..."}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-gold btn-lg"
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                <Send size={16} />
                <span>{submitting ? (lang === "sw" ? "Inatuma Ujumbe..." : "Sending...") : t.btn_send_message}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
