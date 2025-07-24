"use server";

import { db } from "@/lib/prisma";
import { Get_Doctors } from "@/lib/types";


/**
 * Get doctors by specialty
 */
export async function getDoctorsBySpecialty(specialty:string):Promise<{doctors:Get_Doctors[]}> {
  try {
    const doctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
        specialty: specialty.split("%20").join(" "),
      },
      orderBy: {
        name: "asc",
      },
    });

    return { doctors };
  } catch (error) {
    console.error("Failed to fetch doctors by specialty:", error);
    throw new Error("Failed to fetch doctors");
  }
}