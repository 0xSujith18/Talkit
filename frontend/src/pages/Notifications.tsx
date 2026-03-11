import { useState, useEffect } from 'react'; // tickle
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  _id: string;
  user: string;
  type: 'like' | 'comment' | 'authority_response' | 'status_update';
  post?: {
    _id: string;
    caption: string;
  };
  from?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  message?: string;
  read: boolean;
  createdAt: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification._id);
    
    if (notification.post) {
      // Assuming posts are viewable in detail or feed
      // If it's a report status update, we might want to go to reports
      if (notification.type === 'status_update') {
          // If the message contains report ID or similar, we might need logic to find report ID
          // For now, let's just go to reports
          navigate('/reports');
      } else {
          navigate('/feed'); // Or a specific post detail page if implemented
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'authority_response': return '🏛️';
      case 'status_update': return '📈';
      default: return '🔔';
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
      Loading notifications...
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>Notifications</h1>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={() => notifications.filter(n => !n.read).forEach(n => markAsRead(n._id))}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--accent)', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎐</div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>No notifications yet</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            When you get updates about your reports or posts, they'll show up here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map((n) => (
            <div 
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className="card"
              style={{ 
                padding: '16px', 
                display: 'flex', 
                gap: '16px', 
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: n.read ? 'var(--bg-card)' : 'rgba(24, 119, 242, 0.05)',
                borderLeft: n.read ? '1px solid var(--border)' : '4px solid var(--accent)',
                opacity: n.read ? 0.8 : 1
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <div style={{ 
                fontSize: '24px', 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: n.read ? 'var(--hover)' : 'rgba(24, 119, 242, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getIcon(n.type)}
              </div>
              
              <div style={{ flex: 1 }}>
                <p style={{ 
                  margin: 0, 
                  fontSize: '15px', 
                  color: 'var(--text-primary)',
                  fontWeight: n.read ? 400 : 600 
                }}>
                  {n.message || `${n.from?.name || 'Someone'} ${n.type === 'like' ? 'liked' : 'commented on'} your post`}
                </p>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </span>
              </div>

              {!n.read && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
