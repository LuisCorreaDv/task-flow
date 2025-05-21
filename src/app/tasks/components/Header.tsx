import React from "react";
import { logout } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { resetVerification } from "@/redux/features/verificationSlice";

function Header() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetVerification())
    router.push("/");
  };
  return (
    <header>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-6">
          <a
            href="https://flowbite.com"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-4xl font-semibold whitespace-nowrap dark:text-white text-center bg-gradient-to-r from-cyan-300 to-sky-800 bg-clip-text text-transparent">
              Task Flow
            </span>
          </a>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <button
              type="button"
              onClick={handleLogout}
              className="text-white font-medium bg-sky-800 hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-300 rounded-full text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800 transition duration-200 ease-in-out cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
