"use client";
import StudentForm from "@/components/StudentForm";
import Loader from "@/components/common/Loader";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import Image from "next/image";
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

interface IStudent {
  student_image: string;
  student_id: string;
  student_name: string;
  email: string;
  student_cnic: string;
  gender: string;
  school: string;
  department: string;
  semester: string;
  batch: string;
  room_number: string;
  phone_number: string;
  permanent_address: string;
  temporary_address: string;
  problem: string;
  description: string;
  regular_medicine: string;
  blood_group: string;
  is_smoker: string;
  father_name: string;
  father_cnic: string;
  father_phone_number: string;
  mother_name: string;
  mother_cnic: string;
  mother_phone_number: string;
  relative_1_name: string;
  relative_1_cnic: string;
  relative_1_relation: string;
  relative_2_name: string;
  relative_2_cnic: string;
  relative_2_relation: string;
  relative_3_name: string;
  relative_3_cnic: string;
  relative_3_relation: string;
}
interface IRoomType {
  id: number;
  type: string;
}

export default function Page() {
  const auth = useAuth();

  const [students, setStudents] = useState<IStudent[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [underEditStudent, setUnderEditStudent] = useState<IStudent>();
  const [freeRooms, setFreeRooms] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getStudents = async () => {
      let data;
      try {
        const response = await axios.get("/api/students/get-all-students");
        data = await response.data;
      } catch (error) {
        toast.error("Unable to connect to server.");
      }

      if (data.status) {
        const students = data.data;
        setStudents(students);
      } else {
        console.log(data.msg);
      }
    };
    getStudents();

    const getFreeRooms = async () => {
      let data;
      try {
        const response = await axios.get("/api/rooms/all-free-rooms");
        data = await response.data;
      } catch (error) {
        toast.error("Unable to connect to server.");
      }

      if (data.status) {
        const freeRooms = data.data;
        setFreeRooms(freeRooms);
      } else {
        console.log(data.msg);
      }
    };
    getFreeRooms();
  }, []);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  const handleStudentEditClicked = (student_id: string) => {
    const student = students.find(
      (student) => student.student_id === student_id
    );
    if (!student) return;
    setUnderEditStudent(student);
    setIsEditing(true);
  };
  const handleCancelClicked = () => {
    setIsEditing(false);
  };

  const handleStudentEditSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    const onlyNumbersField = [
      "student_cnic",
      "phone_number",
      "father_cnic",
      "father_phone_number",
      "mother_cnic",
      "mother_phone_number",
      "relative_1_cnic",
      "relative_2_cnic",
      "relative_3_cnic",
    ];
    for (let field of onlyNumbersField) {
      if (!/^[0-9]*$/g.test(underEditStudent[field])) {
        toast.error(`Invalid ${field} please remove any non number characters`);
        setIsSubmitting(false);
        return;
      }
    }

    const openEndedFields = [
      "student_name",
      "department",
      "problem",
      "description",
      "regular_medicine",
      "father_name",
      "mother_name",
      "relative_1_name",
      "relative_2_name",
      "relative_3_name",
    ];
    for (let field of openEndedFields) {
      if (!/^[a-zA-Z\s]*$/g.test(underEditStudent[field])) {
        toast.error(`Invalid ${field}`);
        setIsSubmitting(false);
        return;
      }
    }

    // setUnderEditStudent({
    //   ...underEditStudent!,
    //   student_id: underEditStudent!.student_id.trim(),
    //   student_image: underEditStudent!.student_image || "",
    // });

    underEditStudent!.student_name = underEditStudent!.student_name.trim();

    const requiredFields = [
      "student_id",
      "student_name",
      "student_cnic",
      "email",
      "gender",
      "school",
      "department",
      "semester",
      "batch",
      "room_number",
      "phone_number",
      "permanent_address",
      "temporary_address",
      "blood_group",
      "father_name",
      "father_cnic",
      "father_phone_number",
      "mother_name",
      "mother_cnic",
      "mother_phone_number",
      "relative_1_name",
      "relative_1_cnic",
      "relative_1_relation",
      "relative_2_name",
      "relative_2_cnic",
      "relative_2_relation",
      "relative_3_name",
      "relative_3_cnic",
      "relative_3_relation",
    ];
    for (let field of requiredFields) {
      if (!underEditStudent || !underEditStudent[field as keyof IStudent]) {
        toast.error(`Please fill ${field}`);
        setIsSubmitting(false);
        return;
      }
    }

    // upload image
    if (
      underEditStudent.student_image &&
      underEditStudent.student_image instanceof File
    ) {
      const imageFormData = new FormData();
      imageFormData.set("file", underEditStudent.student_image);

      try {
        const data = await toast.promise(
          fetch("/api/upload", {
            method: "POST",
            body: imageFormData,
          }).then((res) => res.json()), // parse response as JSON
          {
            pending: "Uploading image...",
            success: "Image uploaded successfully",
            error: "Error uploading image. Try again please",
          }
        );

        if (!data.ok) {
          toast.error("Error uploading image. Try again please");
          setIsSubmitting(false);
          return;
        }
        const { path } = data;
        const imageName = path.split("\\").pop();
        underEditStudent.student_image = `/images/uploads/${imageName}`;
      } catch (error) {
        toast.error("Error uploading image. Try again please");
        setIsSubmitting(false);
        return;
      }
    }

    let data;

    try {
      const response = await axios.put(
        `/api/students/edit-student/${underEditStudent!.student_id}`,
        underEditStudent
      );
      data = await response.data;
      console.log(data.status);
    } catch (error) {
      toast.error("Unable to connect to server.");
      setIsSubmitting(false);
      return;
    }

    if (!data.status) {
      toast.error(data.msg);
      console.log("Error while editing student");
    } else {
      toast.success(data.msg);
      console.log("Student edited successfully");
    }
    setIsSubmitting(false);
  };

  const handleDeleteStudent = async (student_id: string) => {
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
        `/api/student/delete-student/${student_id}`
      );
      data = await response.data;
    } catch (error) {
      toast.error("Unable to connect to server.");
    }

    if (data.status) {
      toast.success("Student deleted successfully.");
      setStudents(
        students.filter((student) => student.student_id !== student_id)
      );
    } else {
      toast.error(data.msg);
    }
  };

  return (
    <>
      {isEditing ? (
        <section className="bg-white p-8 dark:bg-boxdark">
          <h1 className="text-4xl text-black mb-4 dark:text-white">
            Edit Student Details
          </h1>

          <StudentForm
            formData={underEditStudent}
            freeRooms={freeRooms}
            isSubmitting={isSubmitting}
            onSubmit={handleStudentEditSubmit}
            onCancel={handleCancelClicked}
            setFormData={setUnderEditStudent}
            isEditing={true}
          />
        </section>
      ) : (
        <section className="bg-white p-8 dark:bg-boxdark">
          <h1 className="text-4xl text-black mb-4 dark:text-white">Students</h1>
          <div className="overflow-auto">
            <table className="w-full">
              <thead className="text-left">
                <tr className="border-b pb-2">
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Id</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Room Number</th>
                  <th className="px-4 py-2">Semester</th>
                  <th className="px-4 py-2">School</th>
                  <th className="px-4 py-2">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.student_id} className="border-b">
                    <td className="px-4 py-2">
                      <Image
                        src={
                          student.student_image.length === 0
                            ? "/images/user/avatar.png"
                            : student.student_image
                        }
                        alt="student image"
                        className="rounded-full h-10 w-10"
                        height={40}
                        width={40}
                      />
                    </td>
                    <td className="px-4 py-2">{student.student_id}</td>
                    <td className="px-4 py-2">{student.student_name}</td>
                    <td className="px-4 py-2">{student.room_number}</td>
                    <td className="px-4 py-2">{student.semester}</td>
                    <td className="px-4 py-2">{student.school}</td>
                    <td className="px-4 py-2">{student.phone_number}</td>
                    <td className="px-4 py-2">
                      <div className="flex">
                        <button
                          className="text-blue-500 hover:text-blue-700 mr-2"
                          onClick={() =>
                            handleStudentEditClicked(student.student_id)
                          }
                        >
                          <FaPenToSquare />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() =>
                            handleDeleteStudent(student.student_id)
                          }
                        >
                          <FaTrash />
                        </button>
                      </div>
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
