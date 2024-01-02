"use client";
import NotAuthorized from "@/components/NotAuthorized";
import Loader from "@/components/common/Loader";
import { AuthContext } from "@/contexts/UserAuthContext";
import useAccess from "@/hooks/useAccess";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";

export default function Page() {
  const auth = useAuth();
  const hasAccess = useAccess(["admin", "manager"]);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {}, []);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  if (!hasAccess) return <NotAuthorized />;

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    let data;
    try {
      data = await axios.post("/api/announcements/add-announcement", {
        title,
        description,
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again later.");
      setIsSubmitting(false);
      return;
    }

    if (!data.status) {
      toast.error("Something went wrong, please try again later.");
      setIsSubmitting(false);
      return;
    }

    toast.success("Announcement created successfully.");
    setTitle("");
    setDescription("");
    setIsSubmitting(false);
  };

  return (
    <>
      <section className="bg-white p-8 dark:bg-boxdark">
        <h1 className="text-4xl text-black mb-4 dark:text-white">
          Create Announcement
        </h1>

        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="mb-3 block text-black dark:text-white"
            >
              Title
            </label>
            <input
              placeholder="Title of your announcement"
              id="title"
              name="title"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
              value={title}
              onChange={(e) => {
                const value = e.target.value;

                const regex = /^[a-zA-Z0-9!?. -]*$/;
                if (!regex.test(value)) {
                  return;
                }

                setTitle(value);
              }}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="mb-3 block text-black dark:text-white"
            >
              Description
            </label>
            <textarea
              rows={6}
              placeholder="Enter description of your announcement"
              id="description"
              name="description"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
              value={description}
              onChange={(e) => {
                if (e.target.value.length > 500) {
                  return;
                }

                const regex = /^[a-zA-Z0-9!?. -,/]*$/;
                if (!regex.test(e.target.value)) {
                  return;
                }

                setDescription(e.target.value);
              }}
            />
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <FaSpinner className="text-lg animate-spin mr-2" />
              )}
              Create announcement
            </button>
          </div>
        </form>
      </section>
      <ToastContainer />
    </>
  );
}
