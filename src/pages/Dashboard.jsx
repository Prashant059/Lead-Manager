import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { load } from "../utils/storage";

export default function Dashboard({ leadsState = [], followupsState = [] }) {
  const navigate = useNavigate();
  const leads = leadsState.length ? leadsState : load("leads", []);
  const followups = followupsState.length ? followupsState : load("followups", []);

  const fmt = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString();
  };

  const total = leads.length;
  const statusCounts = leads.reduce((acc, l) => {
    const s = l.status || "Unknown";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const pendingFollowups = followups.filter(f => (f.status || "").toLowerCase() === "pending").length;

  const recentLeads = useMemo(() => {
    return leads.slice().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5);
  }, [leads]);

  const upcomingFollowups = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return followups
      .filter(f => {
        const dateStr = f.date || f.createdAt;
        if (!dateStr) return false;
        const d = new Date(dateStr);
        if (isNaN(d)) return false;
        const diffDays = Math.round((d - now) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
      })
      .sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt))
      .slice(0, 5);
  }, [followups]);

  const openAddLead = () => {
    try { window.dispatchEvent(new CustomEvent("openAddLead")); } 
    catch { window.dispatchEvent(new Event("openAddLead")); }
    navigate("/leads");
  };

  const goLeads = () => navigate("/leads");
  const goFollowups = () => navigate("/followups");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
          <button onClick={openAddLead} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
            + Add Lead
          </button>
          <button onClick={goLeads} className="px-3 py-2 border rounded">View Leads</button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded shadow">
          <div className="text-sm text-gray-500">Total Leads</div>
          <div className="text-2xl font-bold text-indigo-600">{total}</div>
        </div>
        <div className="bg-white p-5 rounded shadow">
          <div className="text-sm text-gray-500">Pending Follow-ups</div>
          <div className="text-2xl font-bold text-indigo-600">{pendingFollowups}</div>
        </div>
        <div className="bg-white p-5 rounded shadow">
          <div className="text-sm text-gray-500">Status Breakdown</div>
          <div className="mt-2 space-y-1">
            {Object.keys(statusCounts).length === 0 && <div className="text-sm text-gray-400">No leads yet</div>}
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <div>{status}</div>
                <div className="font-semibold">{count}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-5 rounded shadow">
          <div className="text-sm text-gray-500">Recent Activity</div>
          <div className="mt-2 text-sm text-gray-700">
            {recentLeads.length ? `${recentLeads[0].name} added` : "No recent activity"}
          </div>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white p-6 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Leads</h3>
            <button onClick={goLeads} className="text-sm text-indigo-600 hover:underline">View all</button>
          </div>
          {recentLeads.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No leads yet. Click “Add Lead” to create one.</div>
          ) : (
            <div className="space-y-3">
              {recentLeads.map(l => (
                <div key={l.id} className="flex items-center justify-between border rounded p-3">
                  <div>
                    <div className="font-medium">{l.name}</div>
                    <div className="text-sm text-gray-500">{l.email}</div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-gray-500">{fmt(l.createdAt)}</div>
                    <div className="text-xs mt-1 px-2 py-1 bg-gray-100 rounded">{l.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Follow-ups */}
        <div className="bg-white p-6 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upcoming Follow-ups (7 days)</h3>
            <button onClick={goFollowups} className="text-sm text-indigo-600 hover:underline">View all</button>
          </div>
          {upcomingFollowups.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No follow-ups in the next 7 days.</div>
          ) : (
            <div className="space-y-3">
              {upcomingFollowups.map(f => {
                const lead = leads.find(l => l.id === f.leadId);
                return (
                  <div key={f.id} className="flex items-center justify-between border rounded p-3">
                    <div>
                      <div className="font-medium">{lead ? lead.name : "Unknown Lead"}</div>
                      <div className="text-sm text-gray-500">{(lead && lead.email) || ""}</div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-gray-500">{fmt(f.date || f.createdAt)}</div>
                      <div className="text-xs mt-1 px-2 py-1 rounded bg-gray-100">{f.status}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
