import { peerRepository } from '@/entities/wg-peer/repository/peer-repository';
import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

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

    // Генерируем QR в base64 (PNG)
    const qr = await QRCode.toDataURL(config, { errorCorrectionLevel: 'L' });

    // Возвращаем как изображение
    const base64 = qr.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="${peer.peerName}.png"`,
      },
    });
  } catch (error) {
    console.error('[API_VPN_CONFIG_QR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
