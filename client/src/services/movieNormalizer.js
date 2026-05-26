// Movie Normalizer Service
// Normalizes movie data from different providers into a consistent structure

export function normalizeMovie(raw, source) {
  if (!raw) return null;

  return {
    id: raw.id || raw.slug,
    source: source,
    slug: raw.slug,
    name: raw.name || raw.title || 'Unknown',
    originName: raw.origin_name || raw.originalTitle || '',
    description: raw.description || '',
    posterUrl: raw.poster_url || raw.poster || '',
    thumbUrl: raw.thumb_url || raw.thumb || '',
    year: raw.year || raw.release_date || null,
    quality: raw.quality || '',
    language: raw.lang || raw.language || '',
    type: raw.type || '',
    status: raw.status || '',
    episodeCurrent: raw.episode_current || raw.currentEpisode || 0,
    episodeTotal: raw.episode_total || raw.totalEpisode || 0,
    categories: raw.category || raw.categories || [],
    countries: raw.country || raw.countries || [],
    actors: raw.actor || raw.actors || [],
    directors: raw.director || raw.directors || [],
    modifiedAt: raw.modified?.time || raw.modifiedAt || null,
  };
}

export function normalizeMovieDetail(raw, source) {
  if (!raw) return null;

  const movie = normalizeMovie(raw, source);
  
  // Normalize episodes
  const episodes = {};
  if (raw.episodes && Array.isArray(raw.episodes)) {
    raw.episodes.forEach((ep) => {
      if (ep.server_name && ep.server_data) {
        episodes[ep.server_name] = ep.server_data.map((item) => ({
          name: item.name,
          slug: item.slug,
          filename: item.filename || '',
          linkEmbed: item.link_embed || '',
          linkM3u8: item.link_m3u8 || '',
        }));
      }
    });
  }

  return {
    ...movie,
    episodes,
  };
}

export function normalizeMovieList(rawData, source) {
  if (!rawData) return [];

  // Handle different response structures
  let items = [];
  
  if (Array.isArray(rawData)) {
    items = rawData;
  } else if (Array.isArray(rawData.items)) {
    items = rawData.items;
  } else if (Array.isArray(rawData.data)) {
    items = rawData.data;
  } else if (Array.isArray(rawData.results)) {
    items = rawData.results;
  }

  return items.map(item => normalizeMovie(item, source)).filter(Boolean);
}

export function getPosterUrl(posterUrl, fallback = null) {
  if (!posterUrl) return fallback;
  
  // If it's already a full URL, return it
  if (posterUrl.startsWith('http://') || posterUrl.startsWith('https://')) {
    return posterUrl;
  }
  
  // If it's a relative path, prepend with base URL if needed
  // This depends on the provider, so we might need to pass the base URL
  return posterUrl;
}

export function getFallbackPoster() {
  // Generate a fallback poster based on title
  return null; // Could implement a placeholder generator
}

export function sanitizeText(text) {
  if (!text) return '';
  
  // Basic sanitization - remove HTML tags
  return text.replace(/<[^>]*>/g, '').trim();
}
