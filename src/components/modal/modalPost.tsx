"use client";

import { useAuth } from "@/contexts/AuthContext";
import { firestore, storage } from "@/lib/firebaseConfig";
import { Dialog, Transition } from "@headlessui/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";

interface ModalPostProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export function ModalPost({ isOpen, onClose, onPostCreated }: ModalPostProps) {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: any) => {
    if (!currentUser) {
      alert("You need to register.");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = null;

      if (data.image && data.image[0]) {
        const imageFile = data.image[0];
        const storageRef = ref(
          storage,
          `posts/${currentUser.uid}/${Date.now()}_${imageFile.name}`
        );
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(firestore, "posts"), {
        title: data.title,
        content: data.content,
        imageUrl: imageUrl,
        authorId: currentUser.uid,
        authorName: data.user?.nickname || currentUser.email,
        authorProfileImageUrl: data.user?.profileImageUrl || null,
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: [],
      });

      reset();
      onClose();
      onPostCreated();
    } catch (error: any) {
      console.error("Erroor:", error);
      alert("error while creating post: " + error.message);
    }

    setIsLoading(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
                <Dialog.Title className="text-lg font-medium">
                  Create new post
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                  <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium">
                      Title
                    </label>
                    <input
                      {...register("title", { required: "Введите название" })}
                      className="w-full rounded border px-3 py-2"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">
                        {/* {errors.title.message} */}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium">
                      Content
                    </label>
                    <textarea
                      {...register("content", { required: "Введите текст" })}
                      className="w-full rounded border px-3 py-2"
                      rows={4}
                    />
                    {errors.content && (
                      <p className="mt-1 text-sm text-red-500">
                        {/* {errors.content.message} */}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium">
                      Image
                    </label>
                    <input
                      type="file"
                      {...register("image")}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="mr-2 rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating..." : "Create"}
                    </button>
                  </div>
                </form>
                <p className="mt-4 text-sm text-gray-500">
                  Created at {new Date().toLocaleDateString()}
                </p>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
