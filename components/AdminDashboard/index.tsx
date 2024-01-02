"use client";
import React, { useEffect, useState } from "react";
import CardDataStats from "../CardDataStats/CardDataStats";

import {
  FaCubesStacked,
  FaFilePen,
  FaGraduationCap,
  FaHouseUser,
} from "react-icons/fa6";
import axios from "axios";
import DataTable from "../Tables/DataTable";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";

interface MessOffStudentInterface {
  studentId: string;
  name: string;
  room: string;
  messOnDate: string;
}
interface ComplaintInterface {
  title: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [totalStudents, setTtotalStudents] = useState<number>(0);
  const [freeSlots, setFreeSlots] = useState<number>(0);
  const [numberOfAssets, setNumberOfAssets] = useState<number>(0);
  const [numberOfActiveComplaints, setNumberOfActiveComplaints] =
    useState<number>(0);
  const [messOffStudents, setMessOffStudents] = useState<
    MessOffStudentInterface[]
  >([]);
  const [recentComplaints, setRecentComplaints] = useState<
    ComplaintInterface[]
  >([]);

  const headings = ["Student ID", "Name", "Room", "Mess on Date"];
  const keys = ["studentId", "name", "room", "messOnDate"];

  // Get data from api related to dashboard
  useEffect(() => {
    const getTotalStudents = async () => {
      let data;
      try {
        const res = await axios.get("/api/students/number-of-students");
        data = await res.data;
      } catch (error) {
        toast.error("Unable to connect to server.");
        throw error;
      }

      if (data.status) {
        setTtotalStudents(data.data.count);
      } else {
        console.log(data.msg);
      }

      // setTtotalStudents(res.data.total);
    };

    const getFreeSlotsInRooms = async () => {
      let data;

      try {
        const res = await axios.get("/api/rooms/number-of-free-slots");
        data = await res.data;
      } catch (error) {
        toast.error("Unable to connect to server.");
        throw error;
      }

      if (data.status) {
        setFreeSlots(data.data.count);
      } else {
        console.log(data.msg);
      }
    };

    const getNumberOfAssets = async () => {
      let data;

      try {
        const res = await axios.get("/api/assets/number-of-assets");
        data = await res.data;
      } catch (error) {
        toast.error("Unable to connect to server.");
        throw error;
      }

      if (data.status) {
        setNumberOfAssets(data.data.count);
      } else {
        console.log(data.msg);
      }
    };

    const getNumberOfActiveComplaints = async () => {
      let data;

      try {
        const res = await axios.get(
          "/api/complaints/number-of-active-complaints"
        );
        data = await res.data;
      } catch (error) {
        toast.error("Unable to connect to server.");
        throw error;
      }

      if (data.status) {
        setNumberOfActiveComplaints(data.data.count);
      } else {
        console.log(data.msg);
      }
    };

    const getStudentWithMessOff = async () => {
      let data;

      try {
        const res = await axios.get("/api/mess/mess-off-students");
        data = await res.data;
      } catch (error) {
        toast.error("Unable to connect to server.");
        throw error;
      }

      if (data.status) {
        const messOffStudents = data.data.students.map(
          ([studentId, name, room, messOnDate]: string[]) => {
            return {
              studentId: studentId,
              name: name,
              room: room,
              messOnDate: messOnDate,
            };
          }
        );
        setMessOffStudents(messOffStudents);
      } else {
        console.log(data.msg);
      }
    };

    const getRecentComplaints = async () => {
      let data;

      try {
        const res = await axios.get("/api/complaints/recent-complaints");
        data = await res.data;
      } catch (error) {
        toast.error("Unable to connect to server.");
        throw error;
      }

      if (data.status) {
        const recentComplaints = data.data.recent_complaints.map(
          ([title, status]: string[]) => {
            return {
              title,
              status,
            };
          }
        );
        setRecentComplaints(recentComplaints);
      } else {
        console.log(data.msg);
      }
    };

    getTotalStudents();
    getFreeSlotsInRooms();
    getNumberOfAssets();
    getNumberOfActiveComplaints();
    getStudentWithMessOff();
    getRecentComplaints();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total Students" total={`${totalStudents}`}>
          <FaGraduationCap className="fill-primary dark:fill-white text-2xl" />
        </CardDataStats>
        <CardDataStats title="Available Student Slots" total={`${freeSlots}`}>
          <FaHouseUser className="fill-primary dark:fill-white text-2xl" />
        </CardDataStats>
        <CardDataStats title="Assets Quantity" total={`${numberOfAssets}`}>
          <FaCubesStacked className="fill-primary dark:fill-white text-2xl" />
        </CardDataStats>
        <CardDataStats
          title="Complaints and queries"
          total={`${numberOfActiveComplaints}`}
        >
          <FaFilePen className="fill-primary dark:fill-white text-2xl" />
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
            <div className="flex w-full flex-wrap gap-3 sm:gap-5">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
                Students with mess off
              </h2>
            </div>
          </div>

          <div className="-ml-5 h-[355px] w-[105%] overflow-auto">
            <div className="h-80 rounded-sm bg-white px-5 pt-6 pb-2.5 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <div className="max-w-full overflow-x-auto">
                <DataTable
                  headings={headings}
                  data={messOffStudents}
                  keys={keys}
                  emptyMessage="No students with mess off"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Complaints & Queries */}
        <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
          <div className="mb-4 justify-between gap-4 sm:flex flex-col">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Recent Complaints
            </h4>

            {recentComplaints.length === 0 && (
              <p className="text-black dark:text-white text-center">
                No recent complaints
              </p>
            )}

            {recentComplaints.map((complaint, index) => (
              <article
                className="p-2 shadow rounded border border-gray"
                key={index}
              >
                <h5 className="text-lg font-semibold text-meta-5">
                  {complaint.title}
                </h5>
                <p className="text-lg">{complaint.status}</p>
              </article>
            ))}
            {recentComplaints.length > 0 && (
              <Link
                href="/complaints/all-complaints"
                className="text-primary font-semibold text-lg"
              >
                View all complaints
              </Link>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Dashboard;
