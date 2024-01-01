"use client";
import NotAuthorized from "@/components/NotAuthorized";
import Loader from "@/components/common/Loader";
import { AuthContext } from "@/contexts/UserAuthContext";
import useAccess from "@/hooks/useAccess";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaChevronDown, FaDoorClosed } from "react-icons/fa6";
import { PatternFormat } from "react-number-format";
import { ToastContainer, toast } from "react-toastify";

interface IStudent {
  id: number;
  name: string;
  image: string;
  roomNumber: number;
}

export default function Page() {
  const auth = useAuth();
  const hasAccess = useAccess(["manager", "admin"]);
  const authContext = useContext(AuthContext);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [firstStudent, setFirstStudent] = useState<IStudent>();
  const [secondStudent, setSecondStudent] = useState<IStudent>();

  useEffect(() => {
    if (!authContext.token) {
      return;
    }

    const getStudents = async () => {
      let data;
      try {
        const response = await axios.get("/api/students/swap-details", {
          headers: {
            Authorization: `${authContext.token}`,
          },
        });
        data = response.data;
      } catch (e) {
        console.log(e);
        return toast.error("Something went wrong");
      }
      console.log(data);

      if (!data.status) {
        return toast.error(data.msg);
      }
      setStudents(data.data);
    };
    getStudents();
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

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    if (!firstStudent || !secondStudent) {
      return toast.error("Please select both students");
    }

    if (!authContext.token) {
      toast.error("Please login to continue");
      return redirect("/auth/signin");
    }

    let data;
    try {
      const response = await axios.post(
        "/api/students/swap-room",
        {
          firstStudentId: firstStudent.id,
          secondStudentId: secondStudent.id,
          firstStudentRoomNumber: firstStudent.roomNumber,
          secondStudentRoomNumber: secondStudent.roomNumber,
        },
        {
          headers: {
            Authorization: `${authContext.token}`,
          },
        }
      );
      data = response.data;
    } catch (e) {
      console.log(e);
      return toast.error("Something went wrong");
    }

    if (!data.status) {
      return toast.error(data.msg);
    }

    toast.success(data.msg);
    setFirstStudent(undefined);
    setSecondStudent(undefined);
  };

  return (
    <>
      <section className="bg-white p-8 dark:bg-boxdark">
        <h1 className="text-4xl text-black mb-6 dark:text-white">Swap Room</h1>

        <form onSubmit={handleFormSubmit} className="grid grid-cols-12 gap-4">
          <div className="mb-4 col-span-12 sm:col-span-6">
            <label
              htmlFor="input1"
              className="mb-3 block text-black dark:text-white"
            >
              First Student
            </label>
            <select
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              value={firstStudent?.id || ""}
              onChange={(e) => {
                const currentId = parseInt(e.target.value);
                const student = students.find((s) => s.id === currentId);
                setFirstStudent(student);
              }}
              required
            >
              <option value="" disabled>
                -- Select First student --
              </option>
              {students.map((student) => (
                <option
                  key={student.id}
                  value={student.id}
                  disabled={
                    secondStudent?.id === student.id ||
                    secondStudent?.roomNumber === student.roomNumber
                  }
                  className="disabled:bg-bodydark2"
                >
                  {student.id}
                </option>
              ))}
            </select>
          </div>

          {firstStudent && (
            <article className="mb-4 col-span-12 sm:col-span-6 sm:hidden flex flex-col justify-center items-center p-6 rounded border border-stroke">
              <Image
                src={firstStudent?.image || "/images/user/avatar.png"}
                width={100}
                height={100}
                alt="Student Image"
              />
              <h3 className="text-2xl">{firstStudent?.name}</h3>
              <p>Current Room: {firstStudent?.roomNumber}</p>
            </article>
          )}

          <div className="mb-4 col-span-12 sm:col-span-6">
            <label
              htmlFor="input1"
              className="mb-3 block text-black dark:text-white"
            >
              Second Student
            </label>
            <select
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              value={secondStudent?.id || ""}
              onChange={(e) => {
                const currentId = parseInt(e.target.value);
                const student = students.find((s) => s.id === currentId);
                setSecondStudent(student);
              }}
              required
            >
              <option value="" disabled>
                -- Select Second student --
              </option>
              {students.map((student) => (
                <option
                  key={student.id}
                  value={student.id}
                  disabled={
                    firstStudent?.id === student.id ||
                    firstStudent?.roomNumber === student.roomNumber
                  }
                  className="disabled:bg-bodydark2"
                >
                  {student.id}
                </option>
              ))}
            </select>
          </div>

          {firstStudent && (
            <article className="hidden sm:flex mb-4 col-span-12 sm:col-span-6 flex-col justify-center items-center p-6 rounded border border-stroke">
              <Image
                src={firstStudent?.image || "/images/user/avatar.png"}
                width={100}
                height={100}
                alt="Student Image"
              />
              <h3 className="text-2xl">{firstStudent?.name}</h3>
              <p>Current Room: {firstStudent?.roomNumber}</p>
            </article>
          )}

          {secondStudent && (
            <article className="mb-4 col-span-12 sm:col-span-6 flex flex-col justify-center items-center p-6 rounded border border-stroke">
              <Image
                src={secondStudent?.image || "/images/user/avatar.png"}
                width={100}
                height={100}
                alt="Student Image"
              />
              <h3 className="text-2xl">{secondStudent?.name}</h3>
              <p>Current Room: {secondStudent?.roomNumber}</p>
            </article>
          )}

          <div className="col-span-12">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Swap rooms
            </button>
          </div>
        </form>
      </section>
      <ToastContainer />
    </>
  );
}
