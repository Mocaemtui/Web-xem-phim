import { kkphimProvider } from "../sources/kkphim.provider";
import { nguoncProvider } from "../sources/nguonc.provider";
import { ophimProvider } from "../sources/ophim.provider";

const providers = [
  kkphimProvider,
  nguoncProvider,
  ophimProvider,
];

let healthyProvidersCache = null;

export async function getHealthyProviders({ force = false } = {}) {
  if (healthyProvidersCache && !force) {
    return healthyProvidersCache;
  }

  const results = [];

  for (const provider of providers) {
    if (!provider.enabled) {
      results.push({
        provider,
        healthy: false,
        reason: "disabled",
      });
      continue;
    }

    const status = await provider.healthCheck();

    results.push({
      provider,
      healthy: status.ok,
      reason: status.reason,
      endpoint: status.endpoint,
    });
  }

  healthyProvidersCache = results;
  return results;
}

export async function getPrimaryProvider() {
  const statuses = await getHealthyProviders();

  const kkphim = statuses.find(
    (item) => item.provider.id === "kkphim" && item.healthy
  );

  if (kkphim) return kkphim.provider;

  const fallback = statuses.find((item) => item.healthy);

  if (fallback) return fallback.provider;

  throw new Error("No healthy movie source available");
}

export async function getHomeRows() {
  const provider = await getPrimaryProvider();

  if (provider.id === "kkphim") {
    const rows = await Promise.allSettled([
      provider.getLatest({ page: 1 }),
      provider.getList({ type: "phim-le", page: 1, limit: 24 }),
      provider.getList({ type: "phim-bo", page: 1, limit: 24 }),
      provider.getList({ type: "hoat-hinh", page: 1, limit: 24 }),
      provider.getList({ type: "tv-shows", page: 1, limit: 24 }),
    ]);

    return rows
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value)
      .filter((row) => row.items.length > 0);
  }

  const latest = await provider.getLatest({ page: 1 });

  return latest.items.length > 0 ? [latest] : [];
}

export async function searchMovies(keyword, page = 1) {
  const provider = await getPrimaryProvider();
  return provider.search({ keyword, page });
}

export async function getMovieDetail(slug) {
  const provider = await getPrimaryProvider();
  return provider.getDetail({ slug });
}

export async function getWatchData(slug) {
  const provider = await getPrimaryProvider();
  return provider.getDetail({ slug });
}

export default {
  getHealthyProviders,
  getPrimaryProvider,
  getHomeRows,
  searchMovies,
  getMovieDetail,
  getWatchData,
};
