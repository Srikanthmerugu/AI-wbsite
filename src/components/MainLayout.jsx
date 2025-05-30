import { Link, Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import { useSidebar } from "../hooks/useSidebar";
import { FiMessageSquare } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { BsStars } from "react-icons/bs";
import SmallAIChatBot from "../pages/SmallAIChatBot";

const MainLayout = () => {
  const { isOpen, toggleSidebar, isLoading } = useSidebar();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sidebarRef = useRef(null);
  const navbarRef = useRef(null);

  // Close sidebar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        toggleSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSidebarHover = (hoverState) => {
    if (!isOpen) {
      setIsHovered(hoverState);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        ref={sidebarRef}
        onMouseEnter={() => handleSidebarHover(true)}
        onMouseLeave={() => handleSidebarHover(false)}
        className={`fixed h-full ${isOpen || isHovered ? "w-60" : "w-20"}`}
      >
        <Sidebar isOpen={isOpen || isHovered} toggleSidebar={toggleSidebar} />
      </div>

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isOpen || isHovered ? "ml-60" : "ml-15"
        }`}
      >
        <div ref={navbarRef}>
          <Navbar toggleSidebar={toggleSidebar} />
        </div>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>

        {/* Floating Ask AI button */}
        <button
          onClick={toggleDrawer}
          className="fixed bottom-6 right-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-full shadow-lg transition-all duration-200 z-40"
          type="button"
        >
          <span className="flex items-center gap-1">
            <BsStars size={20} /> Ask AI
          </span>
        </button>

        {/* Drawer overlay */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-blend-overlay bg-opacity-50 z-30"
            onClick={toggleDrawer}
          ></div>
        )}

        {/* Drawer component */}
        <div
          className={`fixed top-16 right-0 z-40 overflow-y-auto transition-transform bg-white w-100 h-[700px] dark:bg-gray-800 ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
          tabIndex="-1"
        >
          <button
            type="button"
            onClick={toggleDrawer}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close menu</span>
          </button>

          <SmallAIChatBot />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;