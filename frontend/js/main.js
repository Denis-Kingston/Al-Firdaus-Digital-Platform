// Al Firdaus Institute & Mosque — frontend API integration.
const API_BASE = (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "0.0.0.0" ||
  window.location.hostname.startsWith("192.168.") ||
  window.location.hostname.startsWith("10.") ||
  window.location.protocol === "file:" ||
  (window.location.port !== "" && window.location.port !== "80" && window.location.port !== "443")
) ? "http://127.0.0.1:8000" : "https://api.al-firdaus.org";

const formatNumber = (value) => Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  }[char]));
}

function showNotification({ title, message, type = "success", duration = 6000 }) {
  document.getElementById("alFirdausNotificationModal")?.remove();

  const isSuccess = type === "success";
  const iconColor = isSuccess ? "#10b981" : (type === "warning" ? "#f59e0b" : "#ef4444");
  const iconBg = isSuccess ? "rgba(16, 185, 129, 0.15)" : (type === "warning" ? "rgba(245, 158, 11, 0.15)" : "rgba(239, 68, 68, 0.15)");
  const iconBorder = isSuccess ? "rgba(16, 185, 129, 0.35)" : (type === "warning" ? "rgba(245, 158, 11, 0.35)" : "rgba(239, 68, 68, 0.35)");

  const iconSvg = isSuccess
    ? `<svg style="width:36px;height:36px;" fill="none" stroke="${iconColor}" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`
    : `<svg style="width:36px;height:36px;" fill="none" stroke="${iconColor}" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`;

  const modal = document.createElement("div");
  modal.id = "alFirdausNotificationModal";
  modal.style.cssText = "position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(5,15,10,0.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:modalFadeIn 0.25s ease-out;";

  modal.innerHTML = `
    <div style="background:linear-gradient(135deg, #0B1B13 0%, #142E22 100%);border:2px solid rgba(201,162,39,0.45);box-shadow:0 25px 50px -12px rgba(0,0,0,0.7);max-width:440px;width:100%;border-radius:1.5rem;padding:2rem 1.75rem;text-align:center;color:#ffffff;position:relative;animation:modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1);box-sizing:border-box;">
      <button id="closeNotifyBtn" aria-label="Close" style="position:absolute;top:1rem;right:1rem;color:#94a3b8;background:rgba(255,255,255,0.08);border:none;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;">
        <svg style="width:18px;height:18px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      <div style="width:68px;height:68px;border-radius:50%;background:${iconBg};border:2px solid ${iconBorder};display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;box-shadow:0 0 24px ${iconBg};">
        ${iconSvg}
      </div>

      <div style="display:inline-block;padding:0.25rem 0.85rem;border-radius:9999px;background:rgba(201,162,39,0.15);border:1px solid rgba(201,162,39,0.35);font-size:0.7rem;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#E5C158;margin-bottom:0.75rem;">
        Al Firdaus Digital Platform
      </div>

      <h3 style="font-family:'Fraunces', Georgia, serif;font-size:1.45rem;font-weight:700;color:#ffffff;margin-bottom:0.5rem;line-height:1.3;">
        ${escapeHtml(title || "Ujumbe Umetumwa!")}
      </h3>

      <p style="font-size:0.875rem;color:#cbd5e1;line-height:1.6;margin-bottom:1.5rem;font-weight:400;">
        ${escapeHtml(message || "")}
      </p>

      <button id="confirmNotifyBtn" style="width:100%;padding:0.85rem 1.5rem;border-radius:0.75rem;background:linear-gradient(135deg, #C9A227 0%, #A4821B 100%);color:#0B1B13;font-weight:800;font-size:0.9rem;border:none;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 14px rgba(201,162,39,0.35);">
        Sawa / Done
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => {
    modal.style.opacity = "0";
    modal.style.transition = "opacity 0.2s ease";
    setTimeout(() => modal.remove(), 200);
  };

  modal.querySelector("#closeNotifyBtn")?.addEventListener("click", closeModal);
  modal.querySelector("#confirmNotifyBtn")?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", onKeyDown);
    }
  };
  document.addEventListener("keydown", onKeyDown);

  if (duration > 0) {
    setTimeout(() => {
      if (document.body.contains(modal)) closeModal();
    }, duration);
  }
}

// 1. Mobile Navigation & Setup
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isClosed = links.classList.contains("hidden") || !links.classList.contains("open");
      if (isClosed) {
        links.classList.remove("hidden");
        links.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
      } else {
        links.classList.add("hidden");
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.add("hidden");
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!links.contains(e.target) && !toggle.contains(e.target)) {
        links.classList.add("hidden");
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Amount preset buttons
  document.querySelectorAll(".amount-grid").forEach((grid) => {
    const custom = document.querySelector("#customAmount");
    grid.addEventListener("click", (event) => {
      const button = event.target.closest(".amount-btn");
      if (!button) return;
      grid.querySelectorAll(".amount-btn").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      if (custom) custom.value = button.dataset.amount || "";
    });
  });

  // Dynamic Selcom Donation Form Submission with Real USSD Push Simulation
  document.querySelectorAll("form#donationForm, form[data-donation-form]").forEach((form) => {
    // Avoid binding contact form or forms without donation fields
    if (form.hasAttribute("data-contact-form") || !form.querySelector("#customAmount, [name=amount]")) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submitBtn = form.querySelector("button[type=submit]");
      const originalText = submitBtn ? submitBtn.textContent : "Donate Now";

      const amountVal = Number(form.querySelector("#customAmount")?.value || form.querySelector("[name=amount]")?.value || 0);
      const donorName = form.querySelector("#donorName")?.value || form.querySelector("[name=name]")?.value || "Anonymous";
      const donorPhone = form.querySelector("#donorPhone")?.value || form.querySelector("[name=phone]")?.value || "";
      const donorEmail = form.querySelector("#donorEmail")?.value || form.querySelector("[name=email]")?.value || "";
      const causeId = form.querySelector("#causeSelect")?.value || null;

      if (!amountVal || amountVal <= 0) {
        alert("Please enter a valid donation amount.");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Connecting to Selcom USSD Push Gateway...";
      }

      const payload = {
        amount: amountVal,
        donor_name: donorName,
        donor_phone: donorPhone,
        donor_email: donorEmail,
      };
      if (causeId) payload.cause = Number(causeId);

      try {
        const response = await fetch(`${API_BASE}/api/donations/donate/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok && data.reference) {
          data.amount = amountVal;
          openUssdPushSimulationModal(data, donorPhone, form);
        } else {
          alert(`Donation Error: ${data.message || data.error || JSON.stringify(data)}`);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
        }
      } catch (err) {
        console.error("Donation submission failed:", err);
        alert("Network connection error. Make sure backend API server is running.");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  });
});

