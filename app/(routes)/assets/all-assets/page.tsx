"use client";
import NotAuthorized from "@/components/NotAuthorized";
import Loader from "@/components/common/Loader";
import useAccess from "@/hooks/useAccess";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
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

interface IAsset {
  number?: number;
  name?: string;
  quantity?: string;
}

export default function Page() {
  const auth = useAuth();
  const [isEditing, setIsEditing] = useState<boolean | null>(false);
  const [assets, setAssets] = useState<IAsset[]>([]);
  const [underEdit, setUnderEdit] = useState<IAsset>();

  const hasAccess = useAccess(["admin", "manager"]);

  useEffect(() => {
    const getAssets = async () => {
      let data;
      try {
        const res = await axios.get("/api/assets/all-assets");
        data = await res.data;
      } catch (err) {
        console.log(err);
        toast.error("Unable to fetch assets");
      }

      if (data.status) {
        const formattedData = data.data.map((asset: any[]) => ({
          number: asset[0],
          quantity: asset[1],
          name: asset[2],
        }));
        setAssets(formattedData);
      }
    };

    getAssets();
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

  const handleEditClicked = (e: any, roomNumber?: number) => {
    const room = assets.find((room) => room.number === roomNumber);
    if (!room) {
      return;
    }
    setIsEditing(true);
    setUnderEdit(room);
  };

  const handleEditSubmit = async (e: any) => {
    e.preventDefault();

    const name = e.target.name.value;
    const quantity = e.target.quantity.value;

    const dataToSubmit = {
      name,
      quantity,
    };

    let data;
    try {
      const res = await axios.put(
        `/api/assets/edit-asset/${underEdit?.number}`,
        dataToSubmit
      );
      data = await res.data;
    } catch (err) {
      console.log(err);
    }

    if (data.status) {
      toast.success(data.msg);
      e.target.reset();
      setIsEditing(false);
      setUnderEdit({ name: "", quantity: "" });

      const newAssets = assets.map((asset) => {
        if (asset.number === underEdit?.number) {
          return { ...asset, name, quantity };
        }
        return asset;
      });

      setAssets(newAssets);
    } else {
      toast.error(data.msg);
    }
  };

  const handleDelete = async (e: any, roomNumber?: number) => {
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
      const res = await axios.delete(`/api/assets/delete-asset/${roomNumber}`);
      data = await res.data;
    } catch (err) {
      console.log(err);
    }

    if (data.status) {
      toast.success(data.msg);
      const newAssets = assets.filter((asset) => asset.number !== roomNumber);
      setAssets(newAssets);
    } else {
      toast.error(data.msg);
    }
  };

  return (
    <>
      {isEditing ? (
        <section className="bg-white p-8 dark:bg-boxdark">
          <h1 className="text-4xl text-black mb-4 dark:text-white">
            Edit Asset
          </h1>

          <form onSubmit={handleEditSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="mb-3 block text-black dark:text-white"
              >
                Name
              </label>
              <input
                type="text"
                placeholder="Asset name"
                id="name"
                name="name"
                value={underEdit?.name}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                onChange={(e) =>
                  setUnderEdit({ ...underEdit, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="quantity"
                className="mb-3 block text-black dark:text-white"
              >
                Quantity
              </label>
              <input
                type="text"
                placeholder="Asset name"
                id="quantity"
                name="quantity"
                value={underEdit?.quantity}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                onChange={(e) =>
                  setUnderEdit({ ...underEdit, quantity: e.target.value })
                }
              />
            </div>
            <div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              >
                Save Asset
              </button>
              <button
                className="inline-flex items-center justify-center rounded-md bg-meta-7 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 ml-4"
                onClick={() => {
                  setIsEditing(false);
                  setUnderEdit({ name: "", quantity: "" });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="bg-white p-8 dark:bg-boxdark">
          <h1 className="text-4xl text-black mb-4 dark:text-white">Assets</h1>
          <table className="w-full">
            <thead className="text-left">
              <tr className="border-b pb-2">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-2">{asset.name}</td>
                  <td className="px-4 py-2">{asset.quantity}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded dark:text-white"
                      onClick={(e) => handleEditClicked(e, asset.number)}
                    >
                      <FaPenToSquare className="text-lg text-current" />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded dark:text-white"
                      onClick={(e) => handleDelete(e, asset.number)}
                    >
                      <FaTrash className="text-lg text-current" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      <ToastContainer />
    </>
  );
}
