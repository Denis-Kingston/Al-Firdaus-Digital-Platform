import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

export default function NotificationModal({ notification, onClose }) {
  if (!notification) return null;

  const { title, message, type = "success" } = notification;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-10 h-10 text-emerald-400" style={{ color: "#10B981" }} />;
      case "warning":
        return <AlertTriangle className="w-10 h-10 text-amber-400" style={{ color: "#F59E0B" }} />;
      case "error":
        return <XCircle className="w-10 h-10 text-rose-400" style={{ color: "#EF4444" }} />;
      default:
        return <Info className="w-10 h-10 text-blue-400" style={{ color: "#3B82F6" }} />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "rgba(16, 185, 129, 0.4)";
      case "warning":
        return "rgba(245, 158, 11, 0.45)";
      case "error":
        return "rgba(239, 68, 68, 0.45)";
      default:
        return "rgba(201, 162, 39, 0.4)";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(5, 15, 10, 0.75)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0B1B13 0%, #142E22 100%)",
          border: `2px solid ${getBorderColor()}`,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)",
          maxWidth: "460px",
          width: "100%",
          borderRadius: "1.75rem",
          padding: "2.25rem 2rem",
          textAlign: "center",
          color: "#FFFFFF",
          position: "relative",
          animation: "modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
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
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#94A3B8";
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
          }}
        >
          <X size={18} />
        </button>

        <div
          style={{
            width: "76px",
            height: "76px",
            borderRadius: "50%",
            background: type === "success" ? "rgba(16, 185, 129, 0.15)" : type === "warning" ? "rgba(245, 158, 11, 0.15)" : "rgba(239, 68, 68, 0.15)",
            border: `2px solid ${getBorderColor()}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
            boxShadow: `0 0 24px ${type === "success" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)"}`,
          }}
        >
          {getIcon()}
        </div>

        <div
          style={{
            display: "inline-block",
            padding: "0.25rem 0.85rem",
            borderRadius: "9999px",
            background: "rgba(201, 162, 39, 0.15)",
            border: "1px solid rgba(201, 162, 39, 0.35)",
            fontSize: "0.7rem",
            fontWeight: "800",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#E5C158",
            marginBottom: "0.75rem",
          }}
        >
          Al Firdaus Management
        </div>

        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#FFFFFF",
            marginBottom: "0.6rem",
            lineHeight: 1.25,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: "0.9rem",
            color: "#CBD5E1",
            lineHeight: 1.6,
            marginBottom: "1.75rem",
          }}
        >
          {message}
        </p>

        <button
          onClick={onClose}
          className="btn btn-gold"
          style={{ width: "100%", padding: "0.85rem" }}
        >
          Sawa, Nimeelewa / OK
        </button>
      </div>
    </div>
  );
}
