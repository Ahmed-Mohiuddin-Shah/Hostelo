"use client";

import Dashboard from "@/components/Dashboard";
import Loader from "@/components/common/Loader";
import useAuth from "@/hooks/useAuth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export const metadata: Metadata = {
  title: "Hostelo | Hostel Management System",
  description: "This is a hostel management system.",
  // other metadata
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const auth = useAuth();

  useEffect(() => {
    if (auth === null) setIsLoading(true);
    else setIsLoading(false);
  }, [auth]);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  return <>{isLoading ? <Loader /> : <Dashboard />}</>;
}
