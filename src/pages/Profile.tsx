import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Post } from '../types';

export default function Profile() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState({ posts: 0, likes: 0 });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', name: '', bio: '' });

  useEffect(() => {
    const userId = user?.id || (user as any)?._id;
    if (userId) {
      loadUserPosts();
      setFormData({ username: user.username, name: user.name, bio: user.bio || '' });
    }
  }, [user]);

  const loadUserPosts = async () => {
    const userId = user?.id || (user as any)?._id;
    if (!userId) return;
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://localhost:5000/api/posts/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(data);
      const totalLikes = data.reduce((sum: number, p: Post) => sum + p.likes.length, 0);
      setStats({ posts: data.length, likes: totalLikes });
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:5000/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditing(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const updatePost = (updatedPost: Post) => {
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  const deletePost = (postId: string) => {
    setPosts(posts.filter(p => p._id !== postId));
    setStats({ ...stats, posts: stats.posts - 1 });
  };

  return (
    <div className="container" style={{ maxWidth: '600px', paddingTop: '20px' }}>
      <div className="card" style={{ padding: '30px', marginBottom: '20px' }}>
        {!editing ? (
          <>
            <h2>{user?.name}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>@{user?.username}</p>
            {user?.bio && <p style={{ marginTop: '12px', fontSize: '15px' }}>{user.bio}</p>}
            <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
              <div><strong>{stats.posts}</strong> Posts</div>
              <div><strong>{stats.likes}</strong> Likes</div>
            </div>
            <button onClick={() => setEditing(true)} className="btn btn-primary" style={{ marginTop: '20px' }}>Edit Profile</button>
          </>
        ) : (
          <form onSubmit={handleUpdate}>
            <h2 style={{ marginBottom: '20px' }}>Edit Profile</h2>
            <input
              className="input"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <textarea
              className="input"
              placeholder="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              style={{ resize: 'none' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="btn" style={{ background: '#dbdbdb' }}>Cancel</button>
            </div>
          </form>
        )}
      </div>
      
      <h3 style={{ marginBottom: '20px' }}>My Posts</h3>
      {posts.map(post => (
        <PostCard key={post._id} post={post} onUpdate={updatePost} onDelete={deletePost} />
      ))}
    </div>
  );
}
