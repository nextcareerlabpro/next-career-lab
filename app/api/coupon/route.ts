import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

const PLAN_PRICES: Record<string, number> = {
  monthly: 29900,
  quarterly: 59700,
  annual: 178800,
};

export async function POST(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ valid: false, error: "Unauthorized" }, { status: 401 });

  try {
    await adminAuth.verifyIdToken(token);
  } catch {
    return NextResponse.json({ valid: false, error: "Invalid token" }, { status: 401 });
  }

  const { code, plan } = await req.json();
  if (!code || !plan) return NextResponse.json({ valid: false, error: "Missing code or plan" });

  const baseAmount = PLAN_PRICES[plan];
  if (!baseAmount) return NextResponse.json({ valid: false, error: "Invalid plan" });

  const snap = await adminDb
    .collection("coupons")
    .where("code", "==", code.toUpperCase().trim())
    .limit(1)
    .get();

  if (snap.empty) return NextResponse.json({ valid: false, error: "Invalid coupon code" });

  const coupon = snap.docs[0].data();

  if (!coupon.active) return NextResponse.json({ valid: false, error: "Coupon is inactive" });

  if (coupon.validTill && new Date(coupon.validTill) < new Date()) {
    return NextResponse.json({ valid: false, error: "Coupon has expired" });
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return NextResponse.json({ valid: false, error: "Coupon usage limit reached" });
  }

  const discountAmount =
    coupon.type === "percent"
      ? Math.floor((baseAmount * coupon.value) / 100)
      : Math.min(coupon.value * 100, baseAmount - 100); // fixed ₹ → paise, min ₹1 final

  const finalAmount = Math.max(100, baseAmount - discountAmount);

  return NextResponse.json({
    valid: true,
    couponId: snap.docs[0].id,
    type: coupon.type,
    value: coupon.value,
    discountAmount,
    finalAmount,
  });
}
