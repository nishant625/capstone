import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const DriverDetail = () => {
  const { driverCode } = useParams();
  const [sessionData, setSessionData] = useState([]);
  const [aggregatedData, setAggregatedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewType, setViewType] = useState('single'); // single, multiple, combined

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/sessions/${driverCode}`);
        setSessionData(response.data);

        // Aggregate data for combined report
        const aggregate = response.data.reduce(
          (acc, session) => {
            acc.totalSessionTime += session.total_session_time_seconds;
            acc.totalDrowsyTime += session.total_drowsy_time_seconds;
            acc.totalHeadposeTime += session.total_headpose_time_seconds;
            acc.totalYawnTime += session.total_yawn_time_seconds;
            acc.drowsyAlerts += session.drowsy_alerts;
            acc.headposeAlerts += session.headpose_alerts;
            acc.yawnAlerts += session.yawn_alerts;
            return acc;
          },
          {
            totalSessionTime: 0,
            totalDrowsyTime: 0,
            totalHeadposeTime: 0,
            totalYawnTime: 0,
            drowsyAlerts: 0,
            headposeAlerts: 0,
            yawnAlerts: 0,
          }
        );
        setAggregatedData(aggregate);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch session data');
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [driverCode]);

  const handleViewChange = (e) => {
    setViewType(e.target.value);
  };

  const renderSingleSession = (session, index) => {
    const totalTimeData = {
      labels: ['Total Session Time', 'Drowsy Time', 'Headpose Time', 'Yawn Time'],
      datasets: [
        {
          label: 'Time (Seconds)',
          data: [
            session.total_session_time_seconds,
            session.total_drowsy_time_seconds,
            session.total_headpose_time_seconds,
            session.total_yawn_time_seconds,
          ],
          backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#F44336'],
        },
      ],
    };

    const alertData = {
      labels: ['Drowsy Alerts', 'Headpose Alerts', 'Yawn Alerts'],
      datasets: [
        {
          label: 'Count',
          data: [session.drowsy_alerts, session.headpose_alerts, session.yawn_alerts],
          backgroundColor: ['#FFEB3B', '#9C27B0', '#E91E63'],
        },
      ],
    };

    return (
      <div key={session._id} className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Driver Code: {driverCode} - Session {index + 1}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-600 mb-3">Session Overview</h3>
            <p>
              <strong>Total Session Time:</strong> {session.total_session_time_seconds} seconds
            </p>
            <p>
              <strong>Drowsy Time:</strong> {session.total_drowsy_time_seconds} seconds (
              {((session.total_drowsy_time_seconds / session.total_session_time_seconds) * 100).toFixed(2)}%)
            </p>
            <p>
              <strong>Headpose Time:</strong> {session.total_headpose_time_seconds} seconds (
              {((session.total_headpose_time_seconds / session.total_session_time_seconds) * 100).toFixed(2)}%)
            </p>
            <p>
              <strong>Yawn Time:</strong> {session.total_yawn_time_seconds} seconds (
              {((session.total_yawn_time_seconds / session.total_session_time_seconds) * 100).toFixed(2)}%)
            </p>
            <p>
              <strong>Alerts:</strong>
              <ul className="list-disc ml-6">
                <li>Drowsy Alerts: {session.drowsy_alerts}</li>
                <li>Headpose Alerts: {session.headpose_alerts}</li>
                <li>Yawn Alerts: {session.yawn_alerts}</li>
              </ul>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-4 bg-gray-50 rounded shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Session Time Metrics</h3>
            <Bar
              data={totalTimeData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'top' } },
              }}
            />
          </div>

          <div className="p-4 bg-gray-50 rounded shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Alert Distribution</h3>
            <Pie
              data={alertData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderCombinedReport = () => {
    const combinedTimeData = {
      labels: ['Total Session Time', 'Drowsy Time', 'Headpose Time', 'Yawn Time'],
      datasets: [
        {
          label: 'Time (Seconds)',
          data: [
            aggregatedData.totalSessionTime,
            aggregatedData.totalDrowsyTime,
            aggregatedData.totalHeadposeTime,
            aggregatedData.totalYawnTime,
          ],
          backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#F44336'],
        },
      ],
    };

    const combinedAlertData = {
      labels: ['Drowsy Alerts', 'Headpose Alerts', 'Yawn Alerts'],
      datasets: [
        {
          label: 'Count',
          data: [aggregatedData.drowsyAlerts, aggregatedData.headposeAlerts, aggregatedData.yawnAlerts],
          backgroundColor: ['#FFEB3B', '#9C27B0', '#E91E63'],
        },
      ],
    };

    return (
      <div className="mt-12 bg-blue-50 p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Combined Report for Driver {driverCode}</h2>

        <p>
          <strong>Total Session Time:</strong> {aggregatedData.totalSessionTime} seconds
        </p>
        <p>
          <strong>Total Drowsy Time:</strong> {aggregatedData.totalDrowsyTime} seconds (
          {((aggregatedData.totalDrowsyTime / aggregatedData.totalSessionTime) * 100).toFixed(2)}%)
        </p>
        <p>
          <strong>Total Headpose Time:</strong> {aggregatedData.totalHeadposeTime} seconds (
          {((aggregatedData.totalHeadposeTime / aggregatedData.totalSessionTime) * 100).toFixed(2)}%)
        </p>
        <p>
          <strong>Total Yawn Time:</strong> {aggregatedData.totalYawnTime} seconds (
          {((aggregatedData.totalYawnTime / aggregatedData.totalSessionTime) * 100).toFixed(2)}%)
        </p>
        <p>
          <strong>Total Alerts:</strong>
          <ul className="list-disc ml-6">
            <li>Drowsy Alerts: {aggregatedData.drowsyAlerts}</li>
            <li>Headpose Alerts: {aggregatedData.headposeAlerts}</li>
            <li>Yawn Alerts: {aggregatedData.yawnAlerts}</li>
          </ul>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Combined Time Metrics</h3>
            <Bar
              data={combinedTimeData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'top' } },
              }}
            />
          </div>

          <div className="p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Combined Alert Distribution</h3>
            <Pie
              data={combinedAlertData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Driver Session Report</h1>

        <select
          className="mb-6 p-2 border border-gray-300 rounded"
          value={viewType}
          onChange={handleViewChange}
        >
          <option value="single">Single Session</option>
          <option value="multiple">All Sessions</option>
          <option value="combined">Combined</option>
        </select>

        {loading && <p>Loading session data...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {viewType === 'single' &&
          sessionData.length > 0 &&
          renderSingleSession(sessionData[0], 0)}

        {viewType === 'multiple' &&
          sessionData.length > 0 &&
          sessionData.map((session, index) => renderSingleSession(session, index))}

        {viewType === 'combined' && aggregatedData && renderCombinedReport()}

        {sessionData.length === 0 && !loading && !error && <p>No session data found.</p>}
      </div>
    </div>
  );
};

export default DriverDetail;
