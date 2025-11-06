# CI Phases - Detailed Explanation

## Understanding CI: The Complete Picture

Think of CI like an **automated quality control factory** for your code.

---

## The Big Picture

```
Your Code → GitHub → CI Robot → Tests → Build → Report
```

Every time you push code:

1. GitHub notices the change
2. Wakes up the CI "robot"
3. Robot creates a fresh, clean environment
4. Installs everything needed
5. Runs all your tests
6. Tells you if something broke

---

## Phase-by-Phase Breakdown

### **Phase 1: Trigger Detection** (Instant)

**What happens:**

- You run `git push`
- GitHub receives your code
- Checks `.github/workflows/` for CI files
- Finds `ci.yml` or `ci-cd.yml`
- Reads the `on:` section to see if it should run

**Example triggers:**

```yaml
on:
  push:
    branches: [main, develop] # Runs when you push to these branches
  pull_request:
    branches: [main] # Runs when you create a PR to main
```

---

### **Phase 2: Environment Provisioning** (~30 seconds)

**What happens:**

- GitHub spins up a fresh Ubuntu Linux virtual machine
- This is a completely clean environment (no old files, no cached data)
- It's like getting a brand new computer every time

**Why it matters:**

- Ensures tests run in a clean state
- No "it works on my machine" problems
- Everyone gets the same results

---

### **Phase 3: Code Checkout** (~5 seconds)

**What happens:**

```yaml
- name: Checkout code
  uses: actions/checkout@v4
```

**Translation:**

- Downloads your code from GitHub to the VM
- Gets the exact commit you just pushed
- Now the CI robot has access to all your files

---

### **Phase 4: Backend Setup** (~45 seconds)

#### Step 4.1: Start PostgreSQL Database

```yaml
services:
  postgres:
    image: postgres:17.5
```

**What happens:**

- Starts a PostgreSQL database in a Docker container
- Creates the test database
- Waits until it's healthy and ready

#### Step 4.2: Install Python

```yaml
- name: Set up Python 3.11
  uses: actions/setup-python@v5
```

**What happens:**

- Installs Python 3.11
- Sets it as the default Python version
- Configures pip (package manager)

#### Step 4.3: Install Dependencies

```yaml
- name: Install Python dependencies
  run: pip install -r requirements.txt
```

**What happens:**

- Reads `backend/requirements.txt`
- Installs: Django, DRF, psycopg2, etc.
- Same versions you have locally

#### Step 4.4: Create Environment Variables

```yaml
- name: Create .env file
  run: |
    echo "POSTGRES_DB=mall_rent_db_test" > .env
    echo "POSTGRES_PASSWORD=emerge@2025" >> .env
```

**What happens:**

- Creates a `.env` file with test credentials
- Django will read these for database connection
- Keeps secrets secure (uses test values in CI)

---

### **Phase 5: Backend Testing** (~30-90 seconds)

#### Step 5.1: Run Migrations

```yaml
- name: Run Django migrations
  run: python manage.py migrate
```

**What happens:**

- Creates all database tables
- Applies migrations from `shops/migrations/` and `user_accounts/migrations/`
- Sets up database schema exactly like production

**Example output:**

```
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying shops.0001_initial... OK
  Applying user_accounts.0001_initial... OK
```

#### Step 5.2: Run Tests

```yaml
- name: Run Django tests
  run: python manage.py test
```

**What happens:**

- Finds all files named `tests.py` in your apps
- Runs every test function
- Reports pass/fail for each

**Example test:**

```python
# In shops/tests.py
class ShopTestCase(TestCase):
    def test_create_shop(self):
        shop = Shop.objects.create(
            name="Test Shop",
            rent_amount=1000
        )
        self.assertEqual(shop.name, "Test Shop")
```

**Output:**

```
Creating test database for alias 'default'...
System check identified no issues.
..........
----------------------------------------------------------------------
Ran 10 tests in 2.534s

OK
```

#### Step 5.3: Check Migrations

```yaml
- name: Check for missing migrations
  run: python manage.py makemigrations --check
```

**What happens:**

- Checks if you modified models but forgot to create migrations
- Fails if uncommitted migrations are detected
- Prevents deployment issues

---

