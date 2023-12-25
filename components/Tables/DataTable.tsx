import { Package } from "@/types/package";

const packageData: Package[] = [
  {
    name: "Free package",
    price: 0.0,
    invoiceDate: `Jan 13,2023`,
    status: "Paid",
  },
  {
    name: "Standard Package",
    price: 59.0,
    invoiceDate: `Jan 13,2023`,
    status: "Paid",
  },
  {
    name: "Business Package",
    price: 99.0,
    invoiceDate: `Jan 13,2023`,
    status: "Unpaid",
  },
  {
    name: "Standard Package",
    price: 59.0,
    invoiceDate: `Jan 13,2023`,
    status: "Pending",
  },
];

const data = [
  {
    student_id: 1,
    name: "John Doe",
    school: "University of California",
    semester: "3rd",
    room: "A-101",
    mess_on_date: "2021-09-01",
  },
];

interface DataTableProps {
  headings: string[];
  keys: string[];
  data: any[];
  emptyMessage?: string;
}

const DataTable = ({ headings, data, keys, emptyMessage }: DataTableProps) => {
  return (
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-gray-2 text-left dark:bg-meta-4">
          {headings.map((heading, index) => (
            <th
              key={index}
              className={`py-4 px-4 font-medium text-black dark:text-white ${
                index === 0 ? "pl-9 xl:pl-11" : ""
              }`}
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr>
            <td
              className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
              colSpan={keys.length}
            >
              <p className="text-black dark:text-white text-center">
                {emptyMessage || "No data available"}
              </p>
            </td>
          </tr>
        )}
        {data.map((item, index) => (
          <tr key={index}>
            {keys.map((key, index) => (
              <td
                key={index}
                className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
              >
                <p className="text-black dark:text-white">{item[key]}</p>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
