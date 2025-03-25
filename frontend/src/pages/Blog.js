import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts`);
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
        setLoading(false);
        
        // For demo purposes, load some sample posts if the API fails
        setPosts(samplePosts);
      }
    };

    fetchPosts();
  }, []);

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Sample posts for demo/fallback
  const samplePosts = [
    {
      _id: '1',
      title: 'Getting Started with Docker',
      excerpt: 'Learn how to set up and use Docker for your development environment.',
      content: '# Getting Started with Docker\n\nDocker is a platform for developing, shipping, and running applications in containers. Containers are lightweight, portable, and self-sufficient environments that can run anywhere Docker is installed.\n\n## Why Use Docker?\n\n- **Consistency**: Ensures that your application runs the same way in development, testing, and production.\n- **Isolation**: Keeps your application and its dependencies separate from the host system.\n- **Portability**: Allows you to run your application on any system that has Docker installed.\n\n## Installation\n\nTo install Docker, follow these steps:\n\n1. Download the Docker Desktop installer from the [Docker website](https://www.docker.com/products/docker-desktop).\n2. Run the installer and follow the prompts.\n3. Verify the installation by running `docker --version` in your terminal.\n\n## Creating Your First Container\n\nLet\'s create a simple container that runs a web server:\n\n```bash\ndocker run -d -p 80:80 nginx\n```\n\nThis command does the following:\n\n- `-d`: Runs the container in detached mode (in the background).\n- `-p 80:80`: Maps port 80 on your host to port 80 in the container.\n- `nginx`: Uses the official Nginx image from Docker Hub.\n\nYou can now access the Nginx welcome page by visiting `http://localhost` in your web browser.',
      createdAt: '2023-05-15T12:00:00Z',
      author: 'Marc'
    },
    {
      _id: '2',
      title: 'Mastering React Hooks',
      excerpt: 'Explore the power of React Hooks and how they can improve your frontend development.',
      content: '# Mastering React Hooks\n\nReact Hooks were introduced in React 16.8 as a way to use state and other React features without writing a class. They allow you to reuse stateful logic between components, making your code cleaner and more maintainable.\n\n## Why Use Hooks?\n\n- **Simpler Component Logic**: Hooks allow you to organize the logic inside a component into reusable, isolated units.\n- **Reusing Stateful Logic**: With custom Hooks, you can extract and share stateful logic across multiple components without changing your component hierarchy.\n- **Cleaner Code**: Hooks help you avoid the "wrapper hell" that can come with higher-order components and render props.\n\n## Common Hooks\n\n### useState\n\nThe `useState` Hook lets you add state to functional components:\n\n```jsx\nimport React, { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```\n\n### useEffect\n\nThe `useEffect` Hook lets you perform side effects in functional components:\n\n```jsx\nimport React, { useState, useEffect } from \'react\';\n\nfunction Example() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = `You clicked ${count} times`;\n    // This function will run when the component unmounts\n    return () => {\n      document.title = \'React App\';\n    };\n  }, [count]); // Only re-run the effect if count changes\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```\n\n## Creating Custom Hooks\n\nYou can create your own Hooks to reuse stateful logic across components:\n\n```jsx\nimport { useState, useEffect } from \'react\';\n\nfunction useWindowWidth() {\n  const [width, setWidth] = useState(window.innerWidth);\n  \n  useEffect(() => {\n    const handleResize = () => setWidth(window.innerWidth);\n    window.addEventListener(\'resize\', handleResize);\n    return () => {\n      window.removeEventListener(\'resize\', handleResize);\n    };\n  }, []);\n  \n  return width;\n}\n\nfunction MyComponent() {\n  const width = useWindowWidth();\n  return <div>Window width: {width}</div>;\n}\n```\n\n## Conclusion\n\nReact Hooks provide a powerful way to simplify component logic and improve code reusability. By mastering Hooks, you can write more expressive, maintainable React code.',
      createdAt: '2023-06-22T12:00:00Z',
      author: 'Marc'
    },
    {
      _id: '3',
      title: 'Python for Data Science: A Beginner\'s Guide',
      excerpt: 'Start your journey into data science with Python and its powerful libraries.',
      content: '# Python for Data Science: A Beginner\'s Guide\n\nPython has become the go-to language for data science due to its simplicity and powerful ecosystem of libraries. In this guide, we\'ll explore the basics of Python for data science and introduce you to some essential libraries.\n\n## Why Python for Data Science?\n\n- **Easy to Learn**: Python\'s simple syntax makes it accessible for beginners.\n- **Rich Ecosystem**: Python has a vast collection of libraries for data manipulation, analysis, and visualization.\n- **Community Support**: A large community of data scientists and developers contributes to Python\'s growth.\n\n## Essential Libraries\n\n### NumPy\n\nNumPy is the fundamental package for scientific computing in Python. It provides support for large, multi-dimensional arrays and matrices, along with a collection of mathematical functions to operate on these arrays efficiently.\n\n```python\nimport numpy as np\n\n# Create a 2D array\narr = np.array([[1, 2, 3], [4, 5, 6]])\n\n# Perform operations\nprint(arr * 2)  # Multiply each element by 2\nprint(arr.sum())  # Sum of all elements\nprint(arr.mean())  # Mean of all elements\n```\n\n### Pandas\n\nPandas is a fast, powerful, and flexible data analysis and manipulation library. It provides data structures like DataFrames that make working with structured data intuitive and efficient.\n\n```python\nimport pandas as pd\n\n# Create a DataFrame\ndata = {\n    \'Name\': [\'Alice\', \'Bob\', \'Charlie\'],\n    \'Age\': [25, 30, 35],\n    \'City\': [\'New York\', \'San Francisco\', \'Los Angeles\']\n}\ndf = pd.DataFrame(data)\n\n# Basic operations\nprint(df.head())  # Display first few rows\nprint(df.describe())  # Statistical summary\nprint(df[df[\'Age\'] > 25])  # Filter rows\n```\n\n### Matplotlib\n\nMatplotlib is a comprehensive library for creating static, animated, and interactive visualizations in Python.\n\n```python\nimport matplotlib.pyplot as plt\n\n# Sample data\nx = [1, 2, 3, 4, 5]\ny = [10, 15, 7, 12, 9]\n\n# Create a line plot\nplt.plot(x, y)\nplt.title(\'Sample Line Plot\')\nplt.xlabel(\'X-axis\')\nplt.ylabel(\'Y-axis\')\nplt.show()\n```\n\n### Scikit-Learn\n\nScikit-Learn is a simple and efficient tool for data mining and data analysis. It provides various algorithms for classification, regression, clustering, and more.\n\n```python\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_squared_error\n\n# Sample data\nX = [[1], [2], [3], [4], [5]]\ny = [2, 4, 5, 4, 5]\n\n# Split data into training and testing sets\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# Create and train a model\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\n# Make predictions\ny_pred = model.predict(X_test)\n\n# Evaluate the model\nmse = mean_squared_error(y_test, y_pred)\nprint(f\'Mean Squared Error: {mse}\')\n```\n\n## Getting Started\n\n1. **Install Python**: Download and install Python from the [official website](https://www.python.org/downloads/).\n2. **Set Up a Virtual Environment**: Create an isolated environment for your projects.\n3. **Install Libraries**: Use pip to install the necessary libraries.\n\n```bash\npip install numpy pandas matplotlib scikit-learn\n```\n\n4. **Start Coding**: Begin with simple data manipulation tasks and gradually move to more complex analyses.\n\n## Conclusion\n\nPython provides an excellent foundation for data science with its simplicity and powerful libraries. By mastering these tools, you\'ll be well on your way to becoming a proficient data scientist.',
      createdAt: '2023-07-30T12:00:00Z',
      author: 'Marc'
    }
  ];

  if (loading) {
    return <div className="loading">Loading blog posts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="blog-container">
      <h1>Blog Posts</h1>
      <div className="blog-posts">
        {posts.map(post => (
          <div className="blog-card" key={post._id}>
            <h2>{post.title}</h2>
            <div className="blog-meta">
              <span className="blog-date">{formatDate(post.createdAt)}</span>
              <span className="blog-author">by {post.author}</span>
            </div>
            <p className="blog-excerpt">{post.excerpt}</p>
            <Link to={`/blog/${post._id}`} className="read-more">
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
