# Tundify - AI-Powered Chat Application

Tundify is an innovative chat application designed to make communication effortless. Users can sign in or sign up, send and receive messages, exchange files, and record audio in real time. What sets Tundify apart is its AI-powered language translation feature. Users can record audio in their native language, and AI will recognize, transcribe, and translate it into their preferred language before sending it as text.

This repository contains both the **backend** and **frontend** components of Tundify.

## Features

- **Real-time messaging** with WebSockets
- **Audio recording & AI-based translation**
  **Google OAuth Sign-In**
- **File sharing support**
  **Cloudinary integration for file storage**
- **User authentication** (JWT-based access & refresh tokens, Google Sign-In)
- **Secure password reset via email**
- **Robust security measures** (XSS protection, data sanitization, rate limiting, etc.)
- **MVC architecture implementation**
- **Desktop-first UI with animations**

---

## Tech Stack

### Backend:

- **Node.js**, **Express.js**, **MongoDB**, **Redis**
- **Authentication**: JWT (Access & Refresh Tokens), Google OAuth
  **File Storage**: Cloudinary (For storing images, videos, and other media files)
- **Security Features**:
  - XSS Protection
  - Data Sanitization
  - Rate Limiting
  - Preventing Parameter Pollution
- **Email Handling**: Nodemailer (Welcome & Password Reset Emails)
- **Socket.io**: Real-time chat support
- **MVC Architecture**:
  - **Models**: Mongoose schemas for data handling
  - **Controllers**: Logic for request/response handling
  - **Views**: Email templates for user communication

### Frontend:

- **Next.js** (for SSR & Middleware Protection)
- **React.js** (Client-side development)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form

---

## Installation & Setup

### Prerequisites

- **Node.js** (v18 or later)
- **MongoDB** ( Atlas)
- **Redis** (For caching)

### Backend Setup

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:

   - Create a `.env` file in the `backend` directory
   - Add the following configurations:

   ```sh

   PORT=<port>
   DATABASE_ATLAS=<your-database-connection-string>
   DATABASE_PASSWORD=<your-database-password>
   DEFAULT_STATUS=Hey there! I am using Tundify
   DEFAULT_PICTURE=<default-picture-url>
   GOOGLE_CLIENT_ID=<your-client-id>
   GOOGLE_CLIENT_SECRET=<your-client-secret>

   JWT_SECRET=<your-jwt-secret>
   REFRESH_JWT_SECRET=<your-refresh-jwt-secret>
   JWT_EXPIRES_IN=<token-expire-in (time)>
   REFRESH_JWT_EXPIRES_IN=<refresh-token-expire-in (time)>
   JWT_COOKIE_EXPIRES_IN=<token-in-cookies-expire-in>
   REFRESH_JWT_COOKIE_EXPIRES_IN=<refresh-token-in-cookies-expire-in>
   EMAIL_USERNAME=<mailtrap-username>
   EMAIL_PASSWORD=<mailtrap-password>
   EMAIL_HOST=<your-email-host-mailtrap>
   EMAIL_PORT=<your-email-port-mailtrap>
   EMAIL_FROM=<your-signin-email-in-mailtrap>
   FRONTEND_URL=http://localhost:3000
   ONLINE_USERS_KEY=<Redis hash key >
   GEMINI_API_KEY=<your-gemini-api-key>
   ```

4. Start the backend server:
   ```sh
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:

   - Create a `.env` file in the `frontend` directory
   - Add the following configurations:

   ```sh

   NEXT_PUBLIC_API_ENDPOINT=http://localhost:8000/api/v1
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<your-cloudinary-upload-preset>
   NEXT_PUBLIC_BACKEND=http://localhost:8000/
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

---

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Sign up or log in with your account (Google Sign-In available)
3. Start messaging, sending files, or recording audio with real-time AI-powered translation

---

## Security Considerations

- **JWT-based authentication** for secure session management
- **Google OAuth Sign-In**
- **Rate limiting** to prevent abuse
- **Email verification & password reset system**
- **CORS protection**
- **Data sanitization and XSS prevention**

---

## Future Plans

- **Mobile app version** (React Native or Flutter)
- **More AI-powered features** (Voice-to-voice translation, chat summarization, etc.)
- **Enhanced UI & UX improvements**

---

## Contributing

Contributions are welcome! Please fork the repo and submit a pull request with your changes.

---

Happy chatting with **Tundify!** 🚀
