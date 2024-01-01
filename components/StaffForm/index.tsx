import Image from "next/image";
import { useState } from "react";
import { FaCamera } from "react-icons/fa6";

interface StaffFormProps {
  onSubmit: (e: any) => void;
  formData: any;
  setFormData: any;
}

export default function StaffForm({
  onSubmit,
  formData,
  setFormData,
}: StaffFormProps) {
  const [image, setImage] = useState("");

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-12 gap-4">
      <div className="flex justify-center items-center col-span-12">
        <label className="inline-block mb-2 text-gray-500 group cursor-pointer">
          <div>
            <div className="overflow-hidden rounded-full w-32 h-32 relative">
              <div className="">
                <Image
                  src={
                    image.length === 0 || formData.staffImage === ""
                      ? "/images/user/avatar.png"
                      : image
                  }
                  width={128}
                  height={128}
                  alt="user image"
                />
              </div>
              <div className="bg-meta-9 flex flex-col justify-center items-center absolute h-14 w-full z-1 left-1/2 bottom-0 -translate-x-1/2 text-xs origin-bottom translate-y-14 group-hover:-translate-y-0 transition-transform">
                <FaCamera className="text-lg" />
                Student Image
              </div>
            </div>
            <input
              type="file"
              className="opacity-0 sr-only"
              name="studentImage"
              id="studentImage"
              accept="image/*"
              required
              onChange={(e) => {
                // @ts-ignore
                const file = e.target.files[0];
                setFormData({ ...formData, staffImage: file });
                // @ts-ignore
                if (file) setImage(URL.createObjectURL(e.target.files[0]));
                else setImage("");
              }}
            />
          </div>
        </label>
      </div>
      <div className="mb-4 col-span-12 sm:col-span-6">
        <label
          htmlFor="staffName"
          className="mb-3 block text-black dark:text-white"
        >
          Name
        </label>
        <input
          type="text"
          placeholder="e.g. John Doe"
          id="staffName"
          name="staffName"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          required
          value={formData.staffName}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[a-zA-Z\s']+$/.test(value) || value === "") {
              setFormData({ ...formData, staffName: value });
            }
          }}
        />
      </div>
      <div className="mb-4 col-span-12 sm:col-span-6">
        <label
          htmlFor="staffEmail"
          className="mb-3 block text-black dark:text-white"
        >
          Email
        </label>
        <input
          type="email"
          placeholder="e.g. abc@def.co"
          id="staffEmail"
          name="staffEmail"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          required
          value={formData.staffEmail}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[a-zA-Z0-9@._]+$/.test(value) || value === "") {
              setFormData({ ...formData, staffEmail: value });
            }
          }}
        />
      </div>
      <div className="mb-4 col-span-12 sm:col-span-6">
        <label
          htmlFor="staffCnic"
          className="mb-3 block text-black dark:text-white"
        >
          CNIC
        </label>
        <input
          type="number"
          placeholder="e.g. 1234512345671"
          id="staffCnic"
          name="staffCnic"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          required
          value={formData.staffCnic}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length > 13) return;
            if (/^[0-9]+$/.test(value) || value === "") {
              setFormData({ ...formData, staffCnic: value });
            }
          }}
        />
      </div>
      <div className="mb-4 col-span-12 sm:col-span-6">
        <label
          htmlFor="phoneNumber"
          className="mb-3 block text-black dark:text-white"
        >
          Phone Number
        </label>
        <input
          type="text"
          placeholder="e.g. 03001231212"
          id="phoneNumber"
          name="phoneNumber"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          required
          value={formData.staffPhone}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length > 11) return;
            if (/^[0-9]+$/.test(value) || value === "") {
              setFormData({ ...formData, staffPhone: value });
            }
          }}
        />
      </div>
      <div className="mb-4 col-span-12 sm:col-span-6">
        <label htmlFor="role" className="mb-3 block text-black dark:text-white">
          Role
        </label>
        <select
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={formData.staffRole}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "manager" || value === "worker") {
              setFormData({ ...formData, staffRole: value });
            }
          }}
        >
          <option value="" disabled>
            --- Select role ---
          </option>
          <option value="manager">Manager</option>
          <option value="worker">Worker</option>
        </select>
      </div>

      <div className="col-span-12">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          Add staff member
        </button>
      </div>
    </form>
  );
}
