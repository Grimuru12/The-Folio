import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI, commentsAPI } from '../utils/api';

function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const fetchPostAndComments = async () => {
    try {
      const [postData, commentsData] = await Promise.all([
        postsAPI.getById(id),
        commentsAPI.getForPost(id)
      ]);
      setPost(postData);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
    setLoading(false);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    try {
      const result = await commentsAPI.create(id, newComment.trim());
      if (result._id) {
        setComments([...comments, result]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentsAPI.delete(commentId);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await postsAPI.delete(id);
      window.location.href = '/'; // Redirect to home
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (!post) {
    return <div className="error">Post not found</div>;
  }

  const canEdit = user && (user._id === post.author._id || user.role === 'admin');

  return (
    <main className="main">
      <article className="post-detail">
        <header className="post-detail-header">
          <div className="author-info">
            {post.author?.profilePic && (
              <img
                src={`http://localhost:5000/uploads/${post.author.profilePic}`}
                alt={post.author.name}
                className="author-avatar"
              />
            )}
            <div>
              <span className="author-name">{post.author?.name || 'Anonymous'}</span>
              <time className="post-date">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          </div>

          {canEdit && (
            <div className="post-actions">
              <Link to={`/create-post?edit=${post._id}`} className="edit-btn">
                Edit
              </Link>
              <button onClick={handleDeletePost} className="delete-btn">
                Delete
              </button>
            </div>
          )}
        </header>

        {post.image && (
          <img
            src={`http://localhost:5000/uploads/${post.image}`}
            alt={post.title}
            className="post-detail-image"
          />
        )}

        <div className="post-detail-content">
          <h1>{post.title}</h1>
          <div className="post-body">
            {post.body.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>

      <section className="comments-section">
        <h2>Comments ({comments.length})</h2>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              required
              disabled={submitting}
            />
            <button type="submit" disabled={submitting || !newComment.trim()}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="login-prompt">
            <p>Please <Link to="/login">log in</Link> to comment.</p>
          </div>
        )}

        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment._id} className="comment">
              <div className="comment-header">
                <div className="comment-author">
                  {comment.author?.profilePic && (
                    <img
                      src={`http://localhost:5000/uploads/${comment.author.profilePic}`}
                      alt={comment.author.name}
                      className="comment-avatar"
                    />
                  )}
                  <span className="comment-author-name">
                    {comment.author?.name || 'Anonymous'}
                  </span>
                </div>
                <div className="comment-meta">
                  <time>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </time>
                  {(user && (user._id === comment.author._id || user.role === 'admin')) && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="delete-comment-btn"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <div className="comment-body">
                {comment.body.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default PostDetail;