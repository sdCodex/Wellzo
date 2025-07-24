
import { ReactNode } from "react";
import { getDoctorById } from "@/actions/appointments";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";

// Update the generateMetadata params type
export async function generateMetadata({ params }: { params: { specialty: string; id: string } }) {
  const { id } = params;
  const { doctor } = await getDoctorById(id);

  if (!doctor) return { title: "Doctor Not Found" }; // Handle case where doctor might not exist for metadata

  return {
    title: `Dr. ${doctor.name} - Wellzo`,
    description: `Book an appointment with Dr. ${doctor.name}, ${doctor.specialty} specialist with ${doctor.experience} years of experience.`,
  };
}


type LayoutProps = {
  children: ReactNode;
  params: {
    specialty: string; // <--- Add this
    id: string;
  };
};

export default async function DoctorProfileLayout({ children, params }: LayoutProps) {
  const { id, specialty } = params; // Destructure specialty as well, though you only use id here
  const { doctor } = await getDoctorById(id);

  if (!doctor) redirect("/doctors"); // Consider redirecting to /doctors/${specialty} for a better UX

  return (
    <div className="container mx-auto">
      <PageHeader
        title={`Dr. ${doctor.name}`}
        backLink={`/doctors/${doctor.specialty}`} // This correctly uses doctor.specialty
        backLabel={`Back to ${doctor.specialty}`}
      />
      {children}
    </div>
  );
}