# CI Testing Guide

## How to Test Your CI Pipeline

This guide shows you multiple ways to verify your CI pipeline is working correctly.

---

## ✅ Method 1: Create a Pull Request (Best Way)

### Step 1: Create Test Branch

I've already created a test branch for you: `test/ci-verification`

### Step 2: View the CI Run on GitHub

1. **Go to GitHub Actions:**

   - Visit: https://github.com/nankya-elsa/BSE_25_6_MALL_RENT_MANAGEMENT_SYSTEM/actions
   - You should see a workflow running called "CI Pipeline"

2. **Watch it in Real-Time:**

   ```
   CI Pipeline
   └── test: Verify CI pipeline functionality
       ├── backend-tests (running...)
       ├── frontend-tests (running...)
       └── code-quality (running...)
   ```

3. **Check Results:**
   - ✅ Green checkmark = All tests passed
   - ❌ Red X = Something failed
   - 🟡 Yellow dot = Currently running

### Step 3: Create a Pull Request

1. Go to: https://github.com/nankya-elsa/BSE_25_6_MALL_RENT_MANAGEMENT_SYSTEM/pulls
2. Click **"New pull request"**
3. Select:
   - Base: `main`
   - Compare: `test/ci-verification`
4. Click **"Create pull request"**

### Step 4: Observe CI on the PR

On the PR page, scroll down to see:

```
✅ All checks have passed
   • backend-tests — Passed in 2m 15s
   • frontend-tests — Passed in 1m 30s
   • code-quality — Passed in 45s

This branch has no conflicts with the base branch
```

---

## ✅ Method 2: Push to Wilson Branch

Your Wilson branch already triggers CI. Let's test it:

### Step 1: Make a Small Change

```bash
# Switch to Wilson branch
git checkout Wilson

# Make a harmless change
echo "# CI Test" >> Docs/CI_TESTING_GUIDE.md

# Commit and push
git add Docs/CI_TESTING_GUIDE.md
git commit -m "test: Add CI testing guide"
git push origin Wilson
```

### Step 2: Watch CI Run

1. Go to: https://github.com/nankya-elsa/BSE_25_6_MALL_RENT_MANAGEMENT_SYSTEM/actions
2. Click on the latest workflow run
3. Watch the progress

---

## ✅ Method 3: Check CI Workflow File

Verify the CI configuration is correct:

### Step 1: View Workflow File

```bash
cat .github/workflows/ci.yml
```

### Step 2: Check Trigger Configuration

Look for this section:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

This means CI runs when:

- You push to `main` or `develop` branches
- You create a PR targeting `main` or `develop`

---

## ✅ Method 4: Run Tests Locally (Before Pushing)

Test what CI will do, but on your local machine:

### Backend Tests:

```bash
cd backend
source ../venv/bin/activate
python manage.py test
```

**Expected Output:**

```
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
..........
----------------------------------------------------------------------
Ran 10 tests in 2.534s

OK
Destroying test database for alias 'default'...
```

### Frontend Tests:

```bash
cd frontend
npm test
```

**Expected Output:**

```
PASS src/App.test.tsx
  ✓ renders without crashing (234ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        3.456s
```

### Frontend Build Test:

```bash
cd frontend
npm run build
```

**Expected Output:**

```
vite v5.0.0 building for production...
✓ 234 modules transformed.
dist/index.html                   0.45 kB
dist/assets/index-a3b4c5d6.js   143.21 kB │ gzip: 45.34 kB
✓ built in 3.42s
```

---

## ✅ Method 5: Test CI Failure (Important!)

It's important to know CI catches errors. Let's intentionally break something:

### Step 1: Create a Failing Test

```bash
git checkout -b test/failing-ci
```

Edit `backend/shops/tests.py` and add:

```python
def test_intentional_failure(self):
    """This test will fail on purpose to verify CI catches it"""
    self.assertEqual(1, 2, "Intentional failure for CI testing")
```

### Step 2: Commit and Push

```bash
git add backend/shops/tests.py
git commit -m "test: Add intentionally failing test"
git push -u origin test/failing-ci
```

### Step 3: Observe CI Failure

1. Go to GitHub Actions
2. See the workflow fail ❌
3. Click on it to see the error:

```
FAIL: test_intentional_failure (shops.tests.ShopTestCase)
AssertionError: 1 != 2 : Intentional failure for CI testing
```

### Step 4: Fix and Verify

Remove the failing test, commit, push again:

```bash
# Remove the test
git add backend/shops/tests.py
git commit -m "test: Remove failing test"
git push
```

Watch CI turn green ✅

---

## 📊 What to Look For in CI Results

### Successful Run:

```
✅ CI Pipeline
   Total time: 3m 12s

Jobs:
├── ✅ backend-tests (2m 15s)
│   ├── ✅ Checkout code
│   ├── ✅ Set up Python 3.11
│   ├── ✅ Install dependencies
│   ├── ✅ Create .env file
│   ├── ✅ Run migrations
│   ├── ✅ Run Django tests
│   └── ✅ Check for missing migrations
│
├── ✅ frontend-tests (1m 30s)
│   ├── ✅ Checkout code
│   ├── ✅ Set up Node.js
│   ├── ✅ Install dependencies
│   ├── ✅ TypeScript type check
│   ├── ✅ Run Jest tests
│   └── ✅ Build frontend
│
└── ✅ code-quality (45s)
    ├── ✅ Checkout code
    ├── ✅ Set up Python
    ├── ✅ Install flake8
    └── ✅ Run flake8
```

