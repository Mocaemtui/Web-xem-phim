const CacheKeys = {
  list: (hash) => `movies:list:${hash}`,
  detail: (slug) => `movie:detail:${slug}`,
  watch: (slug) => `movie:watch:${slug}`,
  search: (hash) => `search:${hash}`,
  health: (source) => `source:health:${source}`
};

module.exports = CacheKeys;
