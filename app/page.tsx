"use client";

import ECommerce from "@/components/Dashboard/E-commerce";
import { AuthContext } from "@/contexts/UserAuthContext";
import useColorMode from "@/hooks/useColorMode";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";

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
