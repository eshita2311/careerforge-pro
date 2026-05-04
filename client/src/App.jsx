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

  // 🔥 Stripe (optional)
  const handleSubscribe = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/checkout");
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Stripe checkout unavailable. Use Demo Mode.");
    }
  };

  // 🔥 Demo mode (MAIN FLOW)
  const handleDemoUpgrade = () => {
    localStorage.setItem("isPro", "true");
    setIsPro(true);
    alert("🎉 Pro unlocked (Demo Mode)");
  };

  // 🔥 Reset (for testing)
  const handleReset = () => {
    localStorage.removeItem("isPro");
    setIsPro(false);
    alert("Reset to Free Mode");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">

      {/* 🔥 NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">

        <h1 className="text-2xl font-bold">🚀 CareerForge Pro</h1>

        <div className="flex gap-3 items-center">

          {/* PRO BADGE */}
          {isPro && (
            <span className="bg-green-600 px-4 py-1 rounded-full text-sm">
              ✅ Pro
            </span>
          )}

          {/* DEMO PRIMARY BUTTON */}
          {!isPro && (
            <button
              onClick={handleDemoUpgrade}
              className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-lg hover:scale-105 transition"
            >
              🚀 Unlock Pro
            </button>
          )}

          {/* OPTIONAL STRIPE BUTTON */}
          <button
            onClick={handleSubscribe}
            className="text-xs text-gray-400 underline"
          >
            Try Stripe
          </button>

          {/* RESET BUTTON */}
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 underline"
          >
            Reset
          </button>

        </div>
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Resume Builder */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10 hover:shadow-xl hover:scale-[1.02] transition duration-300">
          <h2 className="text-xl font-semibold mb-4">📄 Resume Builder</h2>
          <ResumeForm data={data} setData={setData} />
        </div>

        {/* Preview */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10 hover:shadow-xl hover:scale-[1.02] transition duration-300">
          <h2 className="text-xl font-semibold mb-4">👀 Live Preview</h2>
          <ResumePreview data={data} isPro={isPro} />
        </div>

        {/* ATS + AI */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10 hover:shadow-xl hover:scale-[1.02] transition duration-300">
          <h2 className="text-xl font-semibold mb-4">🤖 ATS + AI Tools</h2>
          <ATSPanel
            data={data}
            jobDesc={jobDesc}
            setJobDesc={setJobDesc}
            isPro={isPro}
          />
        </div>

      </div>

      {/* 🔥 BOTTOM SECTION */}
      {!isPro && (
        <div className="text-center py-10 space-y-4">

          {/* MAIN DEMO BUTTON */}
          <button
            onClick={handleDemoUpgrade}
            className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
          >
            🚀 Unlock Pro (Demo)
          </button>

          {/* OPTIONAL STRIPE */}
          <button
            onClick={handleSubscribe}
            className="text-sm text-gray-400 underline"
          >
            Try Real Payment (Stripe)
          </button>

        </div>
      )}

    </div>
  );
}

export default App;