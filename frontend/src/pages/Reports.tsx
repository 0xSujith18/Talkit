import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

interface Report {
  _id: string;
  reportId: string;
  title: string;
  category: string;
  status: string;
  location: { address: string };
  createdAt: string;
  publishedToFeed: boolean;
}

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: '', status: '' });

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      if (filter.status) params.append('status', filter.status);
      
      const { data } = await api.get(`/reports?${params}`);
      setReports(data.reports);
    } catch (error) {
      console.error('Failed to fetch reports', error);
    } finally {
      setLoading(false);
    }
  };

  const publishToFeed = async (reportId: string) => {
    try {
      await api.post(`/reports/${reportId}/publish`);
      alert('Report published to feed!');
      fetchReports();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to publish');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Reports</h1>
        <Link
          to="/create-report"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Report
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="p-2 border rounded-lg"
        >
          <option value="">All Categories</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="sanitation">Sanitation</option>
          <option value="traffic">Traffic</option>
          <option value="water">Water</option>
          <option value="electricity">Electricity</option>
          <option value="other">Other</option>
        </select>

        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="p-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {reports.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No reports found</p>
          <Link to="/create-report" className="text-blue-600 hover:underline">
            Create your first report
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold">{report.title}</h3>
                  <p className="text-sm text-gray-500">ID: {report.reportId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                  {report.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="flex gap-4 text-sm text-gray-600 mb-4">
                <span className="capitalize">📂 {report.category}</span>
                <span>📍 {report.location.address}</span>
                <span>📅 {new Date(report.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/reports/${report._id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Details
                </Link>
                {!report.publishedToFeed && user?.role === 'citizen' && (
                  <button
                    onClick={() => publishToFeed(report._id)}
                    className="text-green-600 hover:underline"
                  >
                    Publish to Feed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
