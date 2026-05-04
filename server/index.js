require("dotenv").config();

const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const Stripe = require("stripe");

// 🔥 Services
const { rewriteBullets } = require("./services/aiService");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Stripe init
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ---------- UTIL FUNCTIONS ---------- */

// Clean text
function cleanText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Stopwords
const techSkills = [
  "java","python","react","node","css","html","sql","javascript"
];

const filteredKeywords = keywords.filter(k => techSkills.includes(k));

// Extract keywords
function extractKeywords(text) {
  return [...new Set(
    text
      .split(" ")
      .filter(word => word.length > 2 && !stopWords.includes(word))
  )];
}

// ATS Score
function calculateATS(skills, keywords) {
  const skillSet = new Set(skills);

  let matched = [];
  let missing = [];

  keywords.forEach((k) => {
    if (skillSet.has(k)) matched.push(k);
    else missing.push(k);
  });

  const score =
    keywords.length === 0
      ? 0
      : Math.round((matched.length / keywords.length) * 100);

  return { score, matched, missing };
}

/* ---------- ROUTES ---------- */

// 🔹 ATS ANALYZER
app.post("/api/analyze", (req, res) => {
  try {
    const { jobDesc, skills } = req.body;

    if (!jobDesc || !skills || !Array.isArray(skills)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const cleaned = cleanText(jobDesc);
    const keywords = extractKeywords(cleaned);
    const result = calculateATS(skills, keywords);

    res.json({
      score: result.score,
      keywords,
      matched: result.matched,
      missing: result.missing,
    });

  } catch (err) {
    console.error("ATS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 AI RESUME REWRITE
app.post("/api/rewrite", async (req, res) => {
  try {
    const { bullets, jobDesc } = req.body;

    if (!bullets || !jobDesc) {
      return res.status(400).json({ error: "Missing input" });
    }

    const improved = await rewriteBullets(bullets, jobDesc);
    res.json({ improved });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "AI failed" });
  }
});

// 🔹 COVER LETTER GENERATOR (🔥 Week 4)
app.post("/api/cover-letter", async (req, res) => {
  try {
    const { name, skills, jobDesc } = req.body;

    if (!name || !skills || !jobDesc) {
      return res.status(400).json({ error: "Missing input" });
    }

    const prompt = `
Write a professional cover letter for:

Name: ${name}
Skills: ${skills}
Job Description: ${jobDesc}

Make it professional, concise, and impactful.
`;

    const response = await rewriteBullets([prompt], jobDesc);

    res.json({ letter: response });

  } catch (err) {
    console.error("COVER LETTER ERROR:", err);
    res.status(500).json({ error: "Cover letter failed" });
  }
});

// 🔹 PDF EXPORT
app.post("/api/pdf", async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) return res.status(400).send("No HTML provided");

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
    });

    res.send(pdf);

  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).send("PDF failed");
  }
});

// 🔹 STRIPE CHECKOUT
app.post("/api/checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "CareerForge Pro",
            },
            unit_amount: 500,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000",
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("STRIPE ERROR:", err);
    res.status(500).json({ error: "Payment failed" });
  }
});

/* ---------- HEALTH CHECK ---------- */

app.get("/", (req, res) => {
  res.send("🚀 CareerForge API is running");
});

/* ---------- RUN ---------- */

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});