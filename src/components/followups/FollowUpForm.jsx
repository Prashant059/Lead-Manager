import React, { useEffect, useState } from "react";
import { load, uid } from "../../utils/storage";

export default function FollowUpForm({ onAdd, onUpdate, editing, onCancelEdit }) {
  const leads = load("leads", []);
  const emptyForm = { leadId: leads[0]?.id || "", date: "", notes: "", status: "Pending" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editing) setForm(editing);
    else setForm(emptyForm);
  }, [editing, leads.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.leadId) return alert("Please select a lead.");

    if (editing) onUpdate && onUpdate(form);
    else {
      const newFollowup = { ...form, id: uid(), createdAt: new Date().toISOString() };
      onAdd && onAdd(newFollowup);
    }

    setForm(emptyForm);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow">
      <h3 className="font-semibold mb-4">{editing ? "Edit Follow-up" : "Add Follow-up"}</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Lead</label>
          <select
            value={form.leadId}
            onChange={(e) => setForm({ ...form, leadId: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Lead</option>
            {leads.map((l) => <option key={l.id} value={l.id}>{l.name} ({l.email})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Follow-up Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option>Pending</option>
            <option>Done</option>
            <option>Reschedule</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm text-gray-600 mb-1">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Write follow-up notes here..."
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>

      <div className="mt-4 flex gap-2">
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition">
          {editing ? "Update Follow-up" : "Add Follow-up"}
        </button>
        {editing && (
          <button type="button" onClick={onCancelEdit} className="px-4 py-2 border rounded hover:bg-gray-100 transition">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
