

# Welcome to Assignment Tracker

Set up Assignment Tracker locally and learn how the React frontend connects to the Express and MongoDB backend.

Assignment Tracker is a MERN-style application for managing student assignments, deadlines, submissions, and alerts. The repository is split into two services:

* `my-awesome-app/` — React 19 frontend built with Vite and Tailwind CSS
* `assignment-tracker-backend/` — Node.js and Express API backed by MongoDB

## Architecture

<Columns layout="auto">
  <Column>
    Frontend

```
- React 19 with React Router DOM
- Vite with ES modules for development and builds
- Tailwind CSS v4 for styling
- `fetch`-based API layer in `src/api.js`
- Reads `VITE_API_BASE_URL`, then defaults to `http://localhost:5000/api`
```

  </Column>
  <Column>
    Backend

```
- Node.js and Express 5
- MongoDB via Mongoose
- `jsonwebtoken` for auth and `bcryptjs` for password hashing
- `dotenv` for environment variables
- CORS allowlist for local and production frontends
```

  </Column>
</Columns>

<br />

## Prerequisites

Install the following before running the app:

* Node.js 18 or newer and npm
* Git
* A MongoDB connection string from local MongoDB or MongoDB Atlas

Clone the repository:

```bash
git clone https://github.com/makx-dev/Assignment-Tracker-.git
cd Assignment-Tracker-
```

## Run the backend

1. Move into the backend directory and install dependencies:

   ```bash
   cd assignment-tracker-backend
   npm install
   ```

2. Create `assignment-tracker-backend/.env`:

   ```bash
   MONGODB_URI=mongodb://localhost:27017/assignment-tracker
   JWT_SECRET=replace-with-a-long-random-string
   PORT=5000
   ```

3. Start the API in development mode:

   ```bash
   npm run dev
   ```

   The backend runs on `http://localhost:5000` by default.

## Run the frontend

1. Open a new terminal, then move into the frontend directory and install dependencies:

   ```bash
   cd my-awesome-app
   npm install
   ```

2. Optional: create `my-awesome-app/.env` if you need to override the API URL:

   ```bash
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

   If you omit this file, the frontend uses `http://localhost:5000/api`.

3. Start the Vite dev server:

   ```bash
   npm run dev
   ```

   Vite serves the app at `http://localhost:5173`, which is already allowed by the backend CORS configuration.

## API routes

The Express server mounts these route groups in `server.js`:

| Route              | Purpose                                                         |
| ------------------ | --------------------------------------------------------------- |
| `/api/auth`        | Handles teacher login and JWT creation                          |
| `/api/assignments` | Creates, lists, and deletes assignments                         |
| `/api/students`    | Fetches student directories and details                         |
| `/api/submissions` | Fetches submissions by assignment and updates submission status |
| `/api/alerts`      | Creates and reads teacher alerts and student notifications      |

Submission statuses include `pending`, `submitted`, `late`, and `missing`.

## Data models

The backend defines these Mongoose models:

| Model        | Key fields                                                             |
| ------------ | ---------------------------------------------------------------------- |
| `Teacher`    | `name`, `username`, `email`, `password`, `role`                        |
| `Student`    | `name`, `email`, `rollNo`, `division`, `password`                      |
| `Assignment` | `title`, `subject`, `deadline`, `maxMarks`, `description`, `createdAt` |
| `Submission` | `student`, `assignment`, `status`, `submittedAt`, timestamps           |

When a teacher creates an assignment, the backend creates a `pending` submission for every student. When a teacher deletes an assignment, the backend also deletes its related submissions.

## CORS configuration

The backend accepts browser requests from these origins:

* `http://localhost:5173` — local Vite dev server
* `https://assignment-tracker-lmg.vercel.app` — deployed frontend

If you serve the frontend from a different origin, add that origin to the CORS allowlist in `server.js`.

## Troubleshooting

<Accordion title="MongoDB connection errors" icon="fa-duotone fa-database">
  Confirm `MONGODB_URI` is set in `assignment-tracker-backend/.env` and that your MongoDB instance is reachable. For MongoDB Atlas, allowlist your IP address in the cluster network settings.
</Accordion>

<Accordion title="CORS errors in the browser console" icon="fa-duotone fa-shield-halved">
  Run the frontend on `http://localhost:5173` or add your frontend origin to the CORS allowlist in `server.js`.
</Accordion>

<Accordion title="Frontend cannot reach the API" icon="fa-duotone fa-plug">
  Verify the backend is running on port 5000 and that `VITE_API_BASE_URL` matches the backend API URL. Restart `npm run dev` after changing `.env` values because Vite reads environment variables at startup.
</Accordion>

<Accordion title="JWT or login failures" icon="fa-duotone fa-key">
  Make sure `JWT_SECRET` is defined in the backend `.env`. If you rotate the secret, clear stored tokens in the browser and sign in again.
</Accordion>
