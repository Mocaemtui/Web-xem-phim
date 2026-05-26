const nullProvider = {
  id: 'null',
  name: 'Null Provider',
  enabled: false,
  baseUrl: '',

  async healthCheck() {
    return { healthy: false, error: 'Null provider is not a real source' };
  },

  async getLatest() {
    throw new Error('Null provider cannot fetch data');
  },

  async getList() {
    throw new Error('Null provider cannot fetch data');
  },

  async search() {
    throw new Error('Null provider cannot fetch data');
  },

  async getDetail() {
    throw new Error('Null provider cannot fetch data');
  },

  normalizeListItem() {
    return null;
  },

  normalizeDetail() {
    return null;
  },
};

export default nullProvider;
