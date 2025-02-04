require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cheerio = require("cheerio");

if (!process.env.GEMINI_API_KEY) {
  console.error("ERROR: Missing GEMINI_API_KEY in environment variables.");
  process.exit(1); // Stop execution if API key is missing
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyzes an HTML file for accessibility issues.
 * @param {string} html - The raw HTML content.
 * @returns {Promise<{score: number, issues: Array}>} - Accessibility score and list of issues.
 */
async function analyzeAccessibility(html) {
  let issues = [];

  try {
    if (!html || typeof html !== "string") {
      throw new Error("Invalid HTML content provided.");
    }

    const $ = cheerio.load(html);

    // Check for <title> tag
    if ($("title").length === 0) {
      issues.push({
        description: "Missing <title> tag for page title.",
        line: getLineNumber(html, "<html>"),
      });
    }

    // Check for images without alt attributes
    $("img").each((_, el) => {
      if (!$(el).attr("alt")) {
        issues.push({
          description: "Image missing alt attribute.",
          element: $.html(el),
          line: getLineNumber(html, $.html(el)),
        });
      }
    });

    // Check for skipped heading levels (e.g., h1 → h3)
    let lastHeadingLevel = 0;
    $("h1, h2, h3, h4, h5, h6").each((_, el) => {
      const currentLevel = parseInt(el.tagName[1]);
      if (lastHeadingLevel && currentLevel > lastHeadingLevel + 1) {
        issues.push({
          description: `Skipped heading level: Found <h${currentLevel}> after <h${lastHeadingLevel}>`,
          element: $.html(el),
          line: getLineNumber(html, $.html(el)),
        });
      }
      lastHeadingLevel = currentLevel;
    });

    // Send HTML analysis request to OpenAI API
    let aiInsights = "No AI insights available.";
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(`Analyze this HTML for accessibility issues:\n\n${html}`);
      const response = result.response;
      aiInsights = response?.candidates?.[0]?.content || "No insights generated.";
    } catch (error) {
      console.error(`Gemini API ERROR: ${error.message}`);
    }

    issues.push({
      description: "AI Insights:",
      element: aiInsights,
      line: "N/A", // No specific line number for AI-generated text
    });

    // Calculate Compliance Score
    let score = 100 - issues.length * 10;
    if (score < 0) score = 0;

    return { score, issues };
  } catch (error) {
    console.error(`ERROR (Line ${getLineNumber(__filename, "async function analyzeAccessibility")}): ${error.message}`);
    return { score: 0, issues: [{ description: "An error occurred during accessibility analysis." }] };
  }
}

/**
 * Get the line number of a string occurrence in the source content.
 * @param {string} source - The source HTML or file content.
 * @param {string} search - The text to find in the source.
 * @returns {number} - Line number of the occurrence.
 */
function getLineNumber(source, search) {
  const lines = source.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(search)) {
      return i + 1; // Return 1-based line number
    }
  }
  return "N/A";
}

module.exports = analyzeAccessibility;
