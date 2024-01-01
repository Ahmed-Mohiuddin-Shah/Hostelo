"use client";
import NotAuthorized from "@/components/NotAuthorized";
import Loader from "@/components/common/Loader";
import { AuthContext } from "@/contexts/UserAuthContext";
import useAccess from "@/hooks/useAccess";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Page() {
  const auth = useAuth();
  const authContext = useContext(AuthContext);
  const hasAccess = useAccess(["admin", "manager"]);

  useEffect(() => {}, []);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  if (!hasAccess) {
    return <NotAuthorized />;
  }

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    const perApplianceEletricityBill = parseInt(
      e.target.perApplianceElectricityBill.value
    );
    const inputInvoiceDate = e.target.invoiceMonth.value + "-01";
    const currentDateString = new Date().toISOString().split("T")[0];

    const invoiceDate = new Date(inputInvoiceDate);
    const currentDate = new Date(currentDateString);

    if (invoiceDate > currentDate) {
      return toast.error("Invoice month cannot be in future");
    }

    // invoice can be made only for this month or previous
    const diffTime = Math.abs(currentDate.getTime() - invoiceDate.getTime());
    let diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    diffMonths = Math.floor(diffMonths / 30);

    if (diffMonths > 1) {
      return toast.error(
        "Invoice can be made for current month, or previous month only"
      );
    }

    if (isNaN(perApplianceEletricityBill)) {
      return toast.error("Please enter a valid number");
    }
    if (perApplianceEletricityBill <= 0) {
      return toast.error("Cost per day can only be positive");
    }

    let data;
    try {
      const response = await axios.post(
        "/api/invoice/generate-electricity-invoices",
        {
          perDayCost: perApplianceEletricityBill,
          invoiceDate: inputInvoiceDate,
        },
        {
          headers: {
            Authorization: `${authContext.token}`,
          },
        }
      );
      data = response.data;
    } catch (err) {
      return toast.error("Something went wrong, please try again");
    }

    if (!data.status) {
      return toast.error(data.msg);
    }

    toast.success(data.msg);
    e.target.reset();
  };

  return (
    <>
      <section className="bg-white p-8 dark:bg-boxdark">
        <h1 className="text-4xl text-black mb-4 dark:text-white">
          Generate Electricity Invoices
        </h1>

        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label
              htmlFor="perApplianceElectricityBill"
              className="mb-3 block text-black dark:text-white"
            >
              Cost per Appliance
            </label>
            <input
              type="number"
              placeholder="Per appliance bill of electricity"
              id="perApplianceElectricityBill"
              name="perApplianceElectricityBill"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="invoiceMonth"
              className="mb-3 block text-black dark:text-white"
            >
              Invoice Month
            </label>
            <input
              type="month"
              id="invoiceMonth"
              name="invoiceMonth"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Generate Invoices and Send Emails
            </button>
          </div>
        </form>
      </section>
      <ToastContainer />
    </>
  );
}
