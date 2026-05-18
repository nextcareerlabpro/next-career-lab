import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

const PLAN_PRICES: Record<string, number> = {
  monthly: 29900,
  quarterly: 59700,
  annual: 178800,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "create_order") {
      const keyId = process.env.RAZORPAY_KEY_ID || "";
      const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

      const plan = body.plan as string;
      const baseAmount = PLAN_PRICES[plan];
      if (!baseAmount) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
      // Allow coupon-discounted amount from client (validated server-side via /api/coupon)
      const amount = body.amount && Number(body.amount) >= 100 ? Number(body.amount) : baseAmount;

      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(keyId + ":" + keySecret).toString("base64"),
        },
        body: JSON.stringify({
          amount,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          notes: { uid: body.uid || "", plan },
        }),
      });

      const order = await response.json();
      return NextResponse.json({ order });
    }

    if (action === "verify_payment") {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
      const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

      const sign = razorpay_order_id + "|" + razorpay_payment_id;

      const encoder = new TextEncoder();
      const keyData = encoder.encode(keySecret);
      const messageData = encoder.encode(sign);

      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
      const expectedSign = Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (expectedSign === razorpay_signature) {
        // Upgrade plan in Firestore server-side — never trust the client to do this
        const { uid, planType } = body;
        let proExpiry = "";
        if (uid && planType) {
          const now = new Date();
          const expiry = new Date(now);
          if (planType === "annual") expiry.setFullYear(expiry.getFullYear() + 1);
          else if (planType === "quarterly") expiry.setMonth(expiry.getMonth() + 3);
          else expiry.setMonth(expiry.getMonth() + 1);
          proExpiry = expiry.toISOString();

          const snap = await adminDb.collection("users").where("uid", "==", uid).limit(1).get();
          if (!snap.empty) {
            await snap.docs[0].ref.update({
              plan: "pro",
              proPlan: planType,
              proSince: now.toISOString(),
              proExpiry,
            });
          }
        }
        return NextResponse.json({ success: true, proExpiry, planType });
      } else {
        return NextResponse.json({ success: false });
      }
    }

    return NextResponse.json({ error: "Invalid action" });
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json({ error: "Request failed" });
  }
}
