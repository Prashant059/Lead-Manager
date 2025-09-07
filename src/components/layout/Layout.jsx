import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }){
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
