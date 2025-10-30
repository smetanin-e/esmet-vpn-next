import { prisma } from '@/shared/lib/prisma';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export class WgSyncService {
  /**
   * Обновляет поле `lastActivity` для всех пиров
   * на основе данных `wg show <interface> dump`.
   */

  async updatePeersActivity(): Promise<void> {
    const peers = await prisma.wireguardPeer.findMany({
      select: { id: true, peerName: true, publicKey: true },
    });

    for (const peer of peers) {
      const lastHandshake = await this.getPeerLastHandshake(peer.publicKey);
      if (lastHandshake) {
        await prisma.wireguardPeer.update({
          where: { id: peer.id },
          data: { lastActivity: lastHandshake },
        });
      }
    }
    console.log(`✅ Обновлены активности ${peers.length} пиров`);
  }

  /**
   * Получаем дату последнего handshake для конкретного publicKey.
   */

  private async getPeerLastHandshake(publicKey: string): Promise<Date | null> {
    try {
      const { stdout } = await execAsync(`wg show all dump`);
      const lines = stdout.trim().split('\n');
      // каждая строка формата: <interface>\t<publicKey>\t<preshared>\t<endpoint>\t<allowedIPs>\t<latestHandshake>\t...
      const line = lines.find((l) => l.includes(publicKey));
      if (!line) return null;
      const parts = line.split('\t');
      const timestamp = Number(parts[5]); // wg возвращает секунды UNIX
      if (timestamp === 0) return null;
      return new Date(timestamp * 1000);
    } catch (error) {
      console.error(`Ошибка при получении handshake для ${publicKey}`, error);
      return null;
    }
  }
}
