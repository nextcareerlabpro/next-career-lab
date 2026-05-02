import { NextResponse } from "next/server";

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
      const amount = PLAN_PRICES[plan];
      if (!amount) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

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
        return NextResponse.json({ success: true });
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
