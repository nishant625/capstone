import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const DriverDetail = () => {
  const { driverCode } = useParams();
  const [sessionData, setSessionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/sessions/${driverCode}?limit=1`);
        setSessionData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch session data');
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [driverCode]);

  const handleLoadMore = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/sessions/${driverCode}`);
      setSessionData(response.data);
      setShowMore(true);
      setLoading(false);
    } catch (err) {
      setError('Failed to load more session data');
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Driver Session Report</h1>

      {loading && <p>Loading session data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {sessionData.length > 0 ? (
        <div>
          {sessionData.map((session, index) => {
            // Chart Data Preparation
            const totalTimeData = {
              labels: ['Total Session Time', 'Drowsy Time', 'Headpose Time', 'Yawn Time'],
              datasets: [
                {
                  label: 'Time in Seconds',
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
                  label: 'Alerts Count',
                  data: [
                    session.drowsy_alerts,
                    session.headpose_alerts,
                    session.yawn_alerts,
                  ],
                  backgroundColor: ['#FFEB3B', '#9C27B0', '#E91E63'],
                },
              ],
            };

            return (
              <div key={session._id} className="mb-12">
                <h2 className="text-xl mb-4">Summary for Driver {driverCode} - Session {index + 1}</h2>

                {/* Text Summary */}
                <div className="mb-6">
                  <p><strong>Total Session Time:</strong> {session.total_session_time_seconds} seconds</p>
                  <p><strong>Drowsy Time:</strong> {session.total_drowsy_time_seconds} seconds ({((session.total_drowsy_time_seconds / session.total_session_time_seconds) * 100).toFixed(2)}%)</p>
                  <p><strong>Headpose Time:</strong> {session.total_headpose_time_seconds} seconds ({((session.total_headpose_time_seconds / session.total_session_time_seconds) * 100).toFixed(2)}%)</p>
                  <p><strong>Yawn Time:</strong> {session.total_yawn_time_seconds} seconds ({((session.total_yawn_time_seconds / session.total_session_time_seconds) * 100).toFixed(2)}%)</p>
                  <p><strong>Drowsy Alerts:</strong> {session.drowsy_alerts}</p>
                  <p><strong>Headpose Alerts:</strong> {session.headpose_alerts}</p>
                  <p><strong>Yawn Alerts:</strong> {session.yawn_alerts}</p>
                  <p><strong>Average Alert Frequency:</strong> {((session.drowsy_alerts + session.headpose_alerts + session.yawn_alerts) / session.total_session_time_seconds * 3600).toFixed(2)} alerts per hour</p>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Session Time Metrics</h3>
                    <Bar data={totalTimeData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Alert Distribution</h3>
                    <Pie data={alertData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* "View More" button */}
          {!showMore && (
            <button
              onClick={handleLoadMore}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              View More
            </button>
          )}
        </div>
      ) : (
        <p>No session data found.</p>
      )}
    </div>
  );
};

export default DriverDetail;
