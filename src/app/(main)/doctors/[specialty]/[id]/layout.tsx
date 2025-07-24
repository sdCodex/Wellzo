import { getDoctorById } from "@/actions/appointments";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { ReactNode } from "react";

export async function generateMetadata({ params }:{params:{id:string}}) {
  const { id } = await params;

  const { doctor } = await getDoctorById(id);
  return {
    title: `Dr. ${doctor.name} - Wellzo`,
    description: `Book an appointment with Dr. ${doctor.name}, ${doctor.specialty} specialist with ${doctor.experience} years of experience.`,
  };
}

export default async function DoctorProfileLayout({ children, params }:{children:ReactNode,params:{id:string}}) {
  const { id } = await params;
  const { doctor } = await getDoctorById(id);

  if (!doctor) redirect("/doctors");

  return (
    <div className="container mx-auto">
      <PageHeader
        title={"Dr. " + doctor.name}
        backLink={`/doctors/${doctor.specialty}`}
        backLabel={`Back to ${doctor.specialty}`}
      />

      {children}
    </div>
  );
}