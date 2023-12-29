"use client";
import Loader from "@/components/common/Loader";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import StudentForm from "@/components/StudentForm";

interface IRoomType {
  id: number;
  type: string;
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [freeRooms, setFreeRooms] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    student_image: "" as any,
    student_id: "",
    student_name: "",
    email: "",
    student_cnic: "",
    gender: "",
    school: "",
    department: "",
    semester: "",
    batch: "",
    room_number: "",
    phone_number: "",
    permanent_address: "",
    temporary_address: "",
    problem: "",
    description: "",
    regular_medicine: "",
    blood_group: "",
    is_smoker: "",
    father_name: "",
    father_cnic: "",
    father_phone_number: "",
    mother_name: "",
    mother_cnic: "",
    mother_phone_number: "",
    relative_1_name: "",
    relative_1_cnic: "",
    relative_1_relation: "",
    relative_2_name: "",
    relative_2_cnic: "",
    relative_2_relation: "",
    relative_3_name: "",
    relative_3_cnic: "",
    relative_3_relation: "",
  });

  const auth = useAuth();

  useEffect(() => {
    if (auth === null) setIsLoading(true);
    else setIsLoading(false);
  }, [auth]);

  useEffect(() => {
    async function getFreeRooms() {
      try {
        const response = await axios.get("/api/rooms/all-free-rooms");
        const data = await response.data;
        setFreeRooms(data.data);
      } catch (error) {
        toast.error("Error fetching free rooms. Try again please");
        console.log(error);
      }
    }
    getFreeRooms();
  }, []);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  const handleAddStudent = async (e: any) => {
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
      if (!/^[0-9]*$/g.test(formData[field])) {
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
      if (!/^[a-zA-Z\s]*$/g.test(formData[field])) {
        toast.error(`Invalid ${field}`);
        setIsSubmitting(false);
        return;
      }
    }

    setFormData({ ...formData, student_id: formData.student_id.trim() });

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
      if (!formData[field]) {
        toast.error(`Please fill ${field}`);
        setIsSubmitting(false);
        return;
      }
    }

    // upload image
    if (formData.student_image && formData.student_image instanceof File) {
      const imageFormData = new FormData();
      imageFormData.set("file", formData.student_image);

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
        formData.student_image = `/images/uploads/${imageName}`;
      } catch (error) {
        toast.error("Error uploading image. Try again please");
        setIsSubmitting(false);
        return;
      }
    }

    const response = await axios.post("/api/students/add-student", formData);
    const data = await response.data;
    console.log(data.status);

    if (!data.status) {
      toast.error(data.msg);
      console.log("Error adding student");
    } else {
      toast.success(data.msg);
      console.log("Student added successfully");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <section className="bg-white p-4 dark:bg-boxdark sm:p-8">
        <h1 className="text-4xl text-black mb-4 dark:text-white">
          Add Student
        </h1>

        <StudentForm
          formData={formData}
          freeRooms={freeRooms}
          setFormData={setFormData}
          onSubmit={handleAddStudent}
          isEditing={false}
          isSubmitting={isSubmitting}
        />
      </section>
      <ToastContainer />
    </>
  );
}
