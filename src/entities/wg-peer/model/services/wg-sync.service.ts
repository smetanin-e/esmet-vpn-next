import { prisma } from '@/shared/lib/prisma';
import axios from 'axios';

export class WgSyncService {
  private apiBase = 'https://wg.esmet.store/api/clients';
  private apiToken = process.env.WG_API_TOKEN!; // вынеси токен в .env

  async updatePeersActivity(): Promise<void> {
    const peers = await prisma.wireguardPeer.findMany({
      select: { id: true, peerName: true, publicKey: true },
    });

    for (const peer of peers) {
      const lastHandshake = await this.getPeerLastHandshake(peer.id);
      if (lastHandshake) {
        await prisma.wireguardPeer.update({
          where: { id: peer.id },
          data: { lastActivity: lastHandshake },
        });
      }
    }

    console.log(`✅ Обновлены активности ${peers.length} пиров`);
  }

  private async getPeerLastHandshake(clientId: number): Promise<Date | null> {
    try {
      const { data } = await axios.get(`${this.apiBase}/${clientId}`, {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      });

      if (!data?.last_online) return null;

      const lastOnlineDate = new Date(data.last_online);
      return isNaN(lastOnlineDate.getTime()) ? null : lastOnlineDate;
    } catch (err) {
      console.error(`Ошибка при получении данных для клиента ${clientId}:`, err);
      return null;
    }
  }
}
