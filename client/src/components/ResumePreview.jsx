import React from "react";
import axios from "axios";

function ResumePreview({ data, isPro }) {

  const downloadPDF = async () => {
    try {
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
    }
  };

  return (
    <div className="space-y-4">

      {/* 🔥 Resume Content (important for PDF) */}
      <div
        id="resume"
        className="bg-white text-black p-4 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-bold">
          {data.name || "Your Name"}
        </h2>

        <p className="text-gray-700">
          {data.email || "your@email.com"}
        </p>

        <h3 className="mt-3 font-semibold">Summary</h3>
        <p className="text-gray-600">
          {data.summary || "Write a professional summary..."}
        </p>

        <h3 className="mt-3 font-semibold">Skills</h3>

        <div className="flex flex-wrap gap-2 mt-1">
          {data.skills ? (
            data.skills
              .split(/[, ]+/)
              .filter(s => s)
              .map((s, i) => (
                <span
                  key={i}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                  {s}
                </span>
              ))
          ) : (
            <p className="text-gray-500">Add your skills</p>
          )}
        </div>
      </div>

      {/* 🔒 PDF BUTTON (FREE vs PRO) */}
      {isPro ? (
        <button
          onClick={downloadPDF}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition font-semibold"
        >
          📄 Download PDF
        </button>
      ) : (
        <button
          onClick={() => alert("Upgrade to Pro to download PDF")}
          className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          🔒 Download PDF (Pro Only)
        </button>
      )}

    </div>
  );
}

export default ResumePreview;