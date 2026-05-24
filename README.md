 # StreamVibe 🎬

A full-stack video streaming mobile application built with React Native and Node.js — similar to YouTube.

![StreamVibe](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)

## 📱 Features

- 🔐 User Authentication (Register/Login with JWT)
- 📹 Video Upload to Cloudinary
- 🎬 Video Streaming & Playback
- ❤️ Like/Unlike Videos
- 💬 Comment on Videos
- 🔍 Search Videos
- 👥 Follow/Unfollow Creators
- 📜 Watch History
- 🗑️ Delete Own Videos
- 🔄 Pull to Refresh
- 👤 User Profile

## 🛠️ Tech Stack

### Frontend (Mobile)
- React Native + Expo
- Redux Toolkit (State Management)
- expo-video (Video Player)
- expo-linear-gradient (UI)
- expo-document-picker (File Upload)
- @expo/vector-icons (Icons)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (Video Storage)
- Multer (File Upload)
- bcryptjs (Password Hashing)

### Deployment
- Backend: Render
- Database: MongoDB Atlas
- Media: Cloudinary

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- Expo Go app on your phone
- MongoDB Atlas account
- Cloudinary account

### Installation

1. Clone the repository
\```bash
git clone https://github.com/rachankumar846-byte/streamvibe-app.git
\```

2. Install frontend dependencies
\```bash
cd StreamVibe
npm install
\```

3. Install backend dependencies
\```bash
cd server
npm install
\```

4. Create `.env` file in server folder
\```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
\```

5. Run backend
\```bash
cd server
npm run dev
\```

6. Run frontend
\```bash
cd StreamVibe
npm start
\```

## 📹 Demo Video

[Watch Demo](https://www.loom.com/share/fed0efcfd7e14410a0d3740577556029)

## 🌐 Live Backend

Backend API: https://streamvibe-server.onrender.com

## 📂 Project Structure

\```
streamvibe/
├── StreamVibe/          # React Native Frontend
│   ├── src/
│   │   ├── screens/     # App Screens
│   │   ├── components/  # Reusable Components
│   │   ├── redux/       # State Management
│   │   └── api/         # API Configuration
│   └── App.js
│
└── server/              # Node.js Backend
    ├── models/          # MongoDB Models
    ├── routes/          # API Routes
    ├── middleware/       # Auth Middleware
    └── server.js
\```

## 👨‍💻 Author

**Rachan Kumar**
- GitHub: [@rachankumar846-byte](https://github.com/rachankumar846-byte)
- Email: rachankumar846@gmail.com
- LinkedIn: [Rachan Kumar](https://linkedin.com/in/rachan-kumar-0158392b7)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
