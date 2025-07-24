"use server";

import { db } from "@/lib/prisma";
import { UserWithTransactions } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";

import { format } from "date-fns";
import { revalidatePath } from "next/cache";

const PLAN_CREDITS = {
  basic: 0, // Basic plan: 2 credits
  standard: 10, // Standard plan: 10 credits per month
  premium: 24, // Premium plan: 24 credits per month
};


const APPOINTMENT_CREDIT_COST=2;

export async function checkAndAllocateCredits(user: UserWithTransactions) {
  if (!user) return null;
  if (user.role !== "PATIENT") return user;
  const { has } = await auth();
  const hasBasic = has({ plan: "basic" });
  const hasStandard = has({ plan: "standard" });
  const hasPremium = has({ plan: "premium" });
  let currentPlan = null;
  let creditsToAllocate = 0;

  if (hasPremium) {
    currentPlan = "premium";
    creditsToAllocate = PLAN_CREDITS.premium;
  } else if (hasStandard) {
    currentPlan = "standard";
    creditsToAllocate = PLAN_CREDITS.standard;
  } else if (hasBasic) {
    currentPlan = "basic";
    creditsToAllocate = PLAN_CREDITS.basic;
  }

  if (!currentPlan) return user;

  // Check if already allocated credits for this month
  const currentMonth = format(new Date(), "yyyy-MM");

  let latestTransaction;
  let transactionMonth;
  // If there's a transaction this month, check if it's for the same plan
  if (user.transactions.length > 0) {
    latestTransaction = user.transactions[0];
    transactionMonth = format(new Date(latestTransaction.createdAt), "yyyy-MM");
  }

  const transactionPlan = latestTransaction?.packageId;
  // If already allocated credits for this month and the plan is the same, just return
  if (transactionMonth === currentMonth && transactionPlan === currentPlan) {
    return user;
  }

  try {
    // Allocate credits and create transaction record
    const updatedUser = await db.$transaction(async (tx) => {
      // Create transaction record
      await tx.creditTransaction.create({
        data: {
          userId: user.id,
          amount: creditsToAllocate,
          type: "CREDIT_PURCHASE",
          packageId: currentPlan,
        },
      });

      // Update user's credit balance
      const updatedUser = await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          credits: {
            increment: creditsToAllocate,
          },
        },
      });

      return updatedUser;
    });

    revalidatePath("/doctors");
    revalidatePath("/appointments");

    return updatedUser;
  } catch (e: any) {
    console.error(
      "Failed to check subscription and allocate credits:",
      e.message
    );
    return null;
  }
}




/**
 * Deducts credits for booking an appointment
 */
export async function deductCreditsForAppointment(userId:string, doctorId:string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if(!user) throw new Error("User not found");

    const doctor = await db.user.findUnique({
      where: { id: doctorId },
    });

    // Ensure user has sufficient credits
    if (user.credits < APPOINTMENT_CREDIT_COST) {
      throw new Error("Insufficient credits to book an appointment");
    }

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    // Deduct credits from patient and add to doctor
    const result = await db.$transaction(async (tx) => {
      // Create transaction record for patient (deduction)
      await tx.creditTransaction.create({
        data: {
          userId: user.id,
          amount: -APPOINTMENT_CREDIT_COST,
          type: "APPOINTMENT_DEDUCTION",
        },
      });

      // Create transaction record for doctor (addition)
      await tx.creditTransaction.create({
        data: {
          userId: doctor.id,
          amount: APPOINTMENT_CREDIT_COST,
          type: "APPOINTMENT_DEDUCTION", // Using same type for consistency
        },
      });

      // Update patient's credit balance (decrement)
      const updatedUser = await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          credits: {
            decrement: APPOINTMENT_CREDIT_COST,
          },
        },
      });

      // Update doctor's credit balance (increment)
      await tx.user.update({
        where: {
          id: doctor.id,
        },
        data: {
          credits: {
            increment: APPOINTMENT_CREDIT_COST,
          },
        },
      });

      return updatedUser;
    });

    return { success: true, user: result };
  } catch (error:any) {
    console.error("Failed to deduct credits:", error);
    return { success: false, error: error.message };
  }
}
