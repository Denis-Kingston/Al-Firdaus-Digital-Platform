import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, CheckCircle2, Clock, X } from "lucide-react";
import { apiGet, apiPost, translations } from "../utils/api";

export default function Events({ lang, onShowNotification }) {
  const t = translations[lang] || translations.en;
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const defaultEvents = [
    {
      id: 1,
      title: "Ramadan Preparatory Seminar & Tajweed Intensive",
      event_date: "2026-03-20T16:00:00Z",
      location: "Al Firdaus Main Conference Hall",
      description: "Spiritual readiness, fasting fiqh rulings, and nightly Quran recitation masterclasses with guest scholars.",
      rsvp_count: 85,
    },
    {
      id: 2,
      title: "Youth Halaqah: Faith in the Digital Age",
      event_date: "2026-04-05T17:30:00Z",
      location: "Youth Center Pavilion",
      description: "An open, guided discussion for brothers and sisters addressing modern challenges, identity, and peer leadership.",
      rsvp_count: 42,
    },
    {
      id: 3,
      title: "Family Islamic Ethics & Parenting Workshop",
      event_date: "2026-04-18T09:00:00Z",
      location: "Al Firdaus Community Hall",
      description: "Strengthening household tranquility, nurturing children upon Islamic manners, and conflict resolution in marriage.",
      rsvp_count: 67,
    },
  ];

  useEffect(() => {
    async function loadEvents() {
      const data = await apiGet("events/", defaultEvents);
      setEvents(data && data.length ? data : defaultEvents);
    }
    loadEvents();
  }, []);

  const handleOpenRsvp = (eventItem) => {
    setSelectedEvent(eventItem);
    setRsvpName("");
    setRsvpPhone("");
    setIsRsvpOpen(true);
  };

  const handleCloseRsvp = () => {
    setIsRsvpOpen(false);
    setSelectedEvent(null);
  };

  const handleSubmitRsvp = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setSubmitting(true);

    const payload = {
      name: rsvpName.trim(),
      phone: rsvpPhone.trim(),
    };

    try {
      const res = await apiPost(`events/${selectedEvent.id}/rsvp/`, payload);

      if (res.ok) {
        // Update local count
        const newCount = res.data?.rsvp_count !== undefined ? res.data.rsvp_count : selectedEvent.rsvp_count + 1;
        setEvents((prev) =>
          prev.map((ev) => (ev.id === selectedEvent.id ? { ...ev, rsvp_count: newCount } : ev))
        );

        onShowNotification({
          title: lang === "sw" ? "RSVP Imethibitishwa!" : "RSVP Confirmed!",
          message: lang === "sw"
            ? `Jazakallahu Khair ${rsvpName}! Nafasi yako kwenye tukio la "${selectedEvent.title}" imerekodiwa kikamilifu.`
            : `Jazakallahu Khair ${rsvpName}! Your spot for "${selectedEvent.title}" has been reserved successfully.`,
          type: "success",
        });
        handleCloseRsvp();
      } else {
        onShowNotification({
          title: lang === "sw" ? "Hitilafu ya RSVP" : "RSVP Failed",
          message: lang === "sw" ? "Haikuweza kukamilisha RSVP. Tafadhali jaribu tena." : "Could not complete RSVP. Please try again.",
          type: "error",
        });
      }
    } catch (err) {
      console.error("RSVP error:", err);
      onShowNotification({
        title: lang === "sw" ? "Hitilafu ya Mtandao" : "Network Error",
        message: lang === "sw" ? "Kuna tatizo la mawasiliano na seva." : "Network connection error.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="events-section" style={{ padding: "5rem 0", background: "var(--bg-dark)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: "750px", margin: "0 auto 3.5rem" }}>
          <div className="badge badge-gold" style={{ marginBottom: "0.85rem" }}>
            <Calendar size={13} />
            <span>Community Gatherings</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", marginBottom: "0.75rem" }}>
            {t.events_title}
          </h2>
          <p style={{ fontSize: "0.95rem" }}>{t.events_subtitle}</p>
        </div>

        {/* Events Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "2rem",
          }}
        >
          {events.map((ev) => {
            const dateObj = new Date(ev.event_date || Date.now());
            const day = dateObj.getDate();
            const month = dateObj.toLocaleString("en-US", { month: "short" });
            const timeStr = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            return (
              <div
                key={ev.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  {/* Date Badge & RSVP count */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "16px",
                        background: "linear-gradient(135deg, #142E22 0%, #0E2219 100%)",
                        border: "1.5px solid var(--gold)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(201, 162, 39, 0.2)",
                      }}
                    >
                      <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--gold-light)", lineHeight: 1 }}>
                        {day}
                      </span>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "#FFFFFF" }}>
                        {month}
                      </span>
                    </div>

                    <div className="badge badge-emerald">
                      <Users size={12} />
                      <span>{ev.rsvp_count || 0} {lang === "sw" ? "Washiriki" : "Attending"}</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.6rem" }}>
                    {ev.title}
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Clock size={13} color="var(--gold-light)" />
                      <span>{timeStr}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <MapPin size={13} color="var(--gold-light)" />
                      <span>{ev.location || "Al Firdaus Mosque"}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                    {ev.description}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenRsvp(ev)}
                  className="btn btn-outline"
                  style={{ width: "100%", padding: "0.75rem" }}
                >
                  <Users size={16} />
                  <span>{t.btn_rsvp}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* RSVP Modal */}
      {isRsvpOpen && selectedEvent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            backgroundColor: "rgba(5, 15, 10, 0.8)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          onClick={handleCloseRsvp}
        >
          <div
            style={{
              background: "#0E2219",
              border: "1.5px solid var(--gold)",
              borderRadius: "1.75rem",
              padding: "2rem",
              maxWidth: "460px",
              width: "100%",
              color: "#FFFFFF",
              position: "relative",
              animation: "modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseRsvp}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                color: "#94A3B8",
                background: "rgba(255, 255, 255, 0.08)",
                border: "none",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>

            <div style={{ marginBottom: "1.25rem" }}>
              <div className="badge badge-gold" style={{ marginBottom: "0.5rem" }}>
                Event RSVP
              </div>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                {lang === "sw" ? "Thibitisha Kuhudhuria" : "Confirm Attendance"}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--gold-light)", fontWeight: 600 }}>
                {selectedEvent.title}
              </p>
            </div>

            <form onSubmit={handleSubmitRsvp} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  {lang === "sw" ? "Jina Lako Kamili *" : "Your Full Name *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === "sw" ? "k.m. Rashid Ally" : "e.g. Salim Hassan"}
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  {lang === "sw" ? "Namba ya Simu *" : "Phone Number *"}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+255 7XX XXX XXX"
                  value={rsvpPhone}
                  onChange={(e) => setRsvpPhone(e.target.value)}
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-gold"
                style={{ padding: "0.85rem", marginTop: "0.5rem" }}
              >
                <CheckCircle2 size={18} />
                <span>{submitting ? (lang === "sw" ? "Inatuma..." : "Reserving...") : (lang === "sw" ? "Thibitisha Nafasi Yangu" : "Reserve My Spot")}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