// Real Mobile USSD Push Simulation Modal
function openUssdPushSimulationModal(data, donorPhone, form) {
  let modal = document.getElementById("ussdPushModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "ussdPushModal";
    modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all";
    document.body.appendChild(modal);
  }

  const phoneStr = donorPhone || "+255 7XX XXX XXX";
  const amountFormatted = formatNumber(data.amount || 0);

  modal.innerHTML = `
    <div class="bg-slate-900 border-2 border-gold/40 max-w-md w-full rounded-3xl p-6 shadow-2xl text-white space-y-6 relative overflow-hidden">
      <div class="flex items-center justify-between border-b border-white/10 pb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">📲</div>
          <div>
            <strong class="font-serif text-base text-gold-light block leading-none">Selcom USSD Push</strong>
            <span class="text-[10px] text-slate-400 uppercase tracking-widest font-mono">SIM Wallet Prompt</span>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">WAITING PIN</span>
      </div>

      <div class="bg-black/50 border border-emerald-500/30 rounded-2xl p-5 space-y-3 text-center font-mono">
        <p class="text-xs text-emerald-400">Push Notification sent to: <strong>${escapeHtml(phoneStr)}</strong></p>
        <div class="py-2 border-y border-white/10">
          <p class="text-xs text-slate-300">Pay <strong>${escapeHtml(amountFormatted)} TZS</strong> to</p>
          <p class="text-sm font-bold text-gold-light">Al-Firdaus Mosque &amp; Institute</p>
          <p class="text-[10px] text-slate-400 mt-1">Ref: ${escapeHtml(data.reference)}</p>
        </div>
        <div class="pt-1">
          <label class="block text-[11px] text-slate-300 mb-2">Enter SIM Wallet PIN (4-Digits):</label>
          <input type="password" id="simPinInput" maxlength="4" value="1234" class="w-36 text-center text-xl font-bold tracking-widest px-3 py-2 rounded-xl bg-slate-800 border border-gold/50 text-gold-light focus:outline-none focus:ring-2 focus:ring-gold">
        </div>
      </div>

      <div class="space-y-2.5">
        <button type="button" id="confirmPushPayBtn" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-800 text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg transition-all flex items-center justify-center gap-2">
          <span>Authorize &amp; Complete Payment</span>
        </button>
        <button type="button" id="cancelPushPayBtn" class="w-full py-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white font-semibold text-xs transition-colors">
          Decline / Cancel
        </button>
      </div>

      <div id="pushStatusFeedback" class="hidden text-center text-xs font-semibold p-3 rounded-xl"></div>
    </div>
  `;

  modal.classList.remove("hidden");

  const confirmBtn = modal.querySelector("#confirmPushPayBtn");
  const cancelBtn = modal.querySelector("#cancelPushPayBtn");
  const pinInput = modal.querySelector("#simPinInput");
  const feedback = modal.querySelector("#pushStatusFeedback");

  cancelBtn.addEventListener("click", async () => {
    confirmBtn.disabled = true;
    cancelBtn.disabled = true;
    try {
      await fetch(`${API_BASE}/api/donations/simulate-push/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: data.reference, phone: donorPhone, action: "decline" }),
      });
    } catch (_) {}
    modal.classList.add("hidden");
    if (form) {
      const submitBtn = form.querySelector("button[type=submit]");
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Donate Now"; }
    }
  });

  confirmBtn.addEventListener("click", async () => {
    confirmBtn.disabled = true;
    cancelBtn.disabled = true;
    confirmBtn.innerHTML = `<span>Authorizing with Mobile Network...</span>`;

    try {
      const response = await fetch(`${API_BASE}/api/donations/simulate-push/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: data.reference,
          phone: donorPhone,
          pin: pinInput.value || "1234",
          action: "approve",
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.status === "completed") {
        modal.querySelector(".space-y-6").innerHTML = `
          <div class="text-center space-y-4 py-2">
            <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-400 text-2xl font-bold">✓</div>
            <div>
              <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Payment Successful</span>
              <h3 class="font-serif text-2xl font-bold text-gold-light mt-2">Jazakallahu Khair!</h3>
              <p class="text-xs text-slate-300 mt-1">Your donation of <strong>${formatNumber(resData.amount)} TZS</strong> has been received via <strong>${escapeHtml(resData.network)}</strong>.</p>
              <p class="text-[11px] font-mono text-slate-400 mt-1">Ref: ${escapeHtml(resData.reference)}</p>
            </div>
            
            <div class="pt-2 space-y-3">
              <a href="${API_BASE}${resData.receipt_url}" target="_blank" class="w-full py-3.5 rounded-xl bg-gold text-emerald-950 font-bold text-xs hover:bg-gold-light transition-colors shadow-lg flex items-center justify-center gap-2">
                📄 Download Official PDF Receipt
              </a>
              <button type="button" id="closePushSuccessBtn" class="w-full py-2.5 rounded-xl bg-white/10 text-slate-300 hover:text-white font-semibold text-xs transition-colors">
                Close Dialog
              </button>
            </div>
          </div>
        `;

        modal.querySelector("#closePushSuccessBtn")?.addEventListener("click", () => {
          modal.classList.add("hidden");
          window.location.reload();
        });
      } else {
        feedback.classList.remove("hidden");
        feedback.className = "text-center text-xs font-semibold p-3 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30";
        feedback.textContent = resData.error || resData.message || "Push payment failed.";
        confirmBtn.disabled = false;
        cancelBtn.disabled = false;
        confirmBtn.textContent = "Try Again";
      }
    } catch (err) {
      console.error("Simulation error:", err);
      feedback.classList.remove("hidden");
      feedback.className = "text-center text-xs font-semibold p-3 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30";
      feedback.textContent = "Network error. Please check backend connection.";
      confirmBtn.disabled = false;
      cancelBtn.disabled = false;
      confirmBtn.textContent = "Try Again";
    }
  });
}

