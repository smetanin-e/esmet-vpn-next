import { peerRepository } from '@/entities/wg-peer/repository/peer-repository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const peerId = Number((await params).id);

    const peer = await peerRepository.findPeerById(peerId);

    if (!peer) return NextResponse.json({ error: 'Peer not found' }, { status: 404 });

    // Получаем конфиг напрямую из wg-rest-api
    const config = await peerRepository.getWgServerPeerConfig(peerId);
    if (!config) {
      return {
        success: false,
        message: 'Не удалось запросить конфиг. Ошибка на сервере WG',
      };
    }

    return new NextResponse(config, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${peer.peerName}.conf"`,
      },
    });
  } catch (error) {
    console.error('[API_VPN_CONFIG]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
