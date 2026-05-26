// Shared schema documentation (DTOs) for Source Adapters

/*
SourceMovieListResult:
{
  source: string,
  page: number,
  totalPages: number | null,
  totalItems: number | null,
  items: SourceMovieListItem[]
}

SourceMovieListItem:
{
  source: string,
  sourceSlug: string,
  slug: string,
  title: string,
  originalTitle: string | null,
  description: string | null,
  posterUrl: string | null,
  thumbnailUrl: string | null,
  year: number | null,
  quality: string | null,
  language: string | null,
  currentEpisode: string | null,
  totalEpisodes: string | null,
  type: "single" | "series" | "tvshows" | "hoathinh" | "unknown",
  categories: string[],
  countries: string[],
  modifiedAt: string | null
}

SourceMovieDetail:
{
  source: string,
  sourceSlug: string,
  slug: string,
  title: string,
  originalTitle: string | null,
  description: string | null,
  posterUrl: string | null,
  thumbnailUrl: string | null,
  trailerUrl: string | null,
  year: number | null,
  duration: string | null,
  quality: string | null,
  language: string | null,
  currentEpisode: string | null,
  totalEpisodes: string | null,
  status: "ongoing" | "completed" | "unknown",
  type: "single" | "series" | "tvshows" | "hoathinh" | "unknown",
  categories: string[],
  countries: string[],
  actors: string[],
  directors: string[],
  episodes: SourceEpisode[]
}

SourceEpisode:
{
  source: string,
  serverName: string,
  name: string,
  episodeNumber: number | null,
  sourceEpisodeSlug: string | null,
  videoUrl: string | null, // direct video url if any
  embedUrl: string | null, // iframe url
  m3u8Url: null, // Always set to null
  sortOrder: number
}
*/
module.exports = {};
