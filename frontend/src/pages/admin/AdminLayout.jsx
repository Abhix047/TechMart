import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#f7f5f2]">
      <AdminNavbar />
      <main className="lg:ml-[240px] transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
