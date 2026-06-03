import { NextResponse } from "next/server";

export async function POST() {
  // Stub for Stripe webhook — no-op in mock mode
  // When real Stripe is configured, this will validate the webhook signature
  // and update Payment + Property records on checkout.session.completed
  return NextResponse.json({ received: true });
}
