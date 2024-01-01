"use client";
import NotAuthorized from "@/components/NotAuthorized";
import Loader from "@/components/common/Loader";
import useAccess from "@/hooks/useAccess";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronDown, FaDoorClosed } from "react-icons/fa6";
import { PatternFormat } from "react-number-format";
import { ToastContainer, toast } from "react-toastify";

export default function Page() {
  const auth = useAuth();
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

    const name = e.target.name.value;
    const quantity = e.target.quantity.value;

    const dataToSubmit = {
      name,
      quantity,
    };

    let data;
    try {
      const res = await axios.post("/api/assets/add-asset", dataToSubmit);
      data = await res.data;
    } catch (err) {
      console.log(err);
    }

    if (data.status) {
      toast.success(data.msg);
      e.target.reset();
    } else {
      toast.error(data.msg);
    }
  };

  return (
    <>
      <section className="bg-white p-8 dark:bg-boxdark">
        <h1 className="text-4xl text-black mb-4 dark:text-white">Add Asset</h1>

        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="mb-3 block text-black dark:text-white"
            >
              Name
            </label>
            <input
              type="text"
              placeholder="Name of the asset"
              id="name"
              name="name"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="mb-3 block text-black dark:text-white"
            >
              Quantity
            </label>
            <input
              type="number"
              placeholder="quantity of the asset"
              id="quantity"
              name="quantity"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Add Asset
            </button>
          </div>
        </form>
      </section>
      <ToastContainer />
    </>
  );
}
