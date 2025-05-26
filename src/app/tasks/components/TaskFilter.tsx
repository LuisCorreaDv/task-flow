"use client";

import { useEffect, useRef, useState } from "react";
import { TaskStatus } from "@/types/TaskTypes";

interface TaskFilterProps {
  onSearch: (term: string) => void;
  onFilterStatus: (status: TaskStatus | "all") => void;
  onFilterFavorites: (favoritesOnly: boolean) => void;
}

export default function TaskFilter({
  onSearch,
  onFilterStatus,
  onFilterFavorites,
}: TaskFilterProps) {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"all" | TaskStatus>(
    "all"
  );
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search);
  };

  const handleSelectStatus = (status: TaskStatus | "all") => {
    setSelectedStatus(status);
    onFilterStatus(status);
    setDropdownOpen(false);
  };

  // Colors for status in menu
  const statusColors = {
    all: "",
    on_time: "text-green-400 font-medium",
    delayed: "text-yellow-600 font-medium",
    on_going: "text-sky-600 font-medium",
    urgent: "text-red-600 font-medium",
  };
    return (
    <form onSubmit={handleSearchSubmit} className="w-full mx-auto mb-6 flex justify-center items-center">
      <div className="flex items-center gap-4 mx-auto max-w-4xl w-full px-4">
        {/* Search and Filter Container - Takes most space */}
        <div className="flex flex-1">
          {/* Dropdown button */}
          <button
            type="button"
            className="shrink-0 z-30 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-700 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-sky-800 dark:text-white dark:border-gray-600 transition-colors duration-200"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {/* Show selected status */}
            <span
              className={
                statusColors[selectedStatus as keyof typeof statusColors]
              }
            >
              {selectedStatus === "all"
                ? "All"
                : selectedStatus.replace("_", " ")}
            </span>
            <svg
              className="w-2.5 h-2.5 ms-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {/* Dropdown menu */}
          <div
            ref={dropdownRef}
            className={`z-20 ${
              dropdownOpen ? "block" : "hidden"
            } absolute mt-12 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-48 dark:bg-gray-700`}
          >
            <ul className="text-sm text-gray-700 dark:text-gray-200">
              <li>
                <button
                  type="button"
                  onClick={() => handleSelectStatus("all")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  All
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleSelectStatus("on_time")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-green-300"
                >
                  <span className="flex items-center">
                    <span className="w-2 h-2 mr-2 rounded-full bg-green-100"></span>
                    On Time
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleSelectStatus("on_going")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sky-600"
                >
                  <span className="flex items-center">
                    <span className="w-2 h-2 mr-2 rounded-full bg-sky-400"></span>
                    On Going
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleSelectStatus("delayed")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-yellow-600"
                >
                  <span className="flex items-center">
                    <span className="w-2 h-2 mr-2 rounded-full bg-yellow-400"></span>
                    Delayed
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleSelectStatus("urgent")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  <span className="flex items-center">
                    <span className="w-2 h-2 mr-2 rounded-full bg-red-400"></span>
                    Urgent
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Search input */}
          <div className="relative w-full">
            <input
              type="search"
              id="search-dropdown"
              className="block p-2.5 w-full z-10 text-sm text-gray-900 bg-white rounded-e-lg border-s-gray-50 border border-gray-300 focus:outline-sky-800 focus:ring-sky-800 focus:border-sky-800 focus:outline-none shadow-md"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-sky-700 rounded-e-lg border border-sky-700 hover:bg-sky-600 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </button>
          </div>
        </div>
          {/* Toggle Favorites */}
        <div className="flex-shrink-0">
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={favoritesOnly}
              onChange={(e) => {
                setFavoritesOnly(e.target.checked);
                onFilterFavorites(e.target.checked);
              }} 
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400 dark:peer-checked:bg-yellow-400"></div>
            <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Favorites
            </span>
          </label>
        </div>
      </div>
    </form>
  );
}
