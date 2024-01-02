import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AuthContext } from "@/contexts/UserAuthContext";

import {
  FaBellConcierge,
  FaBullhorn,
  FaCubesStacked,
  FaDoorOpen,
  FaFilePen,
  FaGraduationCap,
  FaHive,
  FaPlugCircleBolt,
  FaReceipt,
  FaSnowflake,
  FaSquareCheck,
  FaUsers,
} from "react-icons/fa6";
import SideBarLinkSingle from "./SideBarLinkSingle";
import LinkGroupWithChildren from "./LinkGroupWithChildern";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  let storedSidebarExpanded = "true";
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  const authContext = useContext(AuthContext);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const links = [
    {
      name: "Dashboard",
      path: "/",
      access: "a|s|m",
      Icon: () => <FaHive className="fill-current text-lg" />,
    },
    {
      name: "Students",
      path: "/students",
      access: "a|m",
      Icon: () => <FaGraduationCap className="fill-current text-lg" />,
      children: [
        {
          name: "Add Student",
          path: "/add-student",
          access: "a|m",
        },
        {
          name: "All Students",
          path: "/all-students",
          access: "a|m",
        },
        {
          name: "Swap Room",
          path: "/swap-room",
          access: "a|m",
        },
      ],
    },
    {
      name: "Attendance",
      path: "/attendance",
      access: "a|s|m",
      Icon: () => <FaSquareCheck className="fill-current text-lg" />,
      children: [
        {
          name: "Mark Attendance",
          path: "/mark-attendance",
          access: "a|m",
        },
        {
          name: "View Attendance",
          path: "/all-attendance",
          access: "a|s|m",
        },
      ],
    },
    {
      name: "Mess off",
      path: "/mess-off",
      access: "s",
      Icon: () => <FaSnowflake className="fill-current text-lg" />,
    },
    {
      name: "Invoice",
      path: "/invoice",
      access: "a|s|m",
      Icon: () => <FaReceipt className="fill-current text-lg" />,
      children: [
        {
          name: "Generate Mess Invoices",
          path: "/generate-mess-invoices",
          access: "a|m",
        },
        {
          name: "Generate Elerctricity Invoices",
          path: "/generate-electricity-invoices",
          access: "a|m",
        },
        {
          name: "View Invoices",
          path: "/all-invoices",
          access: "a|s|m",
        },
      ],
    },
    {
      name: "Electrical Appliances",
      path: "/electrical-appliances",
      access: "a|s|m",
      Icon: () => <FaPlugCircleBolt className="fill-current text-lg" />,
      children: [
        {
          name: "Add Electrical Appliance",
          path: "/add-electrical-appliance",
          access: "a|m",
        },
        {
          name: "All Electrical Appliances",
          path: "/all-electrical-appliances",
          access: "a|s|m",
        },
      ],
    },
    {
      name: "Assets",
      path: "/assets",
      access: "a|m",
      Icon: () => <FaCubesStacked className="fill-current text-lg" />,
      children: [
        {
          name: "Add Asset",
          path: "/add-asset",
          access: "a|m",
        },
        {
          name: "All Assets",
          path: "/all-assets",
          access: "a|m",
        },
      ],
    },
    {
      name: "Rooms",
      path: "/rooms",
      access: "a|m",
      Icon: () => <FaDoorOpen className="fill-current text-lg" />,
      children: [
        {
          name: "Add Room",
          path: "/add-room",
          access: "a|m",
        },
        {
          name: "All Rooms",
          path: "/all-rooms",
          access: "a|m",
        },
      ],
    },
    {
      name: "Room services",
      path: "/room-services",
      access: "a|s|m|w",
      Icon: () => <FaBellConcierge className="fill-current text-lg" />,
      children: [
        {
          name: "Request Room Service",
          path: "/request-room-service",
          access: "s",
        },
        {
          name: "Room Services",
          path: "/all-room-services",
          access: "a|s|m|w",
        },
      ],
    },
    {
      name: "Complaints",
      path: "/complaints",
      access: "a|s|m",
      Icon: () => <FaFilePen className="fill-current text-lg" />,
      children: [
        {
          name: "Add Complaint",
          path: "/add-complaint",
          access: "s",
        },
        {
          name: "All Complaints",
          path: "/all-complaints",
          access: "a|s|m",
        },
      ],
    },
    {
      name: "Announcements",
      path: "/announcements",
      access: "a|s|m",
      Icon: () => <FaBullhorn className="fill-current text-lg" />,
      children: [
        {
          name: "Add Announcement",
          path: "/add-announcement",
          access: "a|m",
        },
        {
          name: "All Announcements",
          path: "/all-announcements",
          access: "a|s|m",
        },
      ],
    },
    {
      name: "Staff",
      path: "/staff",
      access: "a|m",
      Icon: () => <FaUsers className="fill-current text-lg" />,
      children: [
        {
          name: "Add Staff",
          path: "/add-staff",
          access: "a|m",
        },
        {
          name: "All Staff",
          path: "/all-staff",
          access: "a|m",
        },
      ],
    },
  ];

  const getLinks = (link: any, i: number) => {
    const currentUserRole = authContext.userInfo?.role[0].toLocaleLowerCase();
    if (!currentUserRole) return;

    if (link.children) {
      if (!link.access.includes(currentUserRole)) return;
      return (
        <LinkGroupWithChildren
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
          groupName={link.name}
          basePath={link.path}
          items={link.children}
          GroupIcon={link.Icon}
          key={i}
          currentUserRole={currentUserRole}
        />
      );
    } else {
      if (!link.access.includes(currentUserRole)) return;
      return (
        <SideBarLinkSingle
          linkName={link.name}
          Icon={link.Icon}
          path={link.path}
          key={i}
        />
      );
    }
  };

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } ${authContext.isLoggedIn ? "" : "hidden"}`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/">
          <Image
            width={176}
            height={32}
            src={"/images/logo/logo-dark.svg"}
            alt="Logo"
          />
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {links.map(getLinks)}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
