# CI/CD Guide - Mall Rent Management System

## What is CI/CD?

### Continuous Integration (CI)

Automatically tests and validates your code every time you push changes to GitHub. Think of it as an automated quality checker that ensures:

- Your code builds successfully
- All tests pass
- No breaking changes are introduced
- Team members' code integrates smoothly

### Continuous Deployment (CD)

Automatically deploys your application to production when tests pass. (Not yet configured for this project)

---

## How Does CI Work for This Project?

### The Workflow

```
Developer pushes code to GitHub
         ↓
GitHub Actions triggers CI pipeline
         ↓
Creates fresh Ubuntu environment
         ↓
Runs Backend Tests (Django) in parallel with Frontend Tests (React)
         ↓
If all pass → ✅ Code is safe to merge
If any fail → ❌ Developer gets notified to fix issues
```

---

## CI Pipeline Phases

### **Backend Pipeline** (Django + PostgreSQL)

| Phase                       | What Happens                           | Why It Matters                   |
| --------------------------- | -------------------------------------- | -------------------------------- |
| 1. **Checkout**             | Downloads your code                    | Gets latest changes              |
| 2. **Setup Python**         | Installs Python 3.11                   | Ensures consistent environment   |
| 3. **Install Dependencies** | Runs `pip install -r requirements.txt` | Gets Django, DRF, psycopg2, etc. |
| 4. **Setup PostgreSQL**     | Creates test database                  | Mimics production database       |
| 5. **Create .env**          | Sets environment variables             | Database credentials for testing |
| 6. **Run Migrations**       | `python manage.py migrate`             | Creates database tables          |
| 7. **Run Tests**            | `python manage.py test`                | Executes all unit tests          |
| 8. **Check Migrations**     | Ensures no uncommitted migrations      | Prevents migration issues        |

### **Frontend Pipeline** (React + Vite + TypeScript)

| Phase                       | What Happens        | Why It Matters                   |
| --------------------------- | ------------------- | -------------------------------- |
| 1. **Checkout**             | Downloads your code | Gets latest changes              |
| 2. **Setup Node.js**        | Installs Node.js 20 | JavaScript runtime               |
| 3. **Install Dependencies** | Runs `npm ci`       | Gets React, Vite, Tailwind, etc. |
| 4. **Type Check**           | `npx tsc --noEmit`  | Catches TypeScript errors        |
| 5. **Run Tests**            | `npm test`          | Executes Jest tests              |
| 6. **Build**                | `npm run build`     | Ensures production build works   |

### **Code Quality Pipeline** (Optional)

| Phase                 | What Happens | Why It Matters           |
| --------------------- | ------------ | ------------------------ |
| 1. **Python Linting** | Runs flake8  | Checks Python code style |

---

## When Does CI Run?

The CI pipeline automatically triggers when:

1. **You push code** to `main` or `develop` branches
2. **You create a Pull Request** targeting `main` or `develop`
3. **You push updates** to an existing Pull Request

---

## How to Read CI Results

### On GitHub:

1. Go to your repository on GitHub
2. Click on **"Actions"** tab
3. You'll see a list of CI runs:
   - ✅ **Green checkmark** = All tests passed
   - ❌ **Red X** = Something failed
   - 🟡 **Yellow dot** = Currently running

### Understanding Failures:

Click on a failed run to see:

- Which job failed (backend/frontend/code-quality)
- Which specific step failed
- Error logs to help debug

---

## First Time Setup

### What You Need to Do:

**Nothing!** The CI is already configured. Just push your code to GitHub and it will run automatically.

### What GitHub Does Automatically:

1. Detects the `.github/workflows/ci.yml` file
2. Sets up the CI pipeline
3. Runs tests on every push/PR

---

## Best Practices for Your Team

### 1. **Never Push Directly to Main**

```bash
# ❌ DON'T DO THIS
git checkout main
git add .
git commit -m "changes"
git push

# ✅ DO THIS INSTEAD
git checkout -b feature/your-name-feature-name
git add .
git commit -m "descriptive message"
git push origin feature/your-name-feature-name
# Then create a Pull Request on GitHub
```

### 2. **Wait for CI Before Merging**

- Always wait for the green checkmark ✅
- Review any failures and fix them
- Never merge if tests are failing

### 3. **Write Tests for New Features**

```python
# backend: Add tests in shops/tests.py or user_accounts/tests.py
from django.test import TestCase

class ShopTestCase(TestCase):
    def test_create_shop(self):
        # Your test here
        pass
```

```typescript
// frontend: Add tests next to your components
describe("Dashboard", () => {
  it("should render correctly", () => {
    // Your test here
  });
});
```

### 4. **Keep CI Fast**

- Write focused, fast tests
- Don't test external APIs (use mocks)
- Avoid long-running tests

---

## Common CI Errors and Solutions

### Backend Errors:

| Error                              | Cause                      | Solution                        |
| ---------------------------------- | -------------------------- | ------------------------------- |
| `ImportError: No module named 'X'` | Missing dependency         | Add to `requirements.txt`       |
| `django.db.utils.OperationalError` | Database connection failed | Check `.env` settings in CI     |
| `Tests failed`                     | Code broke existing tests  | Fix the failing tests           |
| `Migration conflict`               | Uncommitted migrations     | Run `makemigrations` and commit |

### Frontend Errors:

| Error              | Cause                    | Solution                 |
| ------------------ | ------------------------ | ------------------------ |
| `Module not found` | Missing dependency       | Add to `package.json`    |
| `Type error`       | TypeScript type mismatch | Fix type definitions     |
| `Build failed`     | Syntax or import error   | Check Vite build locally |
| `Test failed`      | Component test broke     | Update or fix the test   |

---

## Local Testing (Before Pushing)

### Backend:

```bash
cd backend
source ../venv/bin/activate
python manage.py test
```

### Frontend:

```bash
cd frontend
npm test
npm run build
```

---

## Viewing CI Status in Pull Requests

When you create a PR, GitHub will show:

```
✅ All checks have passed
   • backend-tests — 2m 34s
   • frontend-tests — 1m 12s
   • code-quality — 45s

Ready to merge!
```

Or if failed:

```
❌ Some checks were not successful
   • backend-tests — Failed after 1m 23s
   • frontend-tests — Passed
   • code-quality — Passed

View details to see what went wrong
```

---

## CI Workflow File Location

The CI configuration is stored at:

```
.github/workflows/ci.yml
```

You can edit this file to:

- Add more tests
- Add deployment steps
- Change when CI runs
- Add notifications

---

## Future Enhancements

Things we can add to the CI pipeline:

1. **Code Coverage Reports** - See what % of code is tested
2. **Security Scanning** - Check for vulnerabilities
3. **Performance Tests** - Ensure app runs fast
4. **Automatic Deployment** - Deploy to staging/production
5. **Slack/Email Notifications** - Get alerts on failures
6. **Database Seeding** - Test with realistic data

---

## Questions?

- Check the **Actions** tab on GitHub for run history
- Click on failed runs to see detailed logs
- Ask team members if you're stuck
- Review Django and Jest documentation for test writing

---

## Summary

✅ **CI is now active** on your repository  
✅ **Runs automatically** on every push and PR  
✅ **Tests both backend and frontend** in parallel  
✅ **Catches issues early** before they reach production  
✅ **Improves code quality** across the team

**Remember:** Green checkmarks mean happy deployments! 🚀
