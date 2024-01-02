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
  studentId?: number;
  studentName?: string;
  roomNumber: number;
  serviceType: string;
  requestDate: string;
  status: string;
  staffId?: number;
  staffName?: string;
}

export default function Page() {
  const hasAccess = useAccess(["student", "manager", "admin", "worker"]);
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

    let data;
    try {
      const response = await axios.put(
        "/api/room-services/mark-as-completed",
        { id },
        {
          headers: {
            Authorization: `${authContext.token}`,
          },
        }
      );
      data = response.data;
    } catch (e) {
      console.log(e);
      return toast.error("Unable to mark as completed");
    }

    if (!data.status) {
      return toast.error(data.msg);
    }

    toast.success(data.msg);
    const updatedRoomServices = roomServices.map((service) => {
      if (service.id === id) {
        service.status = "resolved";
      }
      return service;
    });
    setRoomServices(updatedRoomServices);
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
                {authContext.userInfo?.role === "student" ? (
                  <>
                    <th className="px-4 py-2">Service Type</th>
                    <th className="px-4 py-2">Request Date</th>
                    <th className="px-4 py-2">Status</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-2">Student Name</th>
                    <th className="px-4 py-2">Room Number</th>
                    <th className="px-4 py-2">Service Type</th>
                    <th className="px-4 py-2">Request Date</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Staff Name</th>
                  </>
                )}
                {authContext.userInfo?.role === "worker" && (
                  <th className="px-4 py-2">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {roomServices.length === 0 && (
                <tr className="">
                  <td colSpan={4} className="text-center pt-4 text-2xl">
                    No room service requests found
                  </td>
                </tr>
              )}
              {roomServices.map((service) => (
                <tr key={service.id} className="border-b">
                  {authContext.userInfo?.role === "student" ? (
                    <>
                      <td className="px-4 py-4">{service.serviceType}</td>
                      <td className="px-4 py-4">{service.requestDate}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`p-2 text-white rounded ${
                            service.status === "pending"
                              ? "bg-meta-8"
                              : "bg-success"
                          }`}
                        >
                          {service.status}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-4">{service.studentName}</td>
                      <td className="px-4 py-4">{service.roomNumber}</td>
                      <td className="px-4 py-4">{service.serviceType}</td>
                      <td className="px-4 py-4">{service.requestDate}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`p-2 text-white rounded ${
                            service.status === "pending"
                              ? "bg-meta-8"
                              : "bg-success"
                          }`}
                        >
                          {service.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {service.staffName ? service.staffName : "Not done yet"}
                      </td>
                    </>
                  )}
                  <td className="px-4 py-2 flex">
                    {authContext.userInfo?.role === "worker" &&
                      service.status !== "resolved" && (
                        <button
                          className="bg-meta-3 hover:bg-opacity-90 text-white font-bold py-4 px-2 rounded dark:text-white"
                          onClick={(e) => handleCompleted(e, service.id)}
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
