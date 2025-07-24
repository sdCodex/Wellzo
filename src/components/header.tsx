import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { checkUser } from "@/lib/checkUser";
import UserButtonComponent from "./userButtoncomponent";
import { Calendar, CreditCard, ShieldCheck, Stethoscope, User } from "lucide-react";
import { checkAndAllocateCredits } from "@/actions/credits";


const Header = async () => {
  const user = await checkUser();
  if(user?.role==="PATIENT")
  {
    await checkAndAllocateCredits(user);
  }


  return (
    <header className="fixed top-0 w-full border-b bg-backgound/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between ">
        <Link href="/">
          <Image
            src="/logo.png"
            width={200}
            height={30}
            alt="Wellzo logo"
            className="h-15 w-auto object-contain"
            priority
          />
        </Link>
        <div className="flex space-x-4 items-center ml-2">
          <ModeToggle />
          <SignedOut>
            <SignInButton>
              <Button variant={"outline"}>Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>

             {/* Admin  */}
            {user?.role === "ADMIN" && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <ShieldCheck className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* Doctor  */}
            {user?.role === "DOCTOR" && (
              <Link href="/doctor">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <Stethoscope className="h-4 w-4" />
                  Doctor Dashboard
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <Stethoscope className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* Patient  */}
            {user?.role === "PATIENT" && (
              <Link href="/appointments">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  My Appointments
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <Calendar className="h-4 w-4" />
                </Button>
              </Link>
            )}


            {/* Unassinged */}
            {user?.role === "UNASSIGNED" && (
              <Link href="/onboarding">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Complete Profile
                </Button>

                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <User className="h-4 w-4"/>
                </Button>
              </Link>
            )}
          </SignedIn>
          {
            (!user || user.role==="PATIENT") && (
              <Link href="/pricing">
                <Button variant="outline" className="border-emerald-700/30 px-3 py-1 flex items-center gap-2">

                
                <CreditCard className="!h-4 !w-5  text-emerald-400 flex-shrink-0"/>

                <span className="text-emerald-400 text-md">
                  {
                    user && user?.role==="PATIENT"?
                    <>
                    {user.credits} {" "}
                    <span className="hidden md:inline">Credits</span>
                    </>:<>Pricing</>
                  }
                </span>
                </Button>
              </Link>
            )
          }



          <SignedIn>
            <UserButtonComponent />
          </SignedIn>

        </div>
      </nav>
    </header>
  );
};

export default Header;
