"use client";

import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebaseConfig";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
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
    <header>
      <div className="flex items-center justify-between bg-lime-100 px-8">
        <Link className="text-3xl text-cyan-700 hover:text-cyan-950" href={"/"}>
          LiveView
        </Link>
        <div className="relative py-5">
          {currentUser ? (
            <div className="flex items-center">
              <div className="relative">
                <Image
                  src={userData?.profileImageUrl || "/logo.webp"}
                  width={20}
                  height={20}
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
            <div>
              <Link
                className="mx-2 rounded-2xl bg-cyan-300 px-5 py-3 hover:bg-cyan-600"
                href="/sign-in"
              >
                Sign In
              </Link>
              <Link
                className="rounded-2xl bg-cyan-300 px-5 py-3 hover:bg-cyan-600"
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
