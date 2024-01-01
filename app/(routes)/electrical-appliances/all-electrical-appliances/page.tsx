"use client";
import NotAuthorized from "@/components/NotAuthorized";
import Loader from "@/components/common/Loader";
import useAccess from "@/hooks/useAccess";
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
  const [filterText, setFilterText] = useState<string>("");
  const [filteredAppliances, setFilteredAppliances] = useState<IAppliance[]>(
    []
  );

  const auth = useAuth();
  const hasAccess = useAccess(["admin", "manager", "student"]);

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
      setFilteredAppliances(data.data);
    };
    getAppliances();
  }, []);

  useEffect(() => {
    const filtered = appliances.filter((appliance) => {
      const studentName = appliance.student_name.toLowerCase();
      const cmsId = appliance.student_id.toString().toLowerCase();
      const applianceName = appliance.appliance_name.toLowerCase();

      const filterTextLower = filterText.toLowerCase();

      return (
        studentName.includes(filterTextLower) ||
        cmsId.includes(filterTextLower) ||
        applianceName.includes(filterTextLower)
      );
    });

    setFilteredAppliances(filtered);
  }, [filterText]);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  if (!hasAccess) {
    return <NotAuthorized />;
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center w-full">
            <input
              type="search"
              name="search"
              placeholder="Search by name, room number or date"
              className="w-full rounded-lg border-[1.5px] border-black bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
              }}
            />
          </div>
        </div>
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
              {filteredAppliances.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No appliances found
                  </td>
                </tr>
              )}
              {filteredAppliances.map((appliance) => (
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
