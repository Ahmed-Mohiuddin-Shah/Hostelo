"use client";
import NotAuthorized from "@/components/NotAuthorized";
import Loader from "@/components/common/Loader";
import useAccess from "@/hooks/useAccess";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";

export default function Page() {
  const auth = useAuth();
  const [studentDetails, setStudentDetails] = useState<
    { name: string; student_id: number }[]
  >([]);
  const [appliances, setAppliances] = useState<
    { appliance_id: number; appliance_name: string }[]
  >([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const hasAccess = useAccess(["admin", "manager"]);

  useEffect(() => {
    const getStudentDetails = async () => {
      let data;

      try {
        const res = await axios.get("/api/students/get-students");
        data = await res.data;
      } catch (err) {
        console.log(err);
      }

      if (!data.status) {
        toast.error(data.msg);
        return;
      }
      setStudentDetails(data.data);
    };
    getStudentDetails();

    const getAppliances = async () => {
      let data;
      try {
        const response = await axios.get("/api/appliance/get-appliances");
        data = await response.data;
      } catch (err) {
        console.log(err);
        toast.error("Unable to fetch appliances, please try again.");
        return;
      }
      if (!data.status) {
        toast.error(data.msg);
        return;
      }

      setAppliances(data.data);
    };
    getAppliances();
  }, []);

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
    setIsSubmitting(true);

    const studentId = e.target.studentId.value;
    const applianceId = e.target.applianceId.value;

    if (!studentId || !applianceId) {
      toast.error("Please select student and appliance.");
      setIsSubmitting(false);
      return;
    }

    let data;

    try {
      const response = await axios.post(
        "/api/appliance/add-student-appliance",
        {
          student_id: studentId,
          appliance_id: applianceId,
        }
      );
      data = await response.data;
    } catch (err) {
      toast.error("Unable to add appliance, please try again.");
      setIsSubmitting(false);
      return;
    }

    if (!data.status) {
      toast.error(data.msg);
      setIsSubmitting(false);
      return;
    }

    toast.success("Appliance added successfully.");
    e.target.reset();
    setSelectedId("");
    setIsSubmitting(false);
  };

  return (
    <>
      <section className="bg-white p-8 dark:bg-boxdark">
        <h1 className="text-4xl text-black mb-4 dark:text-white">
          Add Appliance
        </h1>

        <form onSubmit={handleFormSubmit} className="grid grid-cols-12 gap-4">
          <div className="mb-4 col-span-12 sm:col-span-6">
            <label
              htmlFor="studentId"
              className="mb-3 block text-black dark:text-white"
            >
              Student Id
            </label>
            <select
              name="studentId"
              id="studentId"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select student id
              </option>
              {studentDetails.map((x) => (
                <option key={x.student_id} value={x.student_id}>
                  {x.student_id}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 col-span-12 sm:col-span-6 flex items-end">
            {selectedId && (
              <div className="pb-3 text-black font-bold dark:text-white">
                Student Name:{" "}
                {
                  studentDetails.find(
                    (x) => x.student_id === Number(selectedId)
                  )?.name
                }
              </div>
            )}
          </div>

          <div className="mb-4 col-span-12">
            <label
              htmlFor="applianceId"
              className="mb-3 block text-black dark:text-white"
            >
              Appliance name
            </label>
            <select
              placeholder="Enter appliance name"
              id="applianceId"
              name="applianceId"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            >
              <option value="" disabled>
                Select appliance
              </option>
              {appliances.map((x) => (
                <option key={x.appliance_id} value={x.appliance_id}>
                  {x.appliance_name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-12">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              disabled={isSubmitting}
            >
              {isSubmitting && <FaSpinner className="text-lg animate-spin" />}
              Add Appliance
            </button>
          </div>
        </form>
      </section>
      <ToastContainer />
    </>
  );
}
