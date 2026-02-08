# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

- **Email**: [INSERT SECURITY EMAIL]
- **GitHub Security Advisory**: Use the "Report a vulnerability" button on the Security tab of this repository

### What to Include

When reporting a vulnerability, please include:

- Type of vulnerability (e.g., XSS, CSRF, SQL injection, etc.)
- Full paths of source file(s) related to the vulnerability
- Location of the affected code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity and complexity

### Severity Levels

We use CVSS v3.0 to assess severity:

- **Critical (9.0-10.0)**: Immediate fix required
- **High (7.0-8.9)**: Fix within 7 days
- **Medium (4.0-6.9)**: Fix within 30 days
- **Low (0.1-3.9)**: Fix in next release

### Security Best Practices

When using MoltyDEX:

1. **Never share private keys**: Private keys should never be sent to the API
2. **Use HTTPS**: Always use HTTPS endpoints in production
3. **Validate inputs**: Validate all inputs on the client side
4. **Keep dependencies updated**: Regularly update dependencies
5. **Monitor for suspicious activity**: Check your wallet transactions regularly

### Security Features

MoltyDEX implements the following security measures:

- ✅ Client-side transaction signing (private keys never leave your system)
- ✅ Rate limiting to prevent abuse
- ✅ Input validation on all endpoints
- ✅ CORS protection
- ✅ HTTPS enforcement
- ✅ Secure error handling (no sensitive data leakage)

### Known Security Considerations

- **Private Keys**: Never send private keys to the API. All signing happens client-side.
- **Rate Limiting**: API endpoints are rate-limited to prevent abuse.
- **Transaction Signing**: Transactions are built server-side but signed client-side for security.

### Disclosure Policy

- We will acknowledge receipt of your vulnerability report
- We will provide an estimated timeline for addressing the vulnerability
- We will notify you when the vulnerability has been fixed
- We will credit you in the security advisory (if you wish)

### Hall of Fame

We maintain a security hall of fame to recognize security researchers who help improve MoltyDEX's security.

### Questions?

If you have questions about our security policy, please open a GitHub Discussion or contact us directly.
