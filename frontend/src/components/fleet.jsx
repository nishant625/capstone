// frontend/components/Fleet.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for routing

const Fleet = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch drivers' data from the backend
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/drivers'); // Update with your backend URL
        setDrivers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch drivers');
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Fleet Management</h1>

      {loading && <p>Loading drivers...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {drivers.length === 0 ? (
        <p>No drivers found.</p>
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Driver Name</th>
              <th className="py-2 px-4 border-b">Driver Code</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.driverCode}>
                <td className="py-2 px-4 border-b">{driver.name}</td>
                <td className="py-2 px-4 border-b">{driver.driverCode}</td>
                <td className="py-2 px-4 border-b">
                  <Link 
                    to={`/driver/${driver.driverCode}`} // Link to driver session page
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View Driver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Fleet;
