"use client";
import Loader from "@/components/common/Loader";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FaChevronDown,
  FaDoorClosed,
  FaPenToSquare,
  FaTrash,
} from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

interface IAsset {
  name: number;
  quantity: string;
}

export default function Page() {
  const [isEditing, setIsEditing] = useState<boolean | null>(false);

  const auth = useAuth();

  useEffect(() => {}, []);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  const handleEditClicked = (e: any, roomNumber: number) => {};

  const handleEditSubmit = async (e: any) => {
    e.preventDefault();
  };

  const handleDelete = async (e: any, roomNumber: number) => {
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
            Edit Title
          </h1>

          <form onSubmit={handleEditSubmit}>
            <div className="mb-4">
              <label
                htmlFor="roomNumber"
                className="mb-3 block text-black dark:text-white"
              >
                Room number
              </label>
              <input
                type="number"
                placeholder="Enter room number"
                id="roomNumber"
                name="roomNumber"
                value={}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                readOnly
                disabled
              />
            </div>
            <div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              >
                Edit room
              </button>
              <button
                className="inline-flex items-center justify-center rounded-md bg-meta-7 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 ml-4"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="bg-white p-8 dark:bg-boxdark">
          <h1 className="text-4xl text-black mb-4 dark:text-white">Rooms</h1>
          <table className="w-full">
            <thead className="text-left">
              <tr className="border-b pb-2">
                <th className="px-4 py-2">Room Number</th>
                <th className="px-4 py-2">Room Type</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {states.map((state) => (
                <tr key={state.id} className="border-b">
                  <td className="px-4 py-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded dark:text-white"
                      onClick={(e) => handleEditClicked(e, room.roomNumber)}
                    >
                      <FaPenToSquare className="text-lg text-current" />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded dark:text-white"
                      onClick={(e) => handleDelete(e, room.roomNumber)}
                    >
                      <FaTrash className="text-lg text-current" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      <ToastContainer />
    </>
  );
}
