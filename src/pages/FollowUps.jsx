import React, { useReducer, useState } from "react";
import FollowUpForm from "../components/followups/FollowUpForm";
import FollowUpTable from "../components/followups/FollowUpTable";
import { load, save } from "../utils/storage";

const initial = { followups: load("followups", []) };

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const added = [action.payload, ...state.followups];
      save("followups", added);
      return { ...state, followups: added };
    }
    case "UPDATE": {
      const updated = state.followups.map((f) =>
        f.id === action.payload.id ? action.payload : f
      );
      save("followups", updated);
      return { ...state, followups: updated };
    }
    case "DELETE": {
      const filtered = state.followups.filter((f) => f.id !== action.payload);
      save("followups", filtered);
      return { ...state, followups: filtered };
    }
    case "SET":
      return { ...state, followups: action.payload };
    default:
      return state;
  }
}

export default function FollowUps() {
  const [state, dispatch] = useReducer(reducer, initial);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Follow Ups</h2>
        <input
          placeholder="Search notes or lead"
          className="border rounded px-3 py-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <FollowUpForm
        onAdd={(f) => dispatch({ type: "ADD", payload: f })}
        onUpdate={(f) => {
          dispatch({ type: "UPDATE", payload: f });
          setEditing(null);
        }}
        editing={editing}
        onCancelEdit={() => setEditing(null)}
      />

      <FollowUpTable
        followups={state.followups.filter(
          (f) =>
            !query ||
            (f.notes || "").toLowerCase().includes(query.toLowerCase())
        )}
        onEdit={(f) => setEditing(f)}
        onDelete={(id) => dispatch({ type: "DELETE", payload: id })}
      />
    </div>
  );
}