// 2. Dynamic Announcements List Feed
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("[data-announcements-list]");
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE}/api/announcements/?_t=${Date.now()}`, { cache: "no-store" });
    if (response.ok) {
      const announcements = await response.json();

      if (!Array.isArray(announcements) || !announcements.length) {
        container.innerHTML = `<div class="bg-white p-6 rounded-2xl border border-slate-200 text-center"><p class="text-xs text-slate-500 font-medium">No announcements posted at this time.</p></div>`;
        return;
      }

      container.innerHTML = announcements.map((item) => {
        const isUrgent = item.is_urgent;
        const badgeClass = isUrgent
          ? "bg-red-100 text-red-700 border-red-200"
          : "bg-emerald-100 text-emerald-800 border-emerald-200";
        const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString() : "";

        return `
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${badgeClass}">
                ${escapeHtml(item.category)} ${isUrgent ? "• URGENT" : ""}
              </span>
              <span class="text-xs text-slate-400 font-medium">${escapeHtml(dateStr)}</span>
            </div>
            <h4 class="font-serif text-base font-bold text-slate-900">${escapeHtml(item.title)}</h4>
            <p class="text-xs text-slate-600 leading-relaxed">${escapeHtml(item.content)}</p>
          </div>
        `;
      }).join("");
    }
  } catch (e) {
    console.warn("Could not load dynamic announcements:", e);
  }
});

// 3. Dynamic Events List (Home Page & Events Page)
document.addEventListener("DOMContentLoaded", async () => {
  const homeContainer = document.querySelector("[data-home-events-list]");
  const fullContainer = document.querySelector("[data-events-list]");

  if (!homeContainer && !fullContainer) return;

  try {
    const response = await fetch(`${API_BASE}/api/events/?_t=${Date.now()}`, { cache: "no-store" });
    if (response.ok) {
      const events = await response.json();

      // Update Home Page Events Widget
      if (homeContainer) {
        if (!Array.isArray(events) || !events.length) {
          homeContainer.innerHTML = `<div class="bg-white p-6 rounded-2xl border border-slate-200 text-center"><p class="text-xs text-slate-500 font-medium">No upcoming events scheduled right now.</p></div>`;
        } else {
          homeContainer.innerHTML = events.slice(0, 3).map((eventItem) => {
            const eventDate = new Date(eventItem.event_date || Date.now());
            const day = eventDate.getDate();
            const month = eventDate.toLocaleString("en-US", { month: "short" });
            const timeStr = eventDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

            return `
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div class="w-14 h-14 rounded-xl bg-emerald-900 text-gold-light flex flex-col items-center justify-center font-bold shrink-0">
                  <span class="text-base leading-none">${day}</span>
                  <span class="text-[10px] uppercase tracking-wider font-semibold">${month}</span>
                </div>
                <div>
                  <h4 class="font-serif text-base font-bold text-slate-900">${escapeHtml(eventItem.title)}</h4>
                  <p class="text-xs text-slate-500 mt-0.5">${escapeHtml(timeStr)} &middot; ${escapeHtml(eventItem.location || "Al Firdaus Mosque")}</p>
                </div>
              </div>
            `;
          }).join("");
        }
      }

      // Update Full Events Grid
      if (fullContainer) {
        if (!Array.isArray(events) || !events.length) {
          fullContainer.innerHTML = `<div class="bg-white p-8 rounded-3xl border border-slate-200 text-center col-span-full"><p class="text-sm text-slate-500 font-medium">No upcoming events scheduled right now.</p></div>`;
        } else {
          fullContainer.innerHTML = events.map((eventItem) => {
            const eventDate = new Date(eventItem.event_date || Date.now());
            const day = eventDate.getDate();
            const month = eventDate.toLocaleString("en-US", { month: "short" });
            const timeStr = eventDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

            return `
              <div class="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:border-gold shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <div class="w-16 h-16 rounded-2xl bg-emerald-900 text-gold-light flex flex-col items-center justify-center font-bold mb-6">
                    <span class="text-xl leading-none">${day}</span>
                    <span class="text-[11px] uppercase font-semibold">${month}</span>
                  </div>
                  <h3 class="font-serif text-2xl font-bold text-slate-900 mb-2">${escapeHtml(eventItem.title)}</h3>
                  <p class="text-xs text-slate-500 mb-4 font-medium">${escapeHtml(timeStr)} &middot; ${escapeHtml(eventItem.location || "Al Firdaus Mosque")}</p>
                  <p class="text-xs text-slate-600 mb-6 leading-relaxed">${escapeHtml(eventItem.description || "")}</p>
                </div>

                <div class="rsvp-widget bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                  <form class="rsvp-form space-y-2.5" data-rsvp-form data-event-id="${eventItem.id}">
                    <input type="text" name="rsvp_name" placeholder="Your full name" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-gold">
                    <input type="tel" name="rsvp_phone" placeholder="Phone number (optional)" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-gold">
                    <button type="submit" class="w-full py-3 rounded-xl bg-emerald-900 text-white font-bold text-xs hover:bg-emerald-950 transition-colors shadow-md">RSVP Now</button>
                  </form>
                  <div class="rsvp-count text-[11px] font-semibold text-slate-500 text-center">${eventItem.rsvp_count || 0} attending</div>
                  <p class="rsvp-success hidden text-xs font-bold text-emerald-700 text-center">RSVP confirmed! Jazakallahu Khair.</p>
                </div>
              </div>
            `;
          }).join("");

          bindRsvpForms();
        }
      }
    }
  } catch (e) {
    console.warn("Could not load dynamic events:", e);
  }
});

function bindRsvpForms() {
  document.querySelectorAll("[data-rsvp-form]").forEach((form) => {
    if (form.dataset.bound) return;
    form.dataset.bound = "true";

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const widget = form.closest(".rsvp-widget");
      const count = widget?.querySelector(".rsvp-count");
      const success = widget?.querySelector(".rsvp-success");
      const submitBtn = form.querySelector("button[type=submit]");

      if (submitBtn) submitBtn.disabled = true;

      const payload = {
        name: form.querySelector("[name=rsvp_name]")?.value.trim(),
        phone: form.querySelector("[name=rsvp_phone]")?.value.trim(),
      };

      try {
        const response = await fetch(`${API_BASE}/api/events/${encodeURIComponent(form.dataset.eventId)}/rsvp/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          if (count && data.rsvp_count !== undefined) {
            count.textContent = `${data.rsvp_count} attending`;
          }
          if (success) success.style.display = "block";
          showNotification({
            title: "RSVP Imetumwa! / Reserved",
            message: "Jazakallahu Khair! Ombi lako la kuhudhuria tukio limepokelewa na jina lako limerekodiwa.",
            type: "success",
            duration: 6000,
          });
          form.reset();
        } else {
          showNotification({
            title: "Hitilafu ya RSVP",
            message: "Haikuweza kurekodi RSVP yako. Tafadhali jaribu tena.",
            type: "error",
          });
        }
      } catch (err) {
        console.error("RSVP error:", err);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });
}

