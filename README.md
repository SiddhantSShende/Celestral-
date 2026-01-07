# Celestral - Love is a Mystery

A modern blind dating platform that helps people connect at partner cafés through curated experiences.

## 🚀 Features

- **Assessment Form**: Multi-step form to collect user preferences and information
- **Admin Dashboard**: Secure Clerk-authenticated portal to manage submissions
- **Firebase Integration**: Real-time data storage and retrieval
- **Modern UI**: Glassmorphism design with smooth animations
- **Responsive Design**: Works seamlessly on all devices

## 📋 Prerequisites

- Node.js (v14 or higher)
- Firebase project with Firestore enabled
- Clerk account for admin authentication

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Celestral
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` in the root directory
   - Fill in your Firebase and Clerk credentials
   - Update the JWT secret for production

4. **Set up Firebase**
   - Place your Firebase service account JSON file in `server/config/firebase-service-account.json`
   - Update the Firebase configuration in `js/firebase-config.js`

5. **Configure Clerk**
   - Update the Clerk publishable key in `.env`
   - Update the Clerk configuration in `admin.html`

## 🚀 Running the Application

### Start the Frontend
```bash
# Using batch file (Windows)
start-frontend.bat

# Or manually
# Simply open index.html in a browser or use a local server
```

### Start the Backend
```bash
# Using batch file (Windows)
start-backend.bat

# Or manually
cd server
npm start
```

The server will run on `http://localhost:5000`

## 📁 Project Structure

```
Celestral/
├── assets/             # Images and static assets
├── css/               # Stylesheets
│   ├── reset.css
│   ├── variables.css
│   ├── base.css
│   ├── components.css
│   ├── layout.css
│   ├── animations.css
│   ├── assessment.css
│   └── admin.css
├── js/                # JavaScript files
│   ├── main.js
│   ├── assessment.js
│   ├── admin.js
│   ├── firebase-config.js
│   └── config.js
├── server/            # Backend API
│   ├── config/
│   ├── services/
│   │   ├── auth-service/
│   │   ├── otp-service/
│   │   └── user-service/
│   └── server.js
├── index.html         # Homepage
├── start-journey.html # Assessment form
├── admin.html         # Admin dashboard
├── contact.html       # Contact page
├── our-mission.html   # Mission page
└── .env              # Environment configuration
```

## 🔒 Security

- Admin dashboard is protected with Clerk authentication
- Only whitelisted email can access the admin portal
- Firebase service account credentials are never exposed to the client
- All sensitive data is stored in `.env` (never commit this file!)

## 🌐 Deployment

### Frontend
Deploy the static files (HTML, CSS, JS, assets) to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

### Backend
Deploy the `server/` directory to:
- Heroku
- Railway
- Render
- DigitalOcean App Platform

**Important**: Update environment variables in your hosting platform with production values.

## 📝 Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `FIREBASE_SERVICE_ACCOUNT_PATH`: Path to Firebase credentials
- `JWT_SECRET`: Secret for JWT token generation
- `VITE_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `ADMIN_EMAIL`: Admin email for Clerk restriction
- `ADMIN_PASSWORD`: Admin password for seeding

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 📧 Contact

For any questions or support, please contact: sidaeivarc@gmail.com
