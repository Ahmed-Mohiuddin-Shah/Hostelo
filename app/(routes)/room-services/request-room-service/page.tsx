"use client";
import Loader from "@/components/common/Loader";
import { AuthContext } from "@/contexts/UserAuthContext";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaChevronDown, FaDoorClosed } from "react-icons/fa6";
import { PatternFormat } from "react-number-format";
import { ToastContainer, toast } from "react-toastify";

interface IRoomServiceType {
  id: number;
  serviceType: string;
}

export default function Page() {
  const auth = useAuth();
  const authContext = useContext(AuthContext);
  const [serviceType, setServiceType] = useState("");
  const [serviceTypes, setServiceTypes] = useState<IRoomServiceType[]>([]);

  useEffect(() => {
    if (!authContext.token) {
      return;
    }

    const getServiceTypes = async () => {
      let data;
      try {
        const response = await axios.get(
          "/api/room-services/all-room-service-types",
          {
            headers: {
              Authorization: `${authContext.token}`,
            },
          }
        );
        data = response.data;
      } catch (e) {
        console.log(e);
        return toast.error("Something went wrong");
      }

      if (!data.status) {
        return toast.error(data.msg);
      }
      setServiceTypes(data.data);
    };
    getServiceTypes();
  }, [authContext.token]);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    if (!serviceType) {
      return toast.error("Please select a service type");
    }
    if (!authContext.token) {
      toast.error("Please login to continue");
      return redirect("/auth/signin");
    }

    let data;
    try {
      const response = await axios.post(
        "/api/room-services/request-room-service",
        {
          serviceType,
        },
        {
          headers: {
            Authorization: `${authContext.token}`,
          },
        }
      );
      data = response.data;
    } catch (e) {
      console.log(e);
      return toast.error("Something went wrong");
    }

    if (!data.status) {
      return toast.error(data.msg);
    }
    toast.success(data.msg);
  };

  return (
    <>
      <section className="bg-white p-8 dark:bg-boxdark">
        <h1 className="text-4xl text-black mb-6 dark:text-white">
          Request Room Service
        </h1>

        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label
              htmlFor="input1"
              className="mb-3 block text-black dark:text-white"
            >
              Service Type
            </label>
            <select
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              required
            >
              <option value="" disabled>
                -- Select Service type --
              </option>
              {serviceTypes.map((serviceType) => (
                <option key={serviceType.id} value={serviceType.id}>
                  {serviceType.serviceType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Request Service
            </button>
          </div>
        </form>
      </section>
      <ToastContainer />
    </>
  );
}
