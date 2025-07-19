"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = "http://localhost:8080";

interface MedicationDto {
  id: number;
  name: string;
  dosage?: string;
  frequency?: string;
}

export default function MedicationsPage() {
  const [meds, setMeds] = useState<MedicationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/medications`);
        const data = await res.json();
        setMeds(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleAdd() {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/medications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), dosage: dosage.trim(), frequency: frequency.trim() }),
      });
      if (res.ok) {
        const created = await res.json();
        setMeds((prev) => [...prev, created]);
        setAddOpen(false);
        setNewName("");
        setDosage("");
        setFrequency("");
      } else {
        alert("Failed to create");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (confirmId === null) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/medications/${confirmId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMeds((prev) => prev.filter((m) => m.id !== confirmId));
      } else {
        const body = await res.json();
        alert(body.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 font-sans">
      <section className="max-w-xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/patients"
              className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              ← Patients
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Medications</h1>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium shadow"
          >
            <span className="text-lg leading-none">+</span> Add Medication
          </button>
        </header>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200/60 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {meds.map((m) => (
              <li
                key={m.id}
                className="flex justify-between items-center rounded-full px-5 py-3 bg-gradient-to-r from-blue-50 to-purple-50 shadow hover:shadow-md transition"
              >
                <div>
                  <p className="font-medium text-gray-800">{m.name}</p>
                  {(m.dosage || m.frequency) && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {m.dosage && (
                        <span className="inline-block bg-white/70 text-gray-700 text-[10px] px-2 py-0.5 rounded-full ring-1 ring-gray-300">
                          {m.dosage}
                        </span>
                      )}
                      {m.frequency && (
                        <span className="inline-block bg-white/70 text-gray-700 text-[10px] px-2 py-0.5 rounded-full ring-1 ring-gray-300">
                          {m.frequency}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setConfirmId(m.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </li>
            ))}
            {!meds.length && <p className="text-gray-500">No medications.</p>}
          </ul>
        )}
      </section>

      {/* Add modal */}
      {addOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => (saving ? null : setAddOpen(false))}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-800">New Medication</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="Dosage (e.g. 500mg)"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="Frequency (e.g. 2x/day)"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setAddOpen(false)}
                disabled={saving}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={saving || !newName.trim()}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* delete confirm */}
      {confirmId !== null && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => (deleting ? null : setConfirmId(null))}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-800">Delete?</h3>
            <p className="text-sm text-gray-600">This cannot be undone.</p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmId(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
