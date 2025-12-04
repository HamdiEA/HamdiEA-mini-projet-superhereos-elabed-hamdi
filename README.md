# SuperHero Manager

A full-stack web application for managing superheroes with role-based access control, complete MongoDB integration, and Docker support.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)
- [Default Users](#default-users)
- [Roles and Permissions](#roles-and-permissions)
- [Technologies Used](#technologies-used)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **User Authentication**: Secure login and registration system
- **Role-Based Access Control**: Admin, Editor, and Viewer roles
- **CRUD Operations**: Complete superhero management
- **Image Upload**: Hero image upload and management
- **Search & Filter**: Advanced search and filtering capabilities
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **RESTful API**: Well-documented Express.js backend
- **MongoDB Integration**: Full MongoDB with fallback to mock data
- **TypeScript**: Type-safe frontend and backend
- **Docker Support**: Containerized deployment

## 📁 Project Structure

```
superhero-manager/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   │   ├── authController.ts
│   │   │   └── heroController.ts
│   │   ├── middleware/      # Express middleware
│   │   │   ├── authMiddleware.ts
│   │   │   ├── roleMiddleware.ts
│   │   │   └── uploadMiddleware.ts
│   │   ├── models/          # Data models
│   │   │   ├── Hero.ts
│   │   │   └── User.ts
│   │   ├── routes/          # API routes
│   │   │   ├── authRoutes.ts
│   │   │   └── heroRoutes.ts
│   │   ├── utils/           # Utility functions
│   │   │   ├── logger.ts
│   │   │   └── seedDatabase.ts
│   │   ├── config/          # Database configuration
│   │   │   └── db.ts
│   │   ├── index.ts         # Main server file
│   │   └── SuperHerosComplet.json  # Sample data
│   ├── uploads/             # File upload directory
│   ├── .env                 # Environment variables
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/                # React/TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── HeroCard.tsx
│   │   │   ├── HeroForm.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── HeroDetails.tsx
│   │   │   ├── AddHero.tsx
│   │   │   ├── EditHero.tsx
│   │   │   └── AdminPage.tsx
│   │   ├── api/             # API service functions
│   │   │   ├── authApi.ts
│   │   │   └── heroApi.ts
│   │   ├── context/         # React context
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/           # Custom hooks
│   │   │   └── useAuth.ts
│   │   ├── types/           # TypeScript type definitions
│   │   │   └── Hero.ts
│   │   ├── styles/          # CSS styles
│   │   │   └── index.css
│   │   ├── App.tsx          # Main App component
│   │   └── main.tsx         # Entry point
│   ├── public/              # Public assets
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── Dockerfile
├── docker-compose.yml       # Docker configuration
├── .gitignore              # Git ignore file
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher
- **MongoDB**: Local installation or cloud service
- **Git**: For version control

### Installation

1. **Extract the zip file**:
   ```bash
   unzip superhero-manager-complete.zip
   cd superhero-manager
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   cd ..
   ```

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. **Install MongoDB**:
   - **MongoDB Community Server**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - **Using Homebrew (macOS)**: `brew install mongodb-community`
   - **Using APT (Ubuntu/Debian)**: Follow [MongoDB installation guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

2. **Start MongoDB**:
   ```bash
   # macOS/Linux
   mongod --dbpath /path/to/your/db
   
   # or as service
   sudo systemctl start mongod  # Linux
   brew services start mongodb-community  # macOS
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create free account** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create a cluster** (free tier available)
3. **Get connection string** from your cluster
4. **Whitelist your IP** in Atlas dashboard

### Option 3: Docker MongoDB

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## ⚙️ Configuration

1. **Environment Setup**:
   Copy the `.env` file in `backend/` and update it:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/superhero-manager
   # Or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/superhero-manager

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRE=7d

   # File Upload Configuration
   MAX_FILE_SIZE=5242880  # 5MB in bytes
   UPLOAD_PATH=./uploads
   ```

2. **Create uploads directory**:
   ```bash
   mkdir -p backend/uploads
   ```

## 🏃 Running the Application

### Development Mode

1. **Start the backend server**:
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

2. **Start the frontend server** (in new terminal):
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Access the application**:
   Open your browser and navigate to `http://localhost:5173`

### Production Mode

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend in production**:
   ```bash
   cd backend
   npm run build
   npm start
   ```

## 🐳 Docker Deployment

### Quick Start

1. **Build and start all containers**:
   ```bash
   docker-compose up --build
   ```

2. **Access the application**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`
   - MongoDB: `localhost:27017`

### Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build --force-recreate
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |

### Hero Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/heroes` | Get all heroes | Yes | Any |
| GET | `/api/heroes/:id` | Get specific hero | Yes | Any |
| POST | `/api/heroes` | Create new hero | Yes | Admin/Editor |
| PUT | `/api/heroes/:id` | Update hero | Yes | Admin/Editor |
| DELETE | `/api/heroes/:id` | Delete hero | Yes | Admin |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API health |

### Request/Response Examples

**Register User**:
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "editor"
}
```

**Login**:
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Create Hero**:
```json
POST /api/heroes
{
  "name": "Superman",
  "superpower": "Flight, Super Strength",
  "humilityScore": 9,
  "universe": "DC"
}
```

## 👤 Default Users

The application automatically seeds with default users:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Admin | admin@example.com | password123 | Full access to all features |
| Editor | editor@example.com | password123 | View, create, and edit heroes |
| Viewer | viewer@example.com | password123 | View only |

## 🔐 Roles and Permissions

### Admin
- ✅ View all heroes
- ✅ Create new heroes
- ✅ Edit any hero
- ✅ Delete heroes
- ✅ Access admin panel
- ✅ User management

### Editor
- ✅ View all heroes
- ✅ Create new heroes
- ✅ Edit any hero
- ❌ Delete heroes
- ❌ Access admin panel

### Viewer
- ✅ View all heroes
- ❌ Create heroes
- ❌ Edit heroes
- ❌ Delete heroes
- ❌ Access admin panel

## 🛠️ Technologies Used

### Backend Stack
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **TypeScript**: Type-safe JavaScript
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing
- **Winston**: Logging utility

### Frontend Stack
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Build tool and dev server
- **Axios**: HTTP client
- **React Router**: Client-side routing
- **React Context**: State management
- **React Hook Form**: Form handling

### DevOps & Tools
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Reverse proxy (Docker)
- **ESLint**: Code linting
- **Prettier**: Code formatting

## 🔧 Development Scripts

### Backend Scripts
```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Start production server
npm test         # Run tests
npm run lint     # Run ESLint
```

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run type-check  # TypeScript type checking
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**:
   - Check MongoDB is running: `mongod --version`
   - Verify connection string in `.env`
   - Check network connectivity for MongoDB Atlas

2. **Port Already in Use**:
   - Kill process on port: `kill -9 $(lsof -ti:5000)`
   - Or change port in `.env` file

3. **JWT Token Issues**:
   - Verify `JWT_SECRET` is set in `.env`
   - Clear browser localStorage/cookies

4. **File Upload Issues**:
   - Ensure uploads directory exists
   - Check file size limits in `.env`
   - Verify write permissions

5. **Docker Issues**:
   - Clear Docker cache: `docker system prune -a`
   - Rebuild containers: `docker-compose up --build`

### Database Reset

```bash
# Clear all data (use with caution!)
cd backend
npm run seed  # This will reseed with default data
```

### Logs and Debugging

```bash
# Backend logs
cd backend && npm run dev

# Frontend logs
cd frontend && npm run dev

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check browser console for frontend errors
5. Check terminal output for backend errors

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

---

**Happy Coding! 🦸‍♂️🦸‍♀️**#   m i n i - p r o j e t - s u p e r h e r e o s - e l a b e d - h a m d i  
 