const stopWords = [
  "and","or","the","is","a","to","of","in","for","on","with","as","by","an"
];

function extractKeywords(text) {
  const words = text.split(" ");

  const filtered = words.filter(
    (w) => w.length > 3 && !stopWords.includes(w)
  );

  return [...new Set(filtered)];
}

module.exports = { extractKeywords };