// 4. Khutbah Archive Audio Player
document.addEventListener("DOMContentLoaded", async () => {
  const list = document.querySelector("[data-khutbah-list]");
  if (!list) return;

  try {
    const response = await fetch(`${API_BASE}/api/khutbahs/?_t=${Date.now()}`, { cache: "no-store" });
    if (response.ok) {
      const khutbahs = await response.json();

      if (!Array.isArray(khutbahs) || !khutbahs.length) {
        list.innerHTML = `<div class="bg-white p-8 rounded-3xl border border-slate-200 text-center col-span-full"><p class="text-sm text-slate-500 font-medium">No audio khutbahs uploaded yet.</p></div>`;
        return;
      }

      list.innerHTML = khutbahs.map((khutbah) => {
        const audio = khutbah.audio
          ? `<audio controls class="w-full mt-2" src="${escapeHtml(khutbah.audio)}"></audio>`
          : '<p class="text-xs text-slate-400 italic mt-2">Audio recording coming soon.</p>';

        return `
          <div class="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-xl transition-all">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-emerald-100 text-emerald-900">Friday Sermon</span>
              <span class="text-xs text-slate-400 font-medium">${escapeHtml(khutbah.date || "")}</span>
            </div>
            <h3 class="font-serif text-2xl font-bold text-slate-900">${escapeHtml(khutbah.title)}</h3>
            <p class="text-xs text-slate-500 font-semibold">Speaker: ${escapeHtml(khutbah.speaker || "Imam")}</p>
            ${khutbah.summary ? `<p class="text-xs text-slate-600 leading-relaxed">${escapeHtml(khutbah.summary)}</p>` : ""}
            ${audio}
          </div>
        `;
      }).join("");
    }
  } catch (e) {
    console.warn("Could not load dynamic khutbahs:", e);
  }
});

