import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import { useContext } from "react";
import { AuthContext } from "@/contexts/UserAuthContext";
import Swal from "sweetalert2";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const authContext = useContext(AuthContext);
  const [_, setLocalToken] = useLocalStorage("token", "");
  const router = useRouter();

  const handleLogOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the system.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log me out!",
      cancelButtonText: "No, keep me logged in",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        authContext.logout();
        setLocalToken("");
        window.localStorage.setItem("token", "");
        router.push("/auth/signin");
      }
    });
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          {authContext.isLoggedIn && (
            <button
              aria-controls="sidebar"
              onClick={(e) => {
                e.stopPropagation();
                props.setSidebarOpen(!props.sidebarOpen);
              }}
              className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
            >
              <span className="relative block h-5.5 w-5.5 cursor-pointer">
                <span className="du-block absolute right-0 h-full w-full">
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                      !props.sidebarOpen && "!w-full delay-300"
                    }`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                      !props.sidebarOpen && "delay-400 !w-full"
                    }`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                      !props.sidebarOpen && "!w-full delay-500"
                    }`}
                  ></span>
                </span>
                <span className="absolute right-0 h-full w-full rotate-45">
                  <span
                    className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                      !props.sidebarOpen && "!h-0 !delay-[0]"
                    }`}
                  ></span>
                  <span
                    className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                      !props.sidebarOpen && "!h-0 !delay-200"
                    }`}
                  ></span>
                </span>
              </span>
            </button>
          )}

          <Link
            className="flex items-center gap-2 flex-shrink-0 lg:hidden"
            href="/"
          >
            <Image
              width={120}
              height={50}
              src={"/images/logo/logo.svg"}
              alt="Logo"
            />
          </Link>
        </div>

        <Link className="hidden items-center gap-2 lg:flex" href="/">
          <Image
            width={120}
            height={50}
            src={"/images/logo/logo.svg"}
            alt="Logo"
            className="block dark:hidden"
          />
          <Image
            width={120}
            height={50}
            src={"/images/logo/logo-dark.svg"}
            alt="Logo"
            className="hidden dark:block"
          />
        </Link>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <DarkModeSwitcher />
          </ul>

          {authContext.isLoggedIn && (
            <DropdownUser
              imageUrl={authContext.userInfo?.image_url}
              onLogOut={handleLogOut}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
