import { WireGuardPeerResponse } from '@/features/wg-peer/model/types';
import { prisma } from '@/shared/lib/prisma';
import { WgPeerStatus } from '@prisma/client';
import { peerApi } from '../api/peer.api';
import { normalizeWgConfig } from '../lib/normalize-config';

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
          select: { id: true, login: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });
  },

  //Получаем все peerId по id пользователя для комплексного отключения на сервере WG
  async getPeerIdsByUserId(userId: number) {
    const peers = await prisma.wireguardPeer.findMany({
      where: { userId },
      select: { id: true },
    });

    return peers.map((p) => p.id);
  },

  //Получаем активные peerId по id пользователя для комплексного отключения на сервере WG
  async getEnabledIdsByUserId(userId: number) {
    const peers = await prisma.wireguardPeer.findMany({
      where: { userId, isEnabled: true },
      select: { id: true },
    });
    return peers.map((p) => p.id);
  },

  //Создаём пира через wg-rest-api
  async createPeerWgServer(name: string): Promise<WireGuardPeerResponse | null> {
    try {
      const res = await peerApi.create(name);
      return res.data;
    } catch (error) {
      console.error('[createPeerWgServer] Server error', error);
      return null;
    }
  },

  // Получаем конфиг напрямую из wg-rest-api
  async getWgServerPeerConfig(peerId: number): Promise<string | null> {
    try {
      const res = await peerApi.get(peerId);
      return normalizeWgConfig(res.data);
    } catch (error) {
      console.error('[getWgServerPeerConfig] Server error', error);
      return null;
    }
  },

  // Поиск пира по id
  async findPeerById(peerId: number) {
    return prisma.wireguardPeer.findFirst({
      where: { id: peerId },
    });
  },

  // Поиск пира по userId
  async findPeersByUserId(userId: number) {
    return prisma.wireguardPeer.findMany({
      where: { userId },
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

  //отключение всех пиров при деактивации пользователя
  async deactivatePeersByUserId(userId: number) {
    const peerIds = await this.getEnabledIdsByUserId(userId);
    await peerApi.deactivateMany(peerIds);
    return await prisma.wireguardPeer.updateMany({
      where: { userId },
      data: { status: WgPeerStatus.INACTIVE },
    });
  },

  //активация пиров при активации пользователя пользователя
  async activatePeersByUserId(userId: number) {
    const peerIds = await this.getEnabledIdsByUserId(userId);
    await peerApi.activateMany(peerIds);
    return await prisma.wireguardPeer.updateMany({
      where: { userId, isEnabled: true },
      data: { status: WgPeerStatus.ACTIVE },
    });
  },

  //обновляем флаг последнего статуса пира (для того чтобы при активации пользователя, включить ему только те пиры, которые были активны до блокировки)
  async updateLabelPeerStatus(peerId: number, value: boolean) {
    return prisma.wireguardPeer.update({
      where: { id: peerId },
      data: {
        isEnabled: value,
      },
    });
  },
  //Деактивируем пир
  async deactivatePeer(peerId: number) {
    try {
      // Деактивируем на сервере WireGuard через wg-rest-api
      await peerApi.deactivate(peerId);
      //обновляем статус пира в БД
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
      await peerApi.activate(peerId);
      //обновляем статус пира в БД
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
      await peerApi.delete(peerId);
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
    return prisma.wireguardPeer.create({
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
