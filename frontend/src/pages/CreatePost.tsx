import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreatePost() {
  const [caption, setCaption] = useState('');
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [_mediaFile, setMediaFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const hashtags = caption.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];
      const postData = {
        caption,
        category: 'complaint',
        hashtags,
        media: mediaPreview ? [mediaPreview] : []
      };
      
      await axios.post('http://localhost:5000/api/posts', postData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to create post');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', paddingTop: '20px' }}>
      <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Create Post</h2>
        <form onSubmit={handleSubmit}>
          {mediaPreview && (
            <div style={{ marginBottom: '12px', position: 'relative' }}>
              <img src={mediaPreview} alt="Preview" style={{ width: '100%', borderRadius: '8px' }} />
              <button
                type="button"
                onClick={() => { setMediaPreview(''); setMediaFile(null); }}
                style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          )}
          
          <label style={{ display: 'block', marginBottom: '12px', cursor: 'pointer' }}>
            <div style={{ padding: '40px', border: '2px dashed var(--border)', borderRadius: '8px', textAlign: 'center', background: 'var(--bg-secondary)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" style={{ margin: '0 auto 8px' }}>
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Click to upload photo/video</p>
            </div>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              style={{ display: 'none' }}
            />
          </label>
          
          <textarea
            className="input"
            placeholder="Write a caption... (use #hashtags)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            style={{ resize: 'none' }}
          />
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '8px' }}>Share</button>
        </form>
      </div>
    </div>
  );
}
