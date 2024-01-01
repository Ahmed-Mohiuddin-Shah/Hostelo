"use client";
import Loader from "@/components/common/Loader";
import useAuth from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";


export default function Page() {
  const auth = useAuth();

  useEffect(() => { }, []);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
  };

  return (
    <>
      <section className="bg-white p-8 dark:bg-boxdark">
        <h1 className="text-4xl text-black mb-4 dark:text-white">Title</h1>

        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label
              htmlFor="input1"
              className="mb-3 block text-black dark:text-white"
            >
              Input 1
            </label>
            <input
              type="text"
              placeholder="placeholder"
              id="input1"
              name="input1"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Submit button
            </button>
          </div>
        </form>
      </section>
      <ToastContainer />
    </>
  );
}
