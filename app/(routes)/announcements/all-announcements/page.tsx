"use client";
import NotAuthorized from "@/components/NotAuthorized";
import Loader from "@/components/common/Loader";
import { AuthContext } from "@/contexts/UserAuthContext";
import useAccess from "@/hooks/useAccess";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaPenToSquare, FaSpinner, FaTrash } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

interface IAnnouncement {
  id: number;
  title: string;
  description: string;
  date: string;
}

export default function Page() {
  const [isEditing, setIsEditing] = useState<boolean | null>(false);
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<IAnnouncement>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const hasAccess = useAccess(["student", "manager", "admin"]);
  const auth = useAuth();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const getAnnoucements = async () => {
      setIsLoading(true);
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

      setAnnouncements(data.data);
      setIsLoading(false);
    };
    getAnnoucements();
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

  const handleEditClicked = (e: any, id: number) => {
    setIsEditing(true);

    const announcement = announcements.find((a) => a.id === id);
    if (!announcement) {
      return;
    }

    setSelectedAnnouncement(announcement);
  };

  const handleEditSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    let data;
    try {
      const response = await axios.put(
        `/api/announcements/update-announcement/${selectedAnnouncement?.id}?announcement_id=${selectedAnnouncement?.id}`,
        {
          title: selectedAnnouncement?.title,
          description: selectedAnnouncement?.description,
        }
      );
      data = response.data;
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again later.");
      setIsSubmitting(false);
      return;
    }

    if (!data.status) {
      toast.error(data.msg);
      setIsSubmitting(false);
      return;
    }

    const updatedAnnouncements = announcements.map((a) => {
      if (a.id === selectedAnnouncement?.id) {
        return selectedAnnouncement;
      }
      return a;
    });
    setAnnouncements(updatedAnnouncements);
    setIsEditing(false);
    toast.success("Announcement updated successfully.");
    setIsSubmitting(false);
  };

  const handleDelete = async (e: any, id: number) => {
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
        `/api/announcements/delete-announcement/${id}?announcement_id=${id}`
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

    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    toast.success("Announcement deleted successfully.");
  };

  return (
    <>
      {isEditing ? (
        <section className="bg-white p-8 dark:bg-boxdark">
          <h1 className="text-4xl text-black mb-4 dark:text-white">
            Edit Announcement
          </h1>

          <form onSubmit={handleEditSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="mb-3 block text-black dark:text-white"
              >
                Title
              </label>
              <input
                placeholder="Title of your announcement"
                id="title"
                name="title"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
                value={selectedAnnouncement?.title}
                onChange={(e) => {
                  const value = e.target.value;

                  const regex = /^[a-zA-Z0-9!?. -]*$/;
                  if (!regex.test(value)) {
                    return;
                  }

                  const updatedAnnouncement = {
                    ...selectedAnnouncement,
                    title: value,
                  } as IAnnouncement;
                  setSelectedAnnouncement(updatedAnnouncement);
                }}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="mb-3 block text-black dark:text-white"
              >
                Description
              </label>
              <textarea
                rows={6}
                placeholder="Enter description of your announcement"
                id="description"
                name="description"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
                value={selectedAnnouncement?.description}
                onChange={(e) => {
                  if (e.target.value.length > 500) {
                    return;
                  }

                  const regex = /^[a-zA-Z0-9!?. -,/]*$/;
                  if (!regex.test(e.target.value)) {
                    return;
                  }

                  const updatedAnnouncement = {
                    ...selectedAnnouncement,
                    description: e.target.value,
                  } as IAnnouncement;
                  setSelectedAnnouncement(updatedAnnouncement);
                }}
              />
            </div>

            <div className="flex gap-4 flex-wrap">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                disabled={isSubmitting}
              >
                {isSubmitting && <FaSpinner className="animate-spin mr-2" />}
                Save announcement
              </button>
              <button
                className="inline-flex items-center justify-center rounded-md bg-meta-8 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="bg-white p-8 dark:bg-boxdark">
          <h1 className="text-4xl text-black mb-4 dark:text-white">
            Annoucements
          </h1>

          {isLoading && <Loader heightClass="h-24" />}

          {authContext?.userInfo?.role === "student" && !isLoading && (
            <div className="grid grid-cols-12 gap-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="border border-stroke rounded-md col-span-12 p-4 sm:col-span-6 text-2xl"
                >
                  <p className="text-meta-5 font-medium text-sm uppercase dark:text-white">
                    {announcement.date}
                  </p>
                  <h4 className="text-2xl mb-4">{announcement.title}</h4>
                  <p className="text-lg">{announcement.description}</p>
                </div>
              ))}
            </div>
          )}

          {authContext?.userInfo?.role !== "student" && !isLoading && (
            <table className="w-full">
              <thead className="text-left">
                <tr className="border-b pb-2">
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((announcement) => (
                  <tr key={announcement.id} className="border-b">
                    <td className="px-4 py-2">{announcement.title}</td>
                    <td className="px-4 py-2">{announcement.description}</td>
                    <td className="px-4 py-2">{announcement.date}</td>
                    <td className="px-4 py-2 flex">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded dark:text-white"
                        onClick={(e) => handleEditClicked(e, announcement.id)}
                      >
                        <FaPenToSquare className="text-lg text-current" />
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-black font-bold py-4 px-2 rounded dark:text-white"
                        onClick={(e) => handleDelete(e, announcement.id)}
                      >
                        <FaTrash className="text-lg text-current" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
      <ToastContainer />
    </>
  );
}
