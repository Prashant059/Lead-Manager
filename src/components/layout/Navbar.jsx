import React, { useState } from "react";

/**
 * Navbar emits global CustomEvents:
 *  - 'leadSearch' with detail { query }
 *  - 'openAddLead' when Add Lead clicked
 */
export default function Navbar() {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    try {
      window.dispatchEvent(new CustomEvent("leadSearch", { detail: { query: value } }));
    } catch {
      // fallback for older browsers
      const ev = new Event("leadSearch");
      window.leadSearchDetail = { query: value };
      window.dispatchEvent(ev);
    }
  };

  const handleAdd = () => {
    try {
      window.dispatchEvent(new CustomEvent("openAddLead"));
    } catch {
      const ev = new Event("openAddLead");
      window.dispatchEvent(ev);
    }
  };

  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 rounded bg-gray-100">☰</button>
        <div className="text-lg font-semibold">Dashboard</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          P
        </div>
      </div>
    </header>
  );
}
