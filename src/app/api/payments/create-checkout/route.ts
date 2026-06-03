import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCheckout } from "@/lib/payments";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { propertyId } = await request.json();
  if (!propertyId) {
    return NextResponse.json({ error: "Missing propertyId" }, { status: 400 });
  }

  const result = await createCheckout(session.user.id, propertyId);
  return NextResponse.json(result);
}
