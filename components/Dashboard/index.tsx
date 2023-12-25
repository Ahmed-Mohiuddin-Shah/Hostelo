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

interface MessOffStudentInterface {
  studentId: string;
  name: string;
  room: string;
  messOnDate: string;
}
interface ComplaintInterface {
  studentName: string;
  text: string;
}

const ECommerce: React.FC = () => {
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
  >([{ studentName: "John Doe", text: "This is a complaint" }]);

  const headings = ["Student ID", "Name", "Room", "Mess on Date"];
  const keys = ["studentId", "name", "room", "messOnDate"];

  // Get data from api related to dashboard
  useEffect(() => {
    const getTotalStudents = async () => {
      const res = await axios.get("/api/students/number-of-students");
      const data = await res.data;
      console.log(data);
      // setTtotalStudents(res.data.total);
    };

    const getFreeSlotsInRooms = async () => {
      const res = await axios.get("/api/rooms/number-of-free-slots");
      const data = await res.data;
      console.log(data);
      // setFreeSlotsInRooms(res.data.total);
    };

    const getNumberOfAssets = async () => {
      const res = await axios.get("/api/assets/number-of-assets");
      const data = await res.data;
      console.log(data);
      // setNumberOfAssets(res.data.total);
    };

    const getNumberOfActiveComplaints = async () => {
      const res = await axios.get(
        "/api/complaints/number-of-active-complaints"
      );
      const data = await res.data;
      console.log(data);
      // setNumberOfActiveComplaints(res.data.total);
    };

    const getStudentWithMessOff = async () => {
      const res = await axios.get("/api/students/mess-off-students");
      const data = await res.data;
      console.log(data);
      // setMessOffStudents(res.data.total);
    };

    const getRecentComplaints = async () => {
      const res = await axios.get("/api/complaints/recent-complaints");
      const data = await res.data;
      console.log(data);
      // setRecentComplaints(res.data.total);
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
        <CardDataStats title="Assets" total={`${numberOfAssets}`}>
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
            <div className="h-80 rounded-sm bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
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
                className="p-2 shadow rounded border border-secondary"
                key={index}
              >
                <h5 className="text-lg font-semibold text-meta-5">
                  {complaint.studentName}
                </h5>
                <p className="text-lg">{complaint.text}</p>
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
    </>
  );
};

export default ECommerce;
