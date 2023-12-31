"use client";
import StaffForm from "@/components/StaffForm";
import Loader from "@/components/common/Loader";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Page() {
  const auth = useAuth();
  const [formData, setFormData] = useState({
    staffImage: "" as any,
    staffName: "",
    staffEmail: "",
    staffPhone: "",
    staffCnic: "",
    staffRole: "",
  });

  useEffect(() => {}, []);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const imageCopy = formData.staffImage;
    // upload image
    let data;
    try {
      const imageData = new FormData();
      imageData.append("file", formData.staffImage);

      data = await toast.promise(
        fetch("/api/upload", {
          method: "POST",
          body: imageData,
        }).then((res) => res.json()),
        {
          pending: "Uploading image...",
          success: "Image uploaded!",
          error: "Error uploading image",
        }
      );
    } catch (error) {
      console.log(error);
      toast.error("Error uploading image");
    }

    if (!data.ok) {
      toast.error("Error uploading image");
      return;
    }
    const { path } = data;
    const imageName = path.split("\\").pop();
    formData.staffImage = `/images/uploads/${imageName}`;

    // add staff
    try {
      const response = await axios.post("/api/staff/add-staff", formData);
      data = await response.data;
    } catch (error) {
      formData.staffImage = imageCopy;
      console.log(error);
      toast.error("Error adding staff");
    }

    if (!data.status) {
      toast.error(data.msg);
      console.log("Error adding staff");
    } else {
      toast.success(data.msg);
    }

    setFormData({
      staffCnic: "",
      staffEmail: "",
      staffImage: "",
      staffName: "",
      staffPhone: "",
      staffRole: "",
    });
  };

  return (
    <>
      <section className="bg-white p-8 dark:bg-boxdark">
        <h1 className="text-4xl text-black mb-4 dark:text-white">Add staff</h1>
        <StaffForm onSubmit={handleFormSubmit} {...{ formData, setFormData }} />
      </section>
      <ToastContainer />
    </>
  );
}
