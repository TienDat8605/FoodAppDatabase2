//cosine similarity function
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  
  return dotProduct / (magnitudeA * magnitudeB);
}

const L2Distance = (vecA, vecB) => {
  const sum = vecA.reduce((acc, a, i) => acc + Math.pow(a - vecB[i], 2), 0);
  return Math.sqrt(sum);
}

const hybridSimilarity = (vecA, vecB, alpha = 0.7) => {
  const cosineSim = cosineSimilarity(vecA, vecB);
  const l2Dist = L2Distance(vecA, vecB);
  return cosineSim *alpha + (1-alpha) / (1 + l2Dist); // Normalize by L2 distance
}

module.exports = { cosineSimilarity, L2Distance, hybridSimilarity };