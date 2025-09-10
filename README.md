# Newsletter Management System

## 1. Project Overview

This is a full-stack MERN application designed to automatically fetch, categorize, and manage newsletters and other emails from a POP3 email server. The backend is built with Node.js, Express, and MongoDB, and it exposes a RESTful API to be consumed by the React frontend.

### Key Features:
- **Email Fetching**: Automatically connects to a POP3 server to download new emails.
- **Smart Categorization**: A service that categorizes emails into predefined folders (`inbox`, `supplier`, `competitor`, `information`, `customers`, `marketing`, `archive`) based on sender, subject, and content analysis.
- **Learning from User Actions**: When a user manually moves an email to a different folder, the system saves this as a `SenderPreference`, ensuring future emails from the same sender are categorized correctly.
- **RESTful API**: A comprehensive set of endpoints to manage emails, folders, and users.
- **User Authentication**: JWT-based authentication for user registration and login.

## 2. Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (with Mongoose)
- **Frontend**: React.js
- **Email Handling**: `poplib`, `mailparser`
- **Authentication**: JSON Web Tokens (JWT)

## 3. Setup and Installation

1.  **Clone the repository**.
2.  **Install Dependencies**:
    ```bash
    # Install root, backend, and frontend dependencies
    yarn install
    cd frontend
    yarn install
    cd ..
    ```
3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and populate it based on the `.envexample` file.

    ```env
    NODE_ENV=development
    PORT=5007
    MONGO_URI=mongodb://localhost:27017/micromax
    JWT_SECRET=your_jwt_secret
    POP3_USER=your-email@example.com
    POP3_PASS=your-email-password
    POP3_HOST=pop.example.com
    ```

4.  **Start the Application**:
    ```bash
    # From the root directory
    yarn dev
    ```
    This command concurrently starts the backend server (on port 5007) and the frontend development server (on port 3000).

## 4. Backend Folder Structure

The backend code is organized to separate concerns, making it modular and maintainable.

-   `config/`: Contains configuration files, such as the database connection setup (`db.js`).
-   `controllers/`: Holds the core application logic for handling API requests. Each controller corresponds to a specific resource (e.g., `emailController.js`).
-   `models/`: Defines the Mongoose schemas for the MongoDB collections (e.g., `emailModel.js`, `userModel.js`).
-   `routes/`: Contains the Express route definitions, which map API endpoints to their corresponding controller functions.
-   `services/`: Includes standalone modules that provide specific business logic, like the `emailCategorizationService.js`.
-   `server.js`: The main entry point for the backend application. It sets up the Express server, connects to the database, and mounts the API routes.

## 5. API Endpoints

The following are the primary API routes available in the application.

### User API (`/api/users`)

| Method | Endpoint         | Description                  |
| :----- | :--------------- | :--------------------------- |
| `POST` | `/register`      | Registers a new user.        |
| `POST` | `/login`         | Authenticates a user and returns a JWT. |
| `POST` | `/logout`        | Logs out a user (client-side token deletion). |

### Email API (`/api/emails`)

| Method | Endpoint                   | Description                                                                                             |
| :----- | :------------------------- | :------------------------------------------------------------------------------------------------------ |
| `GET`  | `/`                        | Triggers the process to fetch new emails from the POP3 server.                                          |
| `GET`  | `/saved`                   | Retrieves emails already saved in the database. Supports filtering by folder and search query (`?q=`).  |
| `GET`  | `/folders/:folderId`       | Retrieves emails for a specific folder with pagination. Supports search query (`?q=`).                  |
| `GET`  | `/counts`                  | Gets the total and unread email counts for each folder.                                                 |
| `GET`  | `/statistics`              | Retrieves aggregated statistics, such as total emails, unread counts, and top senders.                  |
| `PUT`  | `/:emailId/read`           | Marks a single email as read.                                                                           |
| `PATCH`| `/:emailId/unread`         | Marks a single email as unread.                                                                         |
| `PATCH`| `/bulk-read`               | Marks multiple emails as read in a single request.                                                      |
| `PUT`  | `/:emailId/folder`         | Moves an email to a new folder and creates/updates a `SenderPreference` to "learn" the user's choice.   |
| `POST` | `/recategorize`            | Re-runs the categorization logic on all existing emails based on the latest rules and sender preferences. |

### Folder API (`/api/folders`)

| Method | Endpoint       | Description                               |
| :----- | :------------- | :---------------------------------------- |
| `GET`  | `/`            | Retrieves the static folder structure.    |
| `GET`  | `/:folderId`   | Retrieves details for a specific folder.  |