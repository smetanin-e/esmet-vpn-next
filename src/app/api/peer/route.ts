import { peerRepository } from '@/entities/wg-peer/repository/peer-repository';
import { NextRequest, NextResponse } from 'next/server';
import { validateApiToken } from '@/shared/lib/validate-api-token';

export async function GET(req: NextRequest) {
  if (!validateApiToken(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const cursor = req.nextUrl.searchParams.get('cursor');
    const limit = Number(req.nextUrl.searchParams.get('limit')) || 3;

    const result = await peerRepository.getPeersPaginated({
      userId: userId ? Number(userId) : undefined,
      cursor: cursor ? Number(cursor) : undefined,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API_PEER_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
