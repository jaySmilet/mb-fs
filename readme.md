## Milestone completion status

# Milestone 1 – Frontend

Dynamic form page: Partially completed

-Form schema fetched from /api/form-schema using TanStack Query.

-Dynamic rendering of all required field types (text, number, select, multi‑select, date, textarea, switch).

-Labels, placeholders, required indicator, basic inline error UI present.

-Submission flow wired to backend, but form state is not fully wired (submitted payload currently {}), so validation feedback from backend is not fully visible.

Submissions table page: Partially completed

-Table layout with columns (ID, Created Date, View) implemented using TanStack Table.

-Data fetching from /api/submissions using TanStack Query.

-Basic pagination UI present; server-side pagination/sorting behaviour not fully verified end‑to‑end.

Milestone 2 – Backend

API endpoints: Implemented

-GET /api/form-schema returning “Employee Onboarding” schema.​

-POST /api/submissions with schema-based validation, ID generation, and createdAt timestamp, persisting submissions to JSON file.​

-GET /api/submissions with pagination, sorting on createdAt, and total count/total pages.​

Error handling, proper status codes, and CORS support: Implemented.

## Tech stack used

# Frontend

-React 19 (Vite + TypeScript)

-TanStack Query v5

-TanStack Form v1

-TanStack Table v8

-React Router DOM v7

-Tailwind CSS v4

# Backend

-Node.js + Express

-JSON file persistence for submissions and form schema

-uuid for ID generation

-fs-extra for file I/O

## Setup and run instructions

# Prerequisites

-Node.js (LTS) and npm installed.

-Ports 4000 (backend) and 3000 (frontend) available.

# Backend

1-From project root:

cd backend
npm install

2- Ensure data files exist:

-backend/data/form-schema.json – contains the Employee Onboarding schema.​

-backend/data/submissions.json – initialize with:
[]

3- Start backend:

npm run dev

-Backend runs on http://localhost:4000.

-Test endpoints:

-GET http://localhost:4000/api/form-schema

-GET http://localhost:4000/api/submissions

# Frontend

1-From project root:

cd frontend
npm install

2-Ensure vite.config.ts proxies /api to the backend:

server: {
port: 3000,
proxy: {
'/api': {
target: 'http://localhost:4000',
changeOrigin: true,
},
},
}

3-Start frontend
npm run dev

4-Open http://localhost:3000 in the browser.

    -Dynamic form page is at /.

    -Submissions table page is at /submissions.

## Known issues

# TanStack Form integration:

-Current wiring with useForm + useField still results in onSubmit receiving {} as value, so frontend is not yet sending a populated payload to POST /api/submissions.

-As a result, backend validation logic is correct, but cannot be fully exercised from the UI path.​

# Form UX:

-Client-side validation rules (minLength, maxLength, regex, min, max, minDate, minSelected, maxSelected) are not fully mirrored on the frontend; main validation currently happens on the backend.​

# Submissions table:

-Server-side pagination and sorting endpoints work, but UI wiring (page/limit/sort controls) has not been fully verified for all edge cases (invalid query params, empty states).​

-No authentication, no edit/delete/search features implemented (optional bonuses).

## Assumptions

-Assignment allows using JSON files for persistence instead of a full database, as stated (“in-memory, JSON file, SQLite, or other lightweight database”).​

-Frontend and backend run on separate ports in local development, with Vite dev server proxying /api to http://localhost:4000.

-Form schema is static and matches the “Employee Onboarding” schema defined in the assignment; dynamic editing of the schema is out of scope.​

-Validation source of truth is the backend; frontend performs only light validation/UX, and backend responses are considered authoritative.​

-Live deployment (if done) will mirror this structure: one URL for backend API and one for frontend, with frontend configured to call the deployed backend base URL.
