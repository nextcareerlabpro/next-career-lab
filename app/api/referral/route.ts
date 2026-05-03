import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    await adminAuth.verifyIdToken(token);
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { referralCode } = await req.json();
  if (!referralCode) return NextResponse.json({ ok: false });

  const snap = await adminDb
    .collection("users")
    .where("referralCode", "==", referralCode)
    .limit(1)
    .get();

  if (snap.empty) return NextResponse.json({ ok: false, error: "Referrer not found" });

  const ref = snap.docs[0];
  const data = ref.data();

  // Extend referrer's Pro by 30 days (grant 1 month if on free plan)
  const now = new Date();
  let newExpiry: Date;

  if (data.plan === "pro" && data.proExpiry && new Date(data.proExpiry) > now) {
    newExpiry = new Date(data.proExpiry);
    newExpiry.setDate(newExpiry.getDate() + 30);
  } else {
    newExpiry = new Date(now);
    newExpiry.setMonth(newExpiry.getMonth() + 1);
  }

  await ref.ref.update({
    plan: "pro",
    proPlan: data.proPlan || "monthly",
    proSince: data.proSince || now.toISOString(),
    proExpiry: newExpiry.toISOString(),
    referralConverted: (data.referralConverted || 0) + 1,
  });

  return NextResponse.json({ ok: true });
}