### **Phase 6: Frontend Setup** (~30 seconds) - Runs in Parallel

#### Step 6.1: Install Node.js

```yaml
- name: Set up Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "20"
```

**What happens:**

- Installs Node.js version 20
- Installs npm (package manager)

#### Step 6.2: Install Dependencies

```yaml
- name: Install npm dependencies
  run: npm ci
```

**What happens:**

- Reads `frontend/package.json` and `package-lock.json`
- Installs: React, Vite, Tailwind, TypeScript, Jest, etc.
- Uses `npm ci` (faster and more reliable than `npm install`)

---

### **Phase 7: Frontend Testing** (~30-60 seconds)

#### Step 7.1: TypeScript Type Check

```yaml
- name: TypeScript type check
  run: npx tsc --noEmit
```

**What happens:**

- Checks all TypeScript files for type errors
- Doesn't generate JavaScript (--noEmit)
- Catches type mistakes before runtime

**Example errors it catches:**

```typescript
// ❌ This would fail type check
const user: User = {
  name: "John",
  age: "25", // Type error: age should be number, not string
};
```

#### Step 7.2: Run Tests

```yaml
- name: Run Jest tests
  run: npm test
```

**What happens:**

- Runs all test files (_.test.tsx, _.test.ts)
- Uses Jest testing framework
- Tests React components, utilities, etc.

**Example test:**

```typescript
// In App.test.tsx
test("renders login page", () => {
  render(<App />);
  const linkElement = screen.getByText(/Login/i);
  expect(linkElement).toBeInTheDocument();
});
```

**Output:**

```
PASS src/App.test.tsx
  ✓ renders login page (234ms)
  ✓ navigates to register (156ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

#### Step 7.3: Build Application

```yaml
- name: Build frontend
  run: npm run build
```

**What happens:**

- Vite compiles all TypeScript/React code
- Bundles it into optimized JavaScript
- Creates production-ready files in `dist/`
- Checks that production build works

**Output:**

```
vite v5.0.0 building for production...
✓ 234 modules transformed.
dist/index.html                   0.45 kB
dist/assets/index-a3b4c5d6.js   143.21 kB │ gzip: 45.34 kB
✓ built in 3.42s
```

---

### **Phase 8: Code Quality Checks** (~20 seconds) - Optional

```yaml
- name: Run flake8
  run: flake8 . --exclude=venv,migrations
```

**What happens:**

- Checks Python code style
- Finds common errors:
  - Unused imports
  - Undefined variables
  - Syntax errors
  - Code style violations

**Example issues it finds:**

```python
# ❌ Flake8 would flag this:
import os  # Unused import
x = 1;  # Unnecessary semicolon
def myFunction():  # Should be snake_case: my_function
    pass
```

---

### **Phase 9: Reporting** (~5 seconds)

**What happens:**

- CI aggregates all results
- Creates a summary report
- Updates GitHub UI

**Success Report:**

```
✅ All checks passed
   • backend-tests    — Passed in 2m 15s
   • frontend-tests   — Passed in 1m 30s
   • code-quality     — Passed in 45s

This branch is ready to merge!
```

**Failure Report:**

```
❌ Some checks failed
   • backend-tests    — Failed in 1m 23s
      - 2 tests failed in shops.tests
   • frontend-tests   — Passed in 1m 30s
   • code-quality     — Passed in 45s

