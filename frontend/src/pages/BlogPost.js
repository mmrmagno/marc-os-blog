import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/BlogPost.css';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${id}`);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. Please try again later.');
        setLoading(false);
        
        // For demo purposes, load a sample post if the API fails
        const samplePosts = [
          {
            _id: '1',
            title: 'Getting Started with Docker',
            content: '# Getting Started with Docker\n\nDocker is a platform for developing, shipping, and running applications in containers. Containers are lightweight, portable, and self-sufficient environments that can run anywhere Docker is installed.\n\n## Why Use Docker?\n\n- **Consistency**: Ensures that your application runs the same way in development, testing, and production.\n- **Isolation**: Keeps your application and its dependencies separate from the host system.\n- **Portability**: Allows you to run your application on any system that has Docker installed.\n\n## Installation\n\nTo install Docker, follow these steps:\n\n1. Download the Docker Desktop installer from the [Docker website](https://www.docker.com/products/docker-desktop).\n2. Run the installer and follow the prompts.\n3. Verify the installation by running `docker --version` in your terminal.\n\n## Creating Your First Container\n\nLet\'s create a simple container that runs a web server:\n\n```bash\ndocker run -d -p 80:80 nginx\n```\n\nThis command does the following:\n\n- `-d`: Runs the container in detached mode (in the background).\n- `-p 80:80`: Maps port 80 on your host to port 80 in the container.\n- `nginx`: Uses the official Nginx image from Docker Hub.\n\nYou can now access the Nginx welcome page by visiting `http://localhost` in your web browser.',
            createdAt: '2023-05-15T12:00:00Z',
            author: 'Marc'
          },
          {
            _id: '2',
            title: 'Mastering React Hooks',
            content: '# Mastering React Hooks\n\nReact Hooks were introduced in React 16.8 as a way to use state and other React features without writing a class. They allow you to reuse stateful logic between components, making your code cleaner and more maintainable.\n\n## Why Use Hooks?\n\n- **Simpler Component Logic**: Hooks allow you to organize the logic inside a component into reusable, isolated units.\n- **Reusing Stateful Logic**: With custom Hooks, you can extract and share stateful logic across multiple components without changing your component hierarchy.\n- **Cleaner Code**: Hooks help you avoid the "wrapper hell" that can come with higher-order components and render props.\n\n## Common Hooks\n\n### useState\n\nThe `useState` Hook lets you add state to functional components:\n\n```jsx\nimport React, { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```\n\n### useEffect\n\nThe `useEffect` Hook lets you perform side effects in functional components:\n\n```jsx\nimport React, { useState, useEffect } from \'react\';\n\nfunction Example() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = `You clicked ${count} times`;\n    // This function will run when the component unmounts\n    return () => {\n      document.title = \'React App\';\n    };\n  }, [count]); // Only re-run the effect if count changes\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```',
            createdAt: '2023-06-22T12:00:00Z',
            author: 'Marc'
          },
          {
            _id: '3',
            title: 'Python for Data Science: A Beginner\'s Guide',
            content: '# Python for Data Science: A Beginner\'s Guide\n\nPython has become the go-to language for data science due to its simplicity and powerful ecosystem of libraries. In this guide, we\'ll explore the basics of Python for data science and introduce you to some essential libraries.\n\n## Why Python for Data Science?\n\n- **Easy to Learn**: Python\'s simple syntax makes it accessible for beginners.\n- **Rich Ecosystem**: Python has a vast collection of libraries for data manipulation, analysis, and visualization.\n- **Community Support**: A large community of data scientists and developers contributes to Python\'s growth.',
            createdAt: '2023-07-30T12:00:00Z',
            author: 'Marc'
          }
        ];
        
        const samplePost = samplePosts.find(p => p._id === id);
        if (samplePost) {
          setPost(samplePost);
          setLoading(false);
          setError(null);
        }
      }
    };

    fetchPost();
  }, [id]);

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading">Loading blog post...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!post) {
    return <div className="error">Blog post not found.</div>;
  }

  return (
    <div className="blog-post-container">
      <Link to="/blog" className="back-button">
        ← Back to Blog
      </Link>
      <article className="blog-post">
        <header className="blog-post-header">
          <h1>{post.title}</h1>
          <div className="blog-post-meta">
            <span className="blog-post-date">{formatDate(post.createdAt)}</span>
            <span className="blog-post-author">by {post.author}</span>
          </div>
        </header>
        <div className="blog-post-content">
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
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
