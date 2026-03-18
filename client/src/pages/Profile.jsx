import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>

        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="info-row">
            <label>Name:</label>
            <span>{user.name}</span>
          </div>
          <div className="info-row">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="info-row">
            <label>Member Since:</label>
            <span>March 2026</span>
          </div>
        </div>

        <div className="profile-section">
          <h2>Order History</h2>
          <p className="no-orders">You haven't placed any orders yet.</p>
        </div>

        <div className="profile-actions">
          <button className="btn-secondary">Change Password</button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
