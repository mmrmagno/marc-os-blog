import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ImageUpload from '../components/ImageUpload';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('editor');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      // Demo fallback
      setPosts([
        {
          _id: '1',
          title: 'Getting Started with Docker',
          excerpt: 'Learn how to set up and use Docker for your development environment.',
          createdAt: '2023-05-15T12:00:00Z',
        },
        {
          _id: '2',
          title: 'Mastering React Hooks',
          excerpt: 'Explore the power of React Hooks and how they can improve your frontend development.',
          createdAt: '2023-06-22T12:00:00Z',
        },
        {
          _id: '3',
          title: 'Python for Data Science: A Beginner\'s Guide',
          excerpt: 'Start your journey into data science with Python and its powerful libraries.',
          createdAt: '2023-07-30T12:00:00Z',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    
    if (!title || !content || !excerpt) {
      setMessage({
        text: 'Please fill in all fields',
        type: 'error'
      });
      return;
    }
    
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts`,
        {
          title,
          content,
          excerpt,
          images
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setMessage({
        text: 'Post saved successfully!',
        type: 'success'
      });
      
      setTitle('');
      setContent('');
      setExcerpt('');
      setImages([]);
      fetchPosts();
    } catch (err) {
      console.error('Error saving post:', err);
      setMessage({
        text: 'Failed to save post. Please try again.',
        type: 'error'
      });
      
      // Demo mode - simulate successful save
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          setMessage({
            text: 'Post saved successfully! (Demo Mode)',
            type: 'success'
          });
          fetchPosts();
        }, 1000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setMessage({
        text: 'Post deleted successfully!',
        type: 'success'
      });
      
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      setMessage({
        text: 'Failed to delete post. Please try again.',
        type: 'error'
      });
      
      // Demo mode - simulate successful delete
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          setPosts(posts.filter(post => post._id !== id));
          setMessage({
            text: 'Post deleted successfully! (Demo Mode)',
            type: 'success'
          });
        }, 1000);
      }
    }
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'editor' ? 'active' : ''}`}
          onClick={() => setActiveTab('editor')}
        >
          Editor
        </button>
        <button 
          className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Manage Posts
        </button>
      </div>
      
      {activeTab === 'editor' && (
        <div className="editor-section">
          <form onSubmit={handleSavePost} className="post-form">
            <div className="form-group">
              <label htmlFor="title">Post Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                disabled={saving}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="excerpt">Post Excerpt</label>
              <input
                type="text"
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Enter a short excerpt (used on blog listing)"
                disabled={saving}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="content">Post Content (Markdown)</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post using Markdown..."
                rows="10"
                disabled={saving}
              />
            </div>
            
            <button type="submit" className="save-button" disabled={saving}>
              {saving ? 'Saving...' : 'Save Post'}
            </button>
          </form>
          
          {content && (
            <div className="preview-section">
              <h2>Preview</h2>
              <div className="markdown-preview">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'posts' && (
        <div className="posts-section">
          <h2>Manage Posts</h2>
          
          {loading ? (
            <div className="loading">Loading posts...</div>
          ) : posts.length > 0 ? (
            <div className="posts-list">
              {posts.map((post) => (
                <div className="post-item" key={post._id}>
                  <div className="post-details">
                    <h3>{post.title}</h3>
                    <p className="post-date">{formatDate(post.createdAt)}</p>
                    <p className="post-excerpt">{post.excerpt}</p>
                  </div>
                  <div className="post-actions">
                    <button 
                      className="edit-button"
                      onClick={() => {
                        // In a real application, this would load the post into the editor
                        setActiveTab('editor');
                        setTitle(post.title);
                        setExcerpt(post.excerpt || '');
                        // We would fetch the full post content here
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-posts">No posts found. Create your first post in the Editor tab.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
