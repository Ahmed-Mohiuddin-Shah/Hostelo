"use client";
import Loader from "@/components/common/Loader";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

interface IAppliance {
  student_id: number;
  student_name: string;
  room_number: number;
  appliance_id: number;
  appliance_name: string;
}

export default function Page() {
  const [isEditing, setIsEditing] = useState<boolean | null>(false);
  const [appliances, setAppliances] = useState<IAppliance[]>([]);

  const auth = useAuth();

  useEffect(() => {
    const getAppliances = async () => {
      let data;

      try {
        const response = await axios.get("/api/appliance/all-appliances");
        data = response.data;
      } catch (error) {
        console.log(error);
        toast.error("Error fetching appliances");
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

  const handleDelete = async (
    e: any,
    appliance_id: number,
    student_id: number
  ) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) {
      return;
    }

    const appliance = appliances.find(
      (appliance) =>
        appliance.appliance_id === appliance_id &&
        appliance.student_id === student_id
    );

    let data;

    try {
      const response = await axios.delete(
        `/api/appliance/delete-student-appliance/${appliance_id}/${appliance?.student_id}`
      );
      data = response.data;
    } catch (error) {
      console.log(error);
      toast.error("Error deleting appliance");
      return;
    }

    if (!data.status) {
      toast.error(data.msg);
      return;
    }

    toast.success("Appliance deleted successfully");

    const newAppliances = appliances.filter(
      (appliance) =>
        appliance.appliance_id !== appliance_id ||
        appliance.student_id !== student_id
    );

    setAppliances(newAppliances);
  };

  return (
    <>
      <section className="bg-white p-8 dark:bg-boxdark">
        <h1 className="text-4xl text-black mb-4 dark:text-white">Appliances</h1>
        <div className="overflow-auto">
          <table className="w-full">
            <thead className="text-left">
              <tr className="border-b pb-2">
                <th className="px-4 py-2">Student Id</th>
                <th className="px-4 py-2">Student Name</th>
                <th className="px-4 py-2">Room Number</th>
                <th className="px-4 py-2">Appliance Name</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appliances.map((appliance) => (
                <tr
                  key={appliance.student_id + "-" + appliance.appliance_id}
                  className="border-b"
                >
                  <td className="px-4 py-2">{appliance.student_id}</td>
                  <td className="px-4 py-2">{appliance.student_name}</td>
                  <td className="px-4 py-2">{appliance.room_number}</td>
                  <td className="px-4 py-2">{appliance.appliance_name}</td>

                  <td className="px-4 py-2">
                    <button
                      className="bg-red-500 hover:bg-red-700 text-meta-1 font-bold py-2 px-4 rounded dark:text-white"
                      onClick={(e) =>
                        handleDelete(
                          e,
                          appliance.appliance_id,
                          appliance.student_id
                        )
                      }
                    >
                      <FaTrash className="text-lg text-current" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}
