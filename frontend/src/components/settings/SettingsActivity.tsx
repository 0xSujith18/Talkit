import { useState, useEffect } from 'react';
import api from '../../config/api';
import PostCard from '../PostCard';

interface SettingsActivityProps {
  onBack: () => void;
}

export default function SettingsActivity({ onBack }: SettingsActivityProps) {
  const [subView, setSubView] = useState<'menu' | 'likes' | 'comments' | 'reposts'>('menu');
  const [activityData, setActivityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subView !== 'menu') {
      loadActivity();
    }
  }, [subView]);

  const loadActivity = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      if (subView === 'likes') endpoint = '/posts/liked';
      else if (subView === 'comments') endpoint = '/posts/my-comments';
      else if (subView === 'reposts') endpoint = '/posts/my-reposts';

      if (endpoint) {
        const { data } = await api.get(endpoint);
        setActivityData(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (subView === 'menu') {
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <button 
            onClick={onBack} 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '24px', 
              cursor: 'pointer', 
              marginRight: '16px',
              color: 'var(--text-primary)'
            }}
          >
            ←
          </button>
          <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>Your Activity</h2>
        </div>

        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <ActivityItem onClick={() => setSubView('likes')} title="Likes" subtitle="Posts you liked" icon="❤️" />
          <ActivityItem onClick={() => setSubView('comments')} title="Comments" subtitle="Your comments on posts" icon="💬" />
          <ActivityItem onClick={() => setSubView('reposts')} title="Reposts" subtitle="Posts you shared" icon="🔄" />
        </div>
      </>
    );
  }

  const titles = {
    likes: 'Liked Posts',
    comments: 'My Comments',
    reposts: 'My Reposts'
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <button 
          onClick={() => setSubView('menu')} 
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '24px', 
            cursor: 'pointer', 
            marginRight: '16px',
            color: 'var(--text-primary)'
          }}
        >
          ←
        </button>
        <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>{titles[subView]}</h2>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
        </div>
      ) : activityData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>No activity yet</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {subView === 'likes' && 'Posts you like will appear here'}
            {subView === 'comments' && 'Your comments will appear here'}
            {subView === 'reposts' && 'Posts you repost will appear here'}
          </div>
        </div>
      ) : subView === 'comments' ? (
        <div className="card" style={{ padding: '0' }}>
          {activityData.map((comment: any) => (
            <div key={comment._id} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '15px', marginBottom: '8px', lineHeight: '1.4' }}>{comment.text}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                On post by @{comment.post?.user && typeof comment.post.user === 'object' ? (comment.post.user as any).username : 'user'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        activityData.map(post => (
          <PostCard 
            key={post._id} 
            post={post} 
            onUpdate={(updated) => setActivityData(activityData.map(p => p._id === updated._id ? updated : p))} 
          />
        ))
      )}
    </>
  );
}

interface ActivityItemProps {
  onClick: () => void;
  title: string;
  subtitle: string;
  icon: string;
}

function ActivityItem({ onClick, title, subtitle, icon }: ActivityItemProps) {
  return (
    <div 
      onClick={onClick} 
      style={{ 
        padding: '16px 20px', 
        borderBottom: '1px solid var(--border)', 
        cursor: 'pointer',
        transition: 'background 0.15s',
        background: 'transparent'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '24px' }}>{icon}</div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>{title}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{subtitle}</div>
          </div>
        </div>
        <span style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>›</span>
      </div>
    </div>
  );
}
