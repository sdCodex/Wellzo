import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { UserWithTransactions } from "@/types/user";


export const checkUser = async ():Promise<UserWithTransactions|null> => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
      include: {
        transactions: {
          where: {
            type: "CREDIT_PURCHASE",
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },

          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (loggedInUser) return loggedInUser;

    const name = `${user.firstName} ${user.lastName}`;
    const newUser = await db.user.create({
  data: {
    clerkUserId: user.id,
    name,
    imageUrl: user.imageUrl,
    email: user.emailAddresses[0].emailAddress,
    transactions: {
      create: {
        type: "CREDIT_PURCHASE",
        packageId: "basic",
        amount: 0,
      },
    },
  },
  include: {
    transactions: true,
  },
});

return newUser; 

  } catch (e) {
    console.log(e);
    return null;
  }
};
