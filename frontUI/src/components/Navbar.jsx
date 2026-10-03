import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Heart,
  ChevronDown,
  Compass,
  Calculator,
  Landmark,
  MessageCircle,
} from "lucide-react";
import { translations } from "../utils/api";

export default function Navbar({ activeTab, setActiveTab, lang, setLang, onOpenDonate }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileOpen(false);
    setToolsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isToolActive = activeTab === "qibla" || activeTab === "zakat" || activeTab === "mosque_info";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(8, 23, 16, 0.97)" : "rgba(10, 27, 18, 0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        transition: "var(--transition)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "66px",
            gap: "0.75rem",
          }}
        >
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick("home")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              cursor: "pointer",
              userSelect: "none",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "8px",
                background: "#143022",
                border: "1px solid var(--gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="23" stroke="#C9A227" strokeWidth="1" strokeDasharray="3 3" />
                <path
                  d="M24 9C19 13 17 18 17 23C17 27 20 30 24 30C28 30 31 27 31 23C31 18 29 13 24 9Z"
                  fill="#C9A227"
                />
                <rect x="21.5" y="28" width="5" height="11" rx="1" fill="#C9A227" />
                <path
                  d="M12 39C14 33 18 30 24 30C30 30 34 33 36 39"
                  stroke="#E5C158"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <strong
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "var(--gold-light)",
                  letterSpacing: "-0.01em",
                  display: "block",
                  lineHeight: 1.1,
                }}
              >
                Al-Firdaus
              </strong>
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  display: "block",
                }}
              >
                Centre &amp; Institute
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="navbar-desktop-nav"
            style={{
              display: "none",
              alignItems: "center",
              gap: "0.25rem",
              flexShrink: 0,
            }}
          >
            {/* Home */}
            <button
              type="button"
              onClick={() => handleNavClick("home")}
              className={`nav-link-item ${activeTab === "home" ? "active" : ""}`}
            >
              <span>{t.nav_home}</span>
            </button>

            {/* Institute */}
            <button
              type="button"
              onClick={() => handleNavClick("institute")}
              className={`nav-link-item ${activeTab === "institute" ? "active" : ""}`}
            >
              <span>{t.nav_institute}</span>
            </button>

            {/* Prayers (Short & Never Wrapped) */}
            <button
              type="button"
              onClick={() => handleNavClick("prayers")}
              className={`nav-link-item ${activeTab === "prayers" ? "active" : ""}`}
            >
              <span>{t.nav_prayers}</span>
            </button>

            {/* Events */}
            <button
              type="button"
              onClick={() => handleNavClick("events")}
              className={`nav-link-item ${activeTab === "events" ? "active" : ""}`}
            >
              <span>{t.nav_events}</span>
            </button>

            {/* Khutbahs */}
            <button
              type="button"
              onClick={() => handleNavClick("media")}
              className={`nav-link-item ${activeTab === "media" ? "active" : ""}`}
            >
              <span>{t.nav_media}</span>
            </button>

            {/* Services Dropdown */}
            <div
              ref={dropdownRef}
              style={{ position: "relative" }}
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                type="button"
                onClick={() => setToolsOpen(!toolsOpen)}
                className={`nav-link-item ${isToolActive ? "active" : ""}`}
              >
                <span>{t.nav_tools || (lang === "sw" ? "Huduma" : "Services")}</span>
                <ChevronDown
                  size={13}
                  style={{
                    transform: toolsOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    opacity: 0.8,
                  }}
                />
              </button>

              {toolsOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    paddingTop: "0.5rem",
                    zIndex: 110,
                  }}
                >
                  <div className="clean-dropdown-card">
                    {/* Qibla Finder */}
                    <button
                      type="button"
                      onClick={() => handleNavClick("qibla")}
                      className={`clean-dropdown-item ${activeTab === "qibla" ? "active" : ""}`}
                    >
                      <Compass size={15} color="var(--gold-light)" />
                      <span>{t.nav_qibla}</span>
                    </button>

                    {/* Zakat Calculator */}
                    <button
                      type="button"
                      onClick={() => handleNavClick("zakat")}
                      className={`clean-dropdown-item ${activeTab === "zakat" ? "active" : ""}`}
                    >
                      <Calculator size={15} color="var(--gold-light)" />
                      <span>{t.nav_zakat}</span>
                    </button>

                    {/* About Mosque */}
                    <button
                      type="button"
                      onClick={() => handleNavClick("mosque_info")}
                      className={`clean-dropdown-item ${activeTab === "mosque_info" ? "active" : ""}`}
                    >
                      <Landmark size={15} color="#34D399" />
                      <span>{t.nav_mosque_info || (lang === "sw" ? "Kuhusu Msikiti" : "About Mosque")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Contact */}
            <button
              type="button"
              onClick={() => handleNavClick("contact")}
              className={`nav-link-item ${activeTab === "contact" ? "active" : ""}`}
            >
              <span>{t.nav_contact}</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
            {/* WhatsApp Link */}
            <a
              href="https://wa.me/255700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-whatsapp-link"
              title="WhatsApp: +255 700 000 000"
              style={{
                display: "none",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.4rem 0.75rem",
                borderRadius: "var(--radius-sm)",
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                color: "#34D399",
                fontSize: "0.78rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </a>

            {/* Language Switcher Segmented Control */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "#07170E",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "var(--radius-sm)",
                padding: "2px",
                whiteSpace: "nowrap",
              }}
            >
              <button
                type="button"
                onClick={() => setLang("sw")}
                style={{
                  padding: "0.25rem 0.55rem",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  background: lang === "sw" ? "var(--gold)" : "transparent",
                  color: lang === "sw" ? "#07150E" : "var(--text-muted)",
                  transition: "var(--transition)",
                }}
              >
                SW
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                style={{
                  padding: "0.25rem 0.55rem",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  background: lang === "en" ? "var(--gold)" : "transparent",
                  color: lang === "en" ? "#07150E" : "var(--text-muted)",
                  transition: "var(--transition)",
                }}
              >
                EN
              </button>
            </div>

            {/* Primary Action: Clean Gold Donate Button */}
            <button
              onClick={onOpenDonate}
              className="btn btn-gold btn-sm"
              style={{
                padding: "0.45rem 1rem",
                borderRadius: "var(--radius-sm)",
                fontWeight: 700,
              }}
            >
              <Heart size={14} fill="#07150E" />
              <span>{t.btn_donate}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              className="navbar-mobile-toggle"
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                width: "38px",
                height: "38px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              {mobileOpen ? <X size={20} color="var(--gold-light)" /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          style={{
            background: "#081A12",
            borderBottom: "1px solid var(--gold-border)",
            padding: "1rem 1.25rem 1.75rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "1.25rem" }}>
            {[
              { id: "home", label: t.nav_home },
              { id: "institute", label: t.nav_institute },
              { id: "prayers", label: t.nav_prayers },
              { id: "events", label: t.nav_events },
              { id: "media", label: t.nav_media },
              { id: "qibla", label: t.nav_qibla, icon: Compass },
              { id: "zakat", label: t.nav_zakat, icon: Calculator },
              { id: "contact", label: t.nav_contact },
            ].map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "6px",
                    background: isActive ? "rgba(201, 162, 39, 0.15)" : "transparent",
                    border: isActive ? "1px solid rgba(201, 162, 39, 0.3)" : "1px solid transparent",
                    color: isActive ? "var(--gold-light)" : "#E2E8F0",
                    fontSize: "0.9rem",
                    fontWeight: isActive ? 600 : 500,
                    textAlign: "left",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                    {Icon && <Icon size={15} color="var(--gold-light)" />}
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              onOpenDonate();
              setMobileOpen(false);
            }}
            className="btn btn-gold"
            style={{ width: "100%", padding: "0.75rem", borderRadius: "6px" }}
          >
            <Heart size={15} fill="#07150E" />
            <span>{t.btn_donate}</span>
          </button>
        </div>
      )}

      {/* Breakpoint Style Rules */}
      <style>{`
        @media (min-width: 990px) {
          .navbar-desktop-nav {
            display: flex !important;
          }
        }
        @media (min-width: 1140px) {
          .navbar-whatsapp-link {
            display: inline-flex !important;
          }
        }
        @media (max-width: 989px) {
          .navbar-mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
