import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    bio: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFormData({
      name: user.name || '',
      bio: user.bio || ''
    });

    if (user.profilePic) {
      setProfilePicPreview(`http://localhost:5000/uploads/${user.profilePic}`);
    }
  }, [user, navigate]);

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onload = (e) => setProfilePicPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authAPI.updateProfile(formData, profilePic);
      if (result._id) {
        alert('Profile updated successfully!');
        // Refresh the page to update user context
        window.location.reload();
      } else {
        alert(result.message || 'Error updating profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }

    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await authAPI.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (result.message === 'Password updated successfully') {
        alert('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        alert(result.message || 'Error changing password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    }

    setLoading(false);
  };

  if (!user) {
    return null; // Will redirect
  }

  return (
    <main className="main">
      <div className="profile-container">
        <h1>My Profile</h1>

        <div className="profile-tabs">
          <button
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Profile Info
          </button>
          <button
            className={activeTab === 'password' ? 'active' : ''}
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </button>
        </div>

        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleProfileInputChange}
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleProfileInputChange}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="profilePic">Profile Picture</label>
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                onChange={handleProfilePicChange}
              />
              {profilePicPreview && (
                <div className="image-preview">
                  <img src={profilePicPreview} alt="Profile preview" />
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
                required
                minLength={6}
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        )}

        <div className="profile-actions">
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}

export default Profile;