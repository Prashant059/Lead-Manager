import React from "react";

export default function LeadTable({ leads = [], onEdit, onDelete }) {
  return (
    <div className="bg-white p-6 rounded-md shadow">
      <h3 className="font-semibold mb-4">Lead List ({leads.length})</h3>
      <div className="overflow-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-500 border-b">
              <th className="p-2">#</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400">No leads yet</td>
              </tr>
            )}
            {leads.map((l, idx) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="p-2 text-sm">{idx + 1}</td>
                <td className="p-2">{l.name}</td>
                <td className="p-2 text-sm text-gray-600">{l.email}</td>
                <td className="p-2">{l.phone}</td>
                <td className="p-2">{l.status}</td>
                <td className="p-2">
                  <button onClick={() => onEdit(l)} className="text-indigo-600 mr-3">Edit</button>
                  <button onClick={() => onDelete(l.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