// 5. Shared API-powered Prayer Times & Causes
document.addEventListener("DOMContentLoaded", async () => {
  const dateElements = document.querySelectorAll("[data-hijri-date]");
  try {
    const response = await fetch(`${API_BASE}/api/prayer-times/today/?_t=${Date.now()}`, { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      if (data.hijri_date && dateElements.length) {
        dateElements.forEach((el) => { el.textContent = data.hijri_date; });
      }
      document.querySelectorAll("[data-prayer-fajr]").forEach((el) => el.textContent = data.fajr);
      document.querySelectorAll("[data-prayer-dhuhr]").forEach((el) => el.textContent = data.dhuhr);
      document.querySelectorAll("[data-prayer-asr]").forEach((el) => el.textContent = data.asr);
      document.querySelectorAll("[data-prayer-maghrib]").forEach((el) => el.textContent = data.maghrib);
      document.querySelectorAll("[data-prayer-isha]").forEach((el) => el.textContent = data.isha);
    }
  } catch (_) {}

  const causeSelect = document.getElementById("causeSelect");
  const thermometer = document.querySelector("[data-campaign-thermometer]");

  try {
    const response = await fetch(`${API_BASE}/api/donations/causes/?_t=${Date.now()}`, { cache: "no-store" });
    if (response.ok) {
      const causes = await response.json();

      if (causeSelect) {
        if (Array.isArray(causes) && causes.length) {
          causeSelect.innerHTML = `<option value="">General Mosque &amp; Institute Fund</option>` +
            causes.map((c) => `<option value="${c.id}">${escapeHtml(c.title)}</option>`).join("");
        } else {
          causeSelect.innerHTML = `<option value="">General Mosque &amp; Institute Fund</option>`;
        }
      }

      if (thermometer && Array.isArray(causes) && causes.length) {
        const featured = causes.find((c) => Number(c.target_amount) > 0) || causes[0];
        const percent = Number(featured.progress_percent ?? 0);
        const titleEl = thermometer.querySelector(".thermo-title");
        const amountsEl = thermometer.querySelector(".thermo-amounts");
        const fillEl = thermometer.querySelector(".thermo-fill");
        const pctEl = thermometer.querySelector(".thermo-pct");
        if (titleEl) titleEl.textContent = featured.title || "Campaign";
        if (amountsEl) amountsEl.textContent = `${formatNumber(featured.total_raised)} / ${formatNumber(featured.target_amount)} TZS raised`;
        if (fillEl) fillEl.style.width = `${Math.min(100, Math.max(0, percent))}%`;
        if (pctEl) pctEl.textContent = `${percent.toFixed(0)}%`;
      }
    }
  } catch (_) {}

  const amountInput = document.getElementById("customAmount");
  const amount = new URLSearchParams(window.location.search).get("amount");
  if (amountInput && amount && Number.isFinite(Number(amount))) amountInput.value = amount;
});

// Qibla Finder & Zakat Calculator
document.addEventListener("DOMContentLoaded", () => {
  const locateButton = document.getElementById("qiblaLocateBtn");
  if (!locateButton) return;
  const result = document.getElementById("qiblaResult");
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;
  const toRad = (deg) => deg * Math.PI / 180;
  const toDeg = (rad) => rad * 180 / Math.PI;
  const bearing = (lat, lng) => {
    const phi1 = toRad(lat), phi2 = toRad(KAABA_LAT), delta = toRad(KAABA_LNG - lng);
    return (toDeg(Math.atan2(Math.sin(delta) * Math.cos(phi2), Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(delta))) + 360) % 360;
  };
  const locate = () => {
    if (!navigator.geolocation) {
      result.innerHTML = "<p>Geolocation is not supported on this device.</p>";
      return;
    }
    locateButton.disabled = true;
    locateButton.textContent = "Locating...";
    navigator.geolocation.getCurrentPosition((pos) => {
      const dir = bearing(pos.coords.latitude, pos.coords.longitude);
      const needle = document.getElementById("qiblaNeedle");
      if (needle) needle.style.transform = `rotate(${dir}deg)`;
      result.innerHTML = `<div class="qibla-bearing">${dir.toFixed(1)}&deg;</div><p>from true North — point the top of your phone this many degrees clockwise from North.</p>`;
      locateButton.disabled = false;
      locateButton.textContent = "Use My Location";
    }, () => {
      result.innerHTML = "<p>Location access was denied. Please allow location access and try again.</p>";
      locateButton.disabled = false;
      locateButton.textContent = "Use My Location";
    }, { enableHighAccuracy: true, timeout: 10000 });
  };
  locateButton.addEventListener("click", locate);
});

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("zakatCalcBtn");
  if (!button) return;
  const NISAB_TZS = 2200000;
  button.addEventListener("click", () => {
    const value = (id) => Math.max(0, Number.parseFloat(document.getElementById(id)?.value) || 0);
    const total = Math.max(0, value("zCash") + value("zGold") + value("zSilver") + value("zBusiness") + value("zInvest") - value("zDebt"));
    const result = document.getElementById("zakatResult");
    result.style.display = "block";
    if (total < NISAB_TZS) {
      document.getElementById("zakatBelowNisab").style.display = "block";
      document.getElementById("zakatAboveNisab").style.display = "none";
    } else {
      const due = total * 0.025;
      document.getElementById("zakatBelowNisab").style.display = "none";
      document.getElementById("zakatAboveNisab").style.display = "block";
      document.getElementById("zakatTotal").textContent = `${formatNumber(total)} TZS`;
      document.getElementById("zakatDue").textContent = `${formatNumber(due)} TZS`;
      document.getElementById("zakatDonateLink").href = `donate.html?amount=${Math.round(due)}`;
    }
    result.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

// 6. Dynamic Courses & Course Registration
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("[data-courses-list]");
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE}/api/institute/courses/?_t=${Date.now()}`, { cache: "no-store" });
    if (response.ok) {
      const courses = await response.json();

      if (!Array.isArray(courses) || !courses.length) {
        container.innerHTML = `<div class="bg-white p-8 rounded-3xl border border-slate-200 text-center col-span-full"><p class="text-sm text-slate-500 font-medium">No active courses available at this time.</p></div>`;
        return;
      }

      container.innerHTML = courses.map((course) => {
        return `
          <div class="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:border-gold shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-200">${escapeHtml(course.category || "General")}</span>
                <span class="text-xs text-slate-500 font-semibold">${escapeHtml(course.age_group || "All Ages")}</span>
              </div>
              <h3 class="font-serif text-2xl font-bold text-slate-900">${escapeHtml(course.title)}</h3>
              <p class="text-xs text-slate-600 leading-relaxed">${escapeHtml(course.description || "")}</p>
              ${course.schedule ? `<p class="text-xs font-semibold text-emerald-800"><span class="text-slate-400">Schedule:</span> ${escapeHtml(course.schedule)}</p>` : ""}
              ${course.instructor ? `<p class="text-xs font-semibold text-slate-700"><span class="text-slate-400">Instructor:</span> ${escapeHtml(course.instructor)}</p>` : ""}
            </div>
            
            <button type="button" data-register-btn data-course-id="${course.id}" data-course-title="${escapeHtml(course.title)}" class="w-full py-3 rounded-xl bg-emerald-900 text-gold-light font-bold text-xs hover:bg-emerald-950 transition-colors shadow-md mt-4">Register for Course</button>
          </div>
        `;
      }).join("");

      bindCourseRegistrationButtons();
    }
  } catch (e) {
    console.warn("Could not load dynamic courses:", e);
  }
});

function bindCourseRegistrationButtons() {
  const modal = document.getElementById("courseRegistrationModal");
  const form = document.querySelector("[data-course-registration-form]");
  const courseTitleEl = document.getElementById("modalCourseTitle");
  const courseIdInput = document.getElementById("modalCourseId");
  const closeBtn = document.getElementById("closeCourseModal");

  document.querySelectorAll("[data-register-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const courseId = btn.dataset.courseId;
      const courseTitle = btn.dataset.courseTitle;
      if (courseTitleEl) courseTitleEl.textContent = courseTitle;
      if (courseIdInput) courseIdInput.value = courseId;
      if (modal) modal.classList.remove("hidden");
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector("button[type=submit]");
      const originalText = submitBtn ? submitBtn.textContent : "Submit";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Submitting..."; }

      const payload = {
        course: Number(form.querySelector("#modalCourseId")?.value),
        full_name: form.querySelector("[name=full_name]")?.value.trim(),
        phone: form.querySelector("[name=phone]")?.value.trim(),
        email: form.querySelector("[name=email]")?.value.trim(),
        notes: form.querySelector("[name=notes]")?.value.trim(),
      };

      try {
        const response = await fetch(`${API_BASE}/api/institute/register/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          showNotification({
            title: "Usajili Umekamilika! / Registered",
            message: "Ombi lako la usajili wa kozi limepokelewa kikamilifu. Ofisi ya masomo ya chuo itawasiliana nawe hivi punde.",
            type: "success",
            duration: 8000,
          });
          form.reset();
          if (modal) modal.classList.add("hidden");
        } else {
          const errData = await response.json().catch(() => ({}));
          if (response.status === 409 || errData.already_registered) {
            showNotification({
              title: "Tayari Umejisajili! / Already Registered",
              message: errData.message || errData.detail || "Taarifa zako (namba ya simu au barua pepe) tayari zipo kwenye mfumo kwa kozi hii. Ofisi ya masomo ya Al Firdaus itawasiliana nawe kuhusu hatua zinazofuata.",
              type: "warning",
              duration: 8000,
            });
            if (modal) modal.classList.add("hidden");
            form.reset();
          } else {
            showNotification({
              title: "Hitilafu ya Usajili / Registration Error",
              message: errData.detail || errData.message || "Haikuweza kukamilisha usajili. Tafadhali kagua taarifa ulizoingiza na ujaribu tena.",
              type: "error",
              duration: 6000,
            });
          }
        }
      } catch (err) {
        console.error("Course registration error:", err);
        showNotification({
          title: "Hitilafu ya Mtandao",
          message: "Kuna changamoto ya mtandao. Tafadhali jaribu tena baada ya muda mfupi.",
          type: "error",
        });
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
      }
    });
  }
}

