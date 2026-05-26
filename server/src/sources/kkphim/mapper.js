const { safeEmbedUrl, safeImageUrl } = require('../shared/safe-url');
const { safeText } = require('../../utils/sanitize');

function mapToSourceMovieListItem(raw) {
  const sourceSlug = raw.slug || '';
  const slug = sourceSlug ? `kkphim-${sourceSlug}` : `kkphim-${Date.now()}`;
  
  return {
    source: 'kkphim',
    sourceSlug: sourceSlug,
    slug: slug,
    title: raw.name || raw.origin_name || 'Không rõ',
    originalTitle: raw.origin_name || null,
    description: null, // List api usually doesn't return full content
    posterUrl: safeImageUrl(raw.poster_url) || null,
    thumbnailUrl: safeImageUrl(raw.thumb_url) || null,
    year: parseInt(raw.year, 10) || null,
    quality: raw.quality || null,
    language: raw.lang || raw.language || null,
    currentEpisode: raw.episode_current || null,
    totalEpisodes: raw.episode_total || null,
    type: raw.type || 'unknown',
    categories: [],
    countries: [],
    modifiedAt: raw.modified?.time || null
  };
}

function mapToSourceMovieDetail(movieRaw, episodesRaw) {
  const item = mapToSourceMovieListItem(movieRaw);
  
  const episodes = [];
  if (episodesRaw && Array.isArray(episodesRaw)) {
    episodesRaw.forEach((server) => {
      const serverName = server.server_name || 'Server KKPhim';
      if (server.server_data && Array.isArray(server.server_data)) {
        server.server_data.forEach((ep, index) => {
          const embedUrl = safeEmbedUrl(ep.link_embed);
          if (embedUrl) {
            episodes.push({
              source: 'kkphim',
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
    description: safeText(movieRaw.content || '', 500) || null,
    duration: movieRaw.time || null,
    status: movieRaw.status || 'unknown',
    categories: (movieRaw.category || []).map(c => c.name).filter(Boolean),
    countries: (movieRaw.country || []).map(c => c.name).filter(Boolean),
    actors: movieRaw.actor || [],
    directors: movieRaw.director || [],
    episodes: episodes
  };
}

module.exports = {
  mapToSourceMovieListItem,
  mapToSourceMovieDetail
};
