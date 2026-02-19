import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  mla?: string;
  civicBody?: string;
  privacy: string;
  user: { name: string; email: string };
  actionProof?: string[];
  createdAt: string;
  publishedToFeed: boolean;
}

export default function ReportDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const { data } = await api.get(`/reports/${id}`);
      setReport(data);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to fetch report');
      navigate('/reports');
    } finally {
      setLoading(false);
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
  if (!report) return <div className="text-center p-8">Report not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => navigate('/reports')} className="mb-4 text-blue-600 hover:underline">
        ← Back to Reports
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{report.title}</h1>
            <p className="text-gray-500">Report ID: {report.reportId}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
            {report.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="font-semibold text-gray-600">Category</p>
            <p className="capitalize">{report.category}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Privacy</p>
            <p className="capitalize">{report.privacy.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Reported By</p>
            <p>{report.user.name}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Date</p>
            <p>{new Date(report.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{report.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Location</h2>
          <p className="text-gray-700">{report.location.address}</p>
          <p className="text-sm text-gray-500">
            Coordinates: {report.location.coordinates.lat.toFixed(6)}, {report.location.coordinates.lng.toFixed(6)}
          </p>
        </div>

        {report.media.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Photos</h2>
            <div className="grid grid-cols-2 gap-4">
              {report.media.map((img, i) => (
                <img key={i} src={img} alt={`Evidence ${i + 1}`} className="w-full h-64 object-cover rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {report.mla && (
          <div className="mb-4">
            <p className="font-semibold text-gray-600">MLA</p>
            <p>{report.mla}</p>
          </div>
        )}

        {report.civicBody && (
          <div className="mb-4">
            <p className="font-semibold text-gray-600">Civic Body</p>
            <p>{report.civicBody}</p>
          </div>
        )}

        {report.actionProof && report.actionProof.length > 0 && (
          <div className="mb-6 border-t pt-6">
            <h2 className="text-xl font-semibold mb-3 text-green-700">Action Taken</h2>
            <div className="grid grid-cols-2 gap-4">
              {report.actionProof.map((img, i) => (
                <img key={i} src={img} alt={`Action proof ${i + 1}`} className="w-full h-64 object-cover rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {report.publishedToFeed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">✓ This report has been published to the public feed</p>
          </div>
        )}
      </div>
    </div>
  );
}
