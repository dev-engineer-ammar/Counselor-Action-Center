# Zyra Student Action Center

Zyra Student Action Center is a small counselor dashboard for reviewing student records, task urgency, unread messages, and task status updates. The project is split into a React/Vite frontend and an Express/TypeScript backend.

## Project Structure

```text
zyra-student/
  backend/    Express API, service layer, mock data store
  frontend/   React UI, API client, shared UI state
```

## Setup

Install dependencies for both apps:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Environment Variables

Create environment files before running the apps.

Backend:

```bash
cd backend
touch .env
```

Example `backend/.env`:

```env
PORT=5000
FRONTEND_ORIGIN=http://localhost:5173
```

Important backend variables:

- `PORT`: API server port. Defaults to `5000` if not set.
- `FRONTEND_ORIGIN`: Allowed browser origin for CORS. Defaults to `http://localhost:5173` if not set.

Frontend:

```bash
cd frontend
touch .env
```

Example `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Important frontend variables:

- `VITE_API_BASE_URL`: Backend API base URL used by the Axios client. Defaults to `http://localhost:5000/api` if not set.

Do not commit real `.env` files. They are ignored by `.gitignore`.

## Run Locally

Start the backend API:

```bash
cd backend
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

By default, the frontend calls:

```text
http://localhost:5000/api
```

You can override this with `VITE_API_BASE_URL` in a frontend `.env` file.

## Run With Docker

From the project root:

```bash
docker compose up --build
```

Then open:

```text
http://localhost:5173
```

The Compose setup starts:

- `frontend` on `http://localhost:5173`
- `backend` on `http://localhost:5000`

Stop the containers:

```bash
docker compose down
```

## Build

Build the backend:

```bash
cd backend
npm run build
```

Build the frontend:

```bash
cd frontend
npm run build
```

## API Contract

Base URL:

```text
http://localhost:5000/api
```

### Get Students

```http
GET /students
```

Response:

```json
[
  {
    "id": "stu_001",
    "name": "Maya Patel",
    "email": "maya.patel@school.edu",
    "grade": 11,
    "gpa": 3.2,
    "counselorId": "csl_001",
    "enrollmentStatus": "at_risk"
  }
]
```

### Get Student Action Center

```http
GET /students/:id/action-center
```

Response:

```json
{
  "student": {
    "id": "stu_001",
    "name": "Maya Patel",
    "email": "maya.patel@school.edu",
    "grade": 11,
    "gpa": 3.2,
    "counselorId": "csl_001",
    "enrollmentStatus": "at_risk"
  },
  "urgencyLevel": "critical",
  "unreadMessagesCount": 2,
  "tasks": [
    {
      "id": "tsk_001",
      "studentId": "stu_001",
      "title": "Submit FAFSA application",
      "description": "Deadline is approaching. Student has not started the form.",
      "status": "todo",
      "priority": "urgent",
      "dueDate": "2026-06-05",
      "createdAt": "2026-05-13T14:00:00Z",
      "updatedAt": "2026-05-13T14:00:00Z"
    }
  ],
  "messages": [
    {
      "id": "msg_001",
      "studentId": "stu_001",
      "from": "Mrs. Thompson (Math)",
      "subject": "Maya missing assignments",
      "preview": "Maya has not submitted the last three homework sets...",
      "read": false,
      "receivedAt": "2026-05-30T08:30:00Z"
    }
  ]
}
```

Errors:

```json
{ "error": "Student trace record stu_999 not found" }
```

### Update Task Status

```http
PATCH /tasks/:taskId/status
```

Request body:

```json
{
  "status": "in_progress"
}
```

Allowed `status` values:

```text
todo
in_progress
completed
```

Response:

```json
{
  "id": "tsk_001",
  "studentId": "stu_001",
  "title": "Submit FAFSA application",
  "description": "Deadline is approaching. Student has not started the form.",
  "status": "in_progress",
  "priority": "urgent",
  "dueDate": "2026-06-05",
  "createdAt": "2026-05-13T14:00:00Z",
  "updatedAt": "2026-06-01T10:00:00.000Z"
}
```

Errors:

```json
{ "error": "Invalid payload status validation data state" }
```

```json
{ "error": "Task trace record tsk_999 not found" }
```

## Architecture Note

The backend uses a simple layered structure:

- `routes` define the HTTP surface.
- `controllers` validate request input and shape HTTP responses.
- `services` hold application logic, including urgency calculation and task status updates.
- `data` provides an in-memory mock data store that can later be replaced with a database.
- `container.ts` wires the store, service, controller, and router together.

The frontend uses a component-based React structure:

- `pages` compose the main action center screen.
- `components` render focused UI pieces such as the student selector, summary, tasks, and messages.
- `services` isolate API calls.
- `api` configures the shared Axios client.
- `store` holds small UI state, currently the selected student ID.

React Query handles server-state fetching and cache invalidation. Zustand handles lightweight local UI state. This keeps API data and local selection state separate while keeping the UI easy to extend.

## Task 2: Production Readiness Notes

### Reliability Improvements

- Backend requests now receive a request ID from `x-request-id` or a generated UUID, and that ID is returned in the `x-request-id` response header.
- Backend request logging emits structured JSON with request ID, method, path, status code, duration, and content length so production logs can be filtered by a single failing request.
- Backend errors now flow through centralized Express error middleware. Client-safe errors return `{ error, requestId }`, while unexpected 500-level failures are logged with the same request ID for correlation.

### Performance Decisions and Tradeoffs

- The backend keeps logging intentionally lightweight with `console.info(JSON.stringify(...))`. This avoids adding a logging transport dependency for the assessment, but in production I would route these logs through a platform collector or a library such as Pino for async transports, redaction, and log levels.
- Request IDs are assigned before JSON parsing and route handling so every downstream response, including validation errors, can be traced. The tradeoff is a tiny per-request UUID/header cost, which is worth the observability gain.
- The frontend keeps React Query as the server-state layer so action-center data is cached by selected student and invalidated only after task updates. This avoids broad refetching while keeping mutation behavior simple.
- The mock data service remains in memory for speed and assessment clarity. A production database version should add indexing around student/task lookups because the current array scans are fine for fixture data but would not scale for large districts.
- Vite production builds retain sourcemaps for debuggability. That helps post-deploy issue triage, but a production deployment should decide whether sourcemaps are public, private, or uploaded only to an error-tracking service.

### Test Output / CI Run Log

Local verification run on June 1, 2026:

```text
backend npm test
✔ student action center API (11.617833ms)
ℹ tests 1
ℹ pass 1
ℹ fail 0



backend npm run build
tsc
exit code 0
```
### Test Output / Screenshot backend

<img width="909" height="398" alt="Screenshot 2026-06-01 at 2 09 05 PM" src="https://github.com/user-attachments/assets/7319be35-1360-45e1-a501-7bedafa617b5" />

```text
frontend npm test
✓ src/components/TaskList.test.tsx (1 test) 38ms
Test Files 1 passed (1)
Tests 1 passed (1)



frontend npm run build
✓ 151 modules transformed.
✓ built in 805ms
```
### Test Output / Screenshot frontend
<img width="890" height="385" alt="Screenshot 2026-06-01 at 2 10 23 PM" src="https://github.com/user-attachments/assets/992a7a8b-f0dd-4588-bff7-75aef7e0df50" />


Repository remote:

```text
https://github.com/dev-engineer-ammar/Counselor-Action-Center.git
```

