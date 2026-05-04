import React, { useState, useEffect } from "react";
import axios from "axios";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import ATSPanel from "./components/ATSPanel";

function App() {
  const [data, setData] = useState({
    name: "",
    email: "",
    summary: "",
    skills: "",
  });

  const [jobDesc, setJobDesc] = useState("");
  const [isPro, setIsPro] = useState(false);

  // 🔥 Load PRO status
  useEffect(() => {
    const saved = localStorage.getItem("isPro");
    if (saved === "true") {
      setIsPro(true);
    }
  }, []);

  // 🔥 STRIPE SUBSCRIBE
  const handleSubscribe = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/checkout");
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  // 🔥 DEMO MODE (backup for testing)
  const handleDemoUpgrade = () => {
    localStorage.setItem("isPro", "true");
    setIsPro(true);
    alert("🎉 You are now Pro (Demo Mode)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">

      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-8">
        🚀 CareerForge Pro
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {/* FORM */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Resume Builder</h2>
          <ResumeForm data={data} setData={setData} />
        </div>

        {/* PREVIEW */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
          <ResumePreview data={data} isPro={isPro} />
        </div>

        {/* ATS */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">ATS Analyzer</h2>
          <ATSPanel
            data={data}
            jobDesc={jobDesc}
            setJobDesc={setJobDesc}
            isPro={isPro}
          />
        </div>

      </div>

      {/* 🔥 UPGRADE SECTION */}
      {!isPro && (
        <div className="text-center mt-10 space-y-3">

          {/* REAL PAYMENT */}
          <button
            onClick={handleSubscribe}
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg font-semibold w-64"
          >
            💳 Upgrade to Pro ($5/month)
          </button>

          {/* DEMO BUTTON (optional but useful) */}
          <div>
            <button
              onClick={handleDemoUpgrade}
              className="text-sm text-gray-400 underline"
            >
              Use Demo Mode (Skip Payment)
            </button>
          </div>

        </div>
      )}

      {/* PRO BADGE */}
      {isPro && (
        <div className="text-center mt-8">
          <span className="bg-green-600 px-4 py-2 rounded-full text-sm">
            ✅ Pro User
          </span>
        </div>
      )}

    </div>
  );
}

export default App;