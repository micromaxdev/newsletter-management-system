# newsletter-management-system

## Project Overview

This is a MERN stack application for managing newsletters. The backend is built with Node.js, Express, and MongoDB, while the frontend uses React.

## Project Setup Instructions

1. **Clone the repository**
2. **Install root dependencies:**
   ```bash
   yarn install
   ```
3. **Install frontend dependencies:**
   ```bash
   cd frontend
   yarn install
   ```
4. **Create a `.env` file** in the root or backend directory and add your environment variables. For example:
   ```env
   MONGO_URI=mongodb://localhost:27017/newsletterdb
   PORT=5000
   NODE_ENV=development
   ```
5. **Start the development server:**
   ```bash
   # From the root directory
   yarn dev
   ```
   This will start both the backend (with nodemon for automatic reloads on file changes) and the frontend concurrently.

## Development Notes

- The backend uses **nodemon**, so any changes you make to backend files will automatically restart the server.
- The frontend uses **Create React App** and supports hot reloading for React components.
- By default, the backend runs on [http://localhost:5000](http://localhost:5000) and the frontend runs on [http://localhost:3000](http://localhost:3000).
- To view the app, open your browser and go to [http://localhost:3000](http://localhost:3000).
- API endpoints are available under `/api` (e.g., `http://localhost:5000/api/users`).

## Additional Tips

- If you change backend code, just save the file and nodemon will automatically restart the server.
- If you change frontend code, the browser will automatically refresh to show your changes.
- Make sure MongoDB is running locally or update your `MONGO_URI` to point to your MongoDB Atlas or other instance.
