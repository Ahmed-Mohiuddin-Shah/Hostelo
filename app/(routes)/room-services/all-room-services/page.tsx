"use client";
import NotAuthorized from "@/components/NotAuthorized";
import Loader from "@/components/common/Loader";
import { AuthContext } from "@/contexts/UserAuthContext";
import useAccess from "@/hooks/useAccess";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

interface IRoomService {
  id: number;
  studentId: number;
  studentName: string;
  roomNumber: number;
  serviceType: string;
}

export default function Page() {
  const hasAccess = useAccess(["student", "manager", "admin"]);
  const [roomServices, setRoomServices] = useState<IRoomService[]>([]);

  const auth = useAuth();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (!authContext.token) {
      return;
    }

    const getRoomServices = async () => {
      let data;
      try {
        const response = await axios.get(
          "/api/room-services/all-room-services",
          {
            headers: {
              Authorization: `${authContext.token}`,
            },
          }
        );
        data = response.data;
      } catch (e) {
        console.log(e);
        return toast.error("Unable to fetch room services");
      }

      if (!data.status) {
        return toast.error(data.msg);
      }
      setRoomServices(data.data);
    };
    getRoomServices();
  }, [authContext.token]);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  if (!hasAccess) {
    return <NotAuthorized />;
  }

  const handleDelete = async (e: any, id: number) => {
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
  };

  const handleCompleted = async (e: any, id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to mark this service as completed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Mark as completed",
    });

    if (!result.isConfirmed) {
      return;
    }
  };

  return (
    <>
      {
        <section className="bg-white p-8 dark:bg-boxdark">
          <h1 className="text-4xl text-black mb-4 dark:text-white">
            Room Service Requests
          </h1>
          <table className="w-full">
            <thead className="text-left">
              <tr className="border-b pb-2">
                <th className="px-4 py-2">Student Name</th>
                <th className="px-4 py-2">Room Number</th>
                <th className="px-4 py-2">Service Type</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomServices.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center pt-4 text-2xl">
                    No room service requests found
                  </td>
                </tr>
              )}
              {roomServices.map((service) => (
                <tr key={service.id} className="border-b">
                  <td className="px-4 py-2 flex">
                    {authContext.userInfo?.role === "student" ? (
                      <button
                        className="bg-red-500 hover:bg-red-700 text-danger font-bold py-4 px-2 rounded dark:text-white"
                        onClick={(e) => handleDelete(e, service.id)}
                      >
                        <FaTrash className="text-lg text-current" />
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 hover:bg-red-700 text-danger font-bold py-4 px-2 rounded dark:text-white"
                        onClick={(e) => handleDelete(e, service.id)}
                      >
                        Mark as completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      }
      <ToastContainer />
    </>
  );
}
