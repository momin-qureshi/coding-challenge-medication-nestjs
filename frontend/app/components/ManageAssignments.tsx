"use client";
import { useState, useEffect } from "react";

const API = "http://localhost:8080";

interface MedicationDto {
  id: number;
  name: string;
  dosage?: string;
  frequency?: string;
}

interface AssignmentDto {
  id: number;
  medication: MedicationDto;
  remainingDays: number;
}

export default function ManageAssignments({
  patientId,
  initialAssignments,
}: {
  patientId: number;
  initialAssignments: AssignmentDto[];
}) {
  const [assignments, setAssignments] =
    useState<AssignmentDto[]>(initialAssignments);
  const [meds, setMeds] = useState<MedicationDto[]>([]);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState<number | "">("");
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // fetch medications list once
    fetch(`${API}/medications`)
      .then((r) => r.json())
      .then(setMeds)
      .catch(console.error);
  }, []);

  async function addAssignment() {
    if (!selectedMed || days <= 0) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          medicationId: selectedMed,
          startDate: new Date().toISOString(),
          totalDays: days,
        }),
      });
      if (res.ok) {
        const newAssign = await res.json();
        setAssignments((prev) => [...prev, newAssign]);
        setAddOpen(false);
        setSelectedMed("");
        setDays(7);
      } else {
        alert("Failed to add medication");
      }
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (confirmId === null) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/assignments/${confirmId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAssignments((prev) => prev.filter((a) => a.id !== confirmId));
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Active Treatments
        </h2>
        <button
          onClick={() => setAddOpen(true)}
          className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          + Add
        </button>
      </div>

      {assignments.length ? (
        <ul className="space-y-2">
          {assignments.map((a) => (
            <li
              key={a.id}
              className="flex justify-between items-center rounded-full px-5 py-3 bg-gradient-to-r from-green-50 to-teal-50 shadow hover:shadow-md transition"
            >
              <div className="flex flex-col">
                <p className="font-medium text-gray-800">{a.medication.name}</p>
                <div className="flex flex-wrap gap-2 mt-1 text-[10px]">
                  <span className="inline-block bg-white/70 text-gray-700 px-2 py-0.5 rounded-full ring-1 ring-gray-300">
                    {a.remainingDays}d left
                  </span>
                  {a.medication.dosage && (
                    <span className="inline-block bg-white/70 text-gray-700 px-2 py-0.5 rounded-full ring-1 ring-gray-300">
                      {a.medication.dosage}
                    </span>
                  )}
                  {a.medication.frequency && (
                    <span className="inline-block bg-white/70 text-gray-700 px-2 py-0.5 rounded-full ring-1 ring-gray-300">
                      {a.medication.frequency}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setConfirmId(a.id)}
                className="text-red-600 hover:text-red-800 cursor-pointer"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">None</p>
      )}

      {/* simple add modal */}
      {addOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Add Medication
            </h3>
            <label className="block text-sm font-medium text-gray-700">
              Medication
              <select
                value={selectedMed}
                onChange={(e) => setSelectedMed(Number(e.target.value))}
                className="mt-1 w-full border rounded-md px-3 py-2"
              >
                <option value="">Select...</option>
                {meds.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Duration (days)
              <input
                type="number"
                min={1}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setAddOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                disabled={loading || !selectedMed}
                onClick={addAssignment}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmId !== null && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => (deleting ? null : setConfirmId(null))}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Remove medication?
            </h3>
            <p className="text-sm text-gray-600">
              This will end the treatment immediately.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setConfirmId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
