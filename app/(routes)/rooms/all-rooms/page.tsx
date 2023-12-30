"use client";
import Loader from "@/components/common/Loader";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FaChevronDown,
  FaCircleExclamation,
  FaDoorClosed,
  FaPenToSquare,
  FaTrash,
  FaXmark,
} from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

interface IRoom {
  roomNumber: number;
  roomType: string;
}
interface IRoomType {
  id: number;
  type: string;
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [isEditing, setIsEditing] = useState<boolean | null>(false);
  const [underEditingRoom, setUnderEditingRoom] = useState<IRoom | null>(null);
  const [roomTypes, setRoomTypes] = useState<IRoomType[]>([]);
  const modal = useRef<HTMLDivElement>(null);

  const auth = useAuth();

  useEffect(() => {
    if (auth === null) setIsLoading(true);
    else setIsLoading(false);
  }, [auth]);

  useEffect(() => {
    const getRooms = async () => {
      let data;
      try {
        const response = await axios.get("/api/rooms/all-rooms");
        data = await response.data;
      } catch (error) {
        toast.error("Unable to connect to server.");
      }

      if (data.status) {
        const rooms = data.data;
        const roomsFormatted = rooms.map((room: any) => ({
          roomNumber: room[0],
          roomType: room[1],
        }));
        setRooms(roomsFormatted);
      } else {
        console.log(data.message);
      }
    };

    getRooms();
  }, []);

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

  const handleEditRoom = (e: any, roomNumber: number) => {
    setIsEditing(true);
    const room = rooms.find((room) => room.roomNumber === roomNumber);
    if (!room) return;
    setUnderEditingRoom(room);
  };

  const handleEditRoomSubmit = async (e: any) => {
    e.preventDefault();

    const roomTypeId = e.target.roomType.value;

    if (roomTypeId === "") {
      toast.error("Please fill all the fields.");
      return;
    }

    let data;

    try {
      const response = await axios.post(
        `/api/rooms/edit-room/${underEditingRoom?.roomNumber}`,
        {
          room_type: roomTypeId,
        }
      );
      data = await response.data;
    } catch (error) {
      toast.error("Unable to connect to server.");
    }

    if (data.status) {
      toast.success("Room edited successfully.");
      const roomsFiltered = rooms.filter(
        (room) => room.roomNumber !== underEditingRoom?.roomNumber
      );

      if (!underEditingRoom) return;

      setRooms([
        ...roomsFiltered,
        { ...underEditingRoom, roomType: roomTypes[roomTypeId - 1].type },
      ]);
      setIsEditing(false);
      setUnderEditingRoom(null);
    } else {
      toast.error("Unable to edit room.");
    }
  };

  const handleDeleteRoom = async (e: any, roomNumber: number) => {
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
      const response = await axios.delete(
        `/api/rooms/delete-room/${roomNumber}`
      );
      data = await response.data;
    } catch (error) {
      toast.error("Unable to connect to server.");
    }

    if (data.status) {
      toast.success("Room deleted successfully.");
      const roomsFiltered = rooms.filter(
        (room) => room.roomNumber !== roomNumber
      );
      setRooms(roomsFiltered);
    } else {
      toast.error("Unable to delete room.");
    }
  };

  return (
    <>
      {isEditing ? (
        <section className="bg-white p-8 dark:bg-boxdark">
          <h1 className="text-4xl text-black mb-4 dark:text-white">
            Edit Room
          </h1>

          <form onSubmit={handleEditRoomSubmit}>
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
                value={underEditingRoom?.roomNumber}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                readOnly
                disabled
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
                Edit room
              </button>
              <button
                className="inline-flex items-center justify-center rounded-md bg-meta-7 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 ml-4"
                onClick={() => {
                  setIsEditing(false);
                  setUnderEditingRoom(null);
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
              {rooms.map((room) => (
                <tr className="border-b pb-2" key={room.roomNumber}>
                  <td className="px-4 py-2">{room.roomNumber}</td>
                  <td className="px-4 py-2">{room.roomType}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded dark:text-white"
                      onClick={(e) => handleEditRoom(e, room.roomNumber)}
                    >
                      <FaPenToSquare className="text-lg text-current" />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded dark:text-white"
                      onClick={(e) => handleDeleteRoom(e, room.roomNumber)}
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
