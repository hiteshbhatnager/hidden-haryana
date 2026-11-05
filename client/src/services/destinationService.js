import api from './api';

export const destinationService = {
  async getAll(params = {}) {
    const res = await api.get('/destinations', { params });
    return res.data;
  },

  async getFeatured() {
    const res = await api.get('/destinations/featured');
    return res.data;
  },

  async getHiddenGems() {
    const res = await api.get('/destinations/hidden-gems');
    return res.data;
  },

  async getRecent() {
    const res = await api.get('/destinations/recent');
    return res.data;
  },

  async getMeta() {
    const res = await api.get('/destinations/meta');
    return res.data;
  },

  async getByIdOrSlug(idOrSlug) {
    const res = await api.get(`/destinations/${idOrSlug}`);
    return res.data;
  },

  async create(destinationData) {
    const res = await api.post('/destinations', destinationData);
    return res.data;
  },

  async update(id, destinationData) {
    const res = await api.put(`/destinations/${id}`, destinationData);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/destinations/${id}`);
    return res.data;
  },

  async uploadImage(formData) {
    const res = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
