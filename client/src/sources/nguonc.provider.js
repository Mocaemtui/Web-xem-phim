import { sourceConfig } from "./config";
import { requestJson } from "./http";
import { normalizeMovie } from "./normalizeMovie";

const config = sourceConfig.nguonc;

function buildUrl(path, params = {}) {
  const url = new URL(path, config.baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export const nguoncProvider = {
  id: "nguonc",
  name: "Nguonc",
  enabled: config.enabled,
  baseUrl: config.baseUrl,

  async healthCheck() {
    if (!config.enabled) {
      return { ok: false, reason: "disabled" };
    }

    const candidates = [
      buildUrl("/api/films/phim-moi-cap-nhat", { page: 1 }),
      buildUrl("/api/films", { page: 1 }),
    ];

    for (const url of candidates) {
      try {
        const data = await requestJson(url);
        const items = data.items || data.data?.items || data.data || [];

        if (Array.isArray(items) && items.length > 0) {
          return {
            ok: true,
            reason: "ok",
            endpoint: url,
          };
        }
      } catch {
        // thử endpoint kế tiếp
      }
    }

    return {
      ok: false,
      reason: "Nguonc API did not return a valid JSON movie list",
    };
  },

  async getLatest({ page = 1 } = {}) {
    const data = await requestJson(
      buildUrl("/api/films/phim-moi-cap-nhat", { page })
    );

    const items = data.items || data.data?.items || data.data || [];

    return {
      source: this.id,
      page,
      title: "Mới cập nhật",
      items: Array.isArray(items)
        ? items.map((item) => normalizeMovie(item, this.id)).filter(Boolean)
        : [],
      pagination: data.pagination || data.paginate || null,
      raw: data,
    };
  },

  async search({ keyword, page = 1 } = {}) {
    if (!keyword || keyword.trim().length < 2) {
      return {
        source: this.id,
        page,
        title: "Tìm kiếm",
        items: [],
        pagination: null,
      };
    }

    const data = await requestJson(
      buildUrl("/api/films/search", {
        keyword: keyword.trim(),
        page,
      })
    );

    const items = data.items || data.data?.items || data.data || [];

    return {
      source: this.id,
      page,
      title: `Tìm kiếm: ${keyword}`,
      items: Array.isArray(items)
        ? items.map((item) => normalizeMovie(item, this.id)).filter(Boolean)
        : [],
      pagination: data.pagination || data.paginate || null,
      raw: data,
    };
  },

  async getDetail({ slug }) {
    if (!slug) throw new Error("Missing movie slug");

    const data = await requestJson(buildUrl(`/api/film/${slug}`));
    const movieRaw = data.movie || data.data?.movie || data.data || data;

    // Extract episodes from Nguonc API response
    const episodes = [];
    if (data.episodes && Array.isArray(data.episodes)) {
      data.episodes.forEach((server) => {
        const serverName = server.server_name || 'Server Nguonc';
        if (server.server_data && Array.isArray(server.server_data)) {
          server.server_data.forEach((ep, index) => {
            episodes.push({
              episode_number: index + 1,
              name: ep.name || `Tập ${index + 1}`,
              embed_url: ep.link_embed || null,
              video_url: null,
              m3u8_url: null,
              server_name: serverName,
              slug: ep.slug || null
            });
          });
        }
      });
    }

    return {
      source: this.id,
      movie: normalizeMovie(movieRaw, this.id),
      episodes,
      raw: data,
    };
  },
};

export default nguoncProvider;
