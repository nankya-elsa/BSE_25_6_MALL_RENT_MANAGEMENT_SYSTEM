Backend (Django) and Frontend (Vite + React) build instructions

This document lists the local and CI build steps used by the project.

Prerequisites

- Python 3.10+ (3.11 recommended)
- Node.js 18+ and npm
- PostgreSQL (for backend integration tests/local run)

Backend (Django) and Frontend (Vite + React) build instructions

This document lists the local and CI build steps used by the project.

Prerequisites

- Python 3.10+ (3.11 recommended)
- Node.js 18+ and npm
- PostgreSQL (for backend integration tests/local run)

Local: Frontend

1. Install node packages
   cd frontend
   npm ci

2. Start dev server
   npm run dev

3. Build for production
   npm run build

Local: Backend (Django) quickstart

1. Create and activate a virtual environment
   python -m venv venv
   source venv/bin/activate

2. Install Python dependencies
   pip install --upgrade pip
   pip install -r backend/requirements.txt

3. Configure local database

   - Ensure PostgreSQL is running locally and create a database/user (or adjust `backend/settings.py` to use your DB credentials).

4. Run migrations and start the dev server
   source venv/bin/activate
   python backend/manage.py migrate
   python backend/manage.py runserver

CI Overview

- The repository includes CI workflows for GitHub Actions, GitLab CI, and CircleCI.
- CI jobs perform these tasks:
  - Install backend Python deps and run Django tests
  - Install frontend Node deps and run lint/build
  - (Optional) Run migrations against a test database (Postgres service in CI)

Notes

- Do not store production secrets in CI files. Use encrypted secrets/variables exposed by your CI provider.
- If you enable the custom `User` model in `user_accounts.models`, ensure `AUTH_USER_MODEL = 'user_accounts.User'` is set in `backend/settings.py`.

How to add CI secrets/variables

GitHub Actions:

- Repository Settings → Secrets → Actions → New repository secret
- Add `DB_NAME`, `DB_USER`, `DB_PASSWORD`

GitLab CI/CD:

- Project → Settings → CI/CD → Variables → Add variable
- Add `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`

CircleCI:

- Project Settings → Environment Variables → Add Environment Variable
- Add `DB_NAME`, `DB_USER`, `DB_PASSWORD`
