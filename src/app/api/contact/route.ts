import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // TODO: Send email via Resend/SendGrid
  console.log("--- CONTACT FORM ---");
  console.log(JSON.stringify(body, null, 2));
  console.log("--------------------");

  return NextResponse.json({ success: true });
}
