import React, { useState } from "react";
import axios from "axios";

function ATSPanel({ data, jobDesc, setJobDesc, isPro }) {
  const [score, setScore] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [matched, setMatched] = useState([]);
  const [missing, setMissing] = useState([]);
  const [aiResult, setAiResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // 🔹 ATS ANALYZE
  const analyze = async () => {
    if (!jobDesc || !data.skills) {
      alert("Please enter job description and skills");
      return;
    }

    try {
      setLoading(true);

      const skillsArray = data.skills
        .toLowerCase()
        .split(/[, ]+/)
        .map((s) => s.trim())
        .filter((s) => s);

      const res = await axios.post("http://localhost:5000/api/analyze", {
        jobDesc,
        skills: skillsArray,
      });

      setScore(res.data.score);
      setKeywords(res.data.keywords);
      setMatched(res.data.matched || []);
      setMissing(res.data.missing || []);
    } catch (err) {
      console.error(err);
      alert("Backend error");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 AI REWRITE
  const handleAIRewrite = async () => {
    if (!isPro) {
      alert("Upgrade to Pro for AI features");
      return;
    }

    if (!data.summary) {
      alert("Add some summary/bullets first");
      return;
    }

    try {
      setAiLoading(true);

      const bullets = data.summary.split(".").filter(Boolean);

      const res = await axios.post("http://localhost:5000/api/rewrite", {
        bullets,
        jobDesc,
      });

      setAiResult(res.data.improved || []);
    } catch (err) {
      console.error(err);
      alert("AI failed");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-5">

      {/* 🔥 Job Description */}
      <textarea
        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Paste Job Description..."
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />

      {/* 🔥 Buttons */}
      <div className="flex flex-col gap-3">

        <button
          onClick={analyze}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg w-full hover:scale-105 transition"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        <button
          onClick={handleAIRewrite}
          className={`px-4 py-2 rounded-lg w-full transition font-semibold ${
            isPro
              ? "bg-purple-500 text-white hover:scale-105"
              : "bg-gray-600 text-white cursor-not-allowed"
          }`}
        >
          {aiLoading
            ? "Improving..."
            : isPro
            ? "✨ Improve with AI"
            : "🔒 AI Rewrite (Pro)"}
        </button>

      </div>

      {/* 🔥 SCORE CARD */}
      {score !== null && (
        <div className="bg-gray-800 p-4 rounded-xl shadow-md">
          <p className="font-semibold text-lg">
            ATS Score: <span className="text-green-400">{score}%</span>
          </p>

          <div className="w-full bg-gray-700 h-3 rounded mt-2">
            <div
              className="bg-green-500 h-3 rounded transition-all duration-500"
              style={{ width: `${score}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 🔥 MATCHED */}
      {matched.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-xl">
          <h4 className="text-green-400 font-semibold">✔ Matched Skills</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {matched.map((k, i) => (
              <span
                key={i}
                className="bg-green-600/20 text-green-300 px-2 py-1 rounded text-sm"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 MISSING */}
      {missing.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-xl">
          <h4 className="text-red-400 font-semibold">✘ Missing Skills</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {missing.map((k, i) => (
              <span
                key={i}
                className="bg-red-600/20 text-red-300 px-2 py-1 rounded text-sm"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 KEYWORDS */}
      {keywords.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-xl">
          <h4 className="text-blue-400 font-semibold">🔍 Extracted Keywords</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {keywords.map((k, i) => (
              <span
                key={i}
                className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-sm"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 AI RESULT */}
      {aiResult.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-xl">
          <h4 className="text-purple-400 font-semibold">
            ✨ Improved Resume Points
          </h4>
          <ul className="mt-3 space-y-2">
            {aiResult.map((line, i) => (
              <li
                key={i}
                className="bg-gray-700 p-2 rounded text-gray-200 text-sm"
              >
                • {line}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}

export default ATSPanel;