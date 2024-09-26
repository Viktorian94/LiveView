"use client";

import { useAuth } from "@/contexts/AuthContext";
import { firestore } from "@/lib/firebaseConfig";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: any;
  authorId: string;
  authorName: string;
  authorProfileImageUrl: string | null;
  likes: number;
  likedBy: string[];
  imageUrl: any;
}

interface PostListProps {
  filter: string;
}

export function PostList({ filter }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    let q;

    if (filter === "latest") {
      q = query(collection(firestore, "posts"), orderBy("createdAt", "desc"));
    } else if (filter === "my-posts" && currentUser) {
      q = query(
        collection(firestore, "posts"),
        where("authorId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );
    } else if (filter === "liked-posts" && currentUser) {
      q = query(
        collection(firestore, "posts"),
        where("likedBy", "array-contains", currentUser.uid),
        orderBy("createdAt", "desc")
      );
    } else {
      setPosts([]);
      return;
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(postData);
    });

    console.log("Filter:", filter);
    console.log("Current user:", currentUser);

    return () => unsubscribe();
  }, [filter, currentUser]);

  const handleLike = async (postId: string, liked: boolean) => {
    if (!currentUser) {
      alert("You must be logged in to like posts.");
      return;
    }

    const postRef = doc(firestore, "posts", postId);

    try {
      if (liked) {
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(currentUser.uid),
        });
      } else {
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(currentUser.uid),
        });
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm("Are You sure?")) {
      try {
        await deleteDoc(doc(firestore, "posts", postId));
        alert("Succes.");
      } catch (error) {
        console.error("Error", error);
        alert("Error while deleting");
      }
    }
  };

  return (
    <div className="flex-1 p-4">
      {posts.map((post) => {
        const isAuthor = currentUser && post.authorId === currentUser.uid;
        const liked = currentUser
          ? post.likedBy.includes(currentUser.uid)
          : false;

        return (
          <div key={post.id} className="mb-6 border-b pb-4">
            <div className="mb-2 flex items-center">
              {post.authorProfileImageUrl ? (
                <Image
                  src={post.authorProfileImageUrl}
                  alt={post.authorName}
                  className="mr-2 rounded-full"
                  width={40}
                  height={40}
                />
              ) : (
                <div className="mr-2 flex size-10 items-center justify-center rounded-full bg-gray-200">
                  <span className="text-xl text-gray-400">?</span>
                </div>
              )}
              <span className="font-semibold">{post.authorName}</span>
            </div>
            <h2 className="text-2xl font-bold">{post.title}</h2>
            {isAuthor && (
              <button
                onClick={() => handleDeletePost(post.id)}
                className="mt-2 text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            )}
            <p className="mt-2">{post.content}</p>
            {post.imageUrl && (
              <div className="mt-2">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  className="h-auto max-w-full"
                  width={300}
                  height={200}
                />
              </div>
            )}

            <p className="mt-2 text-sm text-gray-500">
              Date of creation:{" "}
              {post.createdAt
                ? post.createdAt.toDate().toLocaleString()
                : "Just now"}
            </p>
            <div className="mt-2 flex items-center">
              <button
                onClick={() => handleLike(post.id, liked)}
                className={`mr-2 ${liked ? "text-red-500" : "text-gray-500"}`}
              >
                {liked ? "Unlike" : "Like"}
              </button>
              <span>{post.likes} likes</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
