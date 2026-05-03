import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  const { couponId } = await req.json();
  if (!couponId) return NextResponse.json({ ok: false });
  try {
    await adminDb.collection("coupons").doc(couponId).update({
      usedCount: FieldValue.increment(1),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
