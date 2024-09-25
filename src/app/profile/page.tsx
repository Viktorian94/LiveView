"use client";

import { useAuth } from "@/contexts/AuthContext";
import { firestore, storage } from "@/lib/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function ProfilePage() {
  const { currentUser, userData } = useAuth();
  const [nickname, setNickname] = useState(userData?.nickname || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!currentUser) {
    return <p>Please, sign in.</p>;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    let profileImageUrl = userData?.profileImageUrl || null;

    try {
      if (profileImage) {
        const imageRef = ref(
          storage,
          `profileImages/${currentUser.uid}/${profileImage.name}`
        );
        await uploadBytes(imageRef, profileImage);
        profileImageUrl = await getDownloadURL(imageRef);
      }

      const userRef = doc(firestore, "users", currentUser.uid);
      await updateDoc(userRef, {
        nickname,
        profileImageUrl,
      });

      alert("Profile updated.");
    } catch (error) {
      console.error("Error during profile update:", error);
      alert("Error while updating profile.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="mb-4 text-2xl font-bold">My Profile</h1>
      <div className="flex flex-col md:flex-row md:items-start">
        <div className="flex flex-col items-center md:mr-8">
          {userData?.profileImageUrl ? (
            <Image
              width={150}
              height={150}
              src={userData.profileImageUrl}
              alt="Profile"
              className="rounded-full"
            />
          ) : (
            <div className="flex size-36 items-center justify-center rounded-full bg-gray-200">
              <span className="text-6xl text-gray-400">?</span>
            </div>
          )}
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="mt-2"
          />
          <button
            onClick={handleSaveProfile}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
        <div className="mt-4 flex flex-col md:mt-0">
          <label className="mb-2 font-semibold">Nickname:</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="mb-4 rounded-md border p-2"
          />
          {/* Другие компоненты или информация */}
        </div>
      </div>
      <Link href={"/"} className="mt-4 text-blue-500 hover:underline">
        Home
      </Link>
    </div>
  );
}

export default ProfilePage;
