# Logging Strategy

## Log Levels

- **INFO**: Normal operations (login, registration, logout)
- **WARNING**: Invalid attempts (wrong password, user not found)
- **ERROR**: System errors (database failures, exceptions)

## What We Log

### User Events:

- Registration attempts (success/failure)
- Login attempts (success/failure)
- Logout events
- Profile access

### System Events:

- Health check status
- Database connection status
- Deployment verification
- API errors

### Error Events:

- Database errors
- Authentication failures
- Internal server errors

## Accessing Logs

### Render Logs:

1. Go to https://dashboard.render.com
2. Select service (backend)
3. Click "Logs" tab
4. Filter by level: INFO, WARNING, ERROR

### Log Format:

```
[LEVEL] YYYY-MM-DD HH:MM:SS module - message
```

### Example Logs:

```
[INFO] 2025-10-17 10:30:15 views - Login attempt for email: user@example.com
[INFO] 2025-10-17 10:30:15 views - Successful login for user: user@example.com
[WARNING] 2025-10-17 10:31:20 views - Failed login attempt - invalid password for: user@example.com
[ERROR] 2025-10-17 10:32:45 views - Database connection failed: timeout
```

## Monitoring Logs

**Regular checks:**

- Review ERROR logs daily
- Monitor WARNING patterns weekly
- Check INFO logs for unusual activity

**Alerts:**

- Better Uptime alerts on downtime
- Manual review of ERROR logs in Render dashboard
