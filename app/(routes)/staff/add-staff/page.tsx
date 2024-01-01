"use client";
import NotAuthorized from "@/components/NotAuthorized";
import StaffForm from "@/components/StaffForm";
import Loader from "@/components/common/Loader";
import useAccess from "@/hooks/useAccess";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Page() {
  const auth = useAuth();
  const hasAccess = useAccess(["admin", "manager"]);
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

  if (!hasAccess) {
    return <NotAuthorized />;
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
          success: "",
          error: "Error uploading image",
        }
      );
    } catch (error) {
      console.log(error);
      toast.error("Error uploading image");
      return;
    }

    if (!data.ok) {
      console.log(data);
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
      formData.staffImage = imageCopy;
      return;
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
