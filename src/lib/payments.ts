import { prisma } from "@/lib/prisma";

export const LISTING_PRICE = 2999;
export const LISTING_PRICE_DISPLAY = "29.99";
export const LISTING_DURATION_DAYS = 30;

async function getStripeSecretKey(): Promise<string> {
  const dbSetting = await prisma.setting.findUnique({
    where: { key: "stripe_secret_key" },
  }).catch(() => null);

  return dbSetting?.value || process.env.STRIPE_SECRET_KEY || "";
}

export async function isMockMode(): Promise<boolean> {
  const key = await getStripeSecretKey();
  return !key || key.startsWith("mock_");
}

export async function createCheckout(userId: string, propertyId: string) {
  const mockMode = await isMockMode();

  if (mockMode) {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + LISTING_DURATION_DAYS);

    await prisma.payment.create({
      data: {
        userId,
        propertyId,
        amount: LISTING_PRICE,
        status: "succeeded",
        stripeSessionId: `mock_${Date.now()}`,
        paidAt: now,
        expiresAt,
      },
    });

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        status: "active",
        paidAt: now,
        expiresAt,
      },
    });

    return { url: `/payment/success?propertyId=${propertyId}` };
  }

  // Real Stripe mode — to be implemented when keys are provided
  // const stripe = new Stripe(await getStripeSecretKey());
  // const session = await stripe.checkout.sessions.create({ ... });
  // return { url: session.url };
  throw new Error("Real Stripe mode not yet configured. Add Stripe keys via Admin > Settings.");
}
