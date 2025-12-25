# ImpactCV - Professional Resume Builder

**Create stunning, ATS-friendly resumes in minutes**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.3.1-blue)](https://reactjs.org/)

---

## 🎯 Overview

**ImpactCV** is a modern, full-stack web application that empowers users to create professional, ATS-optimized resumes with ease. Built with React, TypeScript, and Node.js, it offers a seamless experience from creation to sharing.

## ✨ Features

- ✅ **ATS-Friendly**: Optimized for Applicant Tracking Systems
- ✅ **Multiple Themes**: Professional, modern, and creative designs
- ✅ **Real-time Preview**: See changes instantly
- ✅ **Cloud Storage**: Resumes safely stored in Supabase
- ✅ **Easy Sharing**: Generate shareable links
- ✅ **PDF Export**: Download as high-quality PDF
- ✅ **Responsive Design**: Works on all devices
- ✅ **Secure**: JWT authentication with encrypted passwords

## 🛠️ Tech Stack

### Frontend
- React 18.3.1 + TypeScript 5.6.2
- Vite 5.4.2
- Tailwind CSS 3.4.1
- Radix UI Components
- React Router DOM 6.22.0

### Backend
- Node.js 18+ + Express.js 4.18.2
- PostgreSQL 15+ (Supabase)
- Prisma ORM 6.19.0
- JWT Authentication
- bcrypt Password Hashing

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- Supabase account (free tier)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tanishq-Raj/ImpactCVN.git
   cd ImpactCVN
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL script from `setup-database.sql` in SQL Editor
   - Get your connection strings from Settings → Database

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

5. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

6. **Start the application**
   ```bash
   # Terminal 1: Backend
   cd server && node server.js
   
   # Terminal 2: Frontend
   npm run dev
   ```

7. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📚 Documentation

- **[Setup Guide](SETUP.md)** - Detailed installation instructions
- **[Database Schema](documentation/DATABASE_SCHEMA.md)** - Database structure
- **[Technical Docs](documentation/TECHNICAL.md)** - Architecture & implementation
- **[API Documentation](#)** - API endpoints reference

## 🚀 Usage

1. **Sign Up**: Create your account
2. **Create Resume**: Fill in your information
3. **Choose Theme**: Select a professional theme
4. **Download/Share**: Export as PDF or share via link

## 🌐 Deployment

### Frontend (Vercel)
```bash
vercel --prod
```

### Backend (Render)
- Connect GitHub repository
- Set environment variables
- Auto-deploy on push

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- 📧 Email: tanishqraj0408@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/Tanishq-Raj/ImpactCVN/issues)

## 🙏 Acknowledgments

- React Team
- Supabase
- Prisma
- Tailwind CSS
- All Contributors

---

**Made with ❤️ by the Tanishq Raj**

⭐ Star us on GitHub — it helps!
