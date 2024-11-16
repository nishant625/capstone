import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";  

ChartJS.register(BarElement, ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const Data = () => {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/sessions")
      .then(response => {
        setSessionData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const {
    total_session_time_seconds,
    total_drowsy_time_seconds,
    total_headpose_time_seconds,
    total_yawn_time_seconds,
    drowsy_alerts,
    headpose_alerts,
    yawn_alerts,
    session_start_time,
    session_end_time,
  } = sessionData;

  const barData = {
    labels: ["Drowsy Time", "Headpose Time", "Yawn Time"],
    datasets: [
      {
        label: "Time (in seconds)",
        data: [total_drowsy_time_seconds, total_headpose_time_seconds, total_yawn_time_seconds],
        backgroundColor: ["#f87171", "#60a5fa", "#fbbf24"],
      },
    ],
  };

  const pieData = {
    labels: ["Drowsy Alerts", "Headpose Alerts", "Yawn Alerts"],
    datasets: [
      {
        label: "Alerts",
        data: [drowsy_alerts, headpose_alerts, yawn_alerts],
        backgroundColor: ["#f87171", "#60a5fa", "#fbbf24"],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-4">Driver Safety Monitoring Report</h1>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Session Overview</h2>
        <p><strong>Session Start Time:</strong> {new Date(session_start_time).toLocaleString()}</p>
        <p><strong>Session End Time:</strong> {new Date(session_end_time).toLocaleString()}</p>
        <p><strong>Total Session Time:</strong> {total_session_time_seconds.toFixed(2)} seconds</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-center mb-2">Time Distribution</h2>
          <Bar data={barData} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-center mb-2">Alert Distribution</h2>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default Data;
