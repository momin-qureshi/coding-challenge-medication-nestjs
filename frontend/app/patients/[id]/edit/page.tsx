import PatientEditForm from "@/app/components/PatientEditForm";

const API = "http://localhost:8080";

interface Props {
  params: { id: string };
}

export const revalidate = 0;

export default async function EditPatientPage({ params }: Props) {
  const res = await fetch(`${API}/patients/${params.id}`, {
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

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4 font-sans">
      <PatientEditForm initial={patient} />
    </main>
  );
}
