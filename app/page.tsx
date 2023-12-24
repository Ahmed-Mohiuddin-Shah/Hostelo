"use client";

import ECommerce from "@/components/Dashboard/E-commerce";
import Loader from "@/components/common/Loader";
import { AuthContext } from "@/contexts/UserAuthContext";
import useAuth from "@/hooks/useAuth";
import useColorMode from "@/hooks/useColorMode";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Metadata } from "next";
import { redirect, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

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

  return <>{isLoading ? <Loader /> : <ECommerce />}</>;
}
