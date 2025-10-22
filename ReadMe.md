# BSE 25-6 Mall Rent Management System

The Mall Rent Management System aims to streamline the process of managing rent
payments, shop details, and tenant interactions in shopping malls. The system
automates payment workflows, improves transparency, and ensures efficient rent
collection processes.

## System Features

- User Authentication (Registration/Login)
- Tenant Dashboard
- Shop Details Management
- Rent Payment System
- Admin Shop Management via Django Admin

## Tech Stack

- Frontend: React + Vite + Tailwind CSS (TypeScript)
- Backend: Django + Django REST Framework
- Version Control: Git & GitHub
- Database: PostgreSQL

## Project Structure

BSE_25_6_MALL_RENT_MANAGEMENT_SYSTEM/
├── frontend/ ← React + TypeScript + Tailwind
├── backend/ ← Django project
├── backend/venv/ ← Python virtual environment (ignored)
├── requirements.txt ← Python dependencies
├── .gitignore
└── README.md

## Getting Started

## 🔧 Local Setup Guide (For All Team Members)

Follow these steps to get the full project running on your machine for development:

### 1. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/nankya-elsa/BSE_25_6_MALL_RENT_MANAGEMENT_SYSTEM.git
cd BSE_25_6_MALL_RENT_MANAGEMENT_SYSTEM
```

### 2. Setup the Frontend (React + Vite + Tailwind)

```bash
cd frontend
npm install     # Installs React, Vite, Tailwind and other dependencies
npm run dev     # Starts the frontend dev server at http://localhost:5173
```

### 3. Setup the Backend (Django + REST Framework)

Make sure you have Python 3.x and pip installed

#### a. Create and activate a virtual environment:

````bash
cd backend
python -m venv venv
venv\Scripts\activate      # For Windows
source venv/bin/activate   # For Mac/Linux
```

#### b. Install Python dependencies:

```bash
pip install -r requirements.txt
```

## 4. PostgreSQL Database Setup

The backend uses **PostgreSQL 17.5**. Follow these steps to install, create the database, user, and give it the right permissions.

### 4.1. Install PostgreSQL

Download and install PostgreSQL from the official website:
[https://www.postgresql.org/download/](https://www.postgresql.org/download/)

During installation:
- Install **pgAdmin 4**
- Remember the password you set (you'll need it for pgAdmin)

pgAdmin provides a GUI for the PostgreSQL database.

---

### 4.2. Open pgAdmin and Connect

4.2.1. Open **pgAdmin 4** (installed with PostgreSQL)
4.2.2. On the left panel, double-click:
    - `Servers` → `PostgreSQL <version>`
    - Enter the password you chose during setup to connect

---

### 4.3. Create a New User (Role)

4.3.1. On the left, expand `Login/Group Roles`
4.3.2. Right-click → `Create` → `Login/Group Role…`
4.3.3. In the `General` tab:
    - **Role Name**: rms_user

4.3.4. In the `Definition` tab:
    - Set password as `emerge@2025`


4.3.5. In the `Privileges` tab:
    - Check only:
     -  `Can login`
     -  `Create DB`
     - `Inherit permissions`

4.3.6. Click `Save

### 4.4. Create a New Database

4.4.1. Right-click **Databases** → `Create` → `Database…`
4.4.2. In the dialog that appears:
- **Database Name**:  `mall_rent_db`
- **Owner**:  `rms_user`

4.4.3. Click `Save`

### 4.5. Grant Permissions to the New User

Now link that user (`rms_user`) to the database and grant privileges, to ensure we don't get any privileges issues in future.

4.5.1. Select your database `mall_rent_db` in the left panel
4.5.2. Click on the **"Tools"** menu → `Query Tool`
4.5.3. In the SQL editor that opens, paste and run the following:

```sql
GRANT ALL PRIVILEGES ON DATABASE mall_rent_db TO rms_user;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rms_user;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rms_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO rms_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO rms_user;
```

### 4.6 Setup database information in .env and settings.py

Create a .env file in the backend/ directory with the database credentials:
```env
SECRET_KEY=django-insecure-your-secret-key-change-this-in-production
DEBUG=True

DB_NAME=mall_rent_db
DB_USER=rms_user
DB_PASSWORD=emerge@2025
DB_HOST=localhost
DB_PORT=5432
```
for `settings.py`, You dont have to change it incase you
cloned the repo - it has the right details

4.7 Test if it worked

Run database migrations:

```bash
cd backend
python manage.py migrate
```

4.7.1. Start the backend server:

```bash
python manage.py runserver    # Runs at http://127.0.0.1:8000
```
---

If all runs without errors then this means that Django
successfully built its backend structure in PostgreSQL.

To clear off any doubts, check:
Databases → mall_rent_db → Schemas → public → Tables,
you'll see tables like:

user_accounts_user
shops_shop
shops_payment
django_migrations
django_admin_log

### 5. You're Ready to Start Developing!

Frontend runs at http://localhost:5173
Backend runs at http://127.0.0.1:8000
Django Admin at http://127.0.0.1:8000/admin

React will fetch data from Django via APIs — integration will be handled in the code using axios.
API Endpoints
Authentication

POST /api/auth/register/ - User registration
POST /api/auth/login/ - User login
POST /api/auth/logout/ - User logout
GET /api/auth/profile/ - Get user profile

Shops

GET /api/shops/user-shops/ - Get user's shops
POST /api/shops/make-payment/ - Make rent payment

## Tips for Dev Workflow

### 1. Always create a new branch when working on a feature

```bash
git checkout -b feature/your-name-feature-name
```

### 2. Pull the latest changes before pushing (advised before working to avoid working on already implemented things):

```bash
git pull origin main
```

### 3. Push your changes when done (do this frequently, don't wait for the code to pile up):
```bash
git add .
git commit -m "Descriptive commit message"
git push origin feature/your-name-feature-name
```

### 4. Avoid working on the main branch directly. Collaborate via pull requests.
Team Members
Ntulume Wilson
[Add team member names here]
````
