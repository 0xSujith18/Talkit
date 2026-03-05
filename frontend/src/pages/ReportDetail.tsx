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

  if (loading) return <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-primary)' }}>Loading...</div>;
  if (!report) return <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-primary)' }}>Report not found</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      <button onClick={() => navigate('/reports')} style={{ marginBottom: '16px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
        ← Back to Reports
      </button>

      <div className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>{report.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Report ID: <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{report.reportId}</span></p>
          </div>
          <span style={{ padding: '10px 20px', borderRadius: '24px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', background: report.status === 'pending' ? '#fef3c7' : report.status === 'in_progress' ? '#dbeafe' : '#d1fae5', color: report.status === 'pending' ? '#92400e' : report.status === 'in_progress' ? '#1e40af' : '#065f46' }}>
            {report.status.replace('_', ' ')}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px', padding: '20px', background: 'var(--bg-primary)', borderRadius: '12px' }}>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>CATEGORY</p>
            <p style={{ textTransform: 'capitalize', color: 'var(--text-primary)', fontWeight: 600 }}>{report.category}</p>
          </div>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>PRIVACY</p>
            <p style={{ textTransform: 'capitalize', color: 'var(--text-primary)', fontWeight: 600 }}>{report.privacy.replace('_', ' ')}</p>
          </div>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>REPORTED BY</p>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{report.user.name}</p>
          </div>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>DATE</p>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{new Date(report.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Description</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{report.description}</p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>📍 Location</h2>
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>{report.location.address}</p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Coordinates: {report.location.coordinates.lat.toFixed(6)}, {report.location.coordinates.lng.toFixed(6)}
          </p>
        </div>

        {report.media.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>📸 Evidence Photos</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
              {report.media.map((img, i) => (
                <img key={i} src={img} alt={`Evidence ${i + 1}`} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--border)' }} />
              ))}
            </div>
          </div>
        )}

        {(report.mla || report.civicBody) && (
          <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>🏛️ Authority Information</h2>
            {report.mla && (
              <div style={{ marginBottom: '8px' }}>
                <p style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '12px' }}>MLA</p>
                <p style={{ color: 'var(--text-primary)' }}>{report.mla}</p>
              </div>
            )}
            {report.civicBody && (
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '12px' }}>CIVIC BODY</p>
                <p style={{ color: 'var(--text-primary)' }}>{report.civicBody}</p>
              </div>
            )}
          </div>
        )}

        {report.actionProof && report.actionProof.length > 0 && (
          <div style={{ marginBottom: '24px', padding: '20px', background: '#d1fae5', borderRadius: '12px', border: '2px solid #10b981' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#065f46' }}>✅ Action Taken</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
              {report.actionProof.map((img, i) => (
                <img key={i} src={img} alt={`Action proof ${i + 1}`} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #10b981' }} />
              ))}
            </div>
          </div>
        )}

        {report.publishedToFeed && (
          <div style={{ background: '#d1fae5', border: '2px solid #10b981', borderRadius: '12px', padding: '16px' }}>
            <p style={{ color: '#065f46', fontWeight: 600 }}>✓ This report has been published to the public feed</p>
          </div>
        )}
      </div>
    </div>
  );
}
