import React, { useState } from "react";
import axios from "axios";

function ResumePreview({ data, isPro }) {
  const [loading, setLoading] = useState(false);

  const downloadPDF = async () => {
    if (!isPro) {
      alert("Upgrade to Pro to download PDF");
      return;
    }

    try {
      setLoading(true);

      const element = document.getElementById("resume");

      if (!element) {
        alert("Resume not found");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/pdf",
        {
          html: element.outerHTML,
        },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();

    } catch (err) {
      console.error(err);
      alert("PDF generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* 🔥 Resume Container */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex justify-center">

        {/* 🔥 Resume Card */}
        <div
          id="resume"
          className="w-full max-w-md text-black space-y-4"
        >

          {/* Name */}
          <h2 className="text-2xl font-bold text-center">
            {data.name || "Your Name"}
          </h2>

          {/* Email */}
          <p className="text-gray-600 text-center">
            {data.email || "your@email.com"}
          </p>

          {/* Divider */}
          <hr />

          {/* Summary */}
          <div>
            <h3 className="font-semibold mb-1">Summary</h3>
            <p className="text-gray-700 text-sm">
              {data.summary || "Write a professional summary..."}
            </p>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold mb-2">Skills</h3>

            <div className="flex flex-wrap gap-2">
              {data.skills ? (
                data.skills
                  .split(/[, ]+/)
                  .filter(s => s)
                  .map((s, i) => (
                    <span
                      key={i}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs"
                    >
                      {s}
                    </span>
                  ))
              ) : (
                <p className="text-gray-500 text-sm">Add your skills</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 🔥 PDF BUTTON */}
      <button
        onClick={downloadPDF}
        className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
          isPro
            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105"
            : "bg-gray-600 text-white cursor-not-allowed"
        }`}
      >
        {loading
          ? "Generating PDF..."
          : isPro
          ? "📄 Download PDF"
          : "🔒 Download PDF (Pro Only)"}
      </button>

    </div>
  );
}

export default ResumePreview;