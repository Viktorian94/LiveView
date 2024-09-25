"use client";

import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onOpenModal: () => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export function Sidebar({
  onOpenModal,
  activeFilter,
  setActiveFilter,
}: SidebarProps) {
  const { currentUser } = useAuth();

  const filters = [
    { name: "Latest", value: "latest" },
    { name: "My Posts", value: "my-posts", requiresAuth: true },
    { name: "Favorites", value: "liked-posts", requiresAuth: true },
  ];

  return (
    <div className="w-64 border-r bg-white p-4">
      <button
        className="mb-4 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={onOpenModal}
        disabled={!currentUser}
      >
        Greate Post
      </button>
      <ul>
        {filters.map((filter) => {
          if (filter.requiresAuth && !currentUser) {
            return null;
          }
          return (
            <li key={filter.value} className="mb-2">
              <button
                className={cn(
                  "w-full rounded px-4 py-2 text-left",
                  activeFilter === filter.value
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                )}
                onClick={() => {
                  console.log(`Changing filter to: ${filter.value}`);
                  setActiveFilter(filter.value);
                }}
              >
                {filter.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
