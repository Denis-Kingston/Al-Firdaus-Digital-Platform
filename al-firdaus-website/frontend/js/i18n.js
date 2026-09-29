// Al Firdaus — lightweight EN/SW language toggle.
// Translates elements marked with data-i18n or data-i18n-html.

const AL_FIRDAUS_I18N = {
  en: {
    nav_index: "Home", nav_about: "About", nav_institute: "Institute", nav_mosque: "Mosque",
    nav_events: "Events", nav_media: "Media", nav_donate: "Donate", nav_contact: "Contact",
    nav_tools: "Tools", nav_qibla: "Qibla Finder", nav_zakat: "Zakat Calculator",
    whatsapp_us: "WhatsApp Us", donate_now: "Donate Now",
    hero_eyebrow: "Knowledge · Faith · Community",
    hero_title: "Welcome to <em>Al Firdaus</em>",
    hero_body: "A place of worship, learning and service. Growing together in the light of the Qur'an and Sunnah — serving Dar es Salaam for over a decade.",
    about_us: "About Us", our_programs: "Our Programs",
    info_prayer_title: "Prayer Times", info_prayer_sub: "Accurate times for your location",
    info_quran_title: "Quran & Classes", info_quran_sub: "Islamic courses, all ages",
    info_events_title: "Events", info_events_sub: "Stay updated with our calendar",
    info_donate_title: "Donate", info_donate_sub: "Support our masjid & projects",
    info_announce_title: "Announcements", info_announce_sub: "Latest news & updates",
    info_contact_title: "Contact Us", info_contact_sub: "Get in touch easily",
  },
  sw: {
    nav_index: "Nyumbani", nav_about: "Kuhusu Sisi", nav_institute: "Taasisi", nav_mosque: "Msikiti",
    nav_events: "Matukio", nav_media: "Picha na Habari", nav_donate: "Changia", nav_contact: "Wasiliana",
    nav_tools: "Zana", nav_qibla: "Tafuta Qibla", nav_zakat: "Kikokotoo cha Zaka",
    whatsapp_us: "Tupigie WhatsApp", donate_now: "Changia Sasa",
    hero_eyebrow: "Elimu · Imani · Jamii",
    hero_title: "Karibu <em>Al Firdaus</em>",
    hero_body: "Mahali pa ibada, elimu na huduma. Tunakua pamoja katika nuru ya Qur'an na Sunnah — tukihudumia Dar es Salaam kwa zaidi ya muongo mmoja.",
    about_us: "Kuhusu Sisi", our_programs: "Mafunzo Yetu",
    info_prayer_title: "Nyakati za Sala", info_prayer_sub: "Muda sahihi kwa eneo lako",
    info_quran_title: "Qur'an na Madarasa", info_quran_sub: "Mafunzo ya Kiislamu, umri wote",
    info_events_title: "Matukio", info_events_sub: "Fahamu ratiba yetu",
    info_donate_title: "Changia", info_donate_sub: "Saidia msikiti na miradi yetu",
    info_announce_title: "Matangazo", info_announce_sub: "Habari na taarifa mpya",
    info_contact_title: "Wasiliana Nasi", info_contact_sub: "Ni rahisi kutufikia",
  },
};

function applyLanguage(lang) {
  const selected = AL_FIRDAUS_I18N[lang] ? lang : "en";
  const dict = AL_FIRDAUS_I18N[selected];
  document.documentElement.lang = selected;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const value = dict[el.getAttribute("data-i18n")];
    if (value !== undefined) el.textContent = value;
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const value = dict[el.getAttribute("data-i18n-html")];
    if (value !== undefined) el.innerHTML = value;
  });
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === selected);
  });

  try { localStorage.setItem("af_lang", selected); } catch (_) { /* private browsing */ }
}

document.addEventListener("DOMContentLoaded", () => {
  let saved = "en";
  try { saved = localStorage.getItem("af_lang") || "en"; } catch (_) { /* private browsing */ }
  applyLanguage(saved);
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
  });
});
