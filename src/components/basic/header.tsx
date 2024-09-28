"use client";

import { Icons } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebaseConfig";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { currentUser, userData } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);

      router.push("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-lime-100 px-4 md:px-8">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center">
          {/* Кнопка для открытия сайдбара на мобильных устройствах */}
          <div className="mr-4 md:hidden">
            <button onClick={onToggleSidebar} className="flex items-center">
              <Icons.burgerMunu className="size-6" />
            </button>
          </div>
          <Link
            className="text-2xl font-bold text-cyan-700 hover:text-cyan-950"
            href={"/"}
          >
            LiveView
          </Link>
        </div>
        <div className="relative">
          {currentUser ? (
            <div className="flex items-center">
              <div className="relative">
                <Image
                  src={userData?.profileImageUrl || "/logo.webp"}
                  width={40}
                  height={40}
                  alt="Avatar"
                  className="size-10 cursor-pointer rounded-full"
                  onClick={toggleDropdown}
                />
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link
                className="rounded-2xl bg-cyan-300 px-4 py-2 text-sm hover:bg-cyan-600 md:px-5 md:py-3"
                href="/sign-in"
              >
                Sign In
              </Link>
              <Link
                className="rounded-2xl bg-cyan-300 px-4 py-2 text-sm hover:bg-cyan-600 md:px-5 md:py-3"
                href="/sign-up"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
