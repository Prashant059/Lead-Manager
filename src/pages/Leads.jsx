import React, { useReducer, useState, useRef } from "react";
import LeadForm from "../components/leads/LeadForm";
import LeadTable from "../components/leads/LeadTable";
import { load, save } from "../utils/storage";

const initial = { leads: load("leads", []) };

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const updated = [action.payload, ...state.leads];
      save("leads", updated);
      return { ...state, leads: updated };
    }
    case "UPDATE": {
      const updated = state.leads.map((l) =>
        l.id === action.payload.id ? action.payload : l
      );
      save("leads", updated);
      return { ...state, leads: updated };
    }
    case "DELETE": {
      const updated = state.leads.filter((l) => l.id !== action.payload);
      save("leads", updated);
      return { ...state, leads: updated };
    }
    case "SET":
      return { ...state, leads: action.payload };
    default:
      return state;
  }
}

export default function Leads() {
  const [state, dispatch] = useReducer(reducer, initial);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const formRef = useRef(null);

  // listen for global search events
  React.useEffect(() => {
    const handler = (e) => {
      const q =
        e?.detail?.query ??
        (window.leadSearchDetail && window.leadSearchDetail.query) ??
        "";
      setQuery(q || "");
    };
    window.addEventListener("leadSearch", handler);
    return () => window.removeEventListener("leadSearch", handler);
  }, []);

  // listen for openAddLead event
  React.useEffect(() => {
    const handler = () => {
      setEditing(null);
      try {
        window.dispatchEvent(new CustomEvent("focusLeadForm"));
      } catch {
        window.dispatchEvent(new Event("focusLeadForm"));
      }
    };
    window.addEventListener("openAddLead", handler);
    return () => window.removeEventListener("openAddLead", handler);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Leads</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or email"
          className="border rounded px-3 py-1"
        />
      </div>

      <div ref={formRef}>
        <LeadForm
          onAdd={(lead) => dispatch({ type: "ADD", payload: lead })}
          onUpdate={(lead) => {
            dispatch({ type: "UPDATE", payload: lead });
            setEditing(null);
          }}
          editing={editing}
          onCancelEdit={() => setEditing(null)}
        />
      </div>

      <LeadTable
        leads={state.leads.filter(
          (l) =>
            !query ||
            l.name.toLowerCase().includes(query.toLowerCase()) ||
            l.email.toLowerCase().includes(query.toLowerCase())
        )}
        onEdit={(lead) => setEditing(lead)}
        onDelete={(id) => dispatch({ type: "DELETE", payload: id })}
      />
    </div>
  );
}
