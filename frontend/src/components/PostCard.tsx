import { useState, FormEvent, useRef } from 'react';
import api from '../config/api';
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
  const [isLiked, setIsLiked] = useState(post.likes?.length > 0);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showHeart, setShowHeart] = useState(false);
  const lastTap = useRef(0);

  const isOwner = user?.id === (post.user as any)?._id || user?.id === post.user?.id || (user as any)?._id === (post.user as any)?._id || (user as any)?._id === post.user?.id;

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const hashtags = editCaption.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];
      const { data } = await api.patch(`/posts/${post._id}`,
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
        await api.delete(`/posts/${post._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (onDelete) onDelete(post._id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleLike = async (fromDoubleTap = false) => {
    if (fromDoubleTap && isLiked) return;

    // Optimistic update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);

    try {
      const token = localStorage.getItem('token');
      const { data } = await api.post(`/posts/${post._id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdate(data);
      setIsLiked(data.likes?.length > 0);
      setLikeCount(data.likes?.length || 0);
    } catch (error) {
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikeCount(prev => newIsLiked ? prev - 1 : prev + 1);
      console.error(error);
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!isLiked) {
        handleLike(true);
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 1000);
      }
    }
    lastTap.current = now;
  };

  const loadComments = async () => {
    if (!showComments) {
      const token = localStorage.getItem('token');
      const { data } = await api.get(`/posts/${post._id}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(data);
    }
    setShowComments(!showComments);
  };

  const handleComment = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/posts/${post._id}/comment`, { text: commentText });
      setComments([data, ...comments]);
      setCommentText('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleRepost = async () => {
    if (window.confirm('Repost this post?')) {
      try {
        await api.post(`/posts/${post._id}/repost`);
        alert('Post reposted successfully!');
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Helper for status badge
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    let bg = 'rgba(107, 114, 128, 0.1)';
    let color = '#6b7280';

    if (status.includes('resolved')) {
      bg = 'rgba(16, 185, 129, 0.1)';
      color = '#059669';
    } else if (status.includes('progress')) {
      bg = 'rgba(245, 158, 11, 0.1)';
      color = '#d97706';
    } else if (status.includes('pending')) {
      bg = 'rgba(239, 68, 68, 0.1)';
      color = '#dc2626';
    }

    return (
      <span style={{
        background: bg,
        color: color,
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  // Formatter for relative time mock (since no date is passed in post atm)
  const timeAgo = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now';

  return (
    <div className="card" style={{ padding: 0 }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px',
            flexShrink: 0
          }}>
            {post.user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
                {post.user?.name || 'User'}
              </span>
              {post.user?.isVerified && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent)">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              {post.location?.address && (
                <>
                  <span>📍 {post.location.address.split(',')[0]}</span>
                  <span>•</span>
                </>
              )}
              <span>{timeAgo}</span>
            </div>
            {post.repostOf && (
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 600 }}>
                🔄 Reposted from @{(post.repostOf as any)?.user?.username || 'user'}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {getStatusBadge(post.status)}

          {isOwner && (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowMenu(!showMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-secondary)' }}>⋯</button>
              {showMenu && (
                <div style={{ position: 'absolute', right: 0, top: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: '0 4px 12px var(--shadow)', zIndex: 10, minWidth: '150px', overflow: 'hidden' }}>
                  <button onClick={() => { setEditing(true); setShowMenu(false); }} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', textAlign: 'left', cursor: 'pointer', fontSize: '14px', color: 'var(--text-primary)' }}>Edit</button>
                  <button onClick={handleDelete} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', color: 'var(--error)', fontWeight: 600 }}>Delete</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body / Caption */}
      <div style={{ padding: '0 20px 16px' }}>
        {editing ? (
          <div>
            <textarea className="input" value={editCaption} onChange={(e) => setEditCaption(e.target.value)} rows={3} style={{ resize: 'none', marginBottom: '8px', width: '100%' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleEdit} className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>Save</button>
              <button onClick={() => { setEditing(false); setEditCaption(post.caption); }} className="btn" style={{ padding: '6px 16px', fontSize: '13px', background: 'var(--bg-secondary)' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-wrap' }}>
              {post.caption}
            </p>
            {post.hashtags && post.hashtags.length > 0 && (
              <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {post.hashtags.map(tag => (
                  <span key={tag} style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: 500 }}>#{tag}</span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Media */}
      {post.media?.[0] && (
        <div style={{ position: 'relative', cursor: 'pointer', width: '100%', background: 'var(--bg-secondary)' }} onClick={handleDoubleTap}>
          <img src={post.media[0]} alt="Civic Issue" style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', display: 'block' }} />
          {showHeart && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: 'heartPop 1s ease-out' }}>
              <svg width="100" height="100" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.3))' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: '24px' }}>
        <button
          onClick={() => handleLike()}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: isLiked ? '#ed4956' : 'var(--text-secondary)', transition: 'transform 0.2s' }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? '#ed4956' : 'none'} stroke={isLiked ? '#ed4956' : 'currentColor'} strokeWidth="2" style={{ transition: 'all 0.2s' }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{likeCount}</span>
        </button>

        <button onClick={loadComments} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-secondary)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{post.commentCount || comments.length || 0}</span>
        </button>

        <button onClick={handleRepost} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-secondary)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 1l4 4-4 4M7 23l-4-4 4-4M21 5H9a4 4 0 0 0-4 4v3M3 19h12a4 4 0 0 0 4-4v-3" />
          </svg>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{post.reposts || 0}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px', background: 'var(--bg-secondary)' }}>
          <form onSubmit={handleComment} style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <input
              className="input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              style={{ flex: 1, marginBottom: 0, borderRadius: 'var(--radius-full)', padding: '8px 16px', fontSize: '14px' }}
            />
            <button type="submit" disabled={!commentText.trim()} style={{ background: 'none', border: 'none', color: commentText.trim() ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 600, cursor: commentText.trim() ? 'pointer' : 'default', fontSize: '14px' }}>
              Post
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {comments.map(comment => (
              <div key={comment._id} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                  {comment.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{comment.user?.name}</strong>
                    {comment.isAuthorityResponse && <span style={{ background: 'rgba(24, 119, 242, 0.1)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>AUTHORITY</span>}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {comment.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
