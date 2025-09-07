import React, { useMemo, useState } from "react";
import { load } from "../../utils/storage";
import Modal from "../ui/Modal";

export default function FollowUpTable({ followups = [], onEdit, onDelete }) {
  const leads = load("leads", []) || [];
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [details, setDetails] = useState(null);
  const [showUpcoming, setShowUpcoming] = useState(true); // toggle for upcoming/all

  const getLead = (id) => leads.find((l) => l.id === id);

  const formatDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    if (isNaN(dt)) return "—";
    return dt.toLocaleDateString();
  };

  // filter upcoming 7 days follow-ups
  const upcomingFollowups = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return followups.filter((f) => {
      const d = new Date(f.date || f.createdAt);
      if (isNaN(d)) return false;
      const diffDays = Math.round((d - now) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    });
  }, [followups]);

  const dataToShow = showUpcoming ? upcomingFollowups : followups;

  const sorted = useMemo(() => {
    const arr = dataToShow.slice();
    arr.sort((a, b) => {
      if (sortBy === "status") {
        const A = (a.status || "").toLowerCase();
        const B = (b.status || "").toLowerCase();
        return sortDir === "asc" ? A.localeCompare(B) : B.localeCompare(A);
      } else {
        const da = new Date(a.date || a.createdAt || 0).getTime();
        const db = new Date(b.date || b.createdAt || 0).getTime();
        return sortDir === "asc" ? da - db : db - da;
      }
    });
    return arr;
  }, [dataToShow, sortBy, sortDir]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = (id) => {
    const ok = window.confirm("Are you sure you want to delete this follow-up?");
    if (!ok) return;
    onDelete && onDelete(id);
  };

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [pageSize, totalPages, page]);

  return (
    <div className="bg-white p-6 rounded-md shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Follow-up List ({total})</h3>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-500">View:</label>
          <select
            value={showUpcoming ? "upcoming" : "all"}
            onChange={(e) => setShowUpcoming(e.target.value === "upcoming")}
            className="border rounded px-2 py-1"
          >
            <option value="upcoming">Upcoming 7 days</option>
            <option value="all">All Follow-ups</option>
          </select>

          <label className="text-sm text-gray-500">Sort:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-2 py-1">
            <option value="date">Date</option>
            <option value="status">Status</option>
          </select>

          <button
            onClick={() => setSortDir((s) => (s === "asc" ? "desc" : "asc"))}
            className="border px-2 py-1 rounded"
            title="Toggle sort direction"
          >
            {sortDir === "asc" ? "Asc" : "Desc"}
          </button>

          <label className="text-sm text-gray-500">Show:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-500 border-b">
              <th className="p-2 w-12">#</th>
              <th className="p-2">Lead</th>
              <th className="p-2">Date</th>
              <th className="p-2">Notes</th>
              <th className="p-2">Status</th>
              <th className="p-2 w-40">Actions</th>
            </tr>
          </thead>

          <tbody>
            {current.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  No follow-ups yet
                </td>
              </tr>
            )}

            {current.map((f, idx) => {
              const lead = getLead(f.leadId);
              const noteShort = (f.notes || "").length > 80 ? (f.notes || "").slice(0, 80) + "…" : f.notes;
              return (
                <tr key={f.id} className="hover:bg-gray-50 align-top">
                  <td className="p-2 text-sm">{(page - 1) * pageSize + idx + 1}</td>
                  <td className="p-2">
                    <div className="font-medium">{lead ? lead.name : "—"}</div>
                    <div className="text-xs text-gray-500">{lead ? lead.email : ""}</div>
                  </td>
                  <td className="p-2">{formatDate(f.date || f.createdAt)}</td>
                  <td className="p-2">
                    <div className="text-sm text-gray-700">{noteShort || "—"}</div>
                    {(f.notes || "").length > 80 && (
                      <button onClick={() => setDetails(f)} className="text-xs text-indigo-600 hover:underline mt-1">
                        View
                      </button>
                    )}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        f.status === "Done"
                          ? "bg-green-100 text-green-700"
                          : f.status === "Reschedule"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {f.status || "—"}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-3">
                      <button onClick={() => onEdit && onEdit(f)} className="text-indigo-600 hover:underline text-sm">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(f.id)} className="text-red-600 hover:underline text-sm">
                        Delete
                      </button>
                      <button
                        onClick={() => setDetails(f)}
                        className="text-gray-600 hover:underline text-sm"
                        title="View details"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-gray-600">
          Showing {total === 0 ? 0 : (page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <div className="px-3">
            {page} / {totalPages}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* details modal */}
      <Modal open={!!details} title="Follow-up details" onClose={() => setDetails(null)}>
        {details && (
          <div>
            <div className="mb-2">
              <strong>Lead:</strong> {getLead(details.leadId)?.name || "Unknown"} <br />
              <small className="text-gray-500">{getLead(details.leadId)?.email || ""}</small>
            </div>
            <div className="mb-2">
              <strong>Date:</strong> {formatDate(details.date || details.createdAt)}
            </div>
            <div className="mb-2">
              <strong>Status:</strong> {details.status}
            </div>
            <div className="mt-3">
              <strong>Notes</strong>
              <p className="mt-1 whitespace-pre-line text-sm text-gray-700">{details.notes || "—"}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setDetails(null);
                  onEdit && onEdit(details);
                }}
                className="px-3 py-1 bg-indigo-600 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setDetails(null);
                  handleDelete(details.id);
                }}
                className="px-3 py-1 border rounded text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
