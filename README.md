# RaktoDanBD

This repository contains the Raktobd blood donation application. It includes the main `raktobd` application and a `2.0` folder with additional middleware, models, routes, and utilities.

## Repository structure

- `raktobd/`
  - `server.js` - main Express server entry point
  - `build.js` - build/script helper for the application
  - `public/` - frontend static assets and JavaScript
  - `routes/` - API route definitions
  - `middleware/` - authentication and request middleware
  - `models/` - Mongoose models
  - `utils/` - helper modules (cloudinary, email, etc.)
- `2.0/`
  - `middleware/` - middleware for the second version
  - `models/` - data models for the second version
  - `routes/` - routes for the second version
  - `utils/` - utility helpers for the second version

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in `raktobd/` with environment variables required by the app, such as:
   - `PORT`
   - `MONGO_URI`
   - `JWT_SECRET`
   - Cloudinary credentials
   - Email credentials

3. Start the application:
   ```bash
   npm run dev
   ```

4. To run the app normally:
   ```bash
   npm start
   ```

## Notes

- The `raktobd/package.json` file defines the main backend dependencies for the project.
- Use `nodemon` for local development.
- Frontend files are served from `raktobd/public/`.
- Credit:Farabi
