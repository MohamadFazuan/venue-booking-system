# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅        |

## Reporting a Vulnerability

Email **fazuan.work@gmail.com** with subject line `[SECURITY] venue-booking-system`.

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

**Do not open a public GitHub issue for security vulnerabilities.**

Response time: 48 hours for acknowledgement, 7 days for a fix or mitigation plan.

---

## Security Controls in This Project

### Frontend (React SPA)

| Control | Implementation |
|---------|---------------|
| XSS prevention | React escapes all dynamic content by default; no `dangerouslySetInnerHTML` used |
| No `eval()` | ESLint rules `no-eval`, `no-implied-eval`, `no-new-func` enforced |
| Content Security Policy | Set via nginx `add_header` (restricts script/style/img origins) |
| Clickjacking protection | `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` |
| MIME sniffing | `X-Content-Type-Options: nosniff` |
| XSS filter | `X-XSS-Protection: 1; mode=block` |
| HSTS | `Strict-Transport-Security: max-age=63072000` |
| Referrer policy | `Referrer-Policy: strict-origin-when-cross-origin` |
| Permissions policy | Camera, microphone, geolocation blocked |

### Docker

| Control | Implementation |
|---------|---------------|
| Non-root user | Container runs as `appuser` (UID 1001) |
| Minimal base image | `nginx:1.27-alpine` — small attack surface |
| Multi-stage build | Build tools not present in production image |
| Resource limits | CPU 0.5 / RAM 128 MB via docker-compose |
| Health checks | `/health` endpoint, auto-restart on failure |
| No secrets in image | All secrets via environment variables at runtime |

### CI/CD

| Control | Implementation |
|---------|---------------|
| Dependency pinning | `npm ci --frozen-lockfile` in CI |
| Secret scanning | GitHub secret scanning enabled on repo |
| Container scanning | Add Trivy or Snyk as a CI step for production use |
| GHCR auth | Short-lived `GITHUB_TOKEN`, not a long-lived PAT |

### Known Limitations (in-memory demo)

- Admin credentials are hardcoded (`admin@venue.com / admin123`) — **replace with real auth before production**
- All data is in-memory — **no persistence layer, no SQL injection surface**
- No rate limiting on the booking form — **add at nginx or API layer before going live**
