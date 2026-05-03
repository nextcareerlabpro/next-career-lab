import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

// Razorpay sends raw body — must read as text before parsing
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

  if (!webhookSecret) {
    console.error("RAZORPAY_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  // Verify signature: HMAC-SHA256 of raw body using webhook secret
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(webhookSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const expectedSig = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  if (expectedSig !== signature) {
    console.error("Razorpay webhook signature mismatch");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only handle payment.captured events
  if (event.event !== "payment.captured") {
    return NextResponse.json({ received: true });
  }

  const payment = event.payload?.payment?.entity;
  if (!payment) return NextResponse.json({ received: true });

  const uid = payment.notes?.uid as string | undefined;
  const plan = (payment.notes?.plan as string) || "monthly";

  if (!uid) {
    console.error("Webhook: no uid in payment notes", payment.id);
    return NextResponse.json({ received: true });
  }

  const now = new Date();
  const expiry = new Date();
  if (plan === "annual") expiry.setFullYear(expiry.getFullYear() + 1);
  else if (plan === "quarterly") expiry.setMonth(expiry.getMonth() + 3);
  else expiry.setMonth(expiry.getMonth() + 1);

  const snap = await adminDb.collection("users").where("uid", "==", uid).limit(1).get();
  if (snap.empty) {
    console.error("Webhook: user not found for uid", uid);
    return NextResponse.json({ received: true });
  }

  await snap.docs[0].ref.update({
    plan: "pro",
    proPlan: plan,
    proSince: now.toISOString(),
    proExpiry: expiry.toISOString(),
  });

  console.log(`Webhook: upgraded uid=${uid} to pro (${plan}) via payment ${payment.id}`);
  return NextResponse.json({ received: true });
}
