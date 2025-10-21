import { WireGuardPeerResponse } from '@/features/wg-peer/model/types';
import { prisma } from '@/shared/lib/prisma';
import { WgPeerStatus } from '@prisma/client';
import axios from 'axios';

export const peerRepository = {
  //Получаем количество пиров
  async totalCountPeers(userId?: number) {
    return await prisma.wireguardPeer.count({
      where: userId ? { userId } : undefined,
    });
  },

  //Получаем пиры из БД по userId
  async getPeersByUserId(userId: number, take?: number, skip?: number) {
    return prisma.wireguardPeer.findMany({
      where: { userId },
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

      return res.data;
    } catch (error) {
      console.error('[getWgServerPeerConfig] Server error', error);
      return null;
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
