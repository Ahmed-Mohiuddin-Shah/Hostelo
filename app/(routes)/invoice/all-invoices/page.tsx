"use client";
import NotAuthorized from "@/components/NotAuthorized";
import Loader from "@/components/common/Loader";
import { AuthContext } from "@/contexts/UserAuthContext";
import useAccess from "@/hooks/useAccess";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaCheckToSlot, FaTrash } from "react-icons/fa6";
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
            .toLowerCase()
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
  };

  return (
    <>
      <section className="bg-white p-8 dark:bg-boxdark">
        <h1 className="text-4xl text-black mb-4 dark:text-white">Invoices</h1>

        <ul className="flex flex-wrap text-xl font-medium text-center text-meta-4 border-b border-graydark dark:border-gray dark:text-gray">
          <li className="me-2">
            <button
              aria-current="page"
              className={`transition-colors duration-300 inline-block p-4 text-meta-5 bg-bodydark1 rounded-t-lg dark:bg-gray-800 dark:text-primary ${
                selectedInvoiceType === "mess" && "!bg-primary text-white"
              }`}
              onClick={() => setSelectedInvoiceType("mess")}
            >
              Mess
            </button>
          </li>
          <li className="me-2">
            <button
              className={`transition-colors duration-300 inline-block p-4 text-meta-5 bg-bodydark1 rounded-t-lg dark:bg-gray-800 dark:text-primary ${
                selectedInvoiceType === "electric" && "!bg-primary text-white"
              }`}
              onClick={() => setSelectedInvoiceType("electric")}
            >
              Electricity
            </button>
          </li>
        </ul>

        {authContext.userInfo?.role === "student" ? (
          <div className="grid grid-cols-12 my-4">
            {selectedInvoices.length === 0 && (
              <div className="col-span-12 text-2xl text-center my-8">
                No invoices found
              </div>
            )}
            {selectedInvoices.map((invoice) => (
              <article className="col-span-12" key={invoice.id}>
                <h4 className="text-2xl font-medium text-black dark:text-white">
                  Invoice Id:
                </h4>
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
            <table className="mt-4 w-full">
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
                {selectedInvoices.length === 0 && (
                  <tr className="text-2xl">
                    <td colSpan={7} className="text-center pt-4">
                      No invoices found
                    </td>
                  </tr>
                )}
                {selectedInvoices.map((invoice) => (
                  <td className="px-4 py-2 flex" key={invoice.id}>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-danger font-bold py-4 px-2 rounded dark:text-white"
                      onClick={(e) => handleMarkAsPaid(e, invoice.id)}
                    >
                      <FaCheckToSlot />
                    </button>
                  </td>
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
