"use client";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import React from "react";

const UserButtonComponent = () => {
    const {theme}=useTheme();
  return (
    <UserButton
      appearance={{
        baseTheme:theme === "dark" ? dark : undefined,
        elements: {
          userButtonAvatarBox: {
            width: "2rem",
            height: "2rem",
          },
        },
      }}
    />
  );
};

export default UserButtonComponent;
