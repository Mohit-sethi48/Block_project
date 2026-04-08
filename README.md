# Admin Panel Project

This project contains:

- `backend/`: Node.js + Express + MySQL API
- `frontend/`: React + Vite admin panel
- `database/schema.sql`: MySQL database schema and sample admin user

## Default Admin Login

- Email: `admin@example.com`
- Password: `admin123`

## Backend Setup

1. Copy `backend/.env.example` to `backend/.env`
2. Update values if needed
3. Install packages with `npm install`
4. Start backend with `npm run dev`

Important:
If you open the site from another device, server IP, or domain, set `CORS_ORIGIN` in `backend/.env` to that frontend URL.

## Frontend Setup

1. Install packages in `frontend/` with `npm install`
2. Start frontend with `npm run dev`

## Run Frontend + Backend Together

Run this once if packages are not installed yet:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

Then start both apps together from the project root:

```bash
npm run dev
```

Frontend dev server now runs on `0.0.0.0:5173`, so you can open it with your server IP too, for example:

```bash
http://YOUR_SERVER_IP:5173
```

Useful extra commands:

```bash
npm run dev:backend
npm run dev:frontend
npm run build
```

## Database Setup

Run this from the project root:

```bash
mysql -u root -padmin < database/schema.sql
```

If backend startup fails, confirm MySQL is running on the host and that `backend/.env` matches your real database credentials.
