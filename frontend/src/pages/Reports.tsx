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
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

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

  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.reportId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    inProgress: reports.filter(r => r.status === 'in_progress').length,
    resolved: reports.filter(r => r.status === 'resolved').length
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-primary)' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>My Reports</h1>
        <Link
          to="/create-report"
          style={{ background: 'var(--accent)', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700 }}
        >
          + New Report
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent)' }}>{stats.total}</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Total Reports</div>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#f59e0b' }}>{stats.pending}</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Pending</div>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#3b82f6' }}>{stats.inProgress}</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>In Progress</div>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#10b981' }}>{stats.resolved}</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Resolved</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="input"
          type="text"
          placeholder="🔍 Search reports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: '250px' }}
        />
        <select
          className="input"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          style={{ minWidth: '150px' }}
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
          className="input"
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          style={{ minWidth: '150px' }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <button onClick={() => setViewMode('list')} style={{ padding: '8px 12px', borderRadius: '8px', background: viewMode === 'list' ? 'var(--accent)' : 'var(--bg-card)', color: viewMode === 'list' ? 'white' : 'var(--text-primary)', border: 'none', cursor: 'pointer' }}>List</button>
          <button onClick={() => setViewMode('grid')} style={{ padding: '8px 12px', borderRadius: '8px', background: viewMode === 'grid' ? 'var(--accent)' : 'var(--bg-card)', color: viewMode === 'grid' ? 'white' : 'var(--text-primary)', border: 'none', cursor: 'pointer' }}>Grid</button>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div>
          <div className="card" style={{ textAlign: 'center', padding: '48px', marginBottom: '24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>No Reports Yet</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
              Start making a difference in your community by reporting civic issues. Your voice matters!
            </p>
            <Link to="/create-report" className="btn btn-primary" style={{ display: 'inline-block', padding: '12px 32px', background: 'var(--accent)', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: 700 }}>
              📝 Create Your First Report
            </Link>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>🏛️ How Civic Reporting Works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>1️⃣</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Report the Issue</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Document civic problems with photos, location, and detailed description. Get a unique tracking ID.</p>
              </div>
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>2️⃣</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Authority Review</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Local authorities and civic bodies receive your report and update the status as they work on it.</p>
              </div>
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>3️⃣</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Track Progress</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Monitor your report status: Pending → In Progress → Resolved. Get notified of updates.</p>
              </div>
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>4️⃣</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Share & Amplify</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Publish resolved reports to the public feed to showcase government accountability.</p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>📂 Report Categories</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {[
                { icon: '🏗️', name: 'Infrastructure', desc: 'Roads, bridges, buildings' },
                { icon: '🚮', name: 'Sanitation', desc: 'Waste, cleanliness' },
                { icon: '🚦', name: 'Traffic', desc: 'Signals, congestion' },
                { icon: '💧', name: 'Water', desc: 'Supply, drainage' },
                { icon: '⚡', name: 'Electricity', desc: 'Power, streetlights' },
                { icon: '🌳', name: 'Environment', desc: 'Pollution, greenery' },
              ].map((cat) => (
                <div key={cat.name} className="card" style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{cat.icon}</div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{cat.name}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, var(--accent) 0%, #667eea 100%)', color: 'white' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>🎯 Why Report Civic Issues?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '16px' }}>
              <div>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔒</div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Transparent Accountability</h4>
                <p style={{ fontSize: '13px', opacity: 0.9 }}>Track government response and action on civic issues</p>
              </div>
              <div>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📍</div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>GPS Verified</h4>
                <p style={{ fontSize: '13px', opacity: 0.9 }}>Geo-tagged reports with precise location proof</p>
              </div>
              <div>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🆔</div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Unique Tracking ID</h4>
                <p style={{ fontSize: '13px', opacity: 0.9 }}>Every report gets a TLK-XXXXX-XXXX identifier</p>
              </div>
              <div>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🕵️</div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Anonymous Option</h4>
                <p style={{ fontSize: '13px', opacity: 0.9 }}>Report sensitive issues without revealing identity</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: viewMode === 'grid' ? 'grid' : 'flex', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : 'none', flexDirection: viewMode === 'list' ? 'column' : 'none', gap: '16px' }}>
          {filteredReports.map((report) => (
            <div key={report._id} className="card" style={{ padding: '20px', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{report.title}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ID: {report.reportId}</p>
                </div>
                <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', background: report.status === 'pending' ? '#fef3c7' : report.status === 'in_progress' ? '#dbeafe' : '#d1fae5', color: report.status === 'pending' ? '#92400e' : report.status === 'in_progress' ? '#1e40af' : '#065f46' }}>
                  {report.status.replace('_', ' ')}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                <span style={{ textTransform: 'capitalize' }}>📂 {report.category}</span>
                <span>📍 {report.location.address.substring(0, 30)}...</span>
                <span>📅 {new Date(report.createdAt).toLocaleDateString()}</span>
              </div>

              <div style={{ display: 'flex', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <Link
                  to={`/reports/${report._id}`}
                  style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}
                >
                  View Details →
                </Link>
                {!report.publishedToFeed && user?.role === 'citizen' && (
                  <button
                    onClick={() => publishToFeed(report._id)}
                    style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
                  >
                    📢 Publish
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
