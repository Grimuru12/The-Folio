import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../utils/api';

function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [formData, setFormData] = useState({
    title: '',
    body: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    if (editId) {
      fetchPostForEdit();
    }
  }, [user, editId, navigate]);

  const fetchPostForEdit = async () => {
    try {
      const post = await postsAPI.getById(editId);
      setFormData({
        title: post.title,
        body: post.body
      });
      if (post.image) {
        setImagePreview(`http://localhost:5000/uploads/${post.image}`);
      }
      setIsEdit(true);
    } catch (error) {
      console.error('Error fetching post for edit:', error);
      navigate('/');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) return;

    setLoading(true);
    try {
      if (isEdit) {
        await postsAPI.update(editId, formData, image);
      } else {
        await postsAPI.create(formData, image);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post. Please try again.');
    }
    setLoading(false);
  };

  if (!user || user.role !== 'admin') {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="main">
      <div className="create-post-container">
        <h1>{isEdit ? 'Edit Post' : 'Create New Post'}</h1>

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter post title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="body">Content *</label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              required
              placeholder="Write your post content here..."
              rows={15}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Featured Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.body.trim()}
              className="submit-btn"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Post' : 'Publish Post')}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CreatePost;