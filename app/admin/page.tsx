"use client";

import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

interface UserRow {
  id: string;
  uid: string;
  email: string;
  plan: string;
  proPlan: string;
  proSince: string;
  proExpiry: string;
  scansUsed: number;
  jdAnalysesUsed: number;
  referralCode: string;
  referralCount: number;
  referralConverted: number;
  dripSent: Record<string, boolean>;
  createdAt: string;
  reportCount: number;
}

interface Coupon {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  validTill: string | null;
  usageLimit: number;
  usedCount: number;
  active: boolean;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  proUsers: number;
  freeUsers: number;
  totalReports: number;
  mrr: number;
  planBreakdown: { monthly: number; quarterly: number; annual: number };
  newThisMonth: number;
  users: UserRow[];
}

function fmt(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function isExpired(iso: string) {
  if (!iso) return false;
  return new Date(iso) < new Date();
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pro" | "free">("all");
  const [actionLoading, setActionLoading] = useState("");
  const [toast, setToast] = useState("");
  const [grantPlan, setGrantPlan] = useState<Record<string, string>>({});
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponLoading, setCouponLoading] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: "", type: "percent", value: "", validTill: "", usageLimit: "" });

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  async function loadStats(token: string) {
    const res = await fetch("/api/admin?action=stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Access denied");
    return res.json();
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const token = await u.getIdToken();
          const [data] = await Promise.all([loadStats(token)]);
          setStats(data);
          const cRes = await fetch("/api/admin?action=coupons", { headers: { Authorization: `Bearer ${token}` } });
          if (cRes.ok) { const cd = await cRes.json(); setCoupons(cd.coupons || []); }
        } catch (e: any) {
          setError(e.message || "Access denied. Admin only.");
        }
      } else {
        setError("Not logged in.");
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function grantPro(targetUid: string) {
    const plan = grantPlan[targetUid] || "monthly";
    setActionLoading(targetUid + "_grant");
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "grant_pro", targetUid, plan }),
      });
      const label = plan === "annual" ? "Annual" : plan === "quarterly" ? "Quarterly" : "Monthly";
      if (res.ok) { showToast(`✅ Pro ${label} granted`); setStats(await loadStats(token)); }
      else showToast("❌ Failed");
    } catch { showToast("❌ Error"); }
    setActionLoading("");
  }

  async function revokePro(targetUid: string) {
    if (!confirm("Revoke Pro for this user?")) return;
    setActionLoading(targetUid + "_revoke");
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "revoke_pro", targetUid }),
      });
      if (res.ok) { showToast("✅ Pro revoked"); setStats(await loadStats(token)); }
      else showToast("❌ Failed");
    } catch { showToast("❌ Error"); }
    setActionLoading("");
  }

  async function loadCoupons() {
    if (!user) return;
    const token = await user.getIdToken();
    const res = await fetch("/api/admin?action=coupons", { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) { const d = await res.json(); setCoupons(d.coupons || []); }
  }

  async function createCoupon() {
    if (!newCoupon.code || !newCoupon.value) { showToast("Fill code and value"); return; }
    setCouponLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "create_coupon", ...newCoupon }),
      });
      const d = await res.json();
      if (res.ok) { showToast("✅ Coupon created"); setNewCoupon({ code: "", type: "percent", value: "", validTill: "", usageLimit: "" }); await loadCoupons(); }
      else showToast("❌ " + (d.error || "Failed"));
    } catch { showToast("❌ Error"); }
    setCouponLoading(false);
  }

  async function deleteCoupon(id: string, code: string) {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    const token = await user.getIdToken();
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "delete_coupon", couponId: id }),
    });
    if (res.ok) { showToast("✅ Deleted"); await loadCoupons(); }
    else showToast("❌ Failed");
  }

  async function toggleCoupon(id: string, active: boolean) {
    const token = await user.getIdToken();
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "toggle_coupon", couponId: id, active }),
    });
    await loadCoupons();
  }

  const filtered = (stats?.users || []).filter(u => {
    const matchSearch = !search || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.plan === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Inter,sans-serif", background: "#f0fdf4" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚙️</div>
        <p style={{ color: "#059669", fontWeight: 600 }}>Loading Admin Dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Inter,sans-serif", background: "#fef2f2" }}>
      <div style={{ textAlign: "center", padding: "40px", background: "#fff", borderRadius: "16px", border: "1px solid #fca5a5" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔒</div>
        <p style={{ color: "#dc2626", fontWeight: 700, fontSize: "18px", margin: "0 0 8px" }}>Access Denied</p>
        <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 20px" }}>{error}</p>
        <a href="/" style={{ padding: "10px 24px", background: "#059669", color: "#fff", borderRadius: "9px", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>← Back to App</a>
      </div>
    </div>
  );

  if (!stats) return null;

  const planColor = (plan: string, proPlan: string) => {
    if (plan !== "pro") return { bg: "#f3f4f6", color: "#6b7280", label: "Free" };
    if (proPlan === "annual") return { bg: "#fff7ed", color: "#f97316", label: "Pro Annual" };
    if (proPlan === "quarterly") return { bg: "#ecfeff", color: "#06b6d4", label: "Pro Quarterly" };
    return { bg: "#f0fdf4", color: "#059669", label: "Pro Monthly" };
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', -apple-system, sans-serif; background: #f8fafc; }
        .admin-wrap { max-width: 1200px; margin: 0 auto; padding: 20px 16px; }

        /* Header */
        .admin-header { background: #fff; borderBottom: 1px solid #e5e7eb; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; gap: 8px; flex-wrap: wrap; }
        .admin-header-email { font-size: 13px; color: #6b7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 160px; }

        /* Stats */
        .stat-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 24px; }
        .stat-card { background: #fff; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 18px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
        .stat-label { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
        .stat-value { font-size: 26px; font-weight: 800; color: #111827; line-height: 1; }
        .stat-sub { font-size: 11px; color: #9ca3af; margin-top: 4px; }

        /* Cards */
        .section-card { background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 1px 6px rgba(0,0,0,0.05); overflow: hidden; margin-bottom: 24px; }
        .section-header { padding: 14px 16px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        .section-title { font-size: 15px; font-weight: 700; color: #111827; }

        /* Search & filter */
        .search-input { padding: 7px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 13px; outline: none; width: 100%; }
        .filter-btns { display: flex; gap: 6px; flex-wrap: wrap; }
        .filter-btn { padding: 5px 12px; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280; transition: all 0.15s; }
        .filter-btn.active { border-color: #059669; background: #f0fdf4; color: #059669; }

        /* Table — desktop */
        .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        table { width: 100%; border-collapse: collapse; min-width: 640px; }
        th { padding: 10px 12px; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; text-align: left; background: #f9fafb; border-bottom: 1px solid #f3f4f6; white-space: nowrap; }
        td { padding: 11px 12px; font-size: 13px; color: #374151; border-bottom: 1px solid #f9fafb; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #fafafa; }

        /* User card — mobile only */
        .user-card { display: none; padding: 14px 16px; border-bottom: 1px solid #f3f4f6; }
        .user-card:last-child { border-bottom: none; }
        .user-card-email { font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 6px; word-break: break-all; }
        .user-card-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-size: 12px; color: #6b7280; }
        .user-card-actions { display: flex; gap: 8px; margin-top: 10px; align-items: center; }

        .badge { display: inline-block; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .action-btn { padding: 6px 14px; border-radius: 7px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; transition: opacity 0.15s; }
        .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-grant { background: #059669; color: #fff; }
        .btn-revoke { background: #fee2e2; color: #dc2626; }

        .toast { position: fixed; top: 16px; left: 50%; transform: translateX(-50%); z-index: 999; padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 600; background: #fff; border: 1.5px solid #059669; color: #059669; box-shadow: 0 4px 20px rgba(5,150,105,0.15); white-space: nowrap; max-width: 90vw; text-align: center; }

        /* Plan breakdown mobile */
        .plan-grid { display: grid; grid-template-columns: repeat(3, 1fr); }

        @media (max-width: 900px) {
          .stat-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 600px) {
          .admin-wrap { padding: 12px 12px; }
          .stat-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 16px; }
          .stat-card { padding: 12px 14px; border-radius: 12px; }
          .stat-value { font-size: 22px; }
          .plan-grid { grid-template-columns: 1fr; }
          .plan-grid > div { border-right: none !important; border-bottom: 1px solid #f3f4f6; }
          .plan-grid > div:last-child { border-bottom: none; }
          .section-header { flex-direction: column; align-items: flex-start; }
          .search-input { width: 100%; }
          .desktop-table { display: none; }
          .user-card { display: block; }
          .admin-header-email { display: none; }
        }
      `}</style>

      {toast && <div className="toast">{toast}</div>}

      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>⚙️</span>
          <span style={{ fontSize: "16px", fontWeight: 800, color: "#111827" }}>Admin Dashboard</span>
          <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", background: "#fee2e2", color: "#dc2626", fontWeight: 700 }}>PRIVATE</span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: "#6b7280" }}>{user?.email}</span>
          <a href="/" style={{ padding: "7px 14px", borderRadius: "8px", background: "#f0fdf4", color: "#059669", fontSize: "13px", fontWeight: 600, textDecoration: "none", border: "1px solid #bbf7d0" }}>← App</a>
        </div>
      </div>

      <div className="admin-wrap">

        {/* Stats */}
        <div className="stat-grid" style={{ marginTop: "20px" }}>
          <div className="stat-card">
            <div className="stat-label">👥 Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-sub">+{stats.newThisMonth} this month</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">⭐ Pro Users</div>
            <div className="stat-value" style={{ color: "#059669" }}>{stats.proUsers}</div>
            <div className="stat-sub">{stats.totalUsers ? Math.round(stats.proUsers / stats.totalUsers * 100) : 0}% conversion</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">🆓 Free Users</div>
            <div className="stat-value" style={{ color: "#6b7280" }}>{stats.freeUsers}</div>
            <div className="stat-sub">potential upgrades</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">📊 Analyses</div>
            <div className="stat-value">{stats.totalReports}</div>
            <div className="stat-sub">total ATS scans</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">💰 Est. MRR</div>
            <div className="stat-value" style={{ color: "#f97316" }}>₹{stats.mrr.toLocaleString("en-IN")}</div>
            <div className="stat-sub">per month</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">📅 Est. ARR</div>
            <div className="stat-value" style={{ color: "#7c3aed" }}>₹{(stats.mrr * 12).toLocaleString("en-IN")}</div>
            <div className="stat-sub">annualised</div>
          </div>
        </div>

        {/* Plan breakdown */}
        <div className="section-card" style={{ marginBottom: "24px" }}>
          <div className="section-header">
            <span className="section-title">📦 Plan Breakdown</span>
          </div>
          <div className="plan-grid" style={{ gap: "0" }}>
            {[
              { label: "Monthly", key: "monthly", color: "#059669", bg: "#f0fdf4", price: "₹299/mo" },
              { label: "Quarterly", key: "quarterly", color: "#06b6d4", bg: "#ecfeff", price: "₹597/qtr" },
              { label: "Annual", key: "annual", color: "#f97316", bg: "#fff7ed", price: "₹1788/yr" },
            ].map((p, i) => (
              <div key={p.key} style={{ padding: "20px 24px", borderRight: i < 2 ? "1px solid #f3f4f6" : "none", background: p.bg }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: p.color, marginBottom: "8px" }}>{p.label} · {p.price}</div>
                <div style={{ fontSize: "32px", fontWeight: 800, color: "#111827" }}>{stats.planBreakdown[p.key as keyof typeof stats.planBreakdown]}</div>
                <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                  ₹{(stats.planBreakdown[p.key as keyof typeof stats.planBreakdown] * (p.key === "monthly" ? 299 : p.key === "quarterly" ? 199 : 149)).toLocaleString("en-IN")}/mo revenue
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Drip Funnel */}
        {(() => {
          const allUsers = stats.users;
          const total = allUsers.length;
          const steps = [
            { key: "d2", label: "Day 2", desc: "Tips for free plan", color: "#059669" },
            { key: "d5", label: "Day 5", desc: "ATS rejection nudge", color: "#06b6d4" },
            { key: "d8", label: "Day 8", desc: "Upgrade nudge", color: "#f97316" },
            { key: "d15", label: "Day 15", desc: "Final conversion", color: "#7c3aed" },
          ];
          return (
            <div className="section-card" style={{ marginBottom: "24px" }}>
              <div className="section-header">
                <span className="section-title">📧 Email Drip Funnel</span>
                <span style={{ fontSize: "11px", color: "#9ca3af" }}>Runs daily at 8:00 AM IST</span>
              </div>
              <div style={{ padding: "20px 24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                  {steps.map(s => {
                    const sent = allUsers.filter(u => u.dripSent?.[s.key]).length;
                    const pct = total ? Math.round(sent / total * 100) : 0;
                    return (
                      <div key={s.key} style={{ background: "#f9fafb", borderRadius: "10px", padding: "14px", border: `1px solid ${s.color}22` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: s.color }}>{s.label}</span>
                          <span style={{ fontSize: "10px", color: "#9ca3af" }}>{pct}%</span>
                        </div>
                        <div style={{ fontSize: "24px", fontWeight: 800, color: "#111827", lineHeight: 1, marginBottom: "4px" }}>{sent}<span style={{ fontSize: "13px", fontWeight: 500, color: "#9ca3af" }}>/{total}</span></div>
                        <div style={{ fontSize: "10px", color: "#6b7280", marginBottom: "8px" }}>{s.desc}</div>
                        <div style={{ background: "#e5e7eb", borderRadius: "4px", height: "5px", overflow: "hidden" }}>
                          <div style={{ background: s.color, height: "100%", width: `${pct}%`, borderRadius: "4px", transition: "width 0.4s" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>
                  Welcome email sent on signup · Day 8 &amp; 15 skipped for Pro users · Each email sent exactly once per user
                </p>
              </div>
            </div>
          );
        })()}

        {/* Users table */}
        <div className="section-card">
          <div className="section-header">
            <span className="section-title">👤 All Users ({filtered.length})</span>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <div className="filter-btns">
                {(["all", "pro", "free"] as const).map(f => (
                  <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                    {f === "all" ? "All" : f === "pro" ? "⭐ Pro" : "🆓 Free"}
                  </button>
                ))}
              </div>
              <input
                className="search-input"
                placeholder="Search by email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop table */}
          <div className="table-wrap desktop-table">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>ATS Scans</th>
                  <th>JD Analyses</th>
                  <th>Referrals</th>
                  <th>Drip</th>
                  <th>Reports</th>
                  <th>Joined</th>
                  <th>Pro Expiry</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: "center", color: "#9ca3af", padding: "32px" }}>No users found</td></tr>
                )}
                {filtered.map(u => {
                  const pc = planColor(u.plan, u.proPlan);
                  const expired = u.plan === "pro" && isExpired(u.proExpiry);
                  return (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 500 }}>{u.email || "—"}</td>
                      <td>
                        <span className="badge" style={{ background: expired ? "#fee2e2" : pc.bg, color: expired ? "#dc2626" : pc.color }}>
                          {expired ? "⚠ Expired" : pc.label}
                        </span>
                      </td>
                      <td>{u.scansUsed ?? 0}</td>
                      <td>{u.jdAnalysesUsed ?? 0}</td>
                      <td style={{ color: "#059669", fontWeight: 600 }}>{u.referralCount ?? 0} / {u.referralConverted ?? 0}</td>
                      <td>
                        <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                          {[
                            { k: "d2", label: "D2", color: "#059669" },
                            { k: "d5", label: "D5", color: "#06b6d4" },
                            { k: "d8", label: "D8", color: "#f97316" },
                            { k: "d15", label: "D15", color: "#7c3aed" },
                          ].map(s => (
                            <span key={s.k} style={{ fontSize: "9px", fontWeight: 700, padding: "2px 5px", borderRadius: "4px", background: u.dripSent?.[s.k] ? s.color : "#f3f4f6", color: u.dripSent?.[s.k] ? "#fff" : "#d1d5db" }}>
                              {s.label}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>{u.reportCount}</td>
                      <td style={{ color: "#9ca3af" }}>{fmt(u.createdAt)}</td>
                      <td style={{ color: expired ? "#dc2626" : "#9ca3af" }}>
                        {u.plan === "pro" ? fmt(u.proExpiry) : "—"}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          {u.plan !== "pro" || expired ? (
                            <>
                              <select
                                value={grantPlan[u.uid] || "monthly"}
                                onChange={e => setGrantPlan(prev => ({ ...prev, [u.uid]: e.target.value }))}
                                style={{ padding: "4px 6px", borderRadius: "6px", border: "1px solid #d1fae5", fontSize: "11px", color: "#059669", fontWeight: 600, cursor: "pointer", outline: "none" }}
                              >
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="annual">Annual</option>
                              </select>
                              <button
                                className="action-btn btn-grant"
                                disabled={actionLoading === u.uid + "_grant"}
                                onClick={() => grantPro(u.uid)}
                              >
                                {actionLoading === u.uid + "_grant" ? "..." : "Grant"}
                              </button>
                            </>
                          ) : (
                            <button
                              className="action-btn btn-revoke"
                              disabled={actionLoading === u.uid + "_revoke"}
                              onClick={() => revokePro(u.uid)}
                            >
                              {actionLoading === u.uid + "_revoke" ? "..." : "Revoke"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", color: "#9ca3af", padding: "32px", display: "none" }} className="user-card">No users found</div>
          )}
          {filtered.map(u => {
            const pc = planColor(u.plan, u.proPlan);
            const expired = u.plan === "pro" && isExpired(u.proExpiry);
            return (
              <div key={u.uid + "_card"} className="user-card">
                <div className="user-card-email">{u.email || "—"}</div>
                <div className="user-card-row">
                  <span className="badge" style={{ background: expired ? "#fee2e2" : pc.bg, color: expired ? "#dc2626" : pc.color }}>
                    {expired ? "⚠ Expired" : pc.label}
                  </span>
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>Joined: {fmt(u.createdAt)}</span>
                </div>
                <div className="user-card-row">
                  <span>ATS: <strong>{u.scansUsed ?? 0}</strong></span>
                  <span>JD: <strong>{u.jdAnalysesUsed ?? 0}</strong></span>
                  <span>Reports: <strong>{u.reportCount}</strong></span>
                </div>
                <div className="user-card-row">
                  <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 600 }}>DRIP:</span>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {[{ k:"d2",label:"D2",color:"#059669"},{k:"d5",label:"D5",color:"#06b6d4"},{k:"d8",label:"D8",color:"#f97316"},{k:"d15",label:"D15",color:"#7c3aed"}].map(s => (
                      <span key={s.k} style={{ fontSize: "9px", fontWeight: 700, padding: "2px 5px", borderRadius: "4px", background: u.dripSent?.[s.k] ? s.color : "#f3f4f6", color: u.dripSent?.[s.k] ? "#fff" : "#d1d5db" }}>{s.label}</span>
                    ))}
                  </div>
                </div>
                {u.plan === "pro" && (
                  <div className="user-card-row">
                    <span style={{ color: expired ? "#dc2626" : "#9ca3af", fontSize: "11px" }}>
                      {expired ? "⚠ Expired" : `Valid till: ${fmt(u.proExpiry)}`}
                    </span>
                  </div>
                )}
                <div className="user-card-actions">
                  {u.plan !== "pro" || expired ? (
                    <>
                      <select
                        value={grantPlan[u.uid] || "monthly"}
                        onChange={e => setGrantPlan(prev => ({ ...prev, [u.uid]: e.target.value }))}
                        style={{ padding: "5px 8px", borderRadius: "6px", border: "1px solid #d1fae5", fontSize: "12px", color: "#059669", fontWeight: 600, outline: "none", flex: 1 }}
                      >
                        <option value="monthly">Monthly ₹299</option>
                        <option value="quarterly">Quarterly ₹597</option>
                        <option value="annual">Annual ₹1788</option>
                      </select>
                      <button
                        className="action-btn btn-grant"
                        disabled={actionLoading === u.uid + "_grant"}
                        onClick={() => grantPro(u.uid)}
                      >
                        {actionLoading === u.uid + "_grant" ? "..." : "Grant"}
                      </button>
                    </>
                  ) : (
                    <button
                      className="action-btn btn-revoke"
                      disabled={actionLoading === u.uid + "_revoke"}
                      onClick={() => revokePro(u.uid)}
                    >
                      {actionLoading === u.uid + "_revoke" ? "..." : "Revoke Pro"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Coupon Management */}
      <div style={{ maxWidth: "960px", margin: "24px auto 0", padding: "0 16px 48px" }}>
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #d1fae5", padding: "24px" }}>
          <p style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: 700, color: "#111827" }}>🎟️ Coupon Management</p>

          {/* Create coupon form */}
          <div style={{ background: "#f0fdf4", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
            <p style={{ margin: "0 0 12px", fontSize: "13px", fontWeight: 600, color: "#059669" }}>Create New Coupon</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600 }}>CODE *</label>
                <input value={newCoupon.code} onChange={e => setNewCoupon(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. SAVE20" style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid #d1fae5", fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600 }}>TYPE *</label>
                <select value={newCoupon.type} onChange={e => setNewCoupon(p => ({ ...p, type: e.target.value }))}
                  style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid #d1fae5", fontSize: "13px", boxSizing: "border-box" }}>
                  <option value="percent">Percent (%)</option>
                  <option value="fixed">Fixed (₹)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600 }}>VALUE * {newCoupon.type === "percent" ? "(%)" : "(₹)"}</label>
                <input type="number" value={newCoupon.value} onChange={e => setNewCoupon(p => ({ ...p, value: e.target.value }))}
                  placeholder={newCoupon.type === "percent" ? "e.g. 20" : "e.g. 100"} style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid #d1fae5", fontSize: "13px", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600 }}>VALID TILL</label>
                <input type="date" value={newCoupon.validTill} onChange={e => setNewCoupon(p => ({ ...p, validTill: e.target.value }))}
                  style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid #d1fae5", fontSize: "13px", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600 }}>USAGE LIMIT (0=∞)</label>
                <input type="number" value={newCoupon.usageLimit} onChange={e => setNewCoupon(p => ({ ...p, usageLimit: e.target.value }))}
                  placeholder="0" style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid #d1fae5", fontSize: "13px", boxSizing: "border-box" }} />
              </div>
            </div>
            <button onClick={createCoupon} disabled={couponLoading}
              style={{ padding: "9px 20px", borderRadius: "8px", background: "#059669", color: "#fff", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
              {couponLoading ? "Creating..." : "+ Create Coupon"}
            </button>
          </div>

          {/* Coupon list */}
          {coupons.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>No coupons yet. Create one above.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f0fdf4" }}>
                    {["Code", "Type", "Value", "Used / Limit", "Valid Till", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#374151", fontSize: "11px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {coupons.map(c => {
                    const expired = c.validTill ? new Date(c.validTill) < new Date() : false;
                    const limitHit = c.usageLimit > 0 && c.usedCount >= c.usageLimit;
                    return (
                      <tr key={c.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "10px 12px", fontWeight: 700, letterSpacing: "0.05em", color: "#059669" }}>{c.code}</td>
                        <td style={{ padding: "10px 12px", color: "#6b7280" }}>{c.type === "percent" ? "%" : "₹"}</td>
                        <td style={{ padding: "10px 12px", fontWeight: 600 }}>{c.type === "percent" ? `${c.value}%` : `₹${c.value}`}</td>
                        <td style={{ padding: "10px 12px", color: limitHit ? "#dc2626" : "#374151" }}>{c.usedCount} / {c.usageLimit === 0 ? "∞" : c.usageLimit}</td>
                        <td style={{ padding: "10px 12px", color: expired ? "#dc2626" : "#6b7280", whiteSpace: "nowrap" }}>{c.validTill ? fmt(c.validTill) : "No expiry"}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ background: c.active && !expired && !limitHit ? "#d1fae5" : "#fee2e2", color: c.active && !expired && !limitHit ? "#059669" : "#dc2626", borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: 700 }}>
                            {!c.active ? "Inactive" : expired ? "Expired" : limitHit ? "Limit hit" : "Active"}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button onClick={() => toggleCoupon(c.id, !c.active)}
                              style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #d1fae5", background: "#fff", fontSize: "11px", fontWeight: 600, cursor: "pointer", color: c.active ? "#f97316" : "#059669" }}>
                              {c.active ? "Disable" : "Enable"}
                            </button>
                            <button onClick={() => deleteCoupon(c.id, c.code)}
                              style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #fca5a5", background: "#fff", fontSize: "11px", fontWeight: 600, cursor: "pointer", color: "#dc2626" }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </>
  );
}
