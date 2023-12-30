"use client";
import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import "react-toastify/dist/ReactToastify.css";
import "sweetalert2/src/sweetalert2.scss";
import { useState, useContext } from "react";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { AuthContext, AuthContextProvider } from "@/contexts/UserAuthContext";
import { getAPIURL } from "@/libs/api";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const authContext = useContext(AuthContext);

  const apiURL = getAPIURL();
  axios.defaults.baseURL = apiURL;

  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/images/favicons/site.webmanifest" />
      </head>
      <body suppressHydrationWarning={true}>
        <AuthContextProvider>
          <div className="dark:bg-boxdark-2 dark:text-bodydark">
            <div className="flex h-screen overflow-hidden">
              {/* <!--   ===== Sidebar Start ===== --> */}
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              {/* <!-- ===== Sidebar End ===== --> */}

              {/* <!-- ===== Content Area Start ===== --> */}
              <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                {/* <!-- ===== Header Start ===== --> */}
                <Header
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
                {/* <!-- ===== Header End ===== --> */}

                {/* <!-- ===== Main Content Start ===== --> */}
                <main>
                  <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                    {children}
                  </div>
                </main>
                {/* <!-- ===== Main Content End ===== --> */}
              </div>
              {/* <!-- ===== Content Area End ===== --> */}
            </div>
          </div>
        </AuthContextProvider>
      </body>
    </html>
  );
}
