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
  FaEye,
  FaPenToSquare,
  FaTrash,
  FaXmark,
} from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

interface IStudent {
  student_image: any;
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
  const modalRef = useRef<HTMLDivElement>(null);

  const [students, setStudents] = useState<IStudent[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [underEditStudent, setUnderEditStudent] = useState<IStudent>();
  const [viewingStudent, setViewingStudent] = useState<IStudent>();
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
      const value = underEditStudent![field as keyof IStudent];
      if (!/^[0-9]*$/g.test(value)) {
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
      const value = underEditStudent![field as keyof IStudent];
      if (!/^[a-zA-Z\s]*$/g.test(value)) {
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
      underEditStudent?.student_image &&
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
        `/api/students/delete-student/${student_id}`
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

  const showStudentDetails = (student_id: string) => {
    const student = students.find(
      (student) => student.student_id === student_id
    );
    if (!student) return;

    modalRef.current?.classList.remove("hidden");
    setViewingStudent(student);
  };

  const closeModal = () => {
    modalRef.current?.classList.add("hidden");
  };

  return (
    <>
      <div
        ref={modalRef}
        id="static-modal"
        data-modal-backdrop="static"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 z-999999 justify-center items-center w-full h-full max-h-full bg-meta-4 bg-opacity-50 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === modalRef.current) closeModal();
        }}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full left-1/2 -translate-x-1/2">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Student Info
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="static-modal"
                onClick={closeModal}
              >
                <FaXmark className="text-lg" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5 space-y-4 text-black">
              <div className="flex flex-col">
                <div className="flex-shrink-0 flex items-center gap-4">
                  <Image
                    src={
                      viewingStudent?.student_image?.length === 0
                        ? "/images/user/avatar.png"
                        : viewingStudent?.student_image
                    }
                    alt="student image"
                    className="rounded-full h-20 w-20"
                    height={80}
                    width={80}
                  />
                  <div className="flex-1 font-semibold">
                    <h4 className="text-gray-900 dark:text-white">
                      {viewingStudent?.student_name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {viewingStudent?.student_id}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between mt-4 text-base">
                  <div className="max-w-full break-words">
                    Email:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.email}
                    </span>
                  </div>
                  <div className="max-w-full break-words">
                    CNIC:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.student_cnic}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="max-w-full break-words">
                      Gender:{" "}
                      <span className="font-semibold">
                        {viewingStudent?.gender === "M"
                          ? "Male"
                          : viewingStudent?.gender === "F"
                          ? "Female"
                          : "Other"}
                      </span>
                    </div>
                    <div className="max-w-full break-words">
                      School:{" "}
                      <span className="font-semibold">
                        {viewingStudent?.school}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="max-w-full break-words">
                      Semester:{" "}
                      <span className="font-semibold">
                        {viewingStudent?.semester}
                      </span>
                    </div>
                    <div className="max-w-full break-words">
                      Batch:{" "}
                      <span className="font-semibold">
                        {viewingStudent?.batch}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="max-w-full break-words">
                      Room number:{" "}
                      <span className="font-semibold">
                        {viewingStudent?.room_number}
                      </span>
                    </div>
                    <div className="max-w-full break-words">
                      Phone Number:{" "}
                      <span className="font-semibold">
                        {viewingStudent?.phone_number}
                      </span>
                    </div>
                  </div>
                  <div className="max-w-full break-words">
                    Permanent address:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.permanent_address}
                    </span>
                  </div>
                  <div className="max-w-full break-words">
                    Temporary address:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.temporary_address}
                    </span>
                  </div>
                  {viewingStudent?.problem && (
                    <div className="max-w-full break-words">
                      Problem:{" "}
                      <span className="font-semibold">
                        {viewingStudent?.problem}
                      </span>
                    </div>
                  )}
                  {viewingStudent?.description && (
                    <div className="max-w-full break-words">
                      Description:{" "}
                      <span className="font-semibold">
                        {viewingStudent?.description}
                      </span>
                    </div>
                  )}
                  {viewingStudent?.regular_medicine && (
                    <div className="max-w-full break-words">
                      Regular medicine:{" "}
                      <span className="font-semibold">
                        {viewingStudent?.regular_medicine}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <div className="max-w-full break-words">
                      Blood Group:{" "}
                      <span className="font-semibold">
                        {viewingStudent?.blood_group}
                      </span>
                    </div>
                    <div className="max-w-full break-words">
                      Smoker:{" "}
                      <span className="font-semibold">
                        {viewingStudent?.is_smoker ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                  <div className="max-w-full break-words">
                    Temporary address:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.temporary_address}
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="max-w-full break-words">
                    Father name:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.father_name}
                    </span>
                  </div>
                  <div className="max-w-full break-words">
                    Father CNIC:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.father_cnic}
                    </span>
                  </div>
                  <div className="max-w-full break-words">
                    Father phone number:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.father_phone_number}
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="max-w-full break-words">
                    Mother name:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.mother_name}
                    </span>
                  </div>
                  <div className="max-w-full break-words">
                    Mother CNIC:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.mother_cnic}
                    </span>
                  </div>
                  <div className="max-w-full break-words">
                    Mother phone number:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.mother_phone_number}
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="max-w-full break-words">
                    Relative 1 name:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.relative_1_name}
                    </span>
                  </div>
                  <div className="max-w-full break-words">
                    Relative 1 CNIC:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.relative_1_cnic}
                    </span>
                  </div>
                  <div className="max-w-full break-words">
                    Relative 1 relation:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.relative_1_relation}
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="max-w-full break-words">
                    Relative 2 name:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.relative_2_name}
                    </span>
                  </div>
                  <div className="max-w-full break-words">
                    Relative 2 CNIC:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.relative_2_cnic}
                    </span>
                  </div>
                  <div className="max-w-full break-words">
                    Relative 2 relation:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.relative_2_relation}
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="max-w-full break-words">
                    Relative 3 name:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.relative_3_name}
                    </span>
                  </div>
                  <div className="max-w-full break-words">
                    Relative 3 CNIC:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.relative_3_cnic}
                    </span>
                  </div>
                  <div className="max-w-full break-words">
                    Relative 3 relation:{" "}
                    <span className="font-semibold">
                      {viewingStudent?.relative_3_relation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                          student.student_image?.length === 0
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
                          onClick={() => showStudentDetails(student.student_id)}
                        >
                          <FaEye className="text-lg" />
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700 mr-2"
                          onClick={() =>
                            handleStudentEditClicked(student.student_id)
                          }
                        >
                          <FaPenToSquare className="text-lg" />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() =>
                            handleDeleteStudent(student.student_id)
                          }
                        >
                          <FaTrash className="text-lg" />
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
