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
  const [step, setStep] = useState(1);
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
    
    if (!formData.location.coordinates.lat || !formData.location.coordinates.lng) {
      alert('Please enable location');
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

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>📋 Create Civic Report</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Report civic issues with photo evidence and GPS location tracking</p>
      </div>

      {/* Progress Steps */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20px', left: '0', right: '0', height: '2px', background: 'var(--border)', zIndex: 0 }}>
          <div style={{ height: '100%', background: 'var(--accent)', width: `${((step - 1) / 3) * 100}%`, transition: 'width 0.3s' }} />
        </div>
        {['Category', 'Details', 'Location', 'Review'].map((label, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: step > i ? 'var(--accent)' : step === i + 1 ? 'var(--accent)' : 'var(--bg-card)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: step >= i + 1 ? 'white' : 'var(--text-secondary)', fontWeight: 700, marginBottom: '8px' }}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: '12px', color: step >= i + 1 ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: '32px' }}>
          {/* Step 1: Category Selection */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Select Issue Category</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                {categories.map(cat => (
                  <div
                    key={cat.value}
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    style={{
                      padding: '20px',
                      border: `2px solid ${formData.category === cat.value ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      background: formData.category === cat.value ? 'rgba(124, 58, 237, 0.1)' : 'var(--bg-card)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{cat.icon}</div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{cat.label}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{cat.desc}</p>
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '24px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>Urgency Level</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {urgencyLevels.map(level => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setUrgency(level.value)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: `2px solid ${urgency === level.value ? level.color : 'var(--border)'}`,
                        borderRadius: '8px',
                        background: urgency === level.value ? level.color : 'transparent',
                        color: urgency === level.value ? 'white' : 'var(--text-primary)',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Issue Details</h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief description of the issue"
                  className="input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>Detailed Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide detailed information about the issue, when it started, and its impact..."
                  className="input"
                  style={{ width: '100%', minHeight: '120px', resize: 'vertical' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>Photo Evidence * (Required)</label>
                <div style={{ border: '2px dashed var(--border)', borderRadius: '12px', padding: '24px', textAlign: 'center', background: 'var(--bg-secondary)', cursor: 'pointer', position: 'relative' }}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                  />
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📸</div>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>Click to upload photos</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Upload multiple images as evidence (Max 10MB each)</p>
                </div>
                {mediaPreviews.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px', marginTop: '16px' }}>
                    {mediaPreviews.map((img, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--border)' }} />
                        <button
                          type="button"
                          onClick={() => {
                            setMediaFiles(mediaFiles.filter((_, idx) => idx !== i));
                            setMediaPreviews(mediaPreviews.filter((_, idx) => idx !== i));
                          }}
                          style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Location Information</h2>
              
              <div style={{ marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '16px' }}
                >
                  📍 Get Current GPS Location
                </button>
                {formData.location.coordinates.lat !== 0 && (
                  <div style={{ marginTop: '12px', padding: '12px', background: '#d1fae5', borderRadius: '8px', border: '2px solid #10b981' }}>
                    <p style={{ color: '#065f46', fontWeight: 600, marginBottom: '4px' }}>✓ Location Captured Successfully</p>
                    <p style={{ color: '#065f46', fontSize: '13px' }}>Lat: {formData.location.coordinates.lat.toFixed(6)}, Lng: {formData.location.coordinates.lng.toFixed(6)}</p>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>Address *</label>
                <input
                  type="text"
                  placeholder="Enter full address with landmarks"
                  value={formData.location.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, address: e.target.value }
                  })}
                  className="input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>MLA / Representative (Optional)</label>
                  <input
                    type="text"
                    value={formData.mla}
                    onChange={(e) => setFormData({ ...formData, mla: e.target.value })}
                    placeholder="Name of local MLA"
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>Civic Body (Optional)</label>
                  <input
                    type="text"
                    value={formData.civicBody}
                    onChange={(e) => setFormData({ ...formData, civicBody: e.target.value })}
                    placeholder="Municipal Corporation, etc."
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Review & Submit</h2>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>Privacy Setting</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {privacyOptions.map(opt => (
                    <div
                      key={opt.value}
                      onClick={() => setFormData({ ...formData, privacy: opt.value })}
                      style={{
                        padding: '16px',
                        border: `2px solid ${formData.privacy === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        background: formData.privacy === opt.value ? 'rgba(124, 58, 237, 0.1)' : 'var(--bg-card)'
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{opt.icon}</div>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{opt.label}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: '20px', background: 'var(--bg-secondary)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Report Summary</h3>
                <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                  <p><strong>Category:</strong> {categories.find(c => c.value === formData.category)?.label}</p>
                  <p><strong>Urgency:</strong> <span style={{ color: urgencyLevels.find(u => u.value === urgency)?.color }}>{urgency.toUpperCase()}</span></p>
                  <p><strong>Title:</strong> {formData.title}</p>
                  <p><strong>Photos:</strong> {mediaFiles.length} uploaded</p>
                  <p><strong>Location:</strong> {formData.location.address || 'Not set'}</p>
                  <p><strong>Privacy:</strong> {privacyOptions.find(p => p.value === formData.privacy)?.label}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn"
                style={{ flex: 1, padding: '12px', background: 'var(--bg-card)', color: 'var(--text-primary)', border: '2px solid var(--border)' }}
              >
                ← Previous
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px' }}
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px', fontSize: '16px', fontWeight: 700 }}
              >
                {loading ? '🔄 Submitting Report...' : '✓ Submit Report'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
