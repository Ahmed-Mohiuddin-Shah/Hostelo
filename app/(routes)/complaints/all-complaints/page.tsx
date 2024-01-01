"use client";
import NotAuthorized from "@/components/NotAuthorized";
import Loader from "@/components/common/Loader";
import { AuthContext } from "@/contexts/UserAuthContext";
import useAccess from "@/hooks/useAccess";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

interface IComplaint {
  student_id: number;
  student_name: string;
  room_number: number;
  complaint_id: number;
  title: string;
  description: string;
  status: string;
}

export default function Page() {
  const authContext = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState<boolean | null>(false);
  const [complaints, setComplaints] = useState<IComplaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<IComplaint>();

  const auth = useAuth();
  const hasAccess = useAccess(["admin", "manager", "student"]);

  useEffect(() => {
    const getComplaints = async () => {
      if (!authContext.token) return;

      let data;
      try {
        const response = await axios.get(`/api/complaints/all-complaints/`, {
          headers: {
            Authorization: `${authContext.token}`,
          },
        });
        data = response.data;
      } catch (error) {
        console.log(error);
      }

      if (!data.status) {
        return;
      }

      setComplaints(data.data);
    };
    getComplaints();
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

  const handleEditClicked = (e: any, id: number) => {
    e.preventDefault();
    setIsEditing(true);
    const complaint = complaints.find(
      (complaint) => complaint.complaint_id === id
    );
    setSelectedComplaint(complaint);
  };

  const handleEditSubmit = async (e: any) => {
    e.preventDefault();

    if (!authContext.token) {
      toast.error("You are not authorized to perform this action");
      return;
    }

    let data;
    try {
      const response = await axios.put(
        `/api/complaints/update-complaint/${selectedComplaint?.complaint_id}`,
        {
          title: selectedComplaint?.title,
          description: selectedComplaint?.description,
        },
        {
          headers: {
            Authorization: `${authContext.token}`,
          },
        }
      );
      data = response.data;
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      return;
    }

    if (!data.status) {
      toast.error(data.msg);
      return;
    }

    toast.success(data.msg);

    setIsEditing(false);

    const newComplaints = complaints.map((complaint) => {
      if (complaint.complaint_id === selectedComplaint?.complaint_id) {
        return {
          ...complaint,
          title: selectedComplaint?.title,
          description: selectedComplaint?.description,
        };
      }
      return complaint;
    });
    setComplaints(newComplaints);
  };

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

    if (!authContext.token) {
      toast.error("You are not authorized to perform this action");
      return;
    }

    let data;
    try {
      const response = await axios.delete(
        `/api/complaints/delete-complaint/${id}`,
        {
          headers: {
            Authorization: `${authContext.token}`,
          },
        }
      );
      data = response.data;
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      return;
    }

    if (!data.status) {
      return;
    }

    const newComplaints = complaints.filter(
      (complaint) => complaint.complaint_id !== id
    );
    setComplaints(newComplaints);
  };

  const handleResolved = async (e: any, id: number) => {
    if (!authContext.token) {
      toast.error("You are not authorized to perform this action");
      return;
    }

    const currentStatus = complaints.find(
      (complaint) => complaint.complaint_id === id
    )?.status;
    const updatedStatus = currentStatus === "pending" ? "resolved" : "pending";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to mark this complaint as ${updatedStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) {
      return;
    }

    let data;
    try {
      const response = await axios.put(
        `/api/complaints/update-complaint/${id}`,
        {
          status: updatedStatus,
        },
        {
          headers: {
            Authorization: `${authContext.token}`,
          },
        }
      );
      data = response.data;
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      return;
    }

    if (!data.status) {
      toast.error(data.msg);
      return;
    }

    toast.success(data.msg);

    const newComplaints = complaints.map((complaint) => {
      if (complaint.complaint_id === id) {
        return {
          ...complaint,
          status: updatedStatus,
        };
      }
      return complaint;
    });
    setComplaints(newComplaints);
  };

  return (
    <>
      {isEditing ? (
        <section className="bg-white p-8 dark:bg-boxdark">
          <h1 className="text-4xl text-black mb-4 dark:text-white">
            Write Complaint
          </h1>

          <form onSubmit={handleEditSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="mb-3 block text-black dark:text-white"
              >
                Title
              </label>
              <input
                placeholder="Title of your complaint"
                id="title"
                name="title"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
                value={selectedComplaint?.title}
                onChange={(e) => {
                  const value = e.target.value;

                  const regex = /^[a-zA-Z0-9!?. -]*$/;
                  if (!regex.test(value)) {
                    return;
                  }

                  const newComplaint = {
                    ...selectedComplaint,
                    title: value,
                  } as IComplaint;

                  setSelectedComplaint(newComplaint);
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
                placeholder="Enter description of your complaint"
                id="description"
                name="description"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
                value={selectedComplaint?.description}
                onChange={(e) => {
                  if (e.target.value.length > 500) {
                    return;
                  }

                  const regex = /^[a-zA-Z0-9!?. -,/]*$/;
                  if (!regex.test(e.target.value)) {
                    return;
                  }

                  const newComplaint = {
                    ...selectedComplaint,
                    description: e.target.value,
                  } as IComplaint;

                  setSelectedComplaint(newComplaint);
                }}
              />
            </div>

            <div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              >
                Save Complaint
              </button>
              <button
                className="inline-flex items-center justify-center rounded-md bg-meta-8 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 ml-4"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="bg-white p-8 dark:bg-boxdark">
          <h1 className="text-4xl text-black mb-4 dark:text-white">
            Complaints
          </h1>
          <div className="overflow-auto">
            <table className="w-full">
              <thead className="text-left">
                <tr className="border-b pb-2">
                  {authContext.userInfo?.role !== "student" && (
                    <>
                      <th className="px-4 py-2">Student ID</th>
                      <th className="px-4 py-2">Student Name</th>
                      <th className="px-4 py-2">Room Number</th>
                    </>
                  )}
                  <th className="px-4 py-2">Complaint Title</th>
                  <th className="px-4 py-2">Complaint Description</th>
                  <th className="px-4 py-2">Current Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.complaint_id} className="border-b">
                    {authContext.userInfo?.role !== "student" && (
                      <>
                        <td className="px-4 py-2">{complaint.student_id}</td>
                        <td className="px-4 py-2">{complaint.student_name}</td>
                        <td className="px-4 py-2">{complaint.room_number}</td>
                      </>
                    )}
                    <td className="px-4 py-2">{complaint.title}</td>
                    <td className="px-4 py-2">{complaint.description}</td>
                    <td className={`px-4 py-2 text-white`}>
                      <span
                        className={`p-2 rounded ${
                          complaint.status === "resolved"
                            ? "bg-success"
                            : "bg-warning"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </td>

                    {authContext.userInfo?.role === "student" && (
                      <td className="px-4 py-2 flex">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-4 px-2 rounded dark:text-white"
                          onClick={(e) =>
                            handleEditClicked(e, complaint.complaint_id)
                          }
                        >
                          <FaPenToSquare className="text-lg text-current" />
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-danger font-bold py-4 px-2 rounded dark:text-white"
                          onClick={(e) =>
                            handleDelete(e, complaint.complaint_id)
                          }
                        >
                          <FaTrash className="text-lg text-current" />
                        </button>
                      </td>
                    )}
                    {authContext.userInfo?.role !== "student" &&
                      complaint.status !== "resolved" && (
                        <td className="px-4 py-2 flex">
                          <button
                            className={`text-white font-bold py-2 rounded dark:text-white ${
                              complaint.status === "pending" && "bg-meta-3"
                            }`}
                            onClick={(e) =>
                              handleResolved(e, complaint.complaint_id)
                            }
                          >
                            Mark as resolved
                          </button>
                        </td>
                      )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <ToastContainer />
    </>
  );
}