Click "Details" to see what went wrong
```

---

## Timeline: First CI Run

Here's what happens in real-time on your **first push**:

```
0:00 - You push code to GitHub
0:01 - GitHub detects .github/workflows/ci.yml
0:02 - GitHub Actions starts up
0:05 - Virtual machine provisioned
0:10 - Code checked out
0:15 - Python & Node.js installed
0:30 - PostgreSQL started
0:45 - Backend dependencies installed
1:15 - Frontend dependencies installed
1:30 - Migrations run successfully
1:45 - Backend tests start
2:15 - Backend tests complete ✅
1:45 - Frontend tests start (parallel)
2:00 - TypeScript check complete ✅
2:15 - Jest tests complete ✅
2:45 - Frontend build complete ✅
3:00 - Code quality checks complete ✅
3:05 - Final report generated
3:10 - GitHub shows ✅ All checks passed!
```

**Total time: ~3 minutes** ⏱️

---

## What Happens on Subsequent Runs?

### Caching Makes It Faster

```yaml
cache: 'pip'
cache: 'npm'
```

**What it does:**

- Caches Python packages
- Caches npm modules
- Reuses them if dependencies haven't changed

**Result:**

- First run: ~3 minutes
- Subsequent runs: ~1.5 minutes (50% faster!)

---

## Understanding Test Results

### ✅ When Tests Pass

**You'll see:**

```
test_shop_creation (shops.tests.ShopTestCase) ... ok
test_payment_processing (shops.tests.PaymentTestCase) ... ok
test_user_registration (user_accounts.tests.UserTestCase) ... ok
```

**Meaning:** All functionality works as expected!

### ❌ When Tests Fail

**You'll see:**

```
test_shop_creation (shops.tests.ShopTestCase) ... FAIL
======================================================================
FAIL: test_shop_creation (shops.tests.ShopTestCase)
----------------------------------------------------------------------
AssertionError: Expected rent_amount to be 1000, got 500

Ran 3 tests in 0.123s
FAILED (failures=1)
```

**What to do:**

1. Read the error message
2. Find which test failed
3. Fix the code
4. Push again
5. CI runs automatically

---

## Real-World Example

### Scenario: You Add a New Feature

```python
# You add this to shops/models.py
class Shop(models.Model):
    # ... existing fields ...
    discount_percentage = models.IntegerField(default=0)  # NEW!
```

**What CI does:**

1. ✅ **Phase 1:** Detects your push
2. ✅ **Phase 2:** Sets up environment
3. ❌ **Phase 3:** Runs migrations - **FAILS!**

**Error:**

```
django.db.migrations.exceptions.InconsistentMigrationHistory:
You have changes in your models that aren't in migrations.
Run 'python manage.py makemigrations' to fix this.
```

**You fix it:**

```bash
python manage.py makemigrations
git add shops/migrations/0002_shop_discount_percentage.py
git commit -m "Add migration for discount field"
git push
```

**CI runs again:**

1. ✅ Detects your new push
2. ✅ Sets up environment
3. ✅ Runs migrations - **SUCCESS!**
4. ✅ All tests pass
5. ✅ Ready to merge!

---

## Summary: Why Each Phase Matters

| Phase                    | Purpose                 | Impact if Skipped         |
| ------------------------ | ----------------------- | ------------------------- |
| **Environment Setup**    | Clean slate every time  | Inconsistent test results |
| **Code Checkout**        | Get latest code         | Testing wrong version     |
| **Install Dependencies** | Required packages       | Import errors             |
| **Database Setup**       | Test data persistence   | Database errors           |
| **Run Migrations**       | Database schema         | Model/DB mismatch         |
| **Run Tests**            | Verify functionality    | Bugs reach production     |
| **Type Check**           | Catch TypeScript errors | Runtime crashes           |
| **Build**                | Ensure production works | Broken deployments        |
| **Code Quality**         | Maintain standards      | Technical debt            |

---

## Best Practices for Fast CI

### ✅ DO:

- Write fast, focused tests
- Use database fixtures instead of creating lots of data
- Mock external API calls
- Keep dependencies up to date

### ❌ DON'T:

- Test external services (slow and unreliable)
- Create thousands of database records
- Run integration tests in every PR
- Add unnecessary dependencies

---

## Troubleshooting Common Issues

### Issue 1: CI is Slow

**Solution:**

- Enable caching
- Reduce test data
- Run integration tests separately

### Issue 2: Tests Pass Locally, Fail in CI

**Solution:**

- Check environment variables
- Verify database versions match
- Check for hardcoded paths

### Issue 3: Flaky Tests (Sometimes Pass, Sometimes Fail)

**Solution:**

- Avoid time-dependent tests
- Don't rely on specific ordering
- Use fixtures for consistent data

---

## Next Steps

1. ✅ **Understand phases** (you just did!)
2. 📝 **Write more tests** (make CI valuable)
3. 🔍 **Monitor CI runs** (learn from failures)
4. 🚀 **Add deployment** (complete CI/CD)

Your CI is ready! Push some code and watch it work! 🎉
