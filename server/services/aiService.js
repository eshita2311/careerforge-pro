require("dotenv").config();
const OpenAI = require("openai");

// 🔥 Ensure API key exists
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing in .env file");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Rewrite resume bullet points using AI
 */
async function rewriteBullets(bullets, jobDesc) {
  try {
    // 🔹 Input validation
    if (!bullets || !Array.isArray(bullets) || bullets.length === 0) {
      throw new Error("Invalid bullets input");
    }

    if (!jobDesc || jobDesc.trim() === "") {
      throw new Error("Job description is empty");
    }

    const prompt = `
You are an expert ATS resume optimizer.

Rewrite the given resume bullet points to:
- Improve clarity and impact
- Use strong action verbs (Built, Developed, Led, Optimized, etc.)
- Include relevant keywords from the job description
- Make them ATS-friendly
- Keep them concise (1–2 lines max)

IMPORTANT:
- Return ONLY bullet points
- Each line must start with "-"
- No explanation, no extra text

------------------------

Job Description:
${jobDesc}

------------------------

Original Resume Points:
${bullets.join("\n")}

------------------------

Improved Resume Points:
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let output = response.choices[0].message.content;

    // 🔹 Safety check
    if (!output || output.length < 5) {
      throw new Error("Empty AI response");
    }

    // 🔹 Clean and format output
    const formatted = output
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return formatted;

  } catch (error) {
    console.error("🔥 AI Rewrite Error:", error.message);

    // 🔁 Fallback: return original bullets formatted
    return bullets.map((b) => `- ${b}`);
  }
}

module.exports = { rewriteBullets };