// API utility functions for blog site

const API_BASE = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Posts API
export const postsAPI = {
  // Get all published posts
  getAll: async () => {
    const response = await fetch(`${API_BASE}/posts`);
    return response.json();
  },

  // Get single post
  getById: async (id) => {
    const response = await fetch(`${API_BASE}/posts/${id}`);
    return response.json();
  },

  // Create new post (admin only)
  create: async (postData, imageFile = null) => {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('body', postData.body);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
    return response.json();
  },

  // Update post
  update: async (id, postData, imageFile = null) => {
    const formData = new FormData();
    if (postData.title) formData.append('title', postData.title);
    if (postData.body) formData.append('body', postData.body);
    if (imageFile) formData.append('image', imageFile);

    const response = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData
    });
    return response.json();
  },

  // Delete post
  delete: async (id) => {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Comments API
export const commentsAPI = {
  // Get comments for a post
  getForPost: async (postId) => {
    const response = await fetch(`${API_BASE}/comments/${postId}`);
    return response.json();
  },

  // Add comment to post
  create: async (postId, body) => {
    const response = await fetch(`${API_BASE}/comments/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ body })
    });
    return response.json();
  },

  // Delete comment
  delete: async (commentId) => {
    const response = await fetch(`${API_BASE}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Auth API (login/register handled in AuthContext)
export const authAPI = {
  // Update profile
  updateProfile: async (profileData, profilePicFile = null) => {
    const formData = new FormData();
    if (profileData.name) formData.append('name', profileData.name);
    if (profileData.bio) formData.append('bio', profileData.bio);
    if (profilePicFile) formData.append('profilePic', profilePicFile);

    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData
    });
    return response.json();
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return response.json();
  }
};