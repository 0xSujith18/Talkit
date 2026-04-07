import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import { uploadMultipleImages } from '../utils/uploadImage';

const categories = [
  { value: 'infrastructure', label: 'Infrastructure', icon: '🏗️', desc: 'Roads, bridges, buildings' },
  { value: 'sanitation', label: 'Sanitation', icon: '🚮', desc: 'Waste management, cleanliness' },
  { value: 'traffic', label: 'Traffic', icon: '🚦', desc: 'Signals, congestion, parking' },
  { value: 'water', label: 'Water Supply', icon: '💧', desc: 'Supply issues, drainage' },
  { value: 'electricity', label: 'Electricity', icon: '⚡', desc: 'Power cuts, streetlights' },
  { value: 'other', label: 'Other', icon: '📋', desc: 'Other civic issues' }
];

const privacyOptions = [
  { value: 'public', label: 'Public', icon: '🌐', desc: 'Visible to everyone' },
  { value: 'authorities_only', label: 'Authorities Only', icon: '🏛️', desc: 'Only government officials' },
  { value: 'anonymous', label: 'Anonymous', icon: '🕵️', desc: 'Hide your identity' }
];

const urgencyLevels = [
  { value: 'low', label: 'Low', color: '#10b981' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' },
  { value: 'critical', label: 'Critical', color: '#dc2626' }
];

export default function CreateReport() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [urgency, setUrgency] = useState('medium');
  const [formData, setFormData] = useState({
    category: 'infrastructure',
    title: '',
    description: '',
    location: {
      address: '',
      coordinates: { lat: 0, lng: 0 }
    },
    mla: '',
    civicBody: '',
    privacy: 'public'
  });

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              ...formData.location,
              coordinates: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            }
          });
        },
        (error) => alert('Unable to get location: ' + error.message)
      );
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      setMediaFiles([...mediaFiles, ...filesArray]);

      const readers = filesArray.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(images => {
        setMediaPreviews([...mediaPreviews, ...images]);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mediaFiles.length === 0) {
      alert('At least one photo is required');
      return;
    }

    setLoading(true);
    try {
      const mediaUrls = await uploadMultipleImages(mediaFiles);

      const { data } = await api.post('/reports', {
        ...formData,
        media: mediaUrls
      });

      alert(`Report created successfully! Report ID: ${data.reportId}`);
      navigate('/reports');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create report');
    } finally {
      setLoading(false);
    }
  };

  // Helper for rendering section numbers
  const renderNumberBadge = (num: number) => (
    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>
      {num}
    </div>
  );

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>File a New Report</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Help improve your community by providing accurate details and evidence.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Card 1: Issue Details */}
        <div className="card" style={{ padding: '24px', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            {renderNumberBadge(1)}
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Issue Details</h2>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', fontSize: '14px' }}>Category</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {categories.map(cat => (
                <div
                  key={cat.value}
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  style={{
                    padding: '12px',
                    border: `1.5px solid ${formData.category === cat.value ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: formData.category === cat.value ? 'rgba(24, 119, 242, 0.05)' : 'transparent',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: formData.category === cat.value ? 'var(--accent)' : 'var(--text-primary)' }}>{cat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', fontSize: '14px' }}>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="E.g., Large pothole on Main Street"
              className="input"
              style={{ width: '100%', borderRadius: '8px', padding: '12px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', fontSize: '14px' }}>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide more details about the issue..."
              className="input"
              style={{ width: '100%', minHeight: '100px', resize: 'vertical', borderRadius: '8px', padding: '12px' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', fontSize: '14px' }}>Urgency</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {urgencyLevels.map(level => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setUrgency(level.value)}
                  style={{
                    padding: '8px 16px',
                    border: `1.5px solid ${urgency === level.value ? level.color : 'var(--border)'}`,
                    borderRadius: '20px',
                    background: urgency === level.value ? `${level.color}15` : 'transparent',
                    color: urgency === level.value ? level.color : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Photo Upload */}
        <div className="card" style={{ padding: '24px', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {renderNumberBadge(2)}
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Mandatory Photo Upload</h2>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>Required</span>
          </div>

          <div style={{
            border: '2px dashed var(--border)',
            borderRadius: '12px',
            padding: '32px 24px',
            textAlign: 'center',
            background: 'var(--bg-secondary)',
            cursor: 'pointer',
            position: 'relative',
            transition: 'border-color 0.2s'
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
            />
            <div style={{ fontSize: '32px', marginBottom: '12px', color: 'var(--accent)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </div>
            <p style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: '8px', fontSize: '15px' }}>Click or drag photos to upload</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Clear photos help authorities understand the issue better.</p>
          </div>

          {mediaPreviews.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '12px', marginTop: '16px' }}>
              {mediaPreviews.map((img, i) => (
                <div key={i} style={{ position: 'relative', paddingTop: '100%' }}>
                  <img src={img} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaFiles(mediaFiles.filter((_, idx) => idx !== i));
                      setMediaPreviews(mediaPreviews.filter((_, idx) => idx !== i));
                    }}
                    style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--error)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 3: Location */}
        <div className="card" style={{ padding: '24px', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            {renderNumberBadge(3)}
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>GPS Geo-tagging</h2>
          </div>

          <div style={{ overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '16px', position: 'relative', height: '180px', background: '#e5e7eb' }}>
            {/* Mock Map View */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #cbd5e1 0%, #cbd5e1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '32px' }}>🗺️</span>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px', fontWeight: 500 }}>
                  {formData.location.coordinates.lat !== 0 ? 'Location captured successfully' : 'Map preview not available'}
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={handleGetLocation}
              className="btn"
              style={{ flex: '0 0 auto', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', border: '1.5px solid var(--border)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px' }}
            >
              📍 Detect Automatically
            </button>
            <input
              type="text"
              placeholder="Or type precise address/landmark..."
              value={formData.location.address}
              onChange={(e) => setFormData({
                ...formData,
                location: { ...formData.location, address: e.target.value }
              })}
              className="input"
              style={{ flex: 1, margin: 0, borderRadius: '8px', padding: '12px' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', fontSize: '13px' }}>MLA/Representative (Optional)</label>
              <input
                type="text"
                value={formData.mla}
                onChange={(e) => setFormData({ ...formData, mla: e.target.value })}
                placeholder="E.g., John Doe"
                className="input"
                style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', fontSize: '13px' }}>Civic Body (Optional)</label>
              <input
                type="text"
                value={formData.civicBody}
                onChange={(e) => setFormData({ ...formData, civicBody: e.target.value })}
                placeholder="E.g., City Council"
                className="input"
                style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px' }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Privacy Settings */}
        <div className="card" style={{ padding: '24px', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            {renderNumberBadge(4)}
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Privacy Settings</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {privacyOptions.map(opt => (
              <label
                key={opt.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  border: `1.5px solid ${formData.privacy === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: formData.privacy === opt.value ? 'rgba(24, 119, 242, 0.05)' : 'transparent',
                  transition: 'all 0.2s',
                  gap: '16px'
                }}
              >
                <input
                  type="radio"
                  name="privacy"
                  value={opt.value}
                  checked={formData.privacy === opt.value}
                  onChange={() => setFormData({ ...formData, privacy: opt.value })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>{opt.label}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ marginTop: '8px', marginBottom: '40px' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: 700, boxShadow: '0 4px 12px rgba(24, 119, 242, 0.25)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            {loading ? 'Submitting...' : 'Submit Report'}
            {!loading && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>}
          </button>
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '16px' }}>
            By submitting this report, you agree to our Terms of Service. False reporting may lead to account suspension.
          </p>
        </div>

      </form>
    </div>
  );
}
