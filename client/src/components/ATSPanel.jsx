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
    <div className="space-y-4">

      {/* Job Description */}
      <textarea
        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-gray-300"
        placeholder="Paste Job Description..."
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />

      {/* Analyze Button */}
      <button
        onClick={analyze}
        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg w-full"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {/* 🔒 AI BUTTON */}
      {isPro ? (
        <button
          onClick={handleAIRewrite}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg w-full"
        >
          {aiLoading ? "Improving..." : "✨ Improve with AI"}
        </button>
      ) : (
        <button
          onClick={() => alert("Upgrade to Pro for AI features")}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg w-full"
        >
          🔒 AI Rewrite (Pro)
        </button>
      )}

      {/* Score */}
      {score !== null && (
        <div>
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

      {/* Matched */}
      {matched.length > 0 && (
        <div>
          <h4 className="text-green-400 font-semibold mt-3">✔ Matched</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {matched.map((k, i) => (
              <span key={i} className="bg-green-600/20 px-2 py-1 rounded">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing */}
      {missing.length > 0 && (
        <div>
          <h4 className="text-red-400 font-semibold mt-3">✘ Missing</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {missing.map((k, i) => (
              <span key={i} className="bg-red-600/20 px-2 py-1 rounded">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      {keywords.length > 0 && (
        <div>
          <h4 className="text-blue-400 font-semibold mt-3">🔍 Keywords</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {keywords.map((k, i) => (
              <span key={i} className="bg-blue-600/20 px-2 py-1 rounded">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI RESULT */}
      {aiResult.length > 0 && (
        <div>
          <h4 className="text-purple-400 font-semibold mt-3">
            ✨ Improved Resume
          </h4>
          <ul className="mt-2 space-y-1">
            {aiResult.map((line, i) => (
              <li key={i} className="text-gray-300">
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}

export default ATSPanel;