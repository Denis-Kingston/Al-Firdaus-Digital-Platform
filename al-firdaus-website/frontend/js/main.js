// Al Firdaus Institute & Mosque — frontend interactions.
// Set API_BASE to the deployed backend URL before production deployment.
const API_BASE = "http://127.0.0.1:8000";

const formatNumber = (value) => Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  }[char]));
}

// Mobile navigation, footer year, donation forms and prayer countdown.
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    links.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => links.classList.remove("open")));
  }

  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

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

  document.querySelectorAll("form[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const note = form.querySelector(".form-success");
      if (note) note.style.display = "block";
      form.reset();
      document.querySelectorAll(".amount-btn.active").forEach((button) => button.classList.remove("active"));
    });
  });

  const countdown = document.querySelector("[data-countdown]");
  if (countdown) {
    const prayers = [
      { name: "Fajr", h: 4, m: 45 }, { name: "Dhuhr", h: 12, m: 30 },
      { name: "Asr", h: 16, m: 15 }, { name: "Maghrib", h: 18, m: 45 }, { name: "Isha", h: 20, m: 15 },
    ];
    const update = () => {
      const now = new Date();
      let next = prayers.map((prayer) => {
        const time = new Date(now);
        time.setHours(prayer.h, prayer.m, 0, 0);
        return { ...prayer, time };
      }).find((prayer) => prayer.time > now);
      if (!next) {
        next = { ...prayers[0], time: new Date(now) };
        next.time.setDate(next.time.getDate() + 1);
        next.time.setHours(next.h, next.m, 0, 0);
      }
      const diff = Math.max(0, next.time - now);
      const hh = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const mm = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const ss = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      const name = countdown.querySelector(".cd-name");
      const time = countdown.querySelector(".cd-time");
      const remaining = countdown.querySelector(".cd-remaining");
      if (name) name.textContent = next.name;
      if (time) time.textContent = `${String(next.h % 12 || 12).padStart(2, "0")}:${String(next.m).padStart(2, "0")} ${next.h >= 12 ? "PM" : "AM"}`;
      if (remaining) remaining.textContent = `${hh}:${mm}:${ss} remaining`;
    };
    update();
    setInterval(update, 1000);
  }
});

// Qibla Finder.
document.addEventListener("DOMContentLoaded", () => {
  const locateButton = document.getElementById("qiblaLocateBtn");
  if (!locateButton) return;
  const result = document.getElementById("qiblaResult");
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;
  const toRad = (degrees) => degrees * Math.PI / 180;
  const toDeg = (radians) => radians * 180 / Math.PI;
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
    navigator.geolocation.getCurrentPosition((position) => {
      const direction = bearing(position.coords.latitude, position.coords.longitude);
      const needle = document.getElementById("qiblaNeedle");
      if (needle) needle.style.transform = `rotate(${direction}deg)`;
      result.innerHTML = `<div class="qibla-bearing">${direction.toFixed(1)}&deg;</div><p>from true North — point the top of your phone this many degrees clockwise from North.</p><button id="qiblaLocateBtn2" class="btn btn-outline-dark btn-sm">Recalculate</button>`;
      document.getElementById("qiblaLocateBtn2")?.addEventListener("click", locate);
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

// Zakat calculator.
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

// Shared API-powered enhancements with offline fallbacks.
document.addEventListener("DOMContentLoaded", async () => {
  const dateElements = document.querySelectorAll("[data-hijri-date]");
  if (dateElements.length) {
    const today = new Date();
    dateElements.forEach((element) => { element.textContent = today.toLocaleDateString("en-u-ca-islamic", { day: "numeric", month: "long", year: "numeric" }); });
    try {
      const response = await fetch(`${API_BASE}/api/prayer-times/today/`);
      if (response.ok) {
        const data = await response.json();
        if (data.hijri_date) dateElements.forEach((element) => { element.textContent = data.hijri_date; });
      }
    } catch (_) { /* offline fallback remains visible */ }
  }

  const thermometer = document.querySelector("[data-campaign-thermometer]");
  if (thermometer) {
    try {
      const response = await fetch(`${API_BASE}/api/donations/causes/`);
      if (response.ok) {
        const causes = await response.json();
        const featured = causes.find((cause) => Number(cause.target_amount) > 0) || causes[0];
        if (featured) {
          const percent = Number(featured.progress_percent ?? 0);
          thermometer.querySelector(".thermo-title").textContent = featured.title || "Campaign";
          thermometer.querySelector(".thermo-amounts").textContent = `${formatNumber(featured.total_raised)} / ${formatNumber(featured.target_amount)} TZS raised`;
          thermometer.querySelector(".thermo-fill").style.width = `${Math.min(100, Math.max(0, percent))}%`;
          thermometer.querySelector(".thermo-pct").textContent = `${percent.toFixed(0)}%`;
        }
      }
    } catch (_) { /* demo values remain visible */ }
  }

  const amountInput = document.getElementById("customAmount");
  const amount = new URLSearchParams(window.location.search).get("amount");
  if (amountInput && amount && Number.isFinite(Number(amount))) amountInput.value = amount;
});

// Event RSVP.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-rsvp-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const widget = form.closest(".rsvp-widget");
      const count = widget?.querySelector(".rsvp-count");
      const success = widget?.querySelector(".rsvp-success");
      const payload = { name: form.querySelector("[name=rsvp_name]")?.value.trim(), phone: form.querySelector("[name=rsvp_phone]")?.value.trim() };
      try {
        const response = await fetch(`${API_BASE}/api/events/${encodeURIComponent(form.dataset.eventId)}/rsvp/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (response.ok) {
          const data = await response.json();
          if (count && data.rsvp_count !== undefined) count.textContent = `${data.rsvp_count} attending`;
        } else if (count) count.textContent = "RSVP recorded (demo)";
      } catch (_) { if (count) count.textContent = "RSVP recorded (demo)"; }
      if (success) success.style.display = "block";
      form.reset();
    });
  });
});

// Khutbah archive. Escape API-provided text before inserting it into HTML.
document.addEventListener("DOMContentLoaded", async () => {
  const list = document.querySelector("[data-khutbah-list]");
  if (!list) return;
  try {
    const response = await fetch(`${API_BASE}/api/khutbahs/`);
    if (!response.ok) return;
    const khutbahs = await response.json();
    if (!Array.isArray(khutbahs) || !khutbahs.length) return;
    list.innerHTML = khutbahs.map((khutbah) => {
      const audio = khutbah.audio ? `<audio controls src="${escapeHtml(khutbah.audio)}"></audio>` : '<p class="form-note">Audio not yet uploaded.</p>';
      return `<div class="card khutbah-card"><div class="khutbah-meta"><strong>${escapeHtml(khutbah.title)}</strong><span>${escapeHtml(khutbah.speaker || "")} &middot; ${escapeHtml(khutbah.date || "")}</span></div>${audio}</div>`;
    }).join("");
  } catch (_) { /* demo entries remain visible */ }
});

// Recurring donation toggle.
document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("recurringToggle");
  const interval = document.getElementById("recurringIntervalWrap");
  if (checkbox && interval) checkbox.addEventListener("change", () => { interval.style.display = checkbox.checked ? "block" : "none"; });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(() => {}));
}
