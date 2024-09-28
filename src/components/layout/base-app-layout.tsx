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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePostCreated = () => {
    setIsModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen flex-col">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        {isSidebarOpen && (
          <Sidebar
            onOpenModal={handleOpenModal}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onToggleSidebar={toggleSidebar}
          />
        )}
        <main className="flex-1 overflow-y-auto">
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
