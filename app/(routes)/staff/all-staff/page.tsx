"use client";
import NotAuthorized from "@/components/NotAuthorized";
import Loader from "@/components/common/Loader";
import useAccess from "@/hooks/useAccess";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCamera, FaPenToSquare, FaTrash } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

interface IStaff {
  staffID: number;
  staffImage: string;
  staffName: string;
  staffEmail: string;
  staffPhone: string;
  staffCnic: string;
  staffRole: string;
}

export default function Page() {
  const auth = useAuth();
  const hasAccess = useAccess(["admin", "manager"]);
  const [isEditing, setIsEditing] = useState<boolean | null>(false);
  const [staffMembers, setStaffMembers] = useState<IStaff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<IStaff>();

  useEffect(() => {
    const getStaffMembers = async () => {
      let data;
      try {
        const response = await axios.get("/api/staff/get-all-staff");
        data = response.data;
      } catch (error) {
        console.log(error);
        toast.error("Error fetching staff members");
      }

      if (!data.status) {
        toast.error("Error fetching staff members");
        return;
      }
      setStaffMembers(data.data);
    };
    getStaffMembers();
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

  const handleEditClicked = (e: any, id: number) => {
    setIsEditing(true);
    const staff = staffMembers.find((staff) => staff.staffID === id);
    if (!staff) return;
    setSelectedStaff(staff);
  };

  const handleEditSubmit = async (e: any) => {
    e.preventDefault();

    let data;
    try {
      const response = await axios.put(
        `/api/staff/update-staff/${selectedStaff?.staffID}`,
        {
          staffName: selectedStaff?.staffName,
          staffPhone: selectedStaff?.staffPhone,
          staffImage: selectedStaff?.staffImage,
        }
      );
      data = response.data;
    } catch (error) {
      console.log(error);
      toast.error("Error updating staff member");
      return;
    }

    if (!data.status) {
      toast.error("Error updating staff member");
      return;
    }
    toast.success("Staff member updated successfully");
    setIsEditing(false);

    const newStaffMembers = staffMembers.map((staff) => {
      if (staff.staffID === selectedStaff?.staffID) {
        return {
          ...staff,
          staffName: selectedStaff?.staffName,
          staffPhone: selectedStaff?.staffPhone,
          staffImage: selectedStaff?.staffImage,
        };
      }
      return staff;
    });
    setStaffMembers(newStaffMembers);
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

    let data;
    try {
      const response = await axios.delete(`/api/staff/delete-staff/${id}`);
      data = response.data;
    } catch (error) {
      console.log(error);
      toast.error("Error deleting staff member");
      return;
    }

    if (!data.status) {
      toast.error("Error deleting staff member");
      return;
    }
    toast.success("Staff member deleted successfully");

    const newStaffMembers = staffMembers.filter(
      (staff) => staff.staffID !== id
    );
    setStaffMembers(newStaffMembers);
  };

  return (
    <>
      {isEditing ? (
        <section className="bg-white p-8 dark:bg-boxdark">
          <h1 className="text-4xl text-black mb-4 dark:text-white">
            Edit Staff member
          </h1>
          <form onSubmit={handleEditSubmit} className="grid grid-cols-12 gap-4">
            <div className="mb-4 col-span-12">
              <label
                htmlFor="staffName"
                className="mb-3 block text-black dark:text-white"
              >
                Name
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                id="staffName"
                name="staffName"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
                value={selectedStaff?.staffName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z\s']+$/.test(value) || value === "") {
                    // @ts-ignore
                    setSelectedStaff({ ...selectedStaff, staffName: value });
                  }
                }}
              />
            </div>
            <div className="mb-4 col-span-12">
              <label
                htmlFor="phoneNumber"
                className="mb-3 block text-black dark:text-white"
              >
                Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g. 03001231212"
                id="phoneNumber"
                name="phoneNumber"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
                value={selectedStaff?.staffPhone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length > 11) return;
                  if (/^[0-9]+$/.test(value) || value === "") {
                    const newStaff = {
                      ...selectedStaff,
                      staffPhone: value,
                    } as IStaff;
                    setSelectedStaff(newStaff);
                  }
                }}
              />
            </div>

            <div className="col-span-12 flex gap-4 flex-wrap">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              >
                Save staff member
              </button>
              <button
                className="inline-flex items-center justify-center rounded-md bg-meta-8 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="bg-white p-8 dark:bg-boxdark">
          <h1 className="text-4xl text-black mb-4 dark:text-white">Staff</h1>

          <div className="overflow-auto">
            <table className="w-full">
              <thead className="text-left">
                <tr className="border-b pb-2">
                  <th className="px-4 py-2">Staff Image</th>
                  <th className="px-4 py-2">Staff Name</th>
                  <th className="px-4 py-2">Staff Email</th>
                  <th className="px-4 py-2">Staff Phone</th>
                  <th className="px-4 py-2">Staff CNIC</th>
                  <th className="px-4 py-2">Staff Role</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((staff) => (
                  <tr key={staff.staffID} className="border-b">
                    <td className="px-4 py-2">
                      <Image
                        src={staff.staffImage}
                        width={24}
                        height={24}
                        alt="staff member"
                        className="w-12 h-12 rounded-full"
                      />
                    </td>
                    <td className="px-4 py-2">{staff.staffName}</td>
                    <td className="px-4 py-2">{staff.staffEmail}</td>
                    <td className="px-4 py-2">{staff.staffPhone}</td>
                    <td className="px-4 py-2">{staff.staffCnic}</td>
                    <td className="px-4 py-2">{staff.staffRole}</td>
                    <td className="px-4 py-2 flex items-center justify-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-black font-bold p-2 rounded dark:text-white"
                        onClick={(e) => handleEditClicked(e, staff.staffID)}
                      >
                        <FaPenToSquare className="text-lg text-current" />
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-danger font-bold p-2 py-4 rounded dark:text-white"
                        onClick={(e) => handleDelete(e, staff.staffID)}
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
