import React from "react";
import { useUserStore } from "../store/useUserStore";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const accessToken = useUserStore((state) => state.accessToken);
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex w-full min-h-14 bg-blue-500 items-center justify-between px-6 text-white">
      <h1 className="text-lg font-semibold">Incident Tracker</h1>

      {accessToken && (
        <div className="flex items-center gap-4">
          <h2>Welcome {user.first_name}</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 transition-colors px-4 py-2 font-semibold rounded text-sm cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
