import { wgInstance } from '@/shared/service/wg-instance';

//TODO Сделать activate и deactivate одним методом
export const peerApi = {
  async get(peerId: number) {
    return wgInstance.get(`/api/clients/${peerId}?format=conf`, { responseType: 'text' });
  },

  async create(name: string) {
    return wgInstance.post(`/api/clients`, { name });
  },

  async deactivate(peerId: number) {
    return wgInstance.patch(`/api/clients/${peerId}`, { enable: false });
  },

  async deactivateMany(peerIds: number[]) {
    return Promise.all(
      peerIds.map((peerId) => wgInstance.patch(`/api/clients/${peerId}`, { enable: false })),
    );
  },

  async activate(peerId: number) {
    return wgInstance.patch(`/api/clients/${peerId}`, { enable: true });
  },

  async activateMany(peerIds: number[]) {
    return Promise.all(
      peerIds.map((peerId) => wgInstance.patch(`/api/clients/${peerId}`, { enable: true })),
    );
  },

  async delete(peerId: number) {
    return wgInstance.delete(`/api/clients/${peerId}`);
  },

  async deleteMany(peerIds: number[]) {
    return Promise.all(peerIds.map((peerId) => wgInstance.delete(`/api/clients/${peerId}`)));
  },

  async getConfig(peerId: number) {
    return wgInstance.get(`/api/peer/${peerId}/config`, {
      responseType: 'blob', // важно, чтобы axios воспринимал ответ как файл
      withCredentials: true, // чтобы cookie для авторизации передались
    });
  },

  async getQr(peerId: number) {
    return wgInstance.get(`/api/peer/${peerId}/qr`, {
      responseType: 'blob',
      withCredentials: true,
    });
  },
};
