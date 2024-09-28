"use client";

import { Icons } from "@/components/icons";
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
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredPosts = posts.filter((post) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(lowerCaseQuery) ||
      post.content.toLowerCase().includes(lowerCaseQuery) ||
      post.authorName.toLowerCase().includes(lowerCaseQuery)
    );
  });

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

  const toggleDropdown = (postId: string) => {
    console.log("toggleDropdown called for post:", postId);
    if (openDropdownId === postId) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(postId);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        openDropdownId !== null &&
        !target.closest(`#dropdown-${openDropdownId}`)
      ) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdownId]);

  return (
    <div className="flex-1 p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded border px-4 py-2"
        />
      </div>
      {filteredPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        filteredPosts.map((post) => {
          const isAuthor = currentUser && post.authorId === currentUser.uid;
          const liked = currentUser
            ? post.likedBy.includes(currentUser.uid)
            : false;

          return (
            <div key={post.id} className="mx-auto mb-6 max-w-md border-b pb-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center">
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
                <div id={`dropdown-${post.id}`} className="relative">
                  <button onClick={() => toggleDropdown(post.id)}>
                    {" "}
                    <Icons.menuDots className="cursor-pointer" />
                  </button>

                  {openDropdownId === post.id && (
                    <div className="absolute right-0 z-10 mt-2 w-32 rounded-md bg-white shadow-lg">
                      {isAuthor && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      )}
                      <button
                        className="block w-full px-4 py-2 text-left text-black hover:bg-gray-400"
                        onClick={() => {
                          alert("Soon...");
                        }}
                      >
                        Report
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <p className="mt-2">{post.content}</p>
              {post.imageUrl && (
                <div className="mt-2">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-auto w-full"
                    width={600}
                    height={400}
                    layout="responsive"
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
                  className="mr-2 focus:outline-none"
                  disabled={!currentUser}
                >
                  {liked ? (
                    <Icons.heart className="size-6 fill-red-500" />
                  ) : (
                    <Icons.heart className="size-6 text-gray-500 hover:text-red-500" />
                  )}
                </button>
                <span>{post.likes} likes</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
