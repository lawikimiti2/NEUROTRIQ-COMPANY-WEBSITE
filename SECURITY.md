# Security Hardening Overview

This document summarizes security measures applied and recommended actions.

## Server-side (backend)

- Helmet security headers enabled (X-Content-Type-Options, X-Frame-Options, etc.).
- CORS restricted to CLIENT_URL (configure in backend/.env).
- Rate limiting: global limiter and stricter limiter on POST /api/contact to mitigate spam and abuse.
- Admin route protection: GET /api/admin/contacts requires `Authorization: Bearer <ADMIN_TOKEN>`.
- Basic input sanitization and HTML escaping when generating email bodies.
- JSON body size limit set (100kb) and `x-powered-by` header disabled.
- SQLite operations use prepared statements to prevent SQL injection.

## Client-side (frontend)

- No secrets in frontend code; uses VITE_API_URL from environment.
- Navigation uses SPA Links to reduce server 404 on static hosts.

## Secrets and repository hygiene

- .env files and local databases are .gitignored and removed from tracking.
- If secrets were committed before, rotate them and purge history (e.g., with git filter-repo).

## Deployment recommendations

- Enforce HTTPS, HSTS (via platform or a reverse proxy).
- Configure a WAF/rate limits at the edge (e.g., Cloudflare, Vercel, Netlify functions gateway).
- Set strong `ADMIN_TOKEN` in server environment.
- Configure SMTP credentials in env only; do not log sensitive data.

## Monitoring and logging

- Monitor 4xx/5xx rates and rate limiter rejections.
- Add request logging with privacy considerations (avoid logging PII).

## Next steps (optional)

- Add captcha (hCaptcha or reCAPTCHA) to the contact form.
- Add CSRF protection if you introduce auth cookies/sessions.
- Implement admin authentication flows (JWT or session-based) if you expose more admin endpoints.
