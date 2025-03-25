# 🌐 Marc-OS Blog Platform

A modern, full-stack blog platform built with React, Node.js, and MongoDB, featuring a beautiful dark theme based on Catppuccin Mocha.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

## ✨ Features

- 🎨 Beautiful dark theme using Catppuccin Mocha
- 📱 Fully responsive design
- 🔐 Secure admin authentication
- 📝 Rich text blog post editor
- 🚀 Docker containerization
- 🔄 Reverse proxy support with NPM
- 💾 MongoDB database integration
- 🛡️ JWT authentication
- 🌐 Modern React frontend
- 🎯 Express.js backend API

## 🏗️ Architecture

```
marc-os-blog/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend API
├── mongodb/           # MongoDB data persistence
└── docker-compose.yml # Container orchestration
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node Package Manager (NPM)
- Nginx Proxy Manager
- Domain with DNS configured

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
   - Forward to: `marc-os-frontend-cursor:3000`
   - Enable SSL
   - Enable WebSocket Support

2. Backend API:
   - Domain: `api.blog.marc-os.com`
   - Forward to: `marc-os-backend-cursor:5000`
   - Enable SSL

## 💻 Development

### Frontend Development

```bash
cd frontend
npm install
npm start
```

### Backend Development

```bash
cd backend
npm install
npm run dev
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

## 👤 Author

**Marc**
- Website: [marc-os.com](https://marc-os.com)
- Github: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Catppuccin Theme for the beautiful color scheme
- The open-source community for the amazing tools 