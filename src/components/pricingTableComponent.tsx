"use client";

import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { Card, CardContent } from "./ui/card";

export default function PricingTableComponent() {
  const { theme } = useTheme();
  return (
    <Card className="border-emerald-900/30 shadow-lg bg-gradient-to-b from-emerald-950/30 to-transparent">
    <CardContent className="p-6 md:p-8">
    <PricingTable
      appearance={{
        baseTheme: theme !== "dark" ? undefined : dark,
      }}

      checkoutProps={{
        appearance:{
          baseTheme:theme !== "dark" ? undefined : dark,
          elements:{
            drawerRoot:{
              zIndex:200
            }
          }
        }
      }}
    />
    </CardContent>
    </Card>
  );
}
