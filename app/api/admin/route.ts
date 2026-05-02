import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../lib/firebaseAdmin";

const ADMIN_UID = process.env.ADMIN_UID;

async function verifyAdmin(req: Request): Promise<string | null> {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    if (!ADMIN_UID || decoded.uid !== ADMIN_UID) return null;
    return decoded.uid;
  } catch { return null; }
}

const PLAN_MRR: Record<string, number> = {
  monthly: 299,
  quarterly: 199,
  annual: 149,
};

export async function GET(req: Request) {
  const uid = await verifyAdmin(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "stats") {
    const [usersSnap, reportsSnap] = await Promise.all([
      adminDb.collection("users").orderBy("createdAt", "desc").get(),
      adminDb.collection("reports").get(),
    ]);

    const now = new Date();
    const users = usersSnap.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        uid: d.uid || "",
        email: d.email || "",
        plan: d.plan || "free",
        proPlan: d.proPlan || "",
        proSince: d.proSince || "",
        proExpiry: d.proExpiry || "",
        scansUsed: d.scansUsed || 0,
        createdAt: d.createdAt?.toDate?.()?.toISOString() || "",
      };
    });

    const activeProUsers = users.filter(u =>
      u.plan === "pro" && (!u.proExpiry || new Date(u.proExpiry) > now)
    );

    const planBreakdown = { monthly: 0, quarterly: 0, annual: 0 };
    let mrr = 0;
    activeProUsers.forEach(u => {
      const p = (u.proPlan || "monthly") as keyof typeof planBreakdown;
      if (p in planBreakdown) planBreakdown[p]++;
      mrr += PLAN_MRR[p] || 299;
    });

    // reports per user
    const reportCounts: Record<string, number> = {};
    reportsSnap.docs.forEach(doc => {
      const uid = doc.data().uid;
      if (uid) reportCounts[uid] = (reportCounts[uid] || 0) + 1;
    });

    // attach report counts to users
    const usersWithReports = users.map(u => ({
      ...u,
      reportCount: reportCounts[u.uid] || 0,
    }));

    // this month signups
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const newThisMonth = users.filter(u => u.createdAt?.startsWith(thisMonth)).length;

    return NextResponse.json({
      totalUsers: users.length,
      proUsers: activeProUsers.length,
      freeUsers: users.length - activeProUsers.length,
      totalReports: reportsSnap.size,
      mrr,
      planBreakdown,
      newThisMonth,
      users: usersWithReports,
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function POST(req: Request) {
  const uid = await verifyAdmin(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { action, targetUid } = body;

  const snap = await adminDb.collection("users").where("uid", "==", targetUid).limit(1).get();
  if (snap.empty) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (action === "grant_pro") {
    const plan = (body.plan as string) || "monthly";
    const expiry = new Date();
    if (plan === "annual") expiry.setFullYear(expiry.getFullYear() + 1);
    else if (plan === "quarterly") expiry.setMonth(expiry.getMonth() + 3);
    else expiry.setMonth(expiry.getMonth() + 1);
    await snap.docs[0].ref.update({
      plan: "pro",
      proPlan: plan,
      proSince: new Date().toISOString(),
      proExpiry: expiry.toISOString(),
    });
    return NextResponse.json({ success: true });
  }

  if (action === "revoke_pro") {
    await snap.docs[0].ref.update({
      plan: "free",
      proPlan: "",
      proExpiry: "",
      proSince: "",
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
