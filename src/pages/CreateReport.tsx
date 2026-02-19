import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const categories = [
  'infrastructure',
  'sanitation',
  'traffic',
  'water',
  'electricity',
  'other'
];

const privacyOptions = [
  { value: 'public', label: 'Public' },
  { value: 'authorities_only', label: 'Authorities Only' },
  { value: 'anonymous', label: 'Anonymous' }
];

export default function CreateReport() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: 'infrastructure',
    title: '',
    description: '',
    media: [] as string[],
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
      const readers = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(readers).then(images => {
        setFormData({ ...formData, media: [...formData.media, ...images] });
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.media.length === 0) {
      alert('At least one photo is required');
      return;
    }
    
    if (!formData.location.coordinates.lat || !formData.location.coordinates.lng) {
      alert('Please enable location');
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await api.post('/reports', formData);
      alert(`Report created successfully! Report ID: ${data.reportId}`);
      navigate('/reports');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Civic Report</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-3 border rounded-lg"
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 border rounded-lg h-32"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Photos * (Required)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full p-3 border rounded-lg"
          />
          {formData.media.length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {formData.media.map((img, i) => (
                <img key={i} src={img} alt="" className="w-20 h-20 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-2">Location *</label>
          <button
            type="button"
            onClick={handleGetLocation}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2"
          >
            📍 Get Current Location
          </button>
          <input
            type="text"
            placeholder="Address"
            value={formData.location.address}
            onChange={(e) => setFormData({
              ...formData,
              location: { ...formData.location, address: e.target.value }
            })}
            className="w-full p-3 border rounded-lg"
            required
          />
          {formData.location.coordinates.lat !== 0 && (
            <p className="text-sm text-green-600 mt-1">
              ✓ Location captured: {formData.location.coordinates.lat.toFixed(4)}, {formData.location.coordinates.lng.toFixed(4)}
            </p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-2">MLA (Optional)</label>
          <input
            type="text"
            value={formData.mla}
            onChange={(e) => setFormData({ ...formData, mla: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Civic Body (Optional)</label>
          <input
            type="text"
            value={formData.civicBody}
            onChange={(e) => setFormData({ ...formData, civicBody: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Privacy</label>
          <select
            value={formData.privacy}
            onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
            className="w-full p-3 border rounded-lg"
          >
            {privacyOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}
