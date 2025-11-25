# Request Management Application

A full-stack Request Management Web Application with a focus on robust backend architecture, business logic enforcement, and modern UI design.

## 🎯 Project Overview

This application implements a complete request management system where:
- **Employee A** creates a request and assigns it to **Employee B**
- **Employee B's manager** can approve or reject the request
- **Employee B** can only action the request once it's approved
- **Employee B** can close the request after working on it

## 🏗️ Architecture & Tech Stack

### Backend
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Logging**: Winston with daily log rotation
- **Monitoring**: Morgan HTTP request logger
- **Security**: bcryptjs, helmet, CORS

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **State Management**: React Context API
- **Styling**: Vanilla CSS with modern design system
- **Icons**: Lucide React
- **UI Theme**: Dark mode with purple/blue gradients

## 📋 Features

### Backend Features
✅ **Clean Architecture**: MVC pattern with service layer
✅ **Business Logic Enforcement**: All requirements implemented with validation
✅ **Authentication & Authorization**: JWT-based with role-based access control
✅ **Input Validation**: Joi schemas for all endpoints
✅ **Error Handling**: Centralized error middleware
✅ **Logging**: Winston logger with file rotation and console output
✅ **Database**: Prisma ORM with PostgreSQL
✅ **Security**: Helmet, CORS, password hashing

### Frontend Features
✅ **Modern UI**: Beautiful dark theme with glassmorphism effects
✅ **Responsive Design**: Mobile-first approach
✅ **Authentication**: Login, Register, Protected Routes
✅ **Dashboard**: Role-based views for Employees and Managers
✅ **Request Management**: Create, View, Approve, Reject, Action, Close
✅ **Real-time Updates**: Automatic refresh after actions
✅ **Error Handling**: User-friendly error messages
✅ **Loading States**: Spinners and disabled states

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your PostgreSQL credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/request_management?schema=public"
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Seed the database (optional)**
   ```bash
   npm run prisma:seed
   ```
   
   This creates demo users:
   - Manager: manager@example.com / password123
   - Employee 1: employee1@example.com / password123
   - Employee 2: employee2@example.com / password123
   - Employee 3: employee3@example.com / password123

7. **Start the backend server**
   ```bash
   npm run dev
   ```
   
   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:5173`

## 📊 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `name`
- `role` (EMPLOYEE | MANAGER)
- `managerId` (Foreign Key to Users, nullable)
- `createdAt`
- `updatedAt`

### Requests Table
- `id` (UUID, Primary Key)
- `title`
- `description`
- `status` (PENDING | APPROVED | REJECTED | IN_PROGRESS | CLOSED)
- `createdById` (Foreign Key to Users)
- `assignedToId` (Foreign Key to Users)
- `approvedById` (Foreign Key to Users, nullable)
- `approvedAt` (nullable)
- `closedAt` (nullable)
- `createdAt`
- `updatedAt`

## 🔐 Business Rules Implementation

### 1. Request Creation
- Any employee can create a request
- Must assign to another user
- Initial status: `PENDING`

### 2. Request Approval/Rejection
- **Only** the assigned employee's manager can approve/reject
- Validation checks manager relationship
- Status transitions: `PENDING` → `APPROVED` or `REJECTED`

### 3. Request Action
- **Only** the assigned employee can action
- **Only** if status is `APPROVED`
- Status transition: `APPROVED` → `IN_PROGRESS`

### 4. Request Closure
- **Only** the assigned employee can close
- **Only** if status is `IN_PROGRESS`
- Status transition: `IN_PROGRESS` → `CLOSED`

## 🛣️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### Users
- `GET /api/users` - Get all users (Protected)
- `GET /api/users/:id` - Get user by ID (Protected)
- `GET /api/users/role/employees` - Get all employees (Manager only)
- `GET /api/users/manager/my-employees` - Get manager's employees (Manager only)

### Requests
- `POST /api/requests` - Create request (Protected)
- `GET /api/requests` - Get requests (Protected, filtered by role)
- `GET /api/requests/:id` - Get request by ID (Protected)
- `PUT /api/requests/:id/approve` - Approve request (Manager only)
- `PUT /api/requests/:id/reject` - Reject request (Manager only)
- `PUT /api/requests/:id/action` - Start working on request (Assigned employee only)
- `PUT /api/requests/:id/close` - Close request (Assigned employee only)

## 🎨 Design System

### Color Palette
- **Primary**: Purple/Blue gradient (#8b5cf6 to #3b82f6)
- **Background**: Dark theme (#0a0a0f, #12121a, #1a1a27)
- **Status Colors**:
  - Pending: Orange (#f59e0b)
  - Approved: Green (#10b981)
  - Rejected: Red (#ef4444)
  - In Progress: Blue (#3b82f6)
  - Closed: Gray (#6b7280)

### Typography
- **Font Family**: Inter
- **Sizes**: Responsive scale from 0.75rem to 2.25rem

### Components
- Glassmorphism cards with backdrop blur
- Gradient buttons with hover effects
- Smooth animations and transitions
- Responsive grid layouts

## 📁 Project Structure

```
request-management/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, logger configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions, validators
│   │   └── server.js        # Express app setup
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.js          # Seed data
│   ├── logs/                # Application logs
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context (Auth)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🧪 Testing the Application

### Test Flow 1: Employee Creates Request
1. Login as Employee 3 (employee3@example.com)
2. Create a request and assign to Employee 1
3. Logout

### Test Flow 2: Manager Approves Request
1. Login as Manager (manager@example.com)
2. View the pending request
3. Approve the request
4. Logout

### Test Flow 3: Employee Actions and Closes Request
1. Login as Employee 1 (employee1@example.com)
2. View the approved request
3. Click "Start Working" to action the request
4. Click "Close Request" to complete it

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **CORS**: Configured for frontend origin
- **Helmet**: Security headers
- **Input Validation**: Joi schemas prevent injection
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **Role-Based Access Control**: Middleware authorization

## 📝 Logging & Monitoring

### Winston Logger
- **Error logs**: Separate error log files
- **Combined logs**: All application logs
- **Daily rotation**: Automatic log file rotation
- **Console output**: Development-friendly console logs

### Morgan HTTP Logger
- HTTP request logging
- Response time tracking
- User identification in logs

## 🚢 Deployment

### Backend Deployment (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Add environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_URL=<backend-url>`
6. Deploy

## 👨‍💻 Development

### Backend Development
```bash
cd backend
npm run dev  # Starts nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server
```

### Database Management
```bash
npm run prisma:studio  # Open Prisma Studio GUI
npm run prisma:migrate # Create new migration
```

## 📄 License

MIT

## 🤝 Contributing

This is a case study project. Feel free to fork and modify for your own use.

---

**Built with ❤️ using Node.js, Express, PostgreSQL, React, and Vite**
