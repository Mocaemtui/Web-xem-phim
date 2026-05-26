const { safeEmbedUrl, safeImageUrl } = require('../shared/safe-url');
const { safeText } = require('../../utils/sanitize');
const slugify = require('../../utils/slugify');

function parseArrayStr(str) {
  if (!str) return [];
  if (Array.isArray(str)) return str.map(item => item?.name || item);
  return str.split(',').map(s => s.trim()).filter(Boolean);
}

function parseArrayObj(arr) {
  if (!arr || !Array.isArray(arr)) return [];
  return arr.map(c => c?.name || c).filter(Boolean);
}

function mapToSourceMovieListItem(raw) {
  const sourceSlug = raw.slug || '';
  const slug = sourceSlug ? `nguonc-${sourceSlug}` : `nguonc-${Date.now()}`;
  
  return {
    source: 'nguonc',
    sourceSlug: sourceSlug,
    slug: slug,
    title: raw.name || raw.original_name || 'Không rõ',
    originalTitle: raw.original_name || null,
    description: safeText(raw.description || raw.content || '', 500) || null,
    posterUrl: safeImageUrl(raw.poster_url) || null,
    thumbnailUrl: safeImageUrl(raw.thumb_url) || null,
    year: parseInt(raw.year, 10) || null,
    quality: raw.quality || null,
    language: raw.language || null,
    currentEpisode: raw.current_episode || null,
    totalEpisodes: raw.total_episodes || null,
    type: 'unknown',
    categories: parseArrayObj(raw.category),
    countries: parseArrayObj(raw.country),
    modifiedAt: raw.modified || null
  };
}

function mapToSourceMovieDetail(raw) {
  const item = mapToSourceMovieListItem(raw);
  
  const episodes = [];
  if (raw.episodes && Array.isArray(raw.episodes)) {
    raw.episodes.forEach((server) => {
      const serverName = server.server_name || server.name || 'Server NguonC';
      if (server.items && Array.isArray(server.items)) {
        server.items.forEach((ep, index) => {
          const embedUrl = safeEmbedUrl(ep.embed);
          if (embedUrl) {
            episodes.push({
              source: 'nguonc',
              serverName: serverName,
              name: ep.name || `Tập ${index + 1}`,
              episodeNumber: index + 1,
              sourceEpisodeSlug: ep.slug || null,
              videoUrl: null,
              embedUrl: embedUrl,
              m3u8Url: null,
              sortOrder: index
            });
          }
        });
      }
    });
  }

  return {
    ...item,
    duration: raw.time || null,
    status: 'unknown',
    actors: parseArrayStr(raw.casts),
    directors: parseArrayStr(raw.director),
    episodes: episodes
  };
}

module.exports = {
  mapToSourceMovieListItem,
  mapToSourceMovieDetail
};
