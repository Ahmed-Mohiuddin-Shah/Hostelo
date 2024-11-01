"use client";

import AdminDashboard from "@/components/AdminDashboard";
import Loader from "@/components/common/Loader";
import { AuthContext } from "@/contexts/UserAuthContext";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaBellConcierge, FaFilePen, FaSnowflake } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";

// export const metadata: Metadata = {
//   title: "Hostelo | Hostel Management System",
//   description: "This is a hostel management system.",
//   // other metadata
// };

interface IAnnouncement {
  id: number;
  title: string;
  description: string;
  date: string;
}

interface IStudent {
  student_id: number;
  student_name: string;
  email: string;
  phone_number: string;
  room_number: string;
  student_image: string;
  semester: string;
  school: string;
  gender: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const [currentRole, setCurrentRole] = useState<string>("");
  const auth = useAuth();

  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [currentStudent, setCurrentStudent] = useState<IStudent>();

  useEffect(() => {
    const getAnnoucements = async () => {
      let data;
      try {
        const response = await axios.get(
          "/api/announcements/all-announcements"
        );
        data = response.data;
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong, please try again later.");
        return;
      }

      if (!data.status) {
        toast.error("Something went wrong, please try again later.");
        return;
      }

      const announcements = data.data;

      if (announcements.length > 2) {
        announcements.length = 2;
      }

      setAnnouncements(data.data);
    };
    getAnnoucements();
  }, []);

  useEffect(() => {
    if (!authContext.token) return;
    if (authContext.userInfo?.role !== "student") return;
    const getStudents = async () => {
      let data;
      try {
        const response = await axios.get("/api/students/get-all-students");
        data = await response.data;
      } catch (error) {
        toast.error("Unable to connect to server.");
      }

      if (!data.status) {
        toast.error(data.msg);
        return;
      }

      const student = data.data.find(
        (student: any) => student.email === authContext.userInfo?.username
      );

      if (!student) {
        toast.error("Student not found.");
        return;
      }

      setCurrentStudent(student);
    };
    getStudents();
  }, [authContext.token, authContext.userInfo?.username]);

  useEffect(() => {
    if (!authContext.userInfo?.role) return;
    setCurrentRole(authContext.userInfo?.role);
  }, [authContext.userInfo?.role]);

  useEffect(() => {
    if (auth === null) setIsLoading(true);
    else setIsLoading(false);
  }, [auth]);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (isLoading) return <Loader />;

  if (currentRole === "worker") {
    return <>{redirect("/room-services/all-room-services")}</>;
  }

  if (currentRole !== "student") return <AdminDashboard />;

  return (
    <>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div
          className={`col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5`}
        >
          <h1 className="text-4xl text-black mb-4 dark:text-white">
            Welcome {currentStudent?.student_name}
          </h1>

          <div className="flex gap-8 items-center flex-wrap">
            <div className="flex items-center gap-4 sm:flex-col sm:gap-5">
              <div className="overflow-hidden rounded-full w-40 h-40 relative">
                <Image
                  src={
                    currentStudent?.student_image || "/images/user/avatar.png"
                  }
                  alt="user image"
                  className="w-full h-full object-cover"
                  width={160}
                  height={160}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-black dark:text-white">
                  Email:
                </h2>
                <p className="text-lg text-black dark:text-white break-all">
                  {currentStudent?.email}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-black dark:text-white">
                  Phone Number:
                </h2>
                <p className="text-lg text-black dark:text-white">
                  {currentStudent?.phone_number}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-black dark:text-white">
                  Room Number:
                </h2>
                <p className="text-lg text-black dark:text-white">
                  {currentStudent?.room_number}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-black dark:text-white">
                  Semester:
                </h2>
                <p className="text-lg text-black dark:text-white">
                  {currentStudent?.semester}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-black dark:text-white">
                  School:
                </h2>
                <p className="text-lg text-black dark:text-white uppercase">
                  {currentStudent?.school}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
            <div className="flex w-full flex-wrap gap-3 sm:gap-5">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
                Recent Announcements
              </h2>
            </div>
          </div>

          <div className="-ml-5 h-[355px] w-[105%] overflow-auto">
            <div className="h-80 rounded-sm bg-white px-5 pt-6 pb-2.5 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <div className="max-w-full overflow-x-auto">
                <div className="grid grid-cols-12 gap-4">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="border border-stroke rounded-md col-span-12 p-4 text-2xl dark:bg-black dark:border-black-2"
                    >
                      <p className="text-meta-5 font-medium text-sm uppercase dark:text-white">
                        {announcement.date}
                      </p>
                      <h4 className="text-2xl mb-4">{announcement.title}</h4>
                      <p className="text-lg">{announcement.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
          <div className="mb-4 justify-between gap-4 sm:flex flex-col">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Quick Actions
            </h4>

            {/* Request room service */}
            <Link
              href="/room-services/request-room-service"
              className="text-lg text-primary font-semibold hover:underline cursor-pointer flex items-center gap-2"
            >
              <FaBellConcierge className="fill-current text-lg " />
              <span>Request Room Service</span>
            </Link>
            {/* File complaint */}
            <Link
              href="/complaints/add-complaint"
              className="text-lg text-primary font-semibold hover:underline cursor-pointer flex items-center gap-2"
            >
              <FaFilePen className="fill-current text-lg " />
              <span>File Complaint</span>
            </Link>
            {/* Request mess off */}
            <Link
              href="/mess-off"
              className="text-lg text-primary font-semibold hover:underline cursor-pointer flex items-center gap-2"
            >
              <FaSnowflake className="fill-current text-lg " />
              <span>Request Mess Off</span>
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
