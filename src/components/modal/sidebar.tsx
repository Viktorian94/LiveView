"use client";

import { Icons } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onOpenModal: () => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  onToggleSidebar: () => void;
}

export function Sidebar({
  onOpenModal,
  activeFilter,
  setActiveFilter,
  onToggleSidebar,
}: SidebarProps) {
  const { currentUser } = useAuth();

  const filters = [
    { name: "Latest", value: "latest" },
    { name: "My Posts", value: "my-posts", requiresAuth: true },
    { name: "Favorites", value: "liked-posts", requiresAuth: true },
  ];

  return (
    <div className="w-64 border-r bg-white p-4">
      <div className="mb-4 md:hidden">
        <button onClick={onToggleSidebar} className="flex items-center">
          <Icons.arrowLeft className="size-6" />
          <span className="ml-2">Close</span>
        </button>
      </div>
      <button
        className="mb-4 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={onOpenModal}
        disabled={!currentUser}
        style={{ height: "50px" }}
      >
        Create Post
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
