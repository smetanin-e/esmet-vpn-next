'use server';

import { updateUserDetails } from '@/entities/user/model/update-user-details';
import { userRepository } from '@/entities/user/repository/user-repository';
import { peerRepository } from '@/entities/wg-peer/repository/peer-repository';

type CreatePeerData = {
  name: string;
  userId: number;
};

export async function createPeerAction(data: CreatePeerData) {
  try {
    const user = await userRepository.findUserById(data.userId);
    if (!user || !user.status) {
      return { success: false, message: 'Пользователь не найден или заблокирован' };
    }

    const maxPeers = user.subscription ? user.subscription.maxPeers : 0;
    const peersCount = user.peers ? user.peers.length : 0;

    if (peersCount >= maxPeers) {
      return {
        success: false,
        message:
          'Достигнут лимит конфигураций, обратитесь к администратору для изменения условий подписки',
      };
    }

    // Создаём пира через wg-rest-api
    const peerData = await peerRepository.createPeerWgServer(data.name);
    if (!peerData) {
      return {
        success: false,
        message: 'Не удалось создать конфиг. Ошибка на сервере WG',
      };
    }

    // Получаем конфиг напрямую из wg-rest-api
    const config = await peerRepository.getWgServerPeerConfig(peerData.id);
    if (!config) {
      return {
        success: false,
        message: 'Не удалось запросить конфиг. Ошибка на сервере WG',
      };
    }

    // Парсим ключи и адрес из конфига
    const privateKey = config.match(/PrivateKey\s*=\s*(.+)/)?.[1] ?? '';
    const publicKey = config.match(/PublicKey\s*=\s*(.+)/)?.[1] ?? '';
    const address = config.match(/Address\s*=\s*(.+)/)?.[1] ?? '';

    if (!privateKey || !publicKey || !address) {
      console.error('Config parse error:', config);
      return {
        success: false,
        message: 'Не удалось проанализировать конфигурацию WireGuard.',
      };
    }

    //Сохраняем в БД
    await peerRepository.createPeerDb(
      data.userId,
      data.name,
      peerData.id,
      publicKey,
      privateKey,
      address,
    );

    await updateUserDetails(user.id);

    return { success: true };
  } catch (error) {
    console.error('[CREATE_PEER] Server error', error);
    return { success: false, message: 'Ошибка создания пира' };
  }
}
