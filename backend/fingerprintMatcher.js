const { processFingerprint } = require('./fingerprintProcessor');

async function compareFingerprints(path1, path2) {
  const pixels1 = await processFingerprint(path1);
  const pixels2 = await processFingerprint(path2);
  
  const differences = pixels1.map((p1, i) => Math.abs(p1 - pixels2[i]));
  const totalDifference = differences.reduce((sum, diff) => sum + diff, 0);
  const maxPossibleDifference = pixels1.length * 255;
  const normalizedDifference = totalDifference / maxPossibleDifference;
  const similarity = Math.max(0, Math.min(1, 1 - normalizedDifference));
  
  console.log('Comparison stats:', {
    totalPixels: pixels1.length,
    totalDifference,
    maxPossibleDifference,
    normalizedDifference: normalizedDifference.toFixed(4),
    similarity: similarity.toFixed(4),
    match: similarity >= 0.85
  });
  
  return {
    match: similarity >= 0.85,
    similarity: Number(similarity.toFixed(4))
  };
}

module.exports = { compareFingerprints };