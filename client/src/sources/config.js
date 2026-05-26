export const sourceConfig = {
  nguonc: {
    id: "nguonc",
    name: "Nguonc",
    enabled: import.meta.env.VITE_SOURCE_NGUONC_ENABLED === "true",
    baseUrl:
      import.meta.env.VITE_SOURCE_NGUONC_BASE_URL ||
      "https://phim.nguonc.com",
  },

  kkphim: {
    id: "kkphim",
    name: "KKPhim",
    enabled: import.meta.env.VITE_SOURCE_KKPHIM_ENABLED === "true",
    baseUrl:
      import.meta.env.VITE_SOURCE_KKPHIM_BASE_URL ||
      "https://phimapi.com",
  },

  ophim: {
    id: "ophim",
    name: "OPhim",
    enabled: import.meta.env.VITE_SOURCE_OPHIM_ENABLED === "true",
    baseUrl:
      import.meta.env.VITE_SOURCE_OPHIM_BASE_URL ||
      "https://ophim18.cc",
  },
};
