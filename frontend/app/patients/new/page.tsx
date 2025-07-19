import PatientCreateForm from "@/app/components/PatientCreateForm";

export const revalidate = 0;

export default function NewPatientPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4 font-sans">
      <PatientCreateForm />
    </main>
  );
}
