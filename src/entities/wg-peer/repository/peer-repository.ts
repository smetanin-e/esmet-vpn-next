import { WireGuardPeerResponse } from '@/features/wg-peer/model/types';
import { prisma } from '@/shared/lib/prisma';
import { WgPeerStatus } from '@prisma/client';
import axios from 'axios';

export const peerRepository = {
  //Получаем пиры из БД по userId
  async getPeersByUserId(userId: number, take?: number, skip?: number) {
    return prisma.wireguardPeer.findMany({
      where: { userId },
      select: {
        id: true,
        peerName: true,
        status: true,
        user: {
          select: { id: true, login: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });
  },

  //Получаем пиры из БД по поиску (логин, имя, фамилия)
  async getAllPeersFiltered(search: string, take?: number, skip?: number) {
    return prisma.wireguardPeer.findMany({
      where: search
        ? {
            user: {
              OR: [
                { lastName: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { login: { contains: search, mode: 'insensitive' } },
              ],
            },
          }
        : {},
      select: {
        id: true,
        peerName: true,
        status: true,
        user: {
          select: { login: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });
  },

  //Создаём пира через wg-rest-api
  async createPeerWgServer(name: string): Promise<WireGuardPeerResponse | null> {
    try {
      const res = await axios.post(
        `${process.env.WG_API_URL}/api/clients`,
        { name },
        { headers: { Authorization: `Bearer ${process.env.WG_API_TOKEN}` } },
      );

      return res.data;
    } catch (error) {
      console.error('[createPeerWgServer] Server error', error);
      return null;
    }
  },

  // Получаем конфиг напрямую из wg-rest-api
  async getWgServerPeerConfig(peerId: number): Promise<string | null> {
    try {
      const res = await axios.get(`${process.env.WG_API_URL}/api/clients/${peerId}?format=conf`, {
        headers: { Authorization: `Bearer ${process.env.WG_API_TOKEN}` },
        responseType: 'text',
      });
      let config = res.data;
      // Исправляем DNS и PersistentKeepalive если не установлены
      if (!config.includes('DNS')) {
        config = config.replace('[Interface]', `[Interface]\nDNS = 1.1.1.1`);
      }
      if (!config.includes('PersistentKeepalive')) {
        config = config.replace('Endpoint =', 'PersistentKeepalive = 25\nEndpoint =');
      }

      return config;
    } catch (error) {
      console.error('[getWgServerPeerConfig] Server error', error);
      return null;
    }
  },

  // Поиск пира по id
  async findPeerById(peerId: number) {
    return prisma.wireguardPeer.findUnique({
      where: { id: peerId },
    });
  },

  // обновление статуса пира по id
  async updatePeerStatus(peerId: number, status: WgPeerStatus) {
    return prisma.wireguardPeer.update({
      where: { id: peerId },
      data: {
        status,
      },
    });
  },

  //Деактивируем пир
  async deactivatePeer(peerId: number) {
    try {
      // Деактивируем на сервере WireGuard через wg-rest-api
      await axios.patch(
        `${process.env.WG_API_URL}/api/clients/${peerId}`,
        { enable: false },
        { headers: { Authorization: `Bearer ${process.env.WG_API_TOKEN}` } },
      );

      await this.updatePeerStatus(peerId, WgPeerStatus.INACTIVE);
      return { success: true };
    } catch (error) {
      console.error('[deactivatePeer] Server error', error);
      return { success: false, message: 'Ошибка дективации пира' };
    }
  },

  //Активируем пир
  async activatePeer(peerId: number) {
    try {
      // Активируем на сервере WireGuard через wg-rest-api
      await axios.patch(
        `${process.env.WG_API_URL}/api/clients/${peerId}`,
        { enable: true },
        { headers: { Authorization: `Bearer ${process.env.WG_API_TOKEN}` } },
      );

      await this.updatePeerStatus(peerId, WgPeerStatus.ACTIVE);
      return { success: true };
    } catch (error) {
      console.error('[deactivatePeer] Server error', error);
      return { success: false, message: 'Ошибка активации пира' };
    }
  },

  //Удаляем пир
  async deletePeer(peerId: number) {
    try {
      // Удаляем на сервере WireGuard через wg-rest-api
      await axios.delete(
        `${process.env.WG_API_URL}/api/clients/${peerId}`,

        { headers: { Authorization: `Bearer ${process.env.WG_API_TOKEN}` } },
      );

      //Удаляем из БД
      await prisma.wireguardPeer.delete({
        where: { id: peerId },
      });

      return { success: true };
    } catch (error) {
      console.error('[deletePeer] Server error', error);
      return { success: false, message: 'Ошибка удаления пира' };
    }
  },

  //добавляем пир из wg-rest-api в базу данных
  async createPeerDb(
    userId: number,
    name: string,
    peerId: number,
    publicKey: string,
    privateKey: string,
    address: string,
  ) {
    return await prisma.wireguardPeer.create({
      data: {
        userId,
        peerName: name,
        publicKey,
        privateKey,
        address,
        id: peerId,
        status: WgPeerStatus.ACTIVE,
        isEnabled: true,
      },
    });
  },
};
