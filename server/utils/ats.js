function calculateATS(resumeSkills, jobKeywords) {
  const resumeSet = new Set(resumeSkills);

  let matched = [];
  let missing = [];

  jobKeywords.forEach((word) => {
    if (resumeSet.has(word)) {
      matched.push(word);
    } else {
      missing.push(word);
    }
  });

  const score = Math.round(
    (matched.length / jobKeywords.length) * 100
  );

  return { score, matched, missing };
}

module.exports = { calculateATS };