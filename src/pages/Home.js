import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../utils/api';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postsAPI.getAll();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <main className="main">
      <div className="blog-header">
        <h1>Welcome to My Blog</h1>
        <p>Thoughts, stories, and updates from my journey</p>
        {user?.role === 'admin' && (
          <Link to="/create-post" className="create-post-btn">
            Write New Post
          </Link>
        )}
      </div>

      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts yet. Check back later!</p>
          </div>
        ) : (
          posts.map(post => (
            <article key={post._id} className="post-card">
              <div className="post-header">
                <div className="author-info">
                  {post.author?.profilePic && (
                    <img
                      src={`http://localhost:5000/uploads/${post.author.profilePic}`}
                      alt={post.author.name}
                      className="author-avatar"
                    />
                  )}
                  <span className="author-name">{post.author?.name || 'Anonymous'}</span>
                </div>
                <time className="post-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </time>
              </div>

              {post.image && (
                <img
                  src={`http://localhost:5000/uploads/${post.image}`}
                  alt={post.title}
                  className="post-image"
                />
              )}

              <div className="post-content">
                <h2 className="post-title">
                  <Link to={`/posts/${post._id}`}>{post.title}</Link>
                </h2>
                <p className="post-excerpt">
                  {post.body.length > 150
                    ? `${post.body.substring(0, 150)}...`
                    : post.body
                  }
                </p>
                <Link to={`/posts/${post._id}`} className="read-more">
                  Read More →
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}

export default Home;