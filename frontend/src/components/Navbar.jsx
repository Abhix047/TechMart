import AdminNavbar from "../pages/admin/AdminNavbar";
import { useAuth } from "../context/AuthContext";
import UserNavbar from "./UserNavbar";

const Navbar = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user?.role === "admin") {
    return <AdminNavbar />;
  }

  return <UserNavbar />;
};

export default Navbar;
