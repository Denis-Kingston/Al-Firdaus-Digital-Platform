import React, { useState, useEffect } from "react";
import { BookOpen, User, Clock, CheckCircle2, Search, X, Sparkles, AlertCircle } from "lucide-react";
import { apiGet, apiPost, translations } from "../utils/api";

export default function Institute({ lang, onShowNotification }) {
  const t = translations[lang] || translations.en;
  const [courses, setCourses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Registration Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
  });

  const defaultCourses = [
    {
      id: 1,
      title: "Complete Quran Recitation & Tajweed",
      category: "quran",
      category_display: "Quran & Tajweed",
      description: "Master articulation points (Makharij), rules of Noon Sakinah, and rhythm of recitation with individual feedback.",
      instructor: "Sheikh Abdallah Al-Kinani",
      schedule: "Mon & Wed, 5:00 PM - 7:00 PM",
      age_group: "Teens & Adults",
    },
    {
      id: 2,
      title: "Modern Standard Arabic & Grammar (Nahw & Sarf)",
      category: "arabic",
      category_display: "Arabic Language",
      description: "Comprehensive Arabic language study from foundation to advanced sentence structure and classical vocabulary.",
      instructor: "Ustadh Salim Hassan",
      schedule: "Tue & Thu, 6:00 PM - 8:00 PM",
      age_group: "Adults (16+)",
    },
    {
      id: 3,
      title: "Islamic Jurisprudence (Fiqh) & Aqeedah",
      category: "islamic_studies",
      category_display: "Islamic Studies",
      description: "In-depth understanding of daily worship (Taharah, Salah, Zakat, Sawm) and orthodox Islamic creed.",
      instructor: "Sheikh Muhammad Zubayr",
      schedule: "Saturday, 9:00 AM - 12:00 PM",
      age_group: "All Ages",
    },
    {
      id: 4,
      title: "Intensive Hifdh & Memorization Program",
      category: "hifdh",
      category_display: "Hifdh Program",
      description: "Full-time and part-time Quran memorization tracks with daily revision cycles and sanad-certified supervision.",
      instructor: "Hafidh Yusuf Al-Banna",
      schedule: "Daily, 6:30 AM - 8:30 AM",
      age_group: "Ages 7 to 25",
    },
  ];

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      const data = await apiGet("institute/courses/", defaultCourses);
      setCourses(data && data.length ? data : defaultCourses);
      setLoading(false);
    }
    loadCourses();
  }, []);

  const categories = [
    { id: "all", label: lang === "sw" ? "Kozi Zote" : "All Programs" },
    { id: "quran", label: "Quran & Tajweed" },
    { id: "arabic", label: "Arabic Language" },
    { id: "islamic_studies", label: "Islamic Studies" },
    { id: "hifdh", label: "Hifdh Program" },
  ];

  const filteredCourses = categoryFilter === "all"
    ? courses
    : courses.filter((c) => c.category === categoryFilter);

  const handleOpenApplyModal = (course) => {
    setSelectedCourse(course);
    setFormData({ fullName: "", phone: "", email: "", notes: "" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  // Submit Registration with Duplicate Check Handling
  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;

    setSubmitting(true);

    const payload = {
      course: selectedCourse.id,
      full_name: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      notes: formData.notes.trim(),
    };

    try {
      const response = await apiPost("institute/register/", payload);

      if (response.ok) {
        // Success
        onShowNotification({
          title: lang === "sw" ? "Usajili Umekamilika!" : "Application Submitted!",
          message: lang === "sw"
            ? `Jazakallahu Khair! Usajili wako kwenye kozi ya "${selectedCourse.title}" umepokelewa. Ofisi ya masomo ya chuo itawasiliana nawe hivi punde.`
            : `Jazakallahu Khair! Your registration for "${selectedCourse.title}" has been received. Our admissions office will contact you promptly.`,
          type: "success",
        });
        handleCloseModal();
      } else if (response.status === 409 || response.data?.already_registered) {
        // Duplicate Registration Caught by Backend
        onShowNotification({
          title: lang === "sw" ? "Tayari Umejisajili!" : "Already Registered!",
          message: response.data?.message || (lang === "sw"
            ? `Namba hii ya simu (${formData.phone}) tayari ipo kwenye orodha ya wanafunzi wa kozi ya "${selectedCourse.title}". Ofisi ya masomo itawasiliana nawe.`
            : `This phone number (${formData.phone}) is already registered for "${selectedCourse.title}". Admissions will contact you.`),
          type: "warning",
        });
        handleCloseModal();
      } else {
        // Validation or other error
        const errMsg = response.data?.detail || response.data?.message || JSON.stringify(response.data);
        onShowNotification({
          title: lang === "sw" ? "Hitilafu ya Usajili" : "Registration Error",
          message: errMsg || (lang === "sw" ? "Tafadhali kagua taarifa ulizoingiza na ujaribu tena." : "Please check your inputs and try again."),
          type: "error",
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      onShowNotification({
        title: lang === "sw" ? "Hitilafu ya Mtandao" : "Network Error",
        message: lang === "sw" ? "Kuna hitilafu ya mawasiliano. Tafadhali jaribu tena." : "Connection failed. Please try again.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="institute-section" style={{ padding: "5rem 0", background: "var(--bg-dark)" }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "750px", margin: "0 auto 3rem" }}>
          <div className="badge badge-gold" style={{ marginBottom: "0.85rem" }}>
            <BookOpen size={13} />
            <span>Al Firdaus Islamic Institute</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", marginBottom: "0.75rem" }}>
            {t.courses_title}
          </h2>
          <p style={{ fontSize: "0.95rem" }}>{t.courses_subtitle}</p>
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "3rem",
          }}
        >
          {categories.map((cat) => {
            const isActive = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`filter-tab-btn ${isActive ? "active" : ""}`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Course Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.75rem",
          }}
        >
          {filteredCourses.map((c) => (
            <div
              key={c.id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <span className="badge badge-gold">
                    {c.category_display || c.category}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    {c.age_group || "All Ages"}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem", color: "#FFFFFF" }}>
                  {c.title}
                </h3>

                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                  {c.description}
                </p>
              </div>

              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                  <User size={14} color="var(--gold-light)" />
                  <span><strong>{lang === "sw" ? "Mwalimu:" : "Instructor:"}</strong> {c.instructor || "Al Firdaus Faculty"}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                  <Clock size={14} color="var(--gold-light)" />
                  <span>{c.schedule || "Semester Sessions"}</span>
                </div>

                <button
                  onClick={() => handleOpenApplyModal(c)}
                  className="btn btn-gold"
                  style={{ width: "100%", padding: "0.75rem" }}
                >
                  <BookOpen size={16} />
                  <span>{t.btn_apply_now}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registration Application Modal */}
      {isModalOpen && selectedCourse && (
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
            animation: "fadeIn 0.2s ease-out",
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #0E2219 0%, #08140E 100%)",
              border: "1.5px solid var(--gold-border)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
              maxWidth: "520px",
              width: "100%",
              borderRadius: "1.75rem",
              padding: "2rem",
              color: "#FFFFFF",
              position: "relative",
              animation: "modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
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

            {/* Modal Header */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div className="badge badge-gold" style={{ marginBottom: "0.5rem" }}>
                {selectedCourse.category_display || selectedCourse.category}
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.35rem" }}>
                {lang === "sw" ? "Maombi ya Kujiunga" : "Enrollment Application"}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--gold-light)", fontWeight: 600 }}>
                {selectedCourse.title}
              </p>
            </div>

            {/* Note banner explaining one-time registration rule */}
            <div
              style={{
                background: "rgba(201, 162, 39, 0.1)",
                borderLeft: "3px solid var(--gold)",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.78rem",
                color: "#E2E8F0",
                marginBottom: "1.5rem",
                lineHeight: 1.5,
              }}
            >
              {lang === "sw"
                ? "Kila mwanafunzi anajisajili mara moja tu kwa kozi moja. Mfumo utatambua namba yako ya simu kuzuia usajili mara mbili."
                : "Students register once per program. The system verifies your phone number to ensure single registration."}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitRegistration} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  {lang === "sw" ? "Jina Kamili *" : "Full Name *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === "sw" ? "k.m. Rashid Ally" : "e.g. Salim Hassan"}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    {lang === "sw" ? "Namba ya Simu *" : "Phone Number *"}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+255 7XX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    {lang === "sw" ? "Barua Pepe" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  {lang === "sw" ? "Uzoefu / Maoni" : "Experience Level / Notes"}
                </label>
                <textarea
                  rows="3"
                  placeholder={lang === "sw" ? "Eleza kiwango chako cha sasa au maswali..." : "Tell us your current knowledge level or goals..."}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-gold"
                style={{ padding: "0.85rem", marginTop: "0.5rem" }}
              >
                <CheckCircle2 size={18} />
                <span>{submitting ? (lang === "sw" ? "Inakagua na Kusajili..." : "Verifying & Enrolling...") : (lang === "sw" ? "Tuma Maombi ya Usajili" : "Submit Application")}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
