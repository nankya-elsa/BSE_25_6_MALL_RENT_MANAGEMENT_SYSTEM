# Monitoring Setup

## Better Uptime Monitoring

### Monitors Configured:

1. **Production Backend Health Check**

   - URL: https://mall-rent-management-system-backend.onrender.com/health/
   - Frequency: Every 3 minutes
   - Alert on: Downtime > 1 minute

2. **Production Frontend**

   - URL: https://mall-rent-frontend.onrender.com/
   - Frequency: Every 3 minutes
   - Alert on: Downtime > 1 minute

3. **Staging Backend Health Check**

   - URL: https://mall-rent-backend-staging.onrender.com/health/
   - Frequency: Every 3 minutes
   - Alert on: Downtime > 1 minute

4. **Staging Frontend**
   - URL: https://mall-rent-frontend-staging.onrender.com/
   - Frequency: Every 3 minutes
   - Alert on: Downtime > 1 minute

### Accessing Monitoring Dashboard:

- URL: https://uptime.betterstack.com/team/t468103/monitors
- View real-time uptime status
- Check response times
- Review incident history

## Render Built-in Monitoring

Access via: https://dashboard.render.com

**Available Metrics:**

- CPU Usage
- Memory Usage
- Request Count
- Response Times
- Error Rates

**How to Access:**

1. Select service (backend/frontend)
2. Click "Metrics" tab
3. View real-time graphs

## Health Check Endpoint

**Endpoint:** `GET /health/`

**Response (Healthy):**

```json
{
  "status": "healthy",
  "timestamp": "2025-10-17T10:30:00Z",
  "database": "connected"
}
```

**Response (Unhealthy):**

```json
{
  "status": "unhealthy",
  "error": "Database connection failed",
  "timestamp": "2025-10-17T10:30:00Z"
}
```
