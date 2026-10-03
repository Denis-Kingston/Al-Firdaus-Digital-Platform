import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PrayerTimes from "./components/PrayerTimes";
import Institute from "./components/Institute";
import Donations from "./components/Donations";
import Events from "./components/Events";
import Khutbahs from "./components/Khutbahs";
import ZakatCalculator from "./components/ZakatCalculator";
import QiblaFinder from "./components/QiblaFinder";
import MosqueInfo from "./components/MosqueInfo";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import NotificationModal from "./components/NotificationModal";
import UssdPushModal from "./components/UssdPushModal";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [lang, setLang] = useState("sw"); // Default to Swahili as requested by user
  const [notification, setNotification] = useState(null);
  const [ussdDonationData, setUssdDonationData] = useState(null);

  // Next prayer placeholder for hero
  const nextPrayerInfo = {
    name: "Al-Asr",
    time: "03:42 PM",
  };

  const handleOpenDonate = () => {
    setActiveTab("home");
    setTimeout(() => {
      const el = document.getElementById("donate-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handlePayZakat = (amount) => {
    setUssdDonationData({
      amount: amount,
      phone: "0789631864",
      reference: "ZAK-" + Math.floor(100000 + Math.random() * 900000),
    });
  };

  const handleSuccessfulDonation = (ref) => {
    setNotification({
      title: lang === "sw" ? "Mchango Umepokelewa!" : "Donation Received!",
      message: lang === "sw"
        ? `Jazakallahu Khair! Muamala wako (Ref: ${ref}) umethibitishwa kupitia Selcom USSD Push. Mwenyezi Mungu akuzidishie baraka.`
        : `Jazakallahu Khair! Your contribution (Ref: ${ref}) has been verified via Selcom USSD Push.`,
      type: "success",
    });
  };

  return (
    <div className="app-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        onOpenDonate={handleOpenDonate}
      />

      {/* Main Content Sections based on Active Tab */}
      <main style={{ flex: 1 }}>
        {activeTab === "home" && (
          <>
            <Hero
              lang={lang}
              setActiveTab={setActiveTab}
              onOpenDonate={handleOpenDonate}
              nextPrayerInfo={nextPrayerInfo}
            />
            <PrayerTimes lang={lang} />
            <Institute lang={lang} onShowNotification={setNotification} />
            <Donations
              lang={lang}
              onTriggerUssdModal={setUssdDonationData}
              onShowNotification={setNotification}
            />
            <Events lang={lang} onShowNotification={setNotification} />
            <MosqueInfo lang={lang} />
            <Contact lang={lang} onShowNotification={setNotification} />
          </>
        )}

        {activeTab === "institute" && (
          <div style={{ paddingTop: "1rem" }}>
            <Institute lang={lang} onShowNotification={setNotification} />
          </div>
        )}

        {activeTab === "prayers" && (
          <div style={{ paddingTop: "1rem" }}>
            <PrayerTimes lang={lang} />
            <MosqueInfo lang={lang} />
          </div>
        )}

        {activeTab === "events" && (
          <div style={{ paddingTop: "1rem" }}>
            <Events lang={lang} onShowNotification={setNotification} />
          </div>
        )}

        {activeTab === "media" && (
          <div style={{ paddingTop: "1rem" }}>
            <Khutbahs lang={lang} />
          </div>
        )}

        {activeTab === "zakat" && (
          <div style={{ paddingTop: "1rem" }}>
            <ZakatCalculator lang={lang} onPayZakat={handlePayZakat} />
          </div>
        )}

        {activeTab === "qibla" && (
          <div style={{ paddingTop: "1rem" }}>
            <QiblaFinder lang={lang} />
          </div>
        )}

        {activeTab === "mosque_info" && (
          <div style={{ paddingTop: "1rem" }}>
            <MosqueInfo lang={lang} />
          </div>
        )}

        {activeTab === "contact" && (
          <div style={{ paddingTop: "1rem" }}>
            <Contact lang={lang} onShowNotification={setNotification} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        setActiveTab={setActiveTab}
        onOpenDonate={handleOpenDonate}
      />

      {/* Reusable Notification Dialog Modal */}
      <NotificationModal
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {/* Interactive USSD Push Simulation Modal */}
      {ussdDonationData && (
        <UssdPushModal
          donationData={ussdDonationData}
          onClose={() => setUssdDonationData(null)}
          onSuccessfulDonation={handleSuccessfulDonation}
        />
      )}
    </div>
  );
}
