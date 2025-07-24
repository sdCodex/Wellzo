"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function setUserRole(
  formData: FormData
): Promise<{ success: true; redirect: string } | undefined> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found in database");

  const role = formData.get("role") as string | null;

  if (!role || !["PATIENT", "DOCTOR"].includes(role)) {
    throw new Error("Invalid role selection");
  }

  try {
    if (role === "PATIENT") {
      await db.user.update({
        where: { clerkUserId: userId },
        data: { role: "PATIENT" },
      });

      revalidatePath("/");
      return { success: true, redirect: "/doctors" };
    }

    if (role === "DOCTOR") {
      const specialty = formData.get("specialty") as string | null;
      const experienceRaw = formData.get("experience") as string | null;
      const credentialUrl = formData.get("credentialUrl") as string | null;
      const description = formData.get("description") as string | null;

      const experience = experienceRaw ? parseInt(experienceRaw, 10) : NaN;

      if (!specialty || isNaN(experience) || !credentialUrl || !description) {
        throw new Error("All fields are required");
      }

      await db.user.update({
        where: { clerkUserId: userId },
        data: {
          role: "DOCTOR",
          specialty,
          experience,
          credentialUrl,
          description,
          verificationStatus: "PENDING",
        },
      });

      revalidatePath("/");
      return { success: true, redirect: "/doctor/verification" };
    }
  } catch (error) {
    console.error("Failed to set user role:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to update user profile: ${error.message}`);
    }
    throw new Error("Unknown error while updating user profile");
  }
}

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) return null;

  try {
    return await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  } catch (error) {
    console.error("Failed to get user information:", error);
    return null;
  }
}
