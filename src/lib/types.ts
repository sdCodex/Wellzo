import { Prisma, CreditTransaction, User } from "@prisma/client";

export type Get_Doctors = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    role: true;
    imageUrl: true;
    specialty: true;
    experience: true;
    credentialUrl: true;
    description: true;
    verificationStatus: true;
    createdAt: true;
  };
}>;

export type Doctor = {
  speciality: string;
  experience: number;
  credentialUrl: string;
  description: string;
};

export type Payout = Prisma.PayoutGetPayload<{
  select: {
    id: true;
    doctorId: true;
    amount: true;
    credits: true;
    platformFee: true;
    netAmount: true;
    paypalEmail: true;
    status: true;
    createdAt: true;
    updatedAt: true;
    processedAt: true;
    processedBy: true;
  };
}> & {
  doctor: Prisma.UserGetPayload<{
    select: {
      id: true;
      name: true;
      email: true;
      specialty: true;
      credits: true;
    };
  }>;
};

export type Slot = Prisma.AvailabilityGetPayload<{
  select: {
    id: true;
    doctorId: true;
    startTime: true;
    endTime: true;
    status: true;
  };
}>;

export type UserWithTransactions = User & {
  transactions: CreditTransaction[];
};

export type SlotItem = {
  startTime: string;
  endTime: string;
  formatted: string;
  day: string;
};

export type AvailableTimeSlotsResult = {
  days: {
    date: string;
    displayDate: string;
    slots: SlotItem[];
  }[];
};

export type Appointment = Prisma.AppointmentGetPayload<{
  include: {
    doctor: true;
    patient: true;
  };
}>;

export type PatientAppoinment = Prisma.AppointmentGetPayload<{
  include: {
    doctor: {
      select: {
        id: true;
        name: true;
        specialty: true;
        imageUrl: true;
      };
    };
  };
}>;

export type Earnings = {

    totalEarnings: number;
    thisMonthEarnings: number;
    completedAppointments: number;
    averageEarningsPerMonth: number;
    availableCredits: number;
    availablePayout: number;
  
};


export type Payouts=Prisma.PayoutGetPayload<{}>;
