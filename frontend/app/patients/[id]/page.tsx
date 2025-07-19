import ManageAssignments from "@/app/components/ManageAssignments";
import Link from "next/link";

const API = "http://localhost:8080";

interface Props {
  params: { id: string };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PatientDetailPage({ params }: Props) {
  const id = params.id;
  const res = await fetch(`${API}/patients/${id}?includeAssignments=true`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Failed to load patient</p>
      </main>
    );
  }

  const patient = await res.json();
  const age = Math.floor(
    (Date.now() - new Date(patient.dateOfBirth).getTime()) /
      (1000 * 60 * 60 * 24 * 365.25)
  );

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/patients"
          className="inline-flex items-center gap-1 mb-4 text-sm font-medium px-3 py-1.5 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          ← Back to Patients
        </Link>
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {patient.name}
          </h1>
          <p className="text-gray-700">
            DOB: {patient.dateOfBirth} ({age})
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <ManageAssignments
            patientId={patient.id}
            initialAssignments={patient.assignments || []}
          />
        </div>
      </div>
    </main>
  );
}
