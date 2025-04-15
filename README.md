# 🌐 Marc-OS Blog Platform

A modern, full-stack blog platform built with React, Node.js, and MongoDB, featuring a beautiful dark theme based on Catppuccin Mocha.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)


## 🚀 Quick Start

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/marc-os-blog.git
   cd marc-os-blog
   ```

2. Create environment files:
   ```bash
   cp .env.example backend/.env
   ```

3. Configure your environment variables in `backend/.env`

### 🐳 Docker Deployment

1. Create the proxy network:
   ```bash
   docker network create proxy
   ```

2. Build and start the containers:
   ```bash
   docker compose up --build -d
   ```

### 🔧 NPM Configuration

Configure the following proxy hosts in Nginx Proxy Manager:

1. Blog Frontend:
   - Domain: `blog.marc-os.com`
   - Forward to: `marc-os-frontend-cursor:3023`
   - Enable SSL
   - Enable WebSocket Support

2. Backend API:
   - Domain: `api.blog.marc-os.com`
   - Forward to: `marc-os-backend-cursor:5023`
   - Enable SSL

## 💻 Development

### Frontend Development

```bash
cd frontend
npm install
PORT=3023 npm start
```

### Backend Development

```bash
cd backend
npm install
PORT=5023 npm run dev
```

## 🔒 Security

- Environment variables for sensitive data
- JWT authentication for admin access
- Secure password hashing with bcrypt
- CORS protection
- Rate limiting on authentication routes

## 📦 Dependencies

### Frontend
- React
- React Router
- Tailwind CSS
- Axios

### Backend
- Express.js
- Mongoose
- JWT
- bcrypt
- cors

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Catppuccin Theme for the beautiful color scheme
- The open-source community for the amazing tools 
