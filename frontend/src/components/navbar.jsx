import React from 'react';
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, login, logout } = useKindeAuth();

  return (
    <nav className="flex items-center justify-between p-4 bg-blue-600 text-white shadow-lg">
      <div className="flex gap-4">
        <Link to="/" className="hover:text-blue-200">Home</Link>
        <Link to="/data" className="hover:text-blue-200">Data</Link>
      </div>
      <div>
        {isAuthenticated ? (
          <button onClick={logout} className="px-4 py-2 bg-red-500 rounded hover:bg-red-600">
            Logout
          </button>
        ) : (
          <button onClick={login} className="px-4 py-2 bg-green-500 rounded hover:bg-green-600">
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
