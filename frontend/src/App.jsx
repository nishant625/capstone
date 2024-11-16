import { KindeProvider, useKindeAuth } from "@kinde-oss/kinde-auth-react";
import React from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Data from './components/data';
import DriverDetail from './components/DriverDetail';
import Fleet from './components/fleet';
import Navbar from './components/navbar';
import Register from './components/register';

const App = () => (
  <KindeProvider
    clientId="976923d462314cdfb80521681a956ab2"
    domain="https://carobar.kinde.com"
    redirectUri="http://localhost:5173"
    logoutUri="http://localhost:5173"
  >
    <Router>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/driver/:driverCode" element={<DriverDetail />} /> 
          
          <Route path="/data" element={<Data />} />
        </Routes>
      </div>
    </Router>
  </KindeProvider>
);

const Home = () => {
  const { isAuthenticated, login, logout } = useKindeAuth();

  return (
    <div className="text-center p-8 bg-white rounded-lg shadow-md">
      {isAuthenticated ? (
        <>
          <h1 className="text-2xl font-semibold mb-4">Welcome Back!</h1>
          <p>You're logged in.</p>

          {/* Option to Register New Driver or Manage Fleet */}
          <div className="mt-6">
            <Link to="/register">
              <button className="px-4 py-2 bg-green-500 text-white rounded mr-4">Register New Driver</button>
            </Link>
            <Link to="/fleet">
              <button className="px-4 py-2 bg-blue-500 text-white rounded">Manage Fleet</button>
            </Link>
          </div>

          <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Logout</button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-semibold mb-4">Welcome to the app</h1>
          <p>Please login to continue.</p>
          <button onClick={login} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Login</button>
        </>
      )}
    </div>
  );
};


export default App;
