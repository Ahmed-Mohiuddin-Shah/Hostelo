"use client";
import Loader from "@/components/common/Loader";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronDown, FaDoorClosed } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";

interface IRoomType {
  id: number;
  type: string;
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [roomTypes, setRoomTypes] = useState<IRoomType[]>([]);

  const auth = useAuth();

  useEffect(() => {
    if (auth === null) setIsLoading(true);
    else setIsLoading(false);
  }, [auth]);

  useEffect(() => {
    const getRoomTypes = async () => {
      let data;
      try {
        const response = await axios.get("/api/rooms/room-types");
        data = await response.data;
      } catch (error) {
        toast.error("Unable to connect to server.");
      }

      if (data.status) {
        const roomTypes = data.data;
        const roomTypesFormatted = roomTypes.map((roomType: any) => ({
          id: roomType[0],
          type: roomType[1],
        }));
        setRoomTypes(roomTypesFormatted);
      } else {
        console.log(data.message);
      }
    };

    getRoomTypes();
  }, []);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  const handleAddRoom = async (e: any) => {
    e.preventDefault();

    const roomNumber = e.target.roomNumber.value;
    const roomType = e.target.roomType.value;

    if (roomNumber === "" || roomType === "") {
      toast.error("Please fill all the fields.");
      return;
    }

    let data;

    try {
      const response = await axios.post("/api/rooms/add-room", {
        room_number: roomNumber,
        room_type: roomType,
      });
      data = await response.data;
    } catch (error) {
      toast.error("Unable to connect to server.");
      console.log(error);
      throw error;
    }

    if (data === null) {
      toast.error("Unable to get response from server.");
      return;
    }

    if (data.status) {
      toast.success(data.msg);
    } else {
      toast.error(data.msg);
      return;
    }

    e.target.roomNumber.value = "";
    e.target.roomType.value = "";
  };

  return (
    <>
      <section className="bg-white p-8 dark:bg-boxdark">
        <h1 className="text-4xl text-black mb-4 dark:text-white">Add Room</h1>

        <form onSubmit={handleAddRoom}>
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
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="mb-3 block text-black dark:text-white"
              htmlFor="roomType"
            >
              Select Room Type
            </label>
            <div className="relative z-20 bg-white dark:bg-form-input">
              <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                <FaDoorClosed className="text-current text-lg" />
              </span>
              <select
                placeholder="Select Room Type"
                id="roomType"
                name="roomType"
                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                required
              >
                <option value="" disabled>
                  Select Room Type
                </option>
                {roomTypes.map((roomType, index) => (
                  <option key={index} value={roomType.id}>
                    {roomType.type}
                  </option>
                ))}
              </select>
              <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                <FaChevronDown />
              </span>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Add room
            </button>
          </div>
        </form>
      </section>
      <ToastContainer />
    </>
  );
}
