"use client";
import Loader from "@/components/common/Loader";
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
  const [selectedId, setSelectedId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
      console.log(data.data);
      setStudentDetails(data.data);
    };

    getStudentDetails();
  }, []);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    const name = e.target.applianceName.value;
    const studentId = e.target.studentId.value;

    let data;

    try {
      const response = await axios.post("/api/appliances/add-appliance", {
        name,
        student_id: studentId,
      });
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
              <div className="pb-3 text-black font-bold">
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
              htmlFor="applianceName"
              className="mb-3 block text-black dark:text-white"
            >
              Appliance name
            </label>
            <input
              type="text"
              placeholder="Enter appliance name"
              id="applianceName"
              name="applianceName"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
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
