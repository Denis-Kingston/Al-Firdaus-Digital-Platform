import React, { useState, useEffect } from "react";
import { Smartphone, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";
import { apiPost } from "../utils/api";

export default function UssdPushModal({ donationData, onClose, onSuccessfulDonation }) {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState("awaiting_pin"); // "awaiting_pin" | "processing" | "success" | "cancelled"
  const [secondsLeft, setSecondsLeft] = useState(60);

  const amount = donationData?.amount || 25000;
  const phone = donationData?.phone || "0789631864";
  const reference = donationData?.reference || "SEL-892410";

  // Countdown timer for USSD push
  useEffect(() => {
    if (status !== "awaiting_pin") return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus("cancelled");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  const handleConfirmPin = async () => {
    if (!pin || pin.length < 4) {
      alert("Tafadhali weka tarakimu 4 za PIN ya mtandao wako.");
      return;
    }

    setStatus("processing");

    // Call backend simulator to complete donation
    setTimeout(async () => {
      try {
        await apiPost("donations/simulate-ussd-push/", {
          reference: reference,
          pin: pin,
        });
      } catch (_) {}

      setStatus("success");
      if (onSuccessfulDonation) {
        onSuccessfulDonation(reference);
      }
    }, 2000);
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
        backgroundColor: "rgba(5, 15, 10, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <div
        style={{
          background: "#081710",
          border: "2px solid var(--gold)",
          boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.9)",
          maxWidth: "420px",
          width: "100%",
          borderRadius: "2rem",
          padding: "2rem",
          color: "#FFFFFF",
          textAlign: "center",
          position: "relative",
          animation: "modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            color: "#94A3B8",
            background: "rgba(255, 255, 255, 0.08)",
            border: "none",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={16} />
        </button>

        {status === "awaiting_pin" && (
          <div>
            <div
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "50%",
                background: "rgba(201, 162, 39, 0.15)",
                border: "2px solid var(--gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
                color: "var(--gold-light)",
                boxShadow: "0 0 20px rgba(201, 162, 39, 0.2)",
              }}
            >
              <Smartphone size={32} />
            </div>

            <div className="badge badge-gold" style={{ marginBottom: "0.6rem" }}>
              Selcom Pay USSD Push
            </div>

            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.4rem" }}>
              Weka PIN Kukamilisha
            </h3>

            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
              Ombi la malipo limetumwa kwenye nambari <strong>{phone}</strong>. Weka PIN ya simu yako:
            </p>

            {/* Bill Summary Box */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "var(--radius-md)",
                padding: "1rem",
                marginBottom: "1.5rem",
                textAlign: "left",
                fontSize: "0.82rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Mpokeaji / Beneficiary:</span>
                <strong style={{ color: "#FFFFFF" }}>Al Firdaus Mosque Fund</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Kiasi / Amount:</span>
                <strong style={{ color: "var(--gold-light)", fontSize: "1rem" }}>
                  {Number(amount).toLocaleString()} TZS
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Kumbukumbu / Ref:</span>
                <span style={{ fontFamily: "monospace", color: "var(--text-secondary)" }}>{reference}</span>
              </div>
            </div>

            {/* PIN Input */}
            <div style={{ marginBottom: "1.5rem" }}>
              <input
                type="password"
                maxLength="4"
                placeholder="&bull; &bull; &bull; &bull;"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                style={{
                  width: "180px",
                  padding: "0.75rem",
                  fontSize: "1.75rem",
                  letterSpacing: "0.6rem",
                  textAlign: "center",
                  borderRadius: "var(--radius-md)",
                  background: "#05100B",
                  border: "2px solid var(--gold)",
                  color: "#FFFFFF",
                  outline: "none",
                }}
                autoFocus
              />
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                Muda uliosalia: <strong style={{ color: "var(--gold-light)" }}>{secondsLeft}s</strong>
              </span>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={onClose}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Ghairi / Cancel
              </button>
              <button
                onClick={handleConfirmPin}
                className="btn btn-gold"
                style={{ flex: 2 }}
              >
                Thibitisha Malipo
              </button>
            </div>
          </div>
        )}

        {status === "processing" && (
          <div style={{ padding: "2rem 0" }}>
            <Loader2
              size={56}
              style={{ color: "var(--gold)", animation: "spin 1.2s linear infinite", margin: "0 auto 1.5rem" }}
            />
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Inathibitisha na Selcom Gateway...
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Tafadhali subiri kidogo wakati mtandao unakamilisha mchango wako.
            </p>
          </div>
        )}

        {status === "success" && (
          <div style={{ padding: "1.5rem 0" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.2)",
                border: "2px solid #10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
                color: "#10B981",
                boxShadow: "0 0 25px rgba(16, 185, 129, 0.3)",
              }}
            >
              <CheckCircle size={40} />
            </div>

            <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem", color: "#10B981" }}>
              Malipo Yamekamilika!
            </h3>

            <p style={{ fontSize: "0.9rem", color: "#E2E8F0", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Jazakallahu Khair! Mchango wako wa <strong>{Number(amount).toLocaleString()} TZS</strong> umepokelewa kikamilifu. Mwenyezi Mungu akulipe kheri tele na aufanye sadaka hii kuwa na baraka tele.
            </p>

            <button
              onClick={onClose}
              className="btn btn-gold"
              style={{ width: "100%", padding: "0.85rem" }}
            >
              Sawa / Asante Sana
            </button>
          </div>
        )}

        {status === "cancelled" && (
          <div style={{ padding: "1.5rem 0" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.15)",
                border: "2px solid #EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
                color: "#EF4444",
              }}
            >
              <AlertCircle size={36} />
            </div>

            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Muda Umekwisha
            </h3>

            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Ombi la USSD Push limeshindwa kuthibitishwa kwa wakati. Tafadhali jaribu tena.
            </p>

            <button onClick={onClose} className="btn btn-outline" style={{ width: "100%" }}>
              Funga
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
