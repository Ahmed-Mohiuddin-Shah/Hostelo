"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

import { Metadata } from "next";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/UserAuthContext";
import useAuth from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import Loader from "@/components/common/Loader";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { FaKey } from "react-icons/fa6";
import Swal from "sweetalert2";
import useLocalStorage from "@/hooks/useLocalStorage";
// export const metadata: Metadata = {
//   title: "Profile Page | Next.js E-commerce Dashboard Template",
//   description: "This is Profile page for TailAdmin Next.js",
//   // other metadata
// };

const Profile = () => {
  const authContext = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState<any>();
  const [token, setLocalToken] = useLocalStorage("token", "");

  const auth = useAuth();

  useEffect(() => {
    if (!authContext.token) {
      return;
    }

    setUserInfo(authContext.userInfo);
  }, [authContext.token, authContext.userInfo]);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  const handleUploadProfilePicture = async (e: any) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    let data;
    try {
      data = await toast.promise(
        fetch("/api/upload", {
          method: "POST",
          body: formData,
        }).then((res) => res.json()),
        {
          pending: "Uploading image...",
          success: "Image uploaded successfully",
          error: "Error uploading image. Try again please",
        }
      );
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
      return;
    }

    if (!data.ok) {
      return toast.error(data.msg);
    }
    toast.success(data.msg);

    const imageName = data.path.split("\\").pop();
    setUserInfo({
      ...authContext.userInfo,
      image_url: `/images/uploads/${imageName}`,
    });

    const updateData = {
      image_url: `/images/uploads/${imageName}`,
      username: userInfo?.username,
      name: userInfo?.name,
      role: userInfo?.role,
    };

    console.log(updateData);

    try {
      const response = await axios.post(
        "/api/users/update-profile-picture",
        updateData,
        {
          headers: {
            Authorization: `${authContext.token}`,
          },
        }
      );
      data = await response.data;
    } catch (e) {
      console.log(e);
      return toast.error("Something went wrong");
    }

    if (!data.status) {
      return toast.error(data.msg);
    }
    authContext.login(data.token);
    setLocalToken(data.token);
    toast.success(data.msg);
  };

  const handleChangePassword = async () => {
    const inputValue = "";
    const { value: previousPassword } = await Swal.fire({
      title: "Previous Password",
      input: "password",
      inputLabel: "Enter your previous password",
      inputPlaceholder: "Enter your previous password",
      inputValue,
      showCancelButton: true,
      confirmButtonText: "Submit",
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });
    if (!previousPassword) {
      return;
    }

    let data;
    try {
      const response = await axios.post(
        "/api/users/verify-password",
        {
          password: previousPassword,
        },
        {
          headers: {
            Authorization: `${authContext.token}`,
          },
        }
      );
      data = await response.data;
    } catch (e) {
      console.log(e);
      return toast.error("Something went wrong");
    }

    if (!data.status) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter correct password",
      });
    }

    const { value: newPassword } = await Swal.fire({
      title: "New Password",
      input: "password",
      inputLabel: "Enter your new password",
      inputValue,
      showCancelButton: true,
      confirmButtonText: "Submit",
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
        if (value.length < 8) {
          return "Password must be atleast 8 characters long";
        }
        if (value === previousPassword) {
          return "New password must be different from previous password";
        }
      },
    });

    if (!newPassword) {
      return;
    }

    let data2;
    try {
      const response = await axios.post(
        "/api/users/change-password",
        {
          password: newPassword,
        },
        {
          headers: {
            Authorization: `${authContext.token}`,
          },
        }
      );
      data2 = await response.data;
    } catch (e) {
      console.log(e);
      return toast.error("Something went wrong");
    }

    if (!data2.status) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong",
      });
    }

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Password changed successfully",
    });
  };

  return (
    <>
      <Breadcrumb pageName="Profile" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={"/images/cover/cover-01.png"}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
            width={970}
            height={260}
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2">
              <Image
                src={userInfo?.image_url || "/images/user/avatar.png"}
                width={160}
                height={160}
                alt="profile"
              />
              <label
                htmlFor="profile"
                className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
              >
                <svg
                  className="fill-current"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                    fill=""
                  />
                </svg>
                <input
                  aria-label="Upload profile picture"
                  type="file"
                  name="profile"
                  id="profile"
                  className="sr-only"
                  onChange={handleUploadProfilePicture}
                />
              </label>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {userInfo?.name}
            </h3>
            <p
              className="font-medium text-xl"
              style={{ textTransform: "capitalize" }}
            >
              {userInfo?.role}
            </p>
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              onClick={handleChangePassword}
            >
              <FaKey />
              Change Password
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Profile;
