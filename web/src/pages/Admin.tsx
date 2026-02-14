import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface VerificationRequest {
  _id: string;
  user: {
    _id: string;
    name: string;
    username: string;
    email: string;
  };
  fullName: string;
  category: string;
  organization: string;
  position: string;
  idProof: string;
  reason: string;
  status: string;
  createdAt: string;
}

export default function Admin() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/auth/verification-requests');
      setRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (requestId: string, userId: string) => {
    try {
      await axios.post(`http://localhost:5000/api/auth/verify-user/${userId}`);
      loadRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/verification-request/${requestId}`);
      loadRequests();
    } catch (error) {
      console.error(error);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container" style={{ maxWidth: '600px', paddingTop: '20px' }}>
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', paddingTop: '20px' }}>
      <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Verification Requests</h2>
        
        {requests.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>No pending requests</p>
        ) : (
          requests.map(request => (
            <div key={request._id} style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ marginBottom: '12px' }}>
                <strong>{request.user.name}</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px', marginLeft: '8px' }}>@{request.user.username}</span>
              </div>
              
              <div style={{ fontSize: '13px', marginBottom: '8px', lineHeight: '1.6' }}>
                <div><strong>Full Name:</strong> {request.fullName}</div>
                <div><strong>Category:</strong> {request.category}</div>
                <div><strong>Organization:</strong> {request.organization}</div>
                <div><strong>Position:</strong> {request.position}</div>
                <div><strong>ID Proof:</strong> <a href={request.idProof} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>View Document</a></div>
              </div>
              
              <p style={{ fontSize: '14px', marginBottom: '12px', padding: '8px', background: 'var(--bg-card)', borderRadius: '4px' }}>{request.reason}</p>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleApprove(request._id, request.user._id)} className="btn btn-primary" style={{ padding: '6px 16px' }}>
                  ✓ Approve
                </button>
                <button onClick={() => handleReject(request._id)} className="btn" style={{ padding: '6px 16px', background: 'var(--error)', color: 'white' }}>
                  ✕ Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
