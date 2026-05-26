function normalizeImageUrl(url, baseUrl = null) {
  if (!url || typeof url !== 'string') return null;
  
  // Remove leading/trailing whitespace
  url = url.trim();
  
  // If it's a data URL, return as-is
  if (url.startsWith('data:')) return url;
  
  try {
    // If it's already an absolute URL, convert HTTP to HTTPS
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url.replace('http://', 'https://');
    }
    
    // If it's a relative URL and baseUrl is provided, make it absolute
    if (baseUrl && (url.startsWith('/') || url.startsWith('./'))) {
      return new URL(url, baseUrl).toString();
    }
    
    // If it's a relative path without leading slash, try to make it absolute
    if (baseUrl && !url.includes('://')) {
      return new URL(url.startsWith('/') ? url : '/' + url, baseUrl).toString();
    }
    
    // Return as-is if we can't normalize it
    return url;
  } catch (e) {
    console.warn('Failed to normalize image URL:', url, e);
    return null;
  }
}

export function normalizeMovie(raw, source) {
  if (!raw || typeof raw !== "object") return null;

  // Get base URL for the source
  const sourceBaseUrls = {
    kkphim: 'https://phimapi.com',
    nguonc: 'https://phim.nguonc.com',
    ophim: 'https://ophim18.cc'
  };
  const baseUrl = sourceBaseUrls[source] || null;

  // Extract categories/genres as array of names
  const categories = raw.category || raw.categories || raw.movie?.category || [];
  const genres = Array.isArray(categories) 
    ? categories.map(c => typeof c === 'object' ? c.name : c).filter(Boolean)
    : [];

  // Extract countries as array of names
  const countryData = raw.country || raw.countries || raw.movie?.country || [];
  const countries = Array.isArray(countryData)
    ? countryData.map(c => typeof c === 'object' ? c.name : c).filter(Boolean)
    : [];

  // Normalize image URLs
  const posterUrlRaw = raw.poster_url || raw.poster || raw.image || raw.movie?.poster_url || "";
  const posterUrl = normalizeImageUrl(posterUrlRaw, baseUrl);
  
  const thumbUrlRaw = raw.thumb_url || raw.thumbnail || raw.backdrop_url || raw.movie?.thumb_url || "";
  const thumbUrl = normalizeImageUrl(thumbUrlRaw, baseUrl);
  
  const bgUrlRaw = raw.backdrop_url || raw.thumb_url || raw.backdrop || raw.movie?.backdrop_url || raw.poster_url || "";
  const bgUrl = normalizeImageUrl(bgUrlRaw, baseUrl);

  return {
    id: raw._id || raw.id || raw.slug || crypto.randomUUID(),
    source,

    slug: raw.slug || "",
    title: raw.name || raw.title || raw.movie?.name || "Chưa có tên",
    original_title: raw.origin_name || raw.original_name || raw.movie?.origin_name || "",

    description:
      raw.content ||
      raw.description ||
      raw.overview ||
      raw.movie?.content ||
      "",

    poster_url: posterUrl || "",
    posterUrl: posterUrl || "",
    bg_url: bgUrl || "",
    thumbUrl: thumbUrl || "",

    year: raw.year || raw.release_year || raw.movie?.year || null,
    release_year: raw.year || raw.release_year || raw.movie?.year || null,

    quality:
      raw.quality ||
      raw.lang ||
      raw.movie?.quality ||
      "",

    language:
      raw.lang ||
      raw.language ||
      raw.movie?.lang ||
      "",

    type:
      raw.type ||
      raw.movie?.type ||
      "",

    status:
      raw.status ||
      raw.episode_current ||
      raw.movie?.status ||
      "",

    episodeCurrent:
      raw.episode_current ||
      raw.current_episode ||
      raw.movie?.episode_current ||
      "",

    episodeTotal:
      raw.episode_total ||
      raw.total_episode ||
      raw.movie?.episode_total ||
      "",

    genres,
    categories,
    countries,

    actors: raw.actor || raw.actors || raw.movie?.actor || [],
    directors: raw.director || raw.directors || raw.movie?.director || [],
    producers: [],

    imdb_rating: raw.imdb_rating || raw.rating || raw.movie?.imdb_rating || null,
    age_limit: raw.age_limit || raw.age || raw.movie?.age_limit || null,
    duration: raw.time || raw.duration || raw.movie?.time || null,

    modifiedAt:
      raw.modified?.time ||
      raw.updated_at ||
      raw.modifiedAt ||
      null,

    raw,
  };
}
