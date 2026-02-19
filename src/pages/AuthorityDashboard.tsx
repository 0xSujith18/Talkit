import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

interface Report {
  _id: string;
  reportId: string;
  title: string;
  description: string;
  category: string;
  status: string;
  location: { address: string; coordinates: { lat: number; lng: number } };
  media: string[];
  user: { name: string; email: string };
  createdAt: string;
}

interface Analytics {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  byCategory: Array<{ _id: string; count: number }>;
}

export default function AuthorityDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filter, setFilter] = useState({ category: '', status: '' });

  useEffect(() => {
    if (user?.role === 'authority' || user?.role === 'admin') {
      fetchReports();
      fetchAnalytics();
    }
  }, [filter, user]);

  const fetchReports = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      if (filter.status) params.append('status', filter.status);
      
      const { data } = await api.get(`/reports?${params}`);
      setReports(data.reports);
    } catch (error) {
      console.error('Failed to fetch reports', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/reports/analytics/summary');
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    }
  };

  const updateStatus = async (reportId: string, status: string) => {
    try {
      await api.patch(`/reports/${reportId}/status`, { status });
      alert('Status updated successfully');
      fetchReports();
      fetchAnalytics();
      setSelectedReport(null);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update status');
    }
  };

  if (user?.role !== 'authority' && user?.role !== 'admin') {
    return <div className="text-center p-8">Access Denied</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Authority Dashboard</h1>

      {analytics && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-100 p-6 rounded-lg">
            <h3 className="text-2xl font-bold">{analytics.total}</h3>
            <p className="text-gray-700">Total Reports</p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-lg">
            <h3 className="text-2xl font-bold">{analytics.pending}</h3>
            <p className="text-gray-700">Pending</p>
          </div>
          <div className="bg-blue-100 p-6 rounded-lg">
            <h3 className="text-2xl font-bold">{analytics.inProgress}</h3>
            <p className="text-gray-700">In Progress</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg">
            <h3 className="text-2xl font-bold">{analytics.resolved}</h3>
            <p className="text-gray-700">Resolved</p>
          </div>
        </div>
      )}

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

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Reports</h2>
          {reports.map((report) => (
            <div
              key={report._id}
              onClick={() => setSelectedReport(report)}
              className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg transition ${
                selectedReport?._id === report._id ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <h3 className="font-semibold">{report.title}</h3>
              <p className="text-sm text-gray-600">ID: {report.reportId}</p>
              <div className="flex gap-2 mt-2 text-sm">
                <span className="capitalize">📂 {report.category}</span>
                <span className={`px-2 py-1 rounded ${
                  report.status === 'pending' ? 'bg-yellow-100' :
                  report.status === 'in_progress' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {report.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div>
          {selectedReport ? (
            <div className="border rounded-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold mb-4">{selectedReport.title}</h2>
              <p className="text-sm text-gray-500 mb-4">ID: {selectedReport.reportId}</p>
              
              <div className="mb-4">
                <p className="font-semibold">Description:</p>
                <p className="text-gray-700">{selectedReport.description}</p>
              </div>

              <div className="mb-4">
                <p className="font-semibold">Location:</p>
                <p className="text-gray-700">{selectedReport.location.address}</p>
                <p className="text-sm text-gray-500">
                  {selectedReport.location.coordinates.lat.toFixed(4)}, {selectedReport.location.coordinates.lng.toFixed(4)}
                </p>
              </div>

              <div className="mb-4">
                <p className="font-semibold">Reported by:</p>
                <p className="text-gray-700">{selectedReport.user.name}</p>
                <p className="text-sm text-gray-500">{selectedReport.user.email}</p>
              </div>

              {selectedReport.media.length > 0 && (
                <div className="mb-4">
                  <p className="font-semibold mb-2">Photos:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedReport.media.map((img, i) => (
                      <img key={i} src={img} alt="" className="w-full h-32 object-cover rounded" />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <p className="font-semibold mb-2">Update Status:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(selectedReport._id, 'in_progress')}
                    className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateStatus(selectedReport._id, 'resolved')}
                    className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
                  >
                    Resolved
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-12 text-center text-gray-500">
              Select a report to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
