import { useEffect, useState } from "react";
import API from "../services/api";

import AdminNavbar from "../pages/admin/AdminNavbar";
import UserNavbar from "./UserNavbar";

const Navbar = () => {

  const [role, setRole] = useState(null);

  useEffect(() => {

    const getProfile = async () => {
      try {

        const res = await API.get("/auth/profile");

        setRole(res.data.role);

      } catch (error) {

        setRole("guest");

      }
    };

    getProfile();

  }, []);

  if (role === "admin") {
    return <AdminNavbar />;
  }

  return <UserNavbar />;
};

export default Navbar;