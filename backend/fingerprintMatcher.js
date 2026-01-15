const { processFingerprint } = require('./fingerprintProcessor');

async function compareFingerprints(path1, path2) {
  const pixels1 = await processFingerprint(path1);
  const pixels2 = await processFingerprint(path2);
  
  const differences = pixels1.map((p1, i) => Math.abs(p1 - pixels2[i]));
  const totalDifference = differences.reduce((sum, diff) => sum + diff, 0);
  const normalizedDifference = totalDifference / (pixels1.length * 255);
  const similarity = 1 - normalizedDifference;
  
  return {
    match: similarity >= 0.85,
    similarity: similarity
  };
}

module.exports = { compareFingerprints };