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
  createdAt: string;
  reportCount: number;
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
          const data = await loadStats(token);
          setStats(data);
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
    setActionLoading(targetUid + "_grant");
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "grant_pro", targetUid }),
      });
      if (res.ok) { showToast("✅ Pro granted (1 year)"); setStats(await loadStats(token)); }
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

        .stat-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 24px; }
        .stat-card { background: #fff; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 18px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
        .stat-label { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
        .stat-value { font-size: 26px; font-weight: 800; color: #111827; line-height: 1; }
        .stat-sub { font-size: 11px; color: #9ca3af; margin-top: 4px; }

        .section-card { background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 1px 6px rgba(0,0,0,0.05); overflow: hidden; margin-bottom: 24px; }
        .section-header { padding: 16px 20px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        .section-title { font-size: 15px; font-weight: 700; color: #111827; }

        .search-input { padding: 7px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 13px; outline: none; width: 220px; }
        .filter-btns { display: flex; gap: 6px; }
        .filter-btn { padding: 5px 12px; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280; transition: all 0.15s; }
        .filter-btn.active { border-color: #059669; background: #f0fdf4; color: #059669; }

        table { width: 100%; border-collapse: collapse; }
        th { padding: 10px 14px; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; text-align: left; background: #f9fafb; border-bottom: 1px solid #f3f4f6; }
        td { padding: 12px 14px; font-size: 13px; color: #374151; border-bottom: 1px solid #f9fafb; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #fafafa; }

        .badge { display: inline-block; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .action-btn { padding: 5px 11px; border-radius: 7px; font-size: 11px; font-weight: 700; cursor: pointer; border: none; transition: opacity 0.15s; }
        .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-grant { background: #059669; color: #fff; }
        .btn-revoke { background: #fee2e2; color: #dc2626; }

        .toast { position: fixed; top: 16px; left: 50%; transform: translateX(-50%); z-index: 999; padding: 10px 22px; border-radius: 12px; font-size: 13px; font-weight: 600; background: #fff; border: 1.5px solid #059669; color: #059669; box-shadow: 0 4px 20px rgba(5,150,105,0.15); white-space: nowrap; }

        @media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 600px) { .stat-grid { grid-template-columns: repeat(2,1fr); } }
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0" }}>
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

          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Scans Used</th>
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
                      <td>{u.reportCount}</td>
                      <td style={{ color: "#9ca3af" }}>{fmt(u.createdAt)}</td>
                      <td style={{ color: expired ? "#dc2626" : "#9ca3af" }}>
                        {u.plan === "pro" ? fmt(u.proExpiry) : "—"}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {u.plan !== "pro" || expired ? (
                            <button
                              className="action-btn btn-grant"
                              disabled={actionLoading === u.uid + "_grant"}
                              onClick={() => grantPro(u.uid)}
                            >
                              {actionLoading === u.uid + "_grant" ? "..." : "Grant Pro"}
                            </button>
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
        </div>

      </div>
    </>
  );
}
