"use client";
import Loader from "@/components/common/Loader";
import { AuthContext } from "@/contexts/UserAuthContext";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Page() {
  const authContext = useContext(AuthContext);
  const auth = useAuth();
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  });
  const [startDateMessage, setStartDateMessage] = useState("");
  const [endDateMessage, setEndDateMessage] = useState("");

  useEffect(() => { }, []);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    let hasError = false;

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    if (startDate.getMonth() + 1 !== currentMonth || startDate.getFullYear() !== currentYear) {
      setStartDateMessage("Mess can only be signed off for the current month.");
      hasError = true;
    } else {
      setStartDateMessage("");
    }
    if (endDate.getMonth() + 1 !== currentMonth || endDate.getFullYear() !== currentYear) {
      setEndDateMessage("Mess can only be signed off for the current month.");
      hasError = true;
    } else {
      setEndDateMessage("");
    }

    if (startDate > endDate) {
      setEndDateMessage("End date cannot be before start date.");
      hasError = true;
    } else {
      setEndDateMessage("");
    }

    // start date must be today or after today
    if (startDate < today) {
      setStartDateMessage("Start date cannot be before today.");
      hasError = true;
    } else {
      setStartDateMessage("");
    }

    // difference of days between start and end date
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 12) {
      setEndDateMessage("Mess can only be signed off for a maximum of 12 days.");
      hasError = true;
    } else {
      setEndDateMessage("");
    }

    if (hasError) {
      return;
    }

    let data;
    try {
      const response = await axios.post("/api/mess/sign-off", {
        userName: authContext.userInfo?.username,
        startDate: formData.startDate,
        endDate: formData.endDate,
        daysOff: diffDays,
      });
      data = response.data;
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
      return;
    }

    if (!data.status) {
      toast.error(data.msg);
      return;
    }

    toast.success(data.msg);
  };

  return (
    <>
      <section className="bg-white p-8 dark:bg-boxdark">
        <h1 className="text-4xl text-black mb-4 dark:text-white">
          Sign Off From Mess
        </h1>

        <form onSubmit={handleFormSubmit} className="grid grid-cols-12 gap-2">
          <div className="mb-4 col-span-12 sm:col-span-6 flex flex-col gap-2">
            <label
              htmlFor="startDate"
              className="mb-3 block text-black dark:text-white"
            >
              Start Date
            </label>
            <input
              type="date"
              placeholder="placeholder"
              id="startDate"
              name="startDate"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
              value={formData.startDate}
              onChange={(e) => {
                setFormData({ ...formData, startDate: e.target.value });
              }}
            />
            <p className="text-meta-7">{startDateMessage}</p>
          </div>
          <div className="mb-4 col-span-12 sm:col-span-6 flex flex-col gap-2">
            <label
              htmlFor="endDate"
              className="mb-3 block text-black dark:text-white"
            >
              End Date
            </label>
            <input
              type="date"
              placeholder="placeholder"
              id="endDate"
              name="endDate"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
              value={formData.endDate}
              onChange={(e) => {
                setFormData({ ...formData, endDate: e.target.value });
              }}
            />
            <p className="text-meta-7">{endDateMessage}</p>
          </div>

          <div className="col-span-12">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Sign Off From Mess
            </button>
          </div>
        </form>
      </section>
      <ToastContainer />
    </>
  );
}