### Failed Run:

```
❌ CI Pipeline
   Failed after 1m 23s

Jobs:
├── ❌ backend-tests (1m 23s)
│   ├── ✅ Checkout code
│   ├── ✅ Set up Python 3.11
│   ├── ✅ Install dependencies
│   ├── ✅ Create .env file
│   ├── ✅ Run migrations
│   └── ❌ Run Django tests (FAILED)
│       Error: test_shop_creation failed
│       AssertionError: Expected 1000, got 500
│
├── ✅ frontend-tests (1m 30s)
└── ✅ code-quality (45s)
```

---

## 🔍 How to Read CI Logs

### Step 1: Click on Failed Job

Click the ❌ red X on the failed job

### Step 2: Expand the Failed Step

Click on the step that failed (e.g., "Run Django tests")

### Step 3: Read the Error

```
Run python manage.py test
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
F.........
======================================================================
FAIL: test_shop_creation (shops.tests.ShopTestCase)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/home/runner/work/.../shops/tests.py", line 15, in test_shop_creation
    self.assertEqual(shop.rent_amount, 1000)
AssertionError: 500 != 1000

----------------------------------------------------------------------
Ran 10 tests in 2.534s

FAILED (failures=1)
Error: Process completed with exit code 1.
```

### Step 4: Fix the Issue

The error tells you:

- **What failed:** `test_shop_creation`
- **Where:** `shops/tests.py`, line 15
- **Why:** Expected 1000, got 500

Fix your code and push again.

---

## 🎯 Quick CI Status Check Commands

### Check GitHub from Terminal:

```bash
# View recent workflow runs
gh run list

# View specific run details
gh run view <run-id>

# Watch a run in real-time
gh run watch
```

_(Requires GitHub CLI: `brew install gh`)_

### Check CI Status in Git:

```bash
# See commit status
git log --oneline --decorate -5

# Check remote branch status
git ls-remote --heads origin
```

---

## 📈 CI Performance Tips

### What Makes CI Faster:

✅ **Caching** - Dependencies cached between runs  
✅ **Parallel Jobs** - Backend and frontend run simultaneously  
✅ **Minimal Tests** - Only test what's necessary  
✅ **Fast Database** - Using PostgreSQL in memory

### What Makes CI Slower:

❌ **No Caching** - Re-downloading packages every time  
❌ **Sequential Jobs** - Running jobs one after another  
❌ **Too Many Tests** - Testing everything on every commit  
❌ **External API Calls** - Waiting for third-party services

---

## 🚨 Common Issues and Solutions

### Issue 1: CI Never Runs

**Symptoms:** Push code, but no CI workflow appears

**Causes:**

- Workflow file syntax error
- Wrong branch name in trigger
- GitHub Actions disabled for repo

**Solutions:**

```bash
# Check workflow syntax
cat .github/workflows/ci.yml

# Verify you're on correct branch
git branch --show-current

# Check GitHub Actions is enabled
# Go to: Settings → Actions → General
```

### Issue 2: CI Stuck on "Queued"

**Symptoms:** Workflow shows yellow dot forever

**Causes:**

- GitHub Actions quota exceeded
- GitHub service issues
- Too many workflows running

**Solutions:**

- Check GitHub Status: https://www.githubstatus.com/
- Wait a few minutes
- Cancel old workflows

### Issue 3: Tests Pass Locally, Fail in CI

**Symptoms:** `python manage.py test` works locally but fails in CI

**Causes:**

- Different environment variables
- Different database versions
- Different Python versions
- Hardcoded paths

**Solutions:**

```bash
# Check Python version matches
python --version  # Should be 3.11+

# Check environment variables
cat backend/.env

# Run with same settings as CI
DEBUG=True POSTGRES_DB=test_db python manage.py test
```

---

## ✅ Verification Checklist

After setting up CI, verify these:

- [ ] Push to `main` triggers CI
- [ ] Push to `develop` triggers CI
- [ ] Creating PR triggers CI
- [ ] Backend tests run successfully
- [ ] Frontend tests run successfully
- [ ] Code quality checks run
- [ ] Migration checks pass
- [ ] Failed tests are caught
- [ ] CI results show in PR
- [ ] CI completes in < 5 minutes

---

## 🎓 Next Steps After Testing

Once CI is verified:

1. **Add More Tests**

   - Write unit tests for new features
   - Add integration tests
   - Increase test coverage

2. **Set Up Notifications**

   - Email alerts on failures
   - Slack notifications
   - Status badges in README

3. **Optimize Performance**

   - Enable more caching
   - Reduce test data
   - Parallelize more jobs

4. **Add Deployment**
   - Auto-deploy to staging
   - Manual approve for production
   - Rollback capability

---

## 📚 Resources

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Your CI Workflow:** `.github/workflows/ci.yml`
- **CI Guide:** `Docs/CI_CD_GUIDE.md`
- **Quick Start:** `Docs/CI_QUICK_START.md`

---

## 🎉 You're All Set!

Your CI is configured and tested. Now every push will automatically:

- ✅ Run all tests
- ✅ Check code quality
- ✅ Validate migrations
- ✅ Build the application
- ✅ Report results

**Keep pushing code and let CI keep you safe!** 🛡️
