require('dotenv').config();

const normalizeBaseUrl = (raw, fallback) => {
  const base = (raw || fallback || '').trim();
  const cleaned = base.replace(/^(https?:\/\/)+/i, '').replace(/\/+$/g, '');
  return `https://${cleaned}`;
};

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'movie_website',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'change_me',
  
  SOURCE_NGUONC_ENABLED: process.env.SOURCE_NGUONC_ENABLED !== 'false',
  SOURCE_NGUONC_BASE_URL: normalizeBaseUrl(process.env.SOURCE_NGUONC_BASE_URL, 'https://phim.nguonc.com/api'),
  
  SOURCE_KKPHIM_ENABLED: process.env.SOURCE_KKPHIM_ENABLED !== 'false',
  SOURCE_KKPHIM_BASE_URL: normalizeBaseUrl(process.env.SOURCE_KKPHIM_BASE_URL, 'https://phimapi.com'),
  
  SOURCE_OPHIM_ENABLED: process.env.SOURCE_OPHIM_ENABLED !== 'false',
  SOURCE_OPHIM_BASE_URL: normalizeBaseUrl(process.env.SOURCE_OPHIM_BASE_URL, 'https://ophim18.cc'),
  
  SOURCE_ANIMEVIETSUB_ENABLED: process.env.SOURCE_ANIMEVIETSUB_ENABLED !== 'false',
  SOURCE_ANIMEVIETSUB_BASE_URL: normalizeBaseUrl(process.env.SOURCE_ANIMEVIETSUB_BASE_URL, 'https://animevietsub.site'),
  
  SOURCE_ANIME47_ENABLED: process.env.SOURCE_ANIME47_ENABLED !== 'false',
  SOURCE_ANIME47_BASE_URL: normalizeBaseUrl(process.env.SOURCE_ANIME47_BASE_URL, 'https://anime47.best'),
  
  SOURCE_ANIMEHAY_ENABLED: process.env.SOURCE_ANIMEHAY_ENABLED !== 'false',
  SOURCE_ANIMEHAY_BASE_URL: normalizeBaseUrl(process.env.SOURCE_ANIMEHAY_BASE_URL, 'https://animehay03.site'),
  
  CACHE_DRIVER: process.env.CACHE_DRIVER || 'memory',
  CACHE_TTL_LIST: parseInt(process.env.CACHE_TTL_LIST) || 600,
  CACHE_TTL_DETAIL: parseInt(process.env.CACHE_TTL_DETAIL) || 1800,
};

module.exports = env;
