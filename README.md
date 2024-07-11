# Risk Management Application

This is a Risk Management Application designed to help users manage and mitigate risks within their projects. The application provides functionalities for adding and viewing risks, mitigating actions, and evaluating risks. It also includes user authentication and role-based access control.

## Features

- User authentication and role-based access control (Admin and Normal User roles).
- Dashboard for managing risks and projects.
- Add, view, update, and delete risks.
- Add, view, update, and delete projects.
- Generate PDF reports for risks.
- Manage mitigation actions for risks.
- Evaluate risks with comments and scores.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- PostgreSQL installed and running
- A PostgreSQL database created for the application

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/tweizy/risk-management-app.git
    cd risk-management-app
    ```

2. **Install server dependencies:**

    ```bash
    cd backend
    npm install
    ```

3. **Install client dependencies:**

    ```bash
    cd frontend
    npm install
    ```

4. **Set up environment variables:**

    Create a `.env` file in the `server` directory with the following content:

    ```env
    PORT=4000
    DATABASE_URL=postgres://username:password@localhost:5432/riskapp
    JWT_SECRET=your_jwt_secret
    ```

    Adjust the `DATABASE_URL` with your PostgreSQL credentials.

5. **Run database migrations:**

    ```bash
    cd server
    npx sequelize-cli db:migrate
    ```

## Running the Project

1. **Start the server:**

    ```bash
    cd backend
    node index.js
    ```

2. **Start the client:**

    Open a new terminal window and run:

    ```bash
    cd frontend
    npm run dev
    ```

3. **Access the application:**

    Open your web browser and go to `http://localhost:5173`.