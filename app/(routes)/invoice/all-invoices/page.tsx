"use client";
import NotAuthorized from "@/components/NotAuthorized";
import Loader from "@/components/common/Loader";
import { AuthContext } from "@/contexts/UserAuthContext";
import useAccess from "@/hooks/useAccess";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import {
  FaBolt,
  FaCheckToSlot,
  FaIcons,
  FaMoneyBillWave,
  FaTrash,
  FaUtensils,
} from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

interface IInvoice {
  id: number;
  studentId: number;
  studentName: string;
  roomNumber: number;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: string;
}

export default function Page() {
  const auth = useAuth();
  const authContext = useContext(AuthContext);
  const hasAccess = useAccess(["admin", "manager", "student"]);
  const [electricInvoices, setElectricInvoices] = useState<IInvoice[]>([]);
  const [messInvoices, setMessInvoices] = useState<IInvoice[]>([]);
  const [selectedInvoices, setSelectedInvoices] = useState<IInvoice[]>([]);
  const [selectedInvoiceType, setSelectedInvoiceType] =
    useState<string>("mess");
  const [filterText, setFilterText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authContext.token) return;

    const getInvoices = async (
      type: string,
      setter: React.Dispatch<React.SetStateAction<IInvoice[]>>
    ) => {
      let data;
      try {
        const response = await axios.get(`/api/invoice/get-${type}-invoices`, {
          headers: {
            Authorization: `${authContext.token}`,
          },
        });
        data = response.data;
      } catch (err) {
        return toast.error("Something went wrong, please try again");
      }

      if (!data.status) {
        return toast.error(data.msg);
      }
      console.log(type, data);
      setter(data.data);
    };

    getInvoices("mess", setMessInvoices);
    getInvoices("electricity", setElectricInvoices);
    setIsLoading(false);
  }, [authContext.token]);

  useEffect(() => {
    setSelectedInvoices(
      selectedInvoiceType === "mess" ? messInvoices : electricInvoices
    );
  }, [selectedInvoiceType, messInvoices, electricInvoices]);

  useEffect(() => {
    setSelectedInvoices((prev) => {
      return prev.filter((invoice) => {
        return (
          invoice.studentName
            ?.toLowerCase()
            .includes(filterText.toLowerCase()) ||
          invoice.roomNumber.toString().includes(filterText)
        );
      });
    });
  }, [filterText]);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  if (!hasAccess) {
    return <NotAuthorized />;
  }

  const handleMarkAsPaid = async (e: any, id: number) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to mark this invoice as paid?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, mark as paid",
      cancelButtonText: "No, cancel",
    });

    if (!result.isConfirmed) return;

    let data;
    try {
      const response = await axios.post(
        "/api/invoice/mark-as-paid",
        {
          id,
          type: selectedInvoiceType,
        },
        {
          headers: {
            Authorization: `${authContext.token}`,
          },
        }
      );
      data = response.data;
    } catch (err) {
      return toast.error("Something went wrong, please try again");
    }

    toast.success("Marked as paid");

    const currentInvoices =
      selectedInvoiceType === "mess" ? messInvoices : electricInvoices;
    const updatedInvoices = currentInvoices.map((invoice) => {
      if (invoice.id === id) {
        return {
          ...invoice,
          status: "Paid",
        };
      }
      return invoice;
    });
    if (selectedInvoiceType === "mess") {
      setMessInvoices(updatedInvoices);
    } else {
      setElectricInvoices(updatedInvoices);
    }
  };

  return (
    <>
      <section className="bg-white p-8 dark:bg-boxdark">
        <h1 className="text-4xl text-black mb-4 dark:text-white">Invoices</h1>

        <ul className="flex flex-wrap text-xl font-medium text-center text-meta-4 border-b border-graydark dark:border-gray dark:text-gray">
          <li className="me-2">
            <button
              aria-current="page"
              className={`transition-colors duration-300 inline-block p-4 text-meta-5 bg-bodydark1 rounded-t-lg dark:bg-gray-800  ${
                selectedInvoiceType === "mess" &&
                "!bg-primary text-white !dark:text-white"
              }`}
              onClick={() => setSelectedInvoiceType("mess")}
            >
              Mess
            </button>
          </li>
          <li className="me-2">
            <button
              className={`transition-colors duration-300 inline-block p-4 text-meta-5 bg-bodydark1 rounded-t-lg dark:bg-gray-800  ${
                selectedInvoiceType === "electric" &&
                "!bg-primary text-white !dark:text-white"
              }`}
              onClick={() => setSelectedInvoiceType("electric")}
            >
              Electricity
            </button>
          </li>
        </ul>

        {isLoading && <Loader heightClass="h-24" />}

        {authContext.userInfo?.role === "student" ? (
          <div className="grid grid-cols-12 gap-4 my-4">
            {selectedInvoices.length === 0 && !isLoading && (
              <div className="col-span-12 text-2xl text-center my-8">
                No invoices found
              </div>
            )}
            {selectedInvoices.map((invoice) => (
              <article
                className="flex flex-col border border-stroke rounded p-4 col-span-12 md:col-span-6"
                key={invoice.id}
              >
                <h3 className="text-2xl font-medium text-black dark:text-white mb-2">
                  Student Name: {invoice.studentName}
                </h3>
                <hr className="border-stroke dark:border-gray mb-2" />
                <p className="text-lg font-medium text-black dark:text-white mb-1">
                  Room Number: {invoice.roomNumber}
                </p>
                <p className="text-lg font-medium text-black dark:text-white mb-1">
                  Amount:{" "}
                  {Intl.NumberFormat("en-PK", {
                    currency: "PKR",
                    style: "currency",
                  }).format(invoice.amount)}
                </p>
                <p className="text-lg font-medium text-black dark:text-white mb-1">
                  Issue Date: {invoice.issueDate}
                </p>
                <p className="text-lg font-medium text-black dark:text-white mb-1">
                  Due Date: {invoice.dueDate}
                </p>
                <hr className="border-stroke dark:border-gray mt-3 mb-4" />
                <p className="text-lg font-medium text-black dark:text-white mb-1">
                  Status:{" "}
                  <span
                    className={`px-3 py-1 rounded text-white ${
                      invoice.status?.toLowerCase() === "paid"
                        ? "bg-meta-3"
                        : "bg-meta-8"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </p>
              </article>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between my-4">
              <div className="flex items-center w-full">
                <input
                  type="search"
                  name="search"
                  placeholder="Search by name or room number"
                  className="w-full rounded-lg border-[1.5px] border-black bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={filterText}
                  onChange={(e) => {
                    setFilterText(e.target.value);
                  }}
                />
              </div>
            </div>
            <table className="mt-4 w-full text-lg">
              <thead className="text-left">
                <tr className="border-b pb-2">
                  <th className="px-4 py-2">Student Name</th>
                  <th className="px-4 py-2">Room Number</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Issue Date</th>
                  <th className="px-4 py-2">Due Date</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoices.length === 0 && !isLoading && (
                  <tr className="text-2xl">
                    <td colSpan={7} className="text-center pt-4">
                      No invoices found
                    </td>
                  </tr>
                )}
                {selectedInvoices.map((invoice) => (
                  <tr className="border-b pb-2" key={invoice.id}>
                    <td className="px-4 py-2">{invoice.studentName}</td>
                    <td className="px-4 py-2">{invoice.roomNumber}</td>
                    <td className="px-4 py-2">
                      {Intl.NumberFormat("en-PK", {
                        currency: "PKR",
                        style: "currency",
                      }).format(invoice.amount)}
                    </td>
                    <td className="px-4 py-2">{invoice.issueDate}</td>
                    <td className="px-4 py-2">{invoice.dueDate}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded text-white ${
                          invoice.status?.toLowerCase() === "paid"
                            ? "bg-meta-3"
                            : "bg-meta-8"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex">
                      <button
                        className="flex flex-col items-center justify-center bg-red-500 hover:bg-red-700 text-meta-3 font-bold py-4 px-2 rounded dark:text-white disabled:text-opacity-75 disabled:text-meta-4"
                        onClick={(e) => handleMarkAsPaid(e, invoice.id)}
                        disabled={invoice.status?.toLowerCase() === "paid"}
                      >
                        <FaCheckToSlot className="text-2xl" />{" "}
                        <span>
                          {invoice.status.toLowerCase() === "paid"
                            ? "Already Paid"
                            : "Mark as paid"}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>
      <ToastContainer />
    </>
  );
}
