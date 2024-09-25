"use client";

import Header from "@/components/basic/header";
import { ModalPost } from "@/components/modal/modalPost";
import { PostList } from "@/components/modal/postList";
import { Sidebar } from "@/components/modal/sidebar";
import React, { useState } from "react";

interface BaseAppLayoutProps {
  children: React.ReactNode;
}

export function BaseAppLayout({ children }: BaseAppLayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("latest");

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePostCreated = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar
          onOpenModal={handleOpenModal}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        <main className="flex-1">
          {React.cloneElement(children as React.ReactElement, { activeFilter })}
          <PostList filter={activeFilter} />
        </main>
      </div>
      <ModalPost
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
