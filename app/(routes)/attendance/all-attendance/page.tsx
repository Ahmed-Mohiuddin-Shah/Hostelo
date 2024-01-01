"use client";
import Loader from "@/components/common/Loader";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

interface IAttendance {
  student_image: string;
  student_id: number;
  name: string;
  room_number: string;
  date: string;
  status: boolean;
}

export default function Page() {
  const auth = useAuth();
  const [attendance, setAttendance] = useState<IAttendance[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<IAttendance[]>(
    []
  );
  const [filterText, setFilterText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      let data;
      try {
        const response = await axios.get("/api/attendance/get-attendance");
        data = response.data;
      } catch (error) {
        console.error(error);
      }

      if (data.status) {
        setAttendance(data.data);
        setFilteredAttendance(data.data);
      } else {
        toast.error(data.message);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    handleFilterTextChange();
  }, [filterText]);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  function handleFilterTextChange() {
    if (filterText.length === 0) {
      setFilteredAttendance(attendance);
      return;
    }

    const filtered = attendance.filter((student) => {
      const name = student.name.toLowerCase();
      const roomNumber = String(student.room_number).toLowerCase();
      const date = student.date.toLowerCase();
      const query = filterText.toLowerCase();

      return (
        name.includes(query) ||
        roomNumber.includes(query) ||
        date.includes(query)
      );
    });
    setFilteredAttendance(filtered);
  }

  const handleChangeAttendance = async (student_id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      showCancelButton: true,
    });
    if (!result.isConfirmed) return;

    const student = attendance.find(
      (student) => student.student_id === student_id
    );

    const date = student?.date;

    const response = await toast.promise(
      axios.put(`/api/attendance/edit-attendance/${student?.student_id}`, {
        student_id,
        status: !student?.status,
        date: student?.date,
      }),
      {
        pending: "Submitting",
        success: "Attendance updated",
        error: "Failed to update attendance",
      }
    );

    const data = response.data;
    if (!data.status) {
      toast.error(data.msg);
      return;
    }

    const updatedAttendance = attendance.map((student) => {
      if (student.student_id === student_id && student.date === date) {
        return {
          ...student,
          status: !student.status,
        };
      }
      return student;
    });
    setAttendance(updatedAttendance);
    setFilteredAttendance(updatedAttendance);
  };

  return (
    <>
      <section className="bg-white p-8 dark:bg-boxdark">
        <h1 className="text-4xl text-black mb-4 dark:text-white">Attendance</h1>
        {/* Search box */}
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
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Room Number</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Present</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No attendance found
                  </td>
                </tr>
              )}
              {filteredAttendance.map((student) => (
                <tr
                  key={`${student.student_id}-${student.date}`}
                  className="border-b"
                >
                  <td className="px-4 py-2">
                    <Image
                      src={
                        student.student_image.length === 0
                          ? "/images/user/avatar.png"
                          : student.student_image
                      }
                      alt={student.name}
                      className="w-10 h-10 rounded-full"
                      width={40}
                      height={40}
                    />
                  </td>
                  <td className="px-4 py-2">{student.name}</td>
                  <td className="px-4 py-2">{student.room_number}</td>
                  <td className="px-4 py-2">{student.date}</td>
                  <td className="px-4 py-2">
                    {student.status ? (
                      <div className="bg-meta-3 w-fit p-2 rounded">
                        <FaCheck className="text-white" />
                      </div>
                    ) : (
                      <div className="bg-meta-1 w-fit p-2 rounded">
                        <FaXmark className="text-white" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className={`bg-${
                        student.status ? "meta-7" : "meta-3"
                      } text-white rounded px-4 py-2 bg-opacity-90`}
                      onClick={() => handleChangeAttendance(student.student_id)}
                    >
                      Mark as {student.status ? "absent" : "present"}
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
