"use client";
import Loader from "@/components/common/Loader";
import { AuthContext } from "@/contexts/UserAuthContext";
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

  useEffect(() => {
    const getComplaints = async () => {
      let data;
      try {
        const response = await axios.get(`/api/complaints/all-complaints/`, {
          headers: {
            Authorization: `${authContext.userInfo?.username}`,
          },
        });
        data = response.data;
      } catch (error) {
        console.log(error);
      }

      if (!data.status) {
        return;
      }

      console.log(data);
      setComplaints(data.data);
    };
    getComplaints();
  }, [authContext.userInfo?.username]);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  const handleEditClicked = (e: any, id: number) => {};

  const handleEditSubmit = async (e: any) => {
    e.preventDefault();
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
                    <td className="px-4 py-2">{complaint.status}</td>
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
                        className="bg-red-500 hover:bg-red-700 text-black font-bold py-4 px-2 rounded dark:text-white"
                        onClick={(e) => handleDelete(e, complaint.complaint_id)}
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
      )}
      <ToastContainer />
    </>
  );
}
