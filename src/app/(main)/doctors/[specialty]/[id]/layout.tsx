import { ReactNode } from "react";
import { getDoctorById } from "@/actions/appointments";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";


export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  const { doctor } = await getDoctorById(id);

  return {
    title: `Dr. ${doctor.name} - Wellzo`,
    description: `Book an appointment with Dr. ${doctor.name}, ${doctor.specialty} specialist with ${doctor.experience} years of experience.`,
  };
}


type LayoutProps = {
  children: ReactNode;
  params: { id: string };
};

export default async function DoctorProfileLayout({ children, params }: LayoutProps) {
  const { id } = params;
  const { doctor } = await getDoctorById(id);

  if (!doctor) redirect("/doctors");

  return (
    <div className="container mx-auto">
      <PageHeader
        title={`Dr. ${doctor.name}`}
        backLink={`/doctors/${doctor.specialty}`}
        backLabel={`Back to ${doctor.specialty}`}
      />
      {children}
    </div>
  );
}