// 7. Dynamic Teachers & Imams Grid
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("[data-teachers-list]");
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE}/api/mosque-info/teachers/?_t=${Date.now()}`, { cache: "no-store" });
    if (response.ok) {
      const teachers = await response.json();
      if (!Array.isArray(teachers) || !teachers.length) return;

      container.innerHTML = teachers.map((t) => {
        const avatar = t.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=142E22&color=C9A227&size=256`;
        return `
          <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-xl transition-all text-center">
            <img src="${escapeHtml(avatar)}" alt="${escapeHtml(t.name)}" class="w-24 h-24 rounded-full mx-auto object-cover border-2 border-gold/40 shadow-md">
            <div>
              <h4 class="font-serif text-xl font-bold text-slate-900">${escapeHtml(t.name)}</h4>
              <p class="text-xs font-semibold text-gold-dark mt-0.5">${escapeHtml(t.title)}</p>
              ${t.specialty ? `<span class="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-100">${escapeHtml(t.specialty)}</span>` : ""}
            </div>
            ${t.bio ? `<p class="text-xs text-slate-600 leading-relaxed">${escapeHtml(t.bio)}</p>` : ""}
          </div>
        `;
      }).join("");
    }
  } catch (e) {
    console.warn("Could not load dynamic teachers:", e);
  }
});

