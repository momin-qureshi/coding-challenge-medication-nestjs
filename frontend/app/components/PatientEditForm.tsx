"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API = "http://localhost:8080";

interface PatientDto {
  id: number;
  name: string;
  dateOfBirth: string;
}

export default function PatientEditForm({ initial }: { initial: PatientDto }) {
  const [name, setName] = useState(initial.name);
  const [dob, setDob] = useState(initial.dateOfBirth.substring(0, 10)); // yyyy-mm-dd
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const todayIso = new Date().toISOString().substring(0, 10);
    if (dob > todayIso) {
      alert("Date of birth cannot be in the future");
      return;
    }
    setSaving(true);
    try {
      await fetch(`${API}/patients/${initial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dateOfBirth: dob }),
      });
      router.push("/patients");
    } catch (err) {
      console.error(err);
      alert("Failed to update patient");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow space-y-4"
    >
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Edit Patient
      </h1>

      <label className="block text-sm font-medium text-gray-700">
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      <label className="block text-sm font-medium text-gray-700">
        Date of Birth
        <input
          type="date"
          value={dob}
          max={new Date().toISOString().substring(0, 10)}
          onChange={(e) => setDob(e.target.value)}
          required
          className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
