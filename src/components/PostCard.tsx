import { useState, FormEvent } from 'react';
import axios from 'axios';
import { Post, Comment } from '../types';
import { useAuth } from '../context/AuthContext';

interface PostCardProps {
  post: Post;
  onUpdate: (post: Post) => void;
  onDelete?: (postId: string) => void;
}

export default function PostCard({ post, onUpdate, onDelete }: PostCardProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [editing, setEditing] = useState(false);
  const [editCaption, setEditCaption] = useState(post.caption);
  const [showMenu, setShowMenu] = useState(false);

  const isOwner = user?.id === post.user?._id || user?.id === post.user?.id || (user as any)?._id === post.user?._id || (user as any)?._id === post.user?.id;

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const hashtags = editCaption.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];
      const { data } = await axios.patch(`http://localhost:5000/api/posts/${post._id}`, 
        { caption: editCaption, hashtags },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(data);
      setEditing(false);
      setShowMenu(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/posts/${post._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (onDelete) onDelete(post._id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`http://localhost:5000/api/posts/${post._id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdate(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadComments = async () => {
    if (!showComments) {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://localhost:5000/api/posts/${post._id}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(data);
    }
    setShowComments(!showComments);
  };

  const handleComment = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`http://localhost:5000/api/posts/${post._id}/comment`, 
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([data, ...comments]);
      setCommentText('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card">
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
          {post.user?.name?.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <strong style={{ fontSize: '14px' }}>{post.user?.name}</strong>
            {post.user?.isVerified && <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--accent)"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>@{post.user?.username}</span>
        </div>
        {isOwner && (
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowMenu(!showMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-primary)' }}>⋯</button>
            {showMenu && (
              <div style={{ position: 'absolute', right: 0, top: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 4px 12px var(--shadow)', zIndex: 10, minWidth: '200px', overflow: 'hidden' }}>
                <button onClick={() => { setEditing(true); setShowMenu(false); }} style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', textAlign: 'left', cursor: 'pointer', fontSize: '14px', color: 'var(--text-primary)' }}>Edit</button>
                <button onClick={handleDelete} style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', color: 'var(--error)', fontWeight: 600 }}>Delete</button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {post.media?.[0] && <img src={post.media[0]} alt="" style={{ width: '100%', display: 'block' }} />}
      
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: '16px', padding: '8px 0' }}>
          <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill={post.likes?.length > 0 ? '#ed4956' : 'none'} stroke={post.likes?.length > 0 ? '#ed4956' : 'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <button onClick={loadComments} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
        
        {post.likes?.length > 0 && (
          <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
            {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
          </div>
        )}
        
        {editing ? (
          <div style={{ padding: '0 16px 12px' }}>
            <textarea className="input" value={editCaption} onChange={(e) => setEditCaption(e.target.value)} rows={3} style={{ resize: 'none', marginBottom: '8px' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleEdit} className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>Save</button>
              <button onClick={() => { setEditing(false); setEditCaption(post.caption); }} className="btn" style={{ padding: '6px 16px', fontSize: '13px' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>
            <strong style={{ marginRight: '6px' }}>{post.user?.name}</strong>
            <span>{post.caption}</span>
          </div>
        )}
        
        {post.hashtags && post.hashtags.length > 0 && (
          <div style={{ marginTop: '4px', marginBottom: '8px' }}>
            {post.hashtags.map(tag => (
              <span key={tag} style={{ color: 'var(--accent)', fontSize: '14px', marginRight: '6px' }}>#{tag}</span>
            ))}
          </div>
        )}
        
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.2px', marginTop: '8px', marginBottom: '12px' }}>
          {post.status.replace('_', ' ')}
          {post.location?.address && <span> • {post.location.address}</span>}
        </div>
      </div>
      
      {showComments && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '16px' }}>
          <form onSubmit={handleComment} style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
            <input
              className="input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              style={{ flex: 1, marginBottom: 0, border: 'none', background: 'transparent', padding: '0' }}
            />
            <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>Post</button>
          </form>
          {comments.map(comment => (
            <div key={comment._id} style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '14px' }}>
                <strong style={{ marginRight: '6px' }}>{comment.user?.name}</strong>
                {comment.isAuthorityResponse && <span style={{ color: 'var(--accent)', fontSize: '11px', fontWeight: 600, marginRight: '6px' }}>• AUTHORITY</span>}
                <span>{comment.text}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
