import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { Post } from '../types';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data } = await api.get('/posts/feed');
      setPosts(data.posts);
    } catch (error) {
      console.error(error);
    }
  };

  const updatePost = (updatedPost: Post) => {
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  return (
    <div style={{ padding: '24px', width: '100%' }}>
      {/* Inline Post Creator (Visual Only, redirects to create) */}
      <div
        className="card"
        style={{
          padding: '16px',
          margin: '0 0 24px 0',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/create')}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px',
          flexShrink: 0
        }}>
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div style={{
          flex: 1,
          background: 'var(--bg-secondary)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-full)',
          color: 'var(--text-secondary)',
          fontSize: '15px'
        }}>
          What civic issue did you notice today?
        </div>
      </div>

      {/* Feed List */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '24px',
        alignItems: 'start' 
      }}>
        {posts.map(post => (
          <PostCard key={post._id} post={post} onUpdate={updatePost} />
        ))}
      </div>
    </div>
  );
}
