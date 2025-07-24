"use client";
import {SignUp} from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
export default function SignUpPage() {
  const { theme } = useTheme();
  return (
    <div className="mb-6">
      <SignUp
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
      }}
    />
    </div>
  );
}
