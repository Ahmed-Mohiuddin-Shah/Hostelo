"use client";

import ECommerce from "@/components/Dashboard/E-commerce";
import { AuthContext } from "@/contexts/UserAuthContext";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { useContext } from "react";

export const metadata: Metadata = {
  title: "Hostelo | Hostel Management System",
  description: "This is a hostel management system.",
  // other metadata
};

export default function Home() {
  const authContext = useContext(AuthContext);

  if (!authContext.isLoggedIn) {
    redirect("/auth/signin");
  }

  return (
    <>
      <ECommerce />
    </>
  );
}
