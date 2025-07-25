import { redirect } from "next/navigation";
import { getDoctorsBySpecialty } from "@/actions/doctors-listings";
import { DoctorCard } from "../_components/doctor-card";
import { PageHeader } from "@/components/page-header";


export default async function DoctorSpecialtyPage({ params }:{params:{specialty:string}}) {
  const { specialty } =  await params;

  // Redirect to main doctors page if no specialty is provided
  if (!specialty) {
    redirect("/doctors");
  }

  // Fetch doctors by specialty
  const {doctors}= await getDoctorsBySpecialty(specialty);


  

  return (
    <div className="space-y-5">
      <PageHeader
        title={specialty.split("%20").join(" ")}
        backLink="/doctors"
        backLabel="All Specialties"
      />

      {doctors && doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">
            No doctors available
          </h3>
          <p className="text-muted-foreground">
            There are currently no verified doctors in this specialty. Please
            check back later or choose another specialty.
          </p>
        </div>
      )}
    </div>
  );
}