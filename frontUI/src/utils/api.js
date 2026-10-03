// Centralized API Client & Translations for Al Firdaus Digital Platform

export const API_BASE = ""; // Vite proxy forwards /api to backend

export const translations = {
  en: {
    site_title: "Al Firdaus Institute & Mosque",
    nav_home: "Home",
    nav_institute: "Institute",
    nav_prayers: "Prayers",
    nav_events: "Events",
    nav_media: "Khutbahs",
    nav_tools: "Services",
    nav_zakat: "Zakat Calculator",
    nav_qibla: "Qibla Compass",
    nav_mosque_info: "About Mosque",
    nav_contact: "Contact",
    btn_donate: "Donate Now",
    hero_badge: "Centre of Knowledge & Worship",
    hero_title_1: "In Pursuit of",
    hero_title_2: "Faith & Excellence",
    hero_subtitle: "Serving the Muslim community of Dar es Salaam with authentic Quranic education, congregational prayers, and community outreach.",
    btn_explore_courses: "Explore Courses",
    btn_view_prayers: "Prayer Schedule",
    prayers_title: "Today's Congregational Prayers",
    prayers_subtitle: "Live synchronized prayer timings for Al Firdaus Mosque, Kinondoni",
    next_prayer: "Next Prayer",
    courses_title: "Islamic Institute Programs",
    courses_subtitle: "Structured semester-based learning under qualified traditional scholars",
    filter_all: "All Programs",
    btn_apply_now: "Apply Now",
    donations_title: "Support Our Mosque & Causes",
    donations_subtitle: "Your generous Sadaqah and Zakat sustain our facilities, students, and community welfare",
    events_title: "Upcoming Community Events",
    events_subtitle: "Halaqahs, youth conferences, and Islamic seminars at Al Firdaus hall",
    btn_rsvp: "RSVP Now",
    zakat_title: "Interactive Zakat Calculator",
    zakat_subtitle: "Calculate your annual Zakat accurately in Tanzanian Shillings (TZS)",
    contact_title: "Send Us a Message",
    contact_subtitle: "Questions about enrollment, Nikah services, or visits — we are here to assist you.",
    btn_send_message: "Send Message",
  },
  sw: {
    site_title: "Taasisi na Msikiti wa Al Firdaus",
    nav_home: "Mwanzo",
    nav_institute: "Masomo",
    nav_prayers: "Sala",
    nav_events: "Matukio",
    nav_media: "Khutbah",
    nav_tools: "Huduma",
    nav_zakat: "Kikokotoo cha Zaka",
    nav_qibla: "Mwelekeo wa Qibla",
    nav_mosque_info: "Kuhusu Msikiti",
    nav_contact: "Mawasiliano",
    btn_donate: "Toa Sadaka",
    hero_badge: "Kituo cha Elimu na Ibada",
    hero_title_1: "Katika Njia ya",
    hero_title_2: "Elimu na Ucha Mungu",
    hero_subtitle: "Tunahudumia jamii ya Waislamu wa Dar es Salaam kupitia mafunzo sahihi ya Qur'an na Sunnah, ibada za jamaa, na huduma za kijamii.",
    btn_explore_courses: "Angalia Kozi za Chuo",
    btn_view_prayers: "Nyakati za Sala",
    prayers_title: "Nyakati za Sala za Jamaa Leo",
    prayers_subtitle: "Ratiba rasmi ya sala tano za kila siku Msikiti wa Al Firdaus, Kinondoni",
    next_prayer: "Sala Inayofuata",
    courses_title: "Masomo na Kozi za Chuo",
    courses_subtitle: "Elimu ya mfumo rasmi inayoongozwa na masheikh na walimu waliobobea",
    filter_all: "Kozi Zote",
    btn_apply_now: "Jiunge Sasa",
    donations_title: "Changia Shughuli za Msikiti",
    donations_subtitle: "Sadaka na Zaka yako huwezesha usomeshaji wa wanafunzi na maendeleo ya msikiti",
    events_title: "Matukio na Mihadhara Ijayo",
    events_subtitle: "Halaqah za vijana, darsa za wanawake, na makongamano ya Kiislamu",
    btn_rsvp: "Weka Nafasi (RSVP)",
    zakat_title: "Kikokotoo cha Zaka",
    zakat_subtitle: "Kokotoa kiwango chako halisi cha Zaka kwa Shilingi za Kitanzania (TZS)",
    contact_title: "Tutumie Ujumbe",
    contact_subtitle: "Maswali kuhusu kozi, ndoa, au huduma za msikiti — tuko tayari kukuhudumia.",
    btn_send_message: "Tuma Ujumbe",
  },
};

// API Fetch Helpers with graceful fallbacks
export async function apiGet(endpoint, fallback = null) {
  try {
    const res = await fetch(`/api/${endpoint}`, { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`API GET /api/${endpoint} failed, using fallback:`, err);
  }
  return fallback;
}

export async function apiPost(endpoint, payload) {
  const res = await fetch(`/api/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}
