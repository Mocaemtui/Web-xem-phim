import { sourceConfig } from "./config";
import { requestJson } from "./http";
import { normalizeMovie } from "./normalizeMovie";

const config = sourceConfig.kkphim;

function buildUrl(path, params = {}) {
  const url = new URL(path, config.baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export const kkphimProvider = {
  id: "kkphim",
  name: "KKPhim",
  enabled: config.enabled,
  baseUrl: config.baseUrl,

  async healthCheck() {
    if (!config.enabled) {
      return { ok: false, reason: "disabled" };
    }

    try {
      const data = await requestJson(buildUrl("/danh-sach/phim-moi-cap-nhat", { page: 1 }));
      const items = data.items || data.data?.items || [];

      return {
        ok: Array.isArray(items) && items.length > 0,
        reason: Array.isArray(items) && items.length > 0 ? "ok" : "empty_response",
      };
    } catch (error) {
      return {
        ok: false,
        reason: error.message,
      };
    }
  },

  async getLatest({ page = 1 } = {}) {
    const data = await requestJson(
      buildUrl("/danh-sach/phim-moi-cap-nhat", { page })
    );

    const items = data.items || data.data?.items || [];

    return {
      source: this.id,
      page,
      title: "Mới cập nhật",
      items: items.map((item) => normalizeMovie(item, this.id)).filter(Boolean),
      pagination: {
        currentPage: data.pagination?.currentPage || page,
        totalPages: data.pagination?.totalPages || data.data?.params?.pagination?.totalPages || null,
        totalItems: data.pagination?.totalItems || data.data?.params?.pagination?.totalItems || null,
      },
      raw: data,
    };
  },

  async getList({
    type = "phim-le",
    page = 1,
    limit = 24,
    sortField = "modified.time",
    sortType = "desc",
    sortLang,
    category,
    country,
    year,
  } = {}) {
    const allowedTypes = [
      "phim-bo",
      "phim-le",
      "tv-shows",
      "hoat-hinh",
      "phim-vietsub",
      "phim-thuyet-minh",
      "phim-long-tieng",
    ];

    if (!allowedTypes.includes(type)) {
      throw new Error(`Invalid KKPhim type: ${type}`);
    }

    const data = await requestJson(
      buildUrl(`/v1/api/danh-sach/${type}`, {
        page,
        limit,
        sort_field: sortField,
        sort_type: sortType,
        sort_lang: sortLang,
        category,
        country,
        year,
      })
    );

    const items = data.data?.items || data.items || [];

    return {
      source: this.id,
      page,
      title: data.data?.titlePage || type,
      items: items.map((item) => normalizeMovie(item, this.id)).filter(Boolean),
      pagination: data.data?.params?.pagination || null,
      raw: data,
    };
  },

  async search({ keyword, page = 1, limit = 24 } = {}) {
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
      buildUrl("/v1/api/tim-kiem", {
        keyword: keyword.trim(),
        page,
        limit,
      })
    );

    const items = data.data?.items || data.items || [];

    return {
      source: this.id,
      page,
      title: `Tìm kiếm: ${keyword}`,
      items: items.map((item) => normalizeMovie(item, this.id)).filter(Boolean),
      pagination: data.data?.params?.pagination || null,
      raw: data,
    };
  },

  async getDetail({ slug }) {
    if (!slug) throw new Error("Missing movie slug");

    const data = await requestJson(buildUrl(`/phim/${slug}`));

    const movieRaw = data.movie || data.data?.movie || data;
    const movie = normalizeMovie(movieRaw, this.id);

    // Extract episodes from KKPhim API response
    const episodes = [];
    if (data.episodes && Array.isArray(data.episodes)) {
      data.episodes.forEach((server) => {
        const serverName = server.server_name || 'Server KKPhim';
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
      movie,
      episodes,
      raw: data,
    };
  },
};

export default kkphimProvider;
