# NerdNet Server

The NerdNet Server is the backend component of the NerdNet knowledge-sharing platform. It is built using Express.js, with MongoDB as the database (managed through Mongoose) and JWT for secure user authentication.

## Key Features

- **Express Server:** Provides a robust and scalable backend for handling API requests.
- **MongoDB with Mongoose:** Manages data storage and retrieval with an efficient and flexible schema design.
- **JWT Authentication:** Ensures secure and reliable user authentication and authorization.
- **RESTful API:** Serves the frontend with well-structured API endpoints.
- **Middleware Integration:** Utilizes various middleware for security, logging, and error handling.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JSON Web Tokens (JWT)
- **Middleware:** Helmet, morgan, express-validator

## Installation

```bash
git clone https://github.com/svssathvik7/nerdnet-server.git
cd nerdnet-server
npm install
npm start
