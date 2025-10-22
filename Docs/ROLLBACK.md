# Rollback Strategy

## How to Rollback Production Deployment

1. Go to https://dashboard.render.com
2. Click on **mall-rent-management-system-backend** (or frontend)
3. Click **"Deploys"** tab
4. Find the last working deployment
5. Click **"Rollback, on the right of the deploy"**
6. Verify rollback: `curl https://mall-rent-management-system-backend.onrender.com/health/`

## When to Rollback

- Health check fails after deployment
- Critical bugs in production
- Database connection errors
- High error rates

## Rollback Time

Average rollback time: 2-3 minutes
