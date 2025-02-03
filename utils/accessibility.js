const cheerio = require("cheerio");

function analyzeAccessibility(html) {
  const $ = cheerio.load(html);
  let issues = [];

  if ($("title").length === 0) {
    issues.push({ description: "Missing <title> tag for page title." });
  }

  $("img").each((_, el) => {
    if (!$(el).attr("alt")) {
      issues.push({
        description: "Image missing alt attribute.",
        element: $.html(el),
      });
    }
  });

  let lastHeadingLevel = 0;
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const currentLevel = parseInt(el.tagName[1]);
    if (lastHeadingLevel && currentLevel > lastHeadingLevel + 1) {
      issues.push({
        description: `Skipped heading level: Found <h${currentLevel}> after <h${lastHeadingLevel}>`,
        element: $.html(el),
      });
    }
    lastHeadingLevel = currentLevel;
  });

  let score = 100 - issues.length * 10;
  if (score < 0) score = 0;

  return { score, issues };
}

module.exports = analyzeAccessibility;
