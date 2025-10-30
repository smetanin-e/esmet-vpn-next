import { SubscriptionService } from '@/entities/subscription';

export async function GET() {
  try {
    const service = new SubscriptionService();
    await service.chargeAllUsers();
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
