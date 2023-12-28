"use client";
import Image from "next/image";
import { useState } from "react";
import {
  FaCamera,
  FaCheck,
  FaSpinner,
  FaUserPlus,
  FaXmark,
} from "react-icons/fa6";
import { PatternFormat } from "react-number-format";

interface StudentFormProps {
  onSubmit: (data: any) => void;
  formData: any;
  setFormData: any;
  isEditing: boolean;
  freeRooms: number[];
  isSubmitting: boolean;
}

export default function StudentForm({
  onSubmit,
  formData,
  setFormData,
  isEditing,
  freeRooms,
  isSubmitting,
}: StudentFormProps) {
  const [isSmoker, setIsSmoker] = useState(false);

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-12 gap-2">
      <div className="m-4 col-span-12 rounded-lg bg-gray-50 justify-self-center">
        <label className="inline-block mb-2 text-gray-500 group cursor-pointer">
          <div>
            <div className="overflow-hidden rounded-full w-32 h-32 relative">
              <div className="">
                <Image
                  src={(() => {
                    if (
                      typeof formData.student_image === "string" &&
                      !!formData.student_image
                    ) {
                      return formData.student_image;
                    } else if (formData.student_image) {
                      return URL.createObjectURL(formData.student_image);
                    } else return "/images/user/avatar.png";
                  })()}
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
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  formData.student_image = e.target.files[0];
                }
              }}
            />
          </div>
        </label>
      </div>
      <div className="mb-4 col-span-12 md:col-span-4">
        <label
          htmlFor="studentId"
          className="mb-3 block text-black dark:text-white"
        >
          Student Id <span className="text-meta-1">*</span>
        </label>
        <PatternFormat
          placeholder="Student Id e.g. 123456"
          id="studentId"
          name="studentId"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          required
          format="########"
          valueIsNumericString
          value={formData.student_id}
          onChange={(e) => {
            setFormData({
              ...formData,
              student_id: e.target.value.trim(),
            });
          }}
        />
      </div>
      <div className="mb-4 col-span-12 md:col-span-8">
        <label
          htmlFor="studentName"
          className="mb-3 block text-black dark:text-white"
        >
          Student Name <span className="text-meta-1">*</span>
        </label>
        <input
          type="text"
          placeholder="Student Name e.g. John Doe"
          id="studentName"
          name="studentName"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          required
          value={formData.student_name}
          onChange={(e) => {
            setFormData({
              ...formData,
              student_name: e.target.value,
            });
          }}
        />
      </div>
      <div className="mb-4 col-span-12 sm:col-span-6">
        <label
          htmlFor="email"
          className="mb-3 block text-black dark:text-white"
        >
          Email <span className="text-meta-1">*</span>
        </label>
        <input
          type="email"
          placeholder="Student Email e.g. abc@def.org"
          id="email"
          name="email"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter disabled:opacity-50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          required
          value={formData.email}
          onChange={(e) => {
            setFormData({
              ...formData,
              email: e.target.value,
            });
          }}
        />
      </div>

      <div className="mb-4 col-span-12 sm:col-span-6">
        <label
          htmlFor="studentCnic"
          className="mb-3 block text-black dark:text-white"
        >
          CNIC <span className="text-meta-1">*</span>
        </label>
        <PatternFormat
          placeholder="Student CNIC e.g. 12345-1234567-1"
          id="studentCnic"
          name="studentCnic"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          required
          format="#####-#######-#"
          valueIsNumericString
          value={formData.student_cnic}
          onChange={(e) => {
            setFormData({
              ...formData,
              student_cnic: e.target.value,
            });
          }}
        />
      </div>
      <div className="mb-4 col-span-12 sm:col-span-6">
        <label
          htmlFor="gender"
          className="mb-3 block text-black dark:text-white"
        >
          Gender <span className="text-meta-1">*</span>
        </label>
        <select
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          name="gender"
          id="gender"
          required
          value={formData.gender}
          onChange={(e) => {
            setFormData({
              ...formData,
              gender: e.target.value,
            });
          }}
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Other</option>
        </select>
      </div>

      <div className="mb-4 col-span-6">
        <label
          htmlFor="school"
          className="mb-3 block text-black dark:text-white"
        >
          School <span className="text-meta-1">*</span>
        </label>
        <select
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          name="school"
          id="school"
          required
          value={formData.school}
          onChange={(e) => {
            setFormData({
              ...formData,
              school: e.target.value,
            });
          }}
        >
          <option value="" disabled>
            Select school
          </option>
          <option value="seecs">SEECS</option>
          <option value="sada">SADA</option>
          <option value="s3h">S3H</option>
          <option value="asab">ASAB</option>
          <option value="scme">SCME</option>
          <option value="smme">SMME</option>
          <option value="nbs">NBS</option>
          <option value="nice">NICE</option>
          <option value="igis">IGIS</option>
          <option value="nshs">NSHS</option>
        </select>
      </div>
      <div className="mb-4 col-span-6">
        <label
          htmlFor="department"
          className="mb-3 block text-black dark:text-white"
        >
          Department <span className="text-meta-1">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. CS, EE etc."
          id="department"
          name="department"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          required
          value={formData.department}
          onChange={(e) => {
            setFormData({
              ...formData,
              department: e.target.value,
            });
          }}
        />
      </div>
      <div className="mb-4 col-span-6">
        <label
          htmlFor="semester"
          className="mb-3 block text-black dark:text-white"
        >
          Semester <span className="text-meta-1">*</span>
        </label>
        <select
          placeholder="e.g. CS, EE, BBA, etc."
          id="semester"
          name="semester"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          required
          value={formData.semester}
          onChange={(e) => {
            setFormData({
              ...formData,
              semester: e.target.value,
            });
          }}
        >
          <option value="" disabled>
            Select Semester
          </option>
          <option value="1">1st</option>
          <option value="2">2nd</option>
          <option value="3">3rd</option>
          <option value="4">4th</option>
          <option value="5">5th</option>
          <option value="6">6th</option>
          <option value="7">7th</option>
          <option value="8">8th</option>
        </select>
      </div>
      <div className="mb-4 col-span-6">
        <label
          htmlFor="batch"
          className="mb-3 block text-black dark:text-white"
        >
          Batch <span className="text-meta-1">*</span>
        </label>
        <PatternFormat
          placeholder="e.g. 2022"
          id="batch"
          name="batch"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          required
          format="####"
          valueIsNumericString
          value={formData.batch}
          onChange={(e) => {
            setFormData({
              ...formData,
              batch: e.target.value,
            });
          }}
        />
      </div>
      <div className="mb-4 col-span-12 sm:col-span-6">
        <label
          htmlFor="roomNumber"
          className="mb-3 block text-black dark:text-white"
        >
          Room Number <span className="text-meta-1">*</span>
        </label>
        <select
          placeholder="e.g. CS, EE, BBA, etc."
          id="roomNumber"
          name="roomNumber"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          required
          value={formData.room_number}
          onChange={(e) => {
            setFormData({
              ...formData,
              room_number: e.target.value,
            });
          }}
        >
          <option value="" disabled>
            Select Room
          </option>
          {freeRooms.map((room) => (
            <option key={room} value={room}>
              {room}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4 col-span-12 sm:col-span-6">
        <label
          htmlFor="phoneNumber"
          className="mb-3 block text-black dark:text-white"
        >
          Phone number <span className="text-meta-1">*</span>
        </label>
        <PatternFormat
          placeholder="e.g. 300 123 4567"
          id="phoneNumber"
          name="phoneNumber"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          required
          format="#### ### ####"
          valueIsNumericString
          value={formData.phone_number}
          onChange={(e) => {
            setFormData({
              ...formData,
              phone_number: e.target.value,
            });
          }}
        />
      </div>

      {/* Address */}
      <fieldset className="mb-4 border p-4 rounded col-span-12">
        <legend className="text-xl text-black dark:text-white">Address</legend>

        <div className="mb-4 col-span-12">
          <label
            htmlFor="permanentAddress"
            className="mb-3 block text-black dark:text-white"
          >
            Permanent Address <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. House # 123, Street # 123, Sector F-10/3, Islamabad"
            id="permanentAddress"
            name="permanentAddress"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            value={formData.permanent_address}
            onChange={(e) => {
              setFormData({
                ...formData,
                permanent_address: e.target.value,
              });
            }}
          />
        </div>

        <div className="mb-4 col-span-12">
          <label
            htmlFor="temporaryAddress"
            className="mb-3 block text-black dark:text-white"
          >
            Temporary Address <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. House # 456, Street # 567, Sector F-10/3, Islamabad"
            id="temporaryAddress"
            name="temporaryAddress"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            value={formData.temporary_address}
            onChange={(e) => {
              setFormData({
                ...formData,
                temporary_address: e.target.value,
              });
            }}
          />
        </div>
      </fieldset>

      {/* Medical Record */}
      <fieldset className="mb-4 border p-4 rounded col-span-12 grid grid-cols-12 gap-2">
        <legend className="text-xl text-black dark:text-white">
          Medical Record
        </legend>

        <div className="mb-4 col-span-12">
          <label
            htmlFor="problem"
            className="mb-3 block text-black dark:text-white"
          >
            Problem
          </label>
          <input
            type="text"
            placeholder="e.g. Sugar, Blood Pressure, etc."
            id="problem"
            name="problem"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={formData.problem}
            onChange={(e) => {
              setFormData({
                ...formData,
                problem: e.target.value,
              });
            }}
          />
        </div>
        <div className="mb-4 col-span-12">
          <label
            htmlFor="description"
            className="mb-3 block text-black dark:text-white"
          >
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Details about the problem"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            name="description"
            id="description"
            value={formData.description}
            onChange={(e) => {
              setFormData({
                ...formData,
                description: e.target.value,
              });
            }}
          />
        </div>
        <div className="mb-4 col-span-12">
          <label
            htmlFor="regularMedicine"
            className="mb-3 block text-black dark:text-white"
          >
            Regular Medicine
          </label>
          <input
            type="text"
            placeholder="e.g. Panadol, etc."
            id="regularMedicine"
            name="regularMedicine"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={formData.regular_medicine}
            onChange={(e) => {
              setFormData({
                ...formData,
                regular_medicine: e.target.value,
              });
            }}
          />
        </div>
        <div className="mb-4 col-span-7">
          <label
            htmlFor="bloodGroup"
            className="mb-3 block text-black dark:text-white"
          >
            Blood group <span className="text-meta-1">*</span>
          </label>
          <select
            placeholder="e.g. CS, EE, BBA, etc."
            id="bloodGroup"
            name="bloodGroup"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            value={formData.blood_group}
            onChange={(e) => {
              setFormData({
                ...formData,
                blood_group: e.target.value,
              });
            }}
          >
            <option value="" disabled>
              Select Blood Group
            </option>
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="AB+">AB+</option>
            <option value="O+">O+</option>
            <option value="A-">A-</option>
            <option value="B-">B-</option>
            <option value="AB-">AB-</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div className="mb-4 pb-3 col-span-5 flex items-end h-auto gap-2">
          <label
            htmlFor="isSmoker"
            className="flex cursor-pointer select-none items-center gap-2"
          >
            Smoker: <span className="text-meta-1">*</span>
            <div className="relative">
              <input
                type="checkbox"
                id="isSmoker"
                className="sr-only"
                onChange={() => {
                  setIsSmoker(!isSmoker);
                }}
                checked={isSmoker}
              />
              <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
              <div
                className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                  isSmoker &&
                  "!right-1 !translate-x-full !bg-primary dark:!bg-white"
                }`}
              >
                <span className={`hidden ${isSmoker && "!block"}`}>
                  <FaCheck className="fill-white dark:fill-black" />
                </span>
                <span className={`${isSmoker && "hidden"}`}>
                  <FaXmark className="h-4 w-4 text-black" />
                </span>
              </div>
            </div>
          </label>
        </div>
      </fieldset>

      {/* Father Information */}
      <fieldset className="mb-4 border p-4 rounded col-span-12 grid grid-cols-12 gap-2">
        <legend className="text-xl text-black dark:text-white">
          Father Information
        </legend>
        <div className="mb-4 col-span-12">
          <label
            htmlFor="fatherName"
            className="mb-3 block text-black dark:text-white"
          >
            Father&apos;s Name <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            placeholder="Father Name e.g. John Doe"
            id="fatherName"
            name="fatherName"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            value={formData.father_name}
            onChange={(e) => {
              setFormData({
                ...formData,
                father_name: e.target.value,
              });
            }}
          />
        </div>
        <div className="mb-4 col-span-12 sm:col-span-6">
          <label
            htmlFor="fatherCnic"
            className="mb-3 block text-black dark:text-white"
          >
            Father&apos;s CNIC <span className="text-meta-1">*</span>
          </label>
          <PatternFormat
            placeholder="Father CNIC e.g. 12345-1234567-1"
            id="fatherCnic"
            name="fatherCnic"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            format="#####-#######-#"
            valueIsNumericString
            value={formData.father_cnic}
            onChange={(e) => {
              setFormData({
                ...formData,
                father_cnic: e.target.value,
              });
            }}
          />
        </div>
        <div className="mb-4 col-span-12 sm:col-span-6">
          <label
            htmlFor="fatherPhoneNumber"
            className="mb-3 block text-black dark:text-white"
          >
            Father&apos;s Phone number
            <span className="text-meta-1">*</span>
          </label>
          <PatternFormat
            placeholder="e.g. 300 123 4567"
            id="fatherPhoneNumber"
            name="fatherPhoneNumber"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            format="#### ### ####"
            valueIsNumericString
            value={formData.father_phone_number}
            onChange={(e) => {
              setFormData({
                ...formData,
                father_phone_number: e.target.value,
              });
            }}
          />
        </div>
      </fieldset>

      {/* Mother Information */}
      <fieldset className="mb-4 border p-4 rounded col-span-12 grid grid-cols-12 gap-2">
        <legend className="text-xl text-black dark:text-white">
          Mother Information
        </legend>
        <div className="mb-4 col-span-12">
          <label
            htmlFor="motherName"
            className="mb-3 block text-black dark:text-white"
          >
            Mother&apos;s Name <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            placeholder="Mother Name e.g. Jane Doe"
            id="motherName"
            name="motherName"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            value={formData.mother_name}
            onChange={(e) => {
              setFormData({
                ...formData,
                mother_name: e.target.value,
              });
            }}
          />
        </div>
        <div className="mb-4 col-span-12 sm:col-span-6">
          <label
            htmlFor="motherCnic"
            className="mb-3 block text-black dark:text-white"
          >
            Mother&apos;s CNIC <span className="text-meta-1">*</span>
          </label>
          <PatternFormat
            placeholder="Mother CNIC e.g. 12345-1234567-1"
            id="motherCnic"
            name="motherCnic"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            format="#####-#######-#"
            valueIsNumericString
            value={formData.mother_cnic}
            onChange={(e) => {
              setFormData({
                ...formData,
                mother_cnic: e.target.value,
              });
            }}
          />
        </div>
        <div className="mb-4 col-span-12 sm:col-span-6">
          <label
            htmlFor="motherPhoneNumber"
            className="mb-3 block text-black dark:text-white"
          >
            Mother&apos;s Phone number <span className="text-meta-1">*</span>
          </label>
          <PatternFormat
            placeholder="e.g. 300 123 4567"
            id="motherPhoneNumber"
            name="motherPhoneNumber"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            format="#### ### ####"
            valueIsNumericString
            value={formData.mother_phone_number}
            onChange={(e) => {
              setFormData({
                ...formData,
                mother_phone_number: e.target.value,
              });
            }}
          />
        </div>
      </fieldset>

      <fieldset className="mb-4 border p-4 rounded col-span-12 grid grid-cols-12 gap-2">
        <legend className="text-xl text-black dark:text-white">
          Relatives
        </legend>

        <div className="mb-4 col-span-12">
          <label
            htmlFor="relative1Name"
            className="mb-3 block text-black dark:text-white"
          >
            Relative 1 Name <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            placeholder="Relative 1 Name e.g. John Doe"
            id="relative1Name"
            name="relative1Name"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            value={formData.relative_1_name}
            onChange={(e) => {
              setFormData({
                ...formData,
                relative_1_name: e.target.value,
              });
            }}
          />
        </div>
        <div className="mb-4 col-span-12 sm:col-span-6">
          <label
            htmlFor="relative1Cnic"
            className="mb-3 block text-black dark:text-white"
          >
            Relative 1 CNIC <span className="text-meta-1">*</span>
          </label>
          <PatternFormat
            placeholder="Relative 1 CNIC e.g. 12345-1234567-1"
            id="relative1Cnic"
            name="relative1Cnic"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            format="#####-#######-#"
            valueIsNumericString
            value={formData.relative_1_cnic}
            onChange={(e) => {
              setFormData({
                ...formData,
                relative_1_cnic: e.target.value,
              });
            }}
          />
        </div>
        <div className="mb-4 col-span-12 sm:col-span-6">
          <label
            htmlFor="relative1Relation"
            className="mb-3 block text-black dark:text-white"
          >
            Relative 1 relation <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Brother"
            id="relative1Relation"
            name="relative1Relation"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            value={formData.relative_1_relation}
            onChange={(e) => {
              setFormData({
                ...formData,
                relative_1_relation: e.target.value,
              });
            }}
          />
        </div>

        <hr className="my-2 col-span-12" />

        <div className="mb-4 col-span-12">
          <label
            htmlFor="relative1Name"
            className="mb-3 block text-black dark:text-white"
          >
            Relative 2 Name <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            placeholder="Relative 2 Name e.g. John Doe"
            id="relative2Name"
            name="relative2Name"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            value={formData.relative_2_name}
            onChange={(e) => {
              setFormData({
                ...formData,
                relative_2_name: e.target.value,
              });
            }}
          />
        </div>
        <div className="mb-4 col-span-12 sm:col-span-6">
          <label
            htmlFor="relative2Cnic"
            className="mb-3 block text-black dark:text-white"
          >
            Relative 2 CNIC <span className="text-meta-1">*</span>
          </label>
          <PatternFormat
            placeholder="Relative 2 CNIC e.g. 12345-1234567-1"
            id="relative2Cnic"
            name="relative2Cnic"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            format="#####-#######-#"
            valueIsNumericString
            value={formData.relative_2_cnic}
            onChange={(e) => {
              setFormData({
                ...formData,
                relative_2_cnic: e.target.value,
              });
            }}
          />
        </div>
        <div className="mb-4 col-span-12 sm:col-span-6">
          <label
            htmlFor="relative2Phone"
            className="mb-3 block text-black dark:text-white"
          >
            Relative 2 Relation <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Uncle"
            id="relative2Phone"
            name="relative2Phone"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            value={formData.relative_2_relation}
            onChange={(e) => {
              setFormData({
                ...formData,
                relative_2_relation: e.target.value,
              });
            }}
          />
        </div>

        <hr className="my-2 col-span-12" />

        <div className="mb-4 col-span-12">
          <label
            htmlFor="relative1Name"
            className="mb-3 block text-black dark:text-white"
          >
            Relative 3 Name <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            placeholder="Relative 3 Name e.g. John Doe"
            id="relative3Name"
            name="relative3Name"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            value={formData.relative_3_name}
            onChange={(e) => {
              setFormData({
                ...formData,
                relative_3_name: e.target.value,
              });
            }}
          />
        </div>
        <div className="mb-4 col-span-12 sm:col-span-6">
          <label
            htmlFor="relative3Cnic"
            className="mb-3 block text-black dark:text-white"
          >
            Relative 3 CNIC <span className="text-meta-1">*</span>
          </label>
          <PatternFormat
            placeholder="Relative 3 CNIC e.g. 12345-1234567-1"
            id="relative3Cnic"
            name="relative3Cnic"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            format="#####-#######-#"
            valueIsNumericString
            value={formData.relative_3_cnic}
            onChange={(e) => {
              setFormData({
                ...formData,
                relative_3_cnic: e.target.value,
              });
            }}
          />
        </div>
        <div className="mb-4 col-span-12 sm:col-span-6">
          <label
            htmlFor="relative3Phone"
            className="mb-3 block text-black dark:text-white"
          >
            Relative 3 Relation <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Aunt"
            id="relative3Phone"
            name="relative3Phone"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            value={formData.relative_3_relation}
            onChange={(e) => {
              setFormData({
                ...formData,
                relative_3_relation: e.target.value,
              });
            }}
          />
        </div>
      </fieldset>

      <button
        className="rounded inline-flex items-center justify-center gap-2.5 bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 col-span-12 md:col-span-4 xl:col-span-3"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <FaSpinner className="animate-spin" />
        ) : (
          <FaUserPlus className="h-5 w-5" />
        )}
        {isEditing ? "Save" : "Add"} Student
      </button>
    </form>
  );
}
