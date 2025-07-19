"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API = "http://localhost:8080";

interface AssignmentDto {
  id: number;
  medication: { name: string };
  remainingDays: number;
}

interface PatientDto {
  id: number;
  name: string;
  dateOfBirth: string;
  assignments: AssignmentDto[];
}

const calcAge = (dobIso: string) => {
  const dob = new Date(dobIso);
  return Math.floor(
    (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [ages, setAges] = useState<number[]>([]);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/patients?includeAssignments=true`);
        const data = await res.json();
        setPatients(data);
        // compute ages client-side to avoid SSR mismatch
        setAges(data.map((p: PatientDto) => calcAge(p.dateOfBirth)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleDelete() {
    if (confirmId === null) return;
    setDeleting(true);
    try {
      await fetch(`${API}/patients/${confirmId}`, { method: "DELETE" });
      setPatients((prev) => prev.filter((pt) => pt.id !== confirmId));
    } catch (err) {
      console.error(err);
      // you could show a toast here
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  }

  const mainContent = (
    <main className="min-h-screen bg-gray-100 py-10 px-4 font-sans">
      <section className="max-w-7xl mx-auto">
        {/* Page header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-800">Patients</h1>
            <Link
              href="/medications"
              className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Manage Medications →
            </Link>
          <Link
            href="/patients/new"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="text-lg leading-none">+</span> Add Patient
          </Link>
                  </div>
        </header>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-md bg-gray-200/60"
              ></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow ring-1 ring-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left whitespace-nowrap">
                    DOB / Age
                  </th>
                  <th className="px-6 py-3 text-left">Active Treatments</th>
                  <th className="px-6 py-3 text-center w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.map((p, idx) => (
                  <tr
                    key={p.id}
                    className="cursor-pointer transition-colors hover:bg-gray-50 hover:shadow-inner"
                    onClick={() => router.push(`/patients/${p.id}`)}
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {p.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {p.dateOfBirth}{" "}
                      {ages[idx] !== undefined && `(${ages[idx]})`}
                    </td>
                    <td className="px-6 py-4">
                      {p.assignments.length ? (
                        <div className="flex flex-wrap gap-2">
                          {p.assignments.map((a) => (
                            <span
                              key={a.id}
                              className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs"
                            >
                              {a.medication.name}·{a.remainingDays}d
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td
                      className="px-6 py-4 text-center space-x-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        href={`/patients/${p.id}/edit`}
                        title="Edit"
                        className="hover:text-blue-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        ✏️
                      </Link>
                      <button
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmId(p.id);
                        }}
                        className="hover:text-red-600 cursor-pointer"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );

  return (
    <>
      {mainContent}
      {confirmId !== null && (
        // modal backdrop
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
          onClick={() => (deleting ? null : setConfirmId(null))}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600">
                🗑️
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Delete patient?
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmId(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
