"use client";
import NotAuthorized from "@/components/NotAuthorized";
import Loader from "@/components/common/Loader";
import useAccess from "@/hooks/useAccess";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaCheckDouble, FaSpinner } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";

interface IAttendance {
  student_image: string;
  student_id: string;
  name: string;
  room_number: string;
  room_type: string;
  isPresent: boolean;
}

export default function Page() {
  const auth = useAuth();
  const [students, setStudents] = useState<IAttendance[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasAccess = useAccess(["admin", "manager"]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      let data;
      try {
        const response = await axios.get("/api/attendance/student-details");
        data = response.data;
      } catch (error) {
        console.error(error);
      }

      if (data.status) {
        const students = data.data.map((student: IAttendance) => {
          student.isPresent = true;
          return student;
        });
        setStudents(students);
      } else {
        toast.error(data.message);
      }
      setIsLoading(false);
    };
    fetchStudents();
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

  const saveAttendance = async () => {
    setIsSubmitting(true);
    let data;
    try {
      const response = await axios.post("/api/attendance/mark-attendance", {
        students,
      });
      data = response.data;
    } catch (error) {
      console.error(error);
    }
    console.log(data);
    if (data.status) {
      toast.success(data.msg);
    } else {
      toast.error(data.msg);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <section className="bg-white p-8 dark:bg-boxdark">
        <h1 className="text-4xl text-black mb-4 dark:text-white">
          Mark Attendance
        </h1>
        <table className="w-full text-lg">
          <thead className="text-left">
            <tr className="border-b pb-2">
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Room Number</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  <Loader heightClass="h-24" />
                </td>
              </tr>
            )}
            {students.length === 0 && !isLoading && (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No students found
                </td>
              </tr>
            )}
            {students.map((student) => (
              <tr key={student.student_id} className="border-b">
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
                <td className="px-4 py-2">
                  <label
                    htmlFor={`toggle-${student.student_id}`}
                    className="flex cursor-pointer select-none items-center"
                  >
                    <div className="relative">
                      <input
                        id={`toggle-${student.student_id}`}
                        type="checkbox"
                        className="sr-only"
                        onChange={() => {
                          const newStudents = students.map((s) => {
                            if (s.student_id === student.student_id) {
                              s.isPresent = !s.isPresent;
                            }
                            return s;
                          });
                          setStudents(newStudents);
                        }}
                      />
                      <div
                        className={`h-5 w-14 rounded-full bg-danger bg-opacity-40 shadow-inner transition-colors duration-75 dark:bg-[#5A616B] ${
                          student.isPresent && "bg-meta-3 dark:bg-white"
                        }`}
                      ></div>
                      <div
                        className={`dot absolute left-0 -top-1 h-7 w-7 rounded-full bg-danger shadow-switch-1 transition ${
                          student.isPresent &&
                          "!right-0 !translate-x-full !bg-meta-3 dark:!bg-white"
                        }`}
                      ></div>
                    </div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="mt-4 inline-flex items-center justify-center gap-2.5 bg-meta-3 py-4 px-10 text-center font-medium text-white rounded hover:bg-opacity-90 lg:px-8 xl:px-10"
          onClick={saveAttendance}
        >
          <span>
            {isSubmitting ? (
              <FaSpinner className="animate-spin text-lg" />
            ) : (
              <FaCheckDouble className="text-lg" />
            )}
          </span>
          Save attendance
        </button>
      </section>
      <ToastContainer />
    </>
  );
}
