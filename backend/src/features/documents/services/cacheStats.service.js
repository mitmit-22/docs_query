export const cacheStats = {
  hits: 0,
  misses: 0,
};

export function getCacheStats() {
  const total = cacheStats.hits + cacheStats.misses;
  const hitRate = total === 0 ? 0 : (cacheStats.hits / total) * 100;
  return { ...cacheStats, total, hitRate: `${hitRate.toFixed(1)}%` };
}