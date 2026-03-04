export function calculateROI(
  clientRevenue: number,
  aov: number,
  currentConversion: number,
  estimatedImprovement: number,
  estimatedTrafficGrowth: number,
  projectDuration: number,
  agencyCost: number,
  isOptimistic: boolean,
) {
  // Adjust based on optimistic/conservative
  const improvementFactor = isOptimistic ? 1 : 0.5;
  const trafficFactor = isOptimistic ? 1 : 0.5;

  const actualImprovement = estimatedImprovement * improvementFactor;
  const actualTrafficGrowth = estimatedTrafficGrowth * trafficFactor;

  // Current metrics
  const currentTraffic =
    currentConversion > 0 ? clientRevenue / (currentConversion / 100) / aov : 0;

  // New metrics
  const newConversion = currentConversion * (1 + actualImprovement / 100);
  const newTraffic = currentTraffic * (1 + actualTrafficGrowth / 100);

  // 1. New Projected Revenue
  const newRevenue = newTraffic * (newConversion / 100) * aov;

  // 2. Revenue Increase (Monthly)
  const monthlyRevenueIncrease = newRevenue - clientRevenue;

  // 3. Total Project Gain
  const totalGain = monthlyRevenueIncrease * projectDuration;

  // Total Service Cost
  const totalServiceCost = agencyCost * projectDuration;

  // 4. ROI Percentage
  const roi =
    totalServiceCost > 0
      ? ((totalGain - totalServiceCost) / totalServiceCost) * 100
      : 0;

  // 5. Recommended Agency Pricing Suggestion (e.g., 20% of projected gain)
  const recommendedPricing = totalGain * 0.2;

  return {
    newRevenue,
    monthlyRevenueIncrease,
    totalGain,
    totalServiceCost,
    roi,
    recommendedPricing,
    newConversion,
    newTraffic,
  };
}