// 8. Dynamic Facilities Grid
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("[data-facilities-list]");
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE}/api/mosque-info/facilities/?_t=${Date.now()}`, { cache: "no-store" });
    if (response.ok) {
      const facilities = await response.json();
      if (!Array.isArray(facilities) || !facilities.length) return;

      container.innerHTML = facilities.map((f) => {
        return `
          <div class="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:border-gold shadow-sm hover:shadow-xl transition-all space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-emerald-900 text-gold-light flex items-center justify-center font-bold text-xl">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <h3 class="font-serif text-2xl font-bold text-slate-900">${escapeHtml(f.title)}</h3>
            <p class="text-xs text-slate-600 leading-relaxed">${escapeHtml(f.description)}</p>
            ${f.capacity ? `<p class="text-xs font-bold text-emerald-800"><span class="text-slate-400">Capacity:</span> ${escapeHtml(f.capacity)}</p>` : ""}
          </div>
        `;
      }).join("");
    }
  } catch (e) {
    console.warn("Could not load dynamic facilities:", e);
  }
});

// 9. Dynamic Site Stats
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("[data-stats-list]");
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE}/api/mosque-info/stats/?_t=${Date.now()}`, { cache: "no-store" });
    if (response.ok) {
      const stats = await response.json();
      if (!Array.isArray(stats) || !stats.length) return;

      container.innerHTML = stats.map((s) => {
        return `
          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-2">
            <strong class="font-serif text-4xl font-bold text-emerald-900 block">${escapeHtml(s.value)}</strong>
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">${escapeHtml(s.label)}</span>
          </div>
        `;
      }).join("");
    }
  } catch (e) {
    console.warn("Could not load dynamic stats:", e);
  }
});

// 10. Dynamic Contact Form Submission & Settings
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector("button[type=submit]");
      const originalText = submitBtn ? submitBtn.textContent : "Send Message";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending Message..."; }

      const payload = {
        name: form.querySelector("[name=name]")?.value.trim(),
        email: form.querySelector("[name=email]")?.value.trim(),
        phone: form.querySelector("[name=phone]")?.value.trim() || "",
        subject: form.querySelector("[name=subject]")?.value.trim() || "General Enquiry",
        message: form.querySelector("[name=message]")?.value.trim(),
      };

      try {
        const response = await fetch(`${API_BASE}/api/mosque-info/contact/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          showNotification({
            title: "Ujumbe Umetumwa! / Message Sent",
            message: "Jazakallahu Khair! Ujumbe wako umepokelewa na uongozi wa Al Firdaus. Tutawasiliana nawe hivi punde kupitia simu au barua pepe uliyoweka.",
            type: "success",
            duration: 8000,
          });
          form.reset();
        } else {
          const errData = await response.json().catch(() => ({}));
          showNotification({
            title: "Hitilafu ya Kutuma / Sending Failed",
            message: "Haikuweza kutuma ujumbe wako. Tafadhali kagua taarifa ulizoingiza na ujaribu tena.",
            type: "error",
            duration: 6000,
          });
        }
      } catch (err) {
        console.error("Contact form submission error:", err);
        showNotification({
          title: "Hitilafu ya Mtandao / Network Error",
          message: "Kuna changamoto ya kuunganishwa na seva. Tafadhali hakikisha seva ya mfumo inaendelea kufanya kazi.",
          type: "error",
          duration: 6000,
        });
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
      }
    });
  }

  // Load Site Settings
  fetch(`${API_BASE}/api/mosque-info/settings/?_t=${Date.now()}`, { cache: "no-store" })
    .then((res) => res.json())
    .then((settings) => {
      if (!settings) return;
      document.querySelectorAll("[data-site-phone]").forEach((el) => { el.textContent = settings.phone; });
      document.querySelectorAll("[data-site-email]").forEach((el) => { el.textContent = settings.email; });
      document.querySelectorAll("[data-site-address]").forEach((el) => { el.textContent = settings.address; });
      document.querySelectorAll("[data-site-about]").forEach((el) => { el.textContent = settings.about_text; });
    })
    .catch(() => {});
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(() => {}));
}
