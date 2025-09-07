import React, { useEffect, useState, useRef } from "react";
import { uid, load, save } from "../../utils/storage";

export default function LeadForm({ onAdd, onUpdate, editing, onCancelEdit }) {
  const initialForm = { name: "", email: "", phone: "", status: "New", notes: "" };
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        email: editing.email || "",
        phone: editing.phone || "",
        status: editing.status || "New",
        notes: editing.notes || "",
        id: editing.id,
        createdAt: editing.createdAt,
      });
      nameRef.current?.focus();
    } else {
      setForm(initialForm);
      nameRef.current?.focus();
    }
  }, [editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";

    const leads = load("leads", []);
    const emailLower = form.email.trim().toLowerCase();
    if (emailLower) {
      const exists = leads.some(
        (l) => l.email?.toLowerCase() === emailLower && (!editing || l.id !== editing.id)
      );
      if (exists) e.email = "A lead with this email already exists";
    }

    if (form.phone) {
      const digits = form.phone.replace(/\D/g, "");
      if (digits.length < 7 || digits.length > 15) e.phone = "Phone should be 7–15 digits";
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length) {
      setIsSubmitting(false);
      return;
    }

    const payloadBase = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      status: form.status,
      notes: form.notes.trim(),
    };

    let leads = load("leads", []);

    if (editing && form.id) {
      const payload = { ...payloadBase, id: form.id, createdAt: form.createdAt || new Date().toISOString() };
      leads = leads.map(l => l.id === form.id ? payload : l);
      onUpdate && onUpdate(payload);
    } else {
      const newLead = { ...payloadBase, id: uid(), createdAt: new Date().toISOString() };
      leads.push(newLead);
      onAdd && onAdd(newLead);
    }

    save("leads", leads);

    setForm(initialForm);
    setErrors({});
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow" id="lead-form">
      <h3 className="font-semibold mb-4">{editing ? "Edit Lead" : "Add Lead"}</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <input
            ref={nameRef}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border rounded px-3 py-2 mt-1"
            autoComplete="name"
          />
          {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded px-3 py-2 mt-1"
            autoComplete="email"
          />
          {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border rounded px-3 py-2 mt-1"
          />
          {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
          >
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Lost</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm text-gray-600">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="w-full border rounded px-3 py-2 mt-1"
          rows={3}
        />
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded text-white ${isSubmitting ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {editing ? "Update Lead" : "Add Lead"}
        </button>

        {editing && (
          <button type="button" onClick={onCancelEdit} className="px-4 py-2 border rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
