# 🔒 Security Policy - Baby Pluto Guard

## Purpose and Scope

Baby Pluto Guard is an **educational security monitoring tool** designed for students learning cybersecurity concepts. It is **not intended for production security monitoring** or as a replacement for enterprise-grade security solutions.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

---

## Security Considerations

### What Baby Pluto Guard Is

✅ An educational tool for learning system security concepts  
✅ A local monitoring application for personal computers  
✅ A safe environment to practice security analysis  
✅ Open-source software for transparency and learning

### What Baby Pluto Guard Is NOT

❌ Enterprise security software  
❌ Antivirus or anti-malware solution  
❌ Intrusion Prevention System (IPS)  
❌ Suitable for protecting sensitive/production systems  
❌ A replacement for dedicated security tools

---

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in Baby Pluto Guard, please report it responsibly.

### How to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please email: **[YOUR_EMAIL@example.com]**

Include in your report:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)
- Your contact information

### What to Expect

1. **Acknowledgment** - We'll acknowledge receipt within 48 hours
2. **Assessment** - We'll assess the severity and validity
3. **Communication** - We'll keep you updated on progress
4. **Fix & Disclosure** - We'll work on a fix and coordinate disclosure
5. **Credit** - You'll be credited in release notes (if desired)

### Response Timeline

| Severity | Response Time | Fix Target |
|----------|--------------|------------|
| Critical | 24 hours | 7 days |
| High | 48 hours | 14 days |
| Medium | 1 week | 30 days |
| Low | 2 weeks | 60 days |

---

## Known Security Limitations

As an educational tool, Baby Pluto Guard has intentional limitations:

### 1. Local Execution Only
- Runs with user privileges
- No system-level access required (except some Linux network features)
- Cannot detect rootkits or kernel-level malware

### 2. Detection Capabilities
- **Signature-based detection:** None
- **Heuristic analysis:** Basic risk scoring only
- **Behavioral analysis:** Limited to process/network monitoring
- **Malware removal:** Not supported

### 3. Network Security
- **Packet inspection:** Not implemented
- **Traffic analysis:** Basic connection monitoring only
- **Firewall:** Not included
- **DDoS protection:** Not applicable

### 4. Data Protection
- **Encryption at rest:** Not implemented for local database
- **Encryption in transit:** Local HTTP only (no TLS for localhost)
- **Authentication:** Not required (local-only application)
- **Access control:** Based on OS user permissions

---

## Security Best Practices for Users

### Installation & Usage

✅ **DO:**
- Download only from official GitHub repository
- Verify checksums of downloads (future feature)
- Run with standard user privileges (not administrator/root)
- Use on personal learning/testing systems
- Keep Python and Node.js updated
- Review code before running (it's open source!)

❌ **DON'T:**
- Install from unofficial sources
- Use on production systems
- Grant unnecessary elevated privileges
- Expose the backend API to the internet
- Store sensitive data in the application
- Rely on it as your only security tool

### Configuration

**Backend (`backend/main.py`):**
```python
# Default configuration is safe for local use
uvicorn.run(
    app,
    host="127.0.0.1",  # Localhost only - DO NOT change to 0.0.0.0
    port=8000,
    log_level="info"
)
```

**Frontend (`.env`):**
```env
# Only connect to local backend
VITE_API_URL=http://localhost:8000  # DO NOT use external IPs
```

---

## Security Features

### Current Security Measures

1. **Input Validation**
   - Pydantic models validate all API inputs
   - SQL parameterization prevents injection
   - Path traversal protection

2. **Error Handling**
   - No sensitive information in error messages
   - Graceful degradation on permission errors
   - Logging without exposing system details

3. **Access Control**
   - Respects OS file permissions
   - No privilege escalation
   - Limited to user's accessible resources

4. **Dependencies**
   - Regular dependency updates
   - Minimal dependency footprint
   - Well-known, maintained libraries

### Planned Security Enhancements

- [ ] Code signing for releases
- [ ] Checksum verification
- [ ] HTTPS for frontend-backend communication (optional)
- [ ] Rate limiting for API endpoints
- [ ] Authentication for multi-user scenarios (future)

---

## Threat Model

### In Scope

Baby Pluto Guard protects against:
- Learning about security monitoring
- Understanding system processes and network activity
- Detecting basic anomalies in system behavior
- Educational exposure to risk analysis

### Out of Scope

Baby Pluto Guard does **NOT** protect against:
- Advanced Persistent Threats (APTs)
- Zero-day exploits
- Kernel-level malware (rootkits)
- Network-based attacks
- Social engineering
- Physical security threats

---

## Dependencies Security

### Dependency Management

**Backend (Python):**
- Regular updates via `pip install --upgrade`
- Security advisories monitored via GitHub Dependabot
- Minimal dependencies philosophy

**Frontend (JavaScript):**
- Regular updates via `npm audit fix`
- Automated security scanning
- Trusted, popular libraries only

### Known Vulnerable Dependencies

We maintain a list of known vulnerabilities in dependencies:

**Current Status:** ✅ No known vulnerabilities

**How we monitor:**
- GitHub Dependabot alerts
- `npm audit` / `pip-audit`
- Regular manual reviews

---

## Privacy Policy

### Data Collection

Baby Pluto Guard **DOES NOT**:
- Send data to external servers
- Track user behavior
- Use analytics or telemetry
- Collect personal information
- Connect to cloud services

### Data Storage

Baby Pluto Guard **DOES**:
- Store baseline snapshots locally in SQLite database
- Cache scan results temporarily in memory
- Log errors to local files (optional)

**Location:**
- Database: `backend/data/baselines.db`
- Logs: Console output only (not persisted by default)

### Data Sharing

Baby Pluto Guard **NEVER**:
- Shares your data with third parties
- Uploads scan results anywhere
- Phones home
- Requires internet connection (after installation)

---

## Compliance

### Educational Use Disclaimer

Baby Pluto Guard is provided for **educational purposes only**. 

**Users are responsible for:**
- Ensuring lawful use in their jurisdiction
- Compliance with their organization's policies
- Not using it for unauthorized system monitoring
- Respecting privacy of other users on shared systems

**NOT suitable for:**
- HIPAA-regulated environments
- PCI-DSS compliance
- SOC 2 requirements
- Any regulated production environment

---

## Security Audit

### Last Audit
- **Date:** 2025-01-15
- **Version:** 1.0.0
- **Findings:** No critical vulnerabilities
- **Status:** Educational tool - no formal audit required

### Community Security Review

We welcome security reviews from the community:
- Conduct code reviews
- Perform penetration testing (on your own systems)
- Report findings responsibly
- Suggest improvements

---

## Security Updates

### Notification Channels

Security updates will be announced via:
- GitHub Security Advisories
- Release notes (CHANGELOG.md)
- README.md updates

### Update Process

1. Security issue reported
2. Patch developed and tested
3. New version released
4. Security advisory published
5. Users notified to update

---

## Responsible Disclosure Guidelines

### For Researchers

If you're testing Baby Pluto Guard's security:

✅ **Allowed:**
- Test on your own systems
- Report findings privately
- Request CVE if appropriate
- Publish after coordinated disclosure

❌ **Not Allowed:**
- Testing on others' systems without permission
- Exploiting vulnerabilities maliciously
- Public disclosure before fix is available
- Demanding payment for disclosure

### Coordinated Disclosure Timeline

1. **Day 0:** Vulnerability reported
2. **Day 1-2:** Acknowledgment sent
3. **Day 3-14:** Assessment and fix development
4. **Day 15:** Patch released
5. **Day 30:** Public disclosure (if critical)
6. **Day 90:** Full details published (if medium/low)

---

## Legal

### License

Baby Pluto Guard is released under the MIT License. See [LICENSE](../LICENSE) for details.

### Warranty Disclaimer

Baby Pluto Guard is provided "as is" without warranty of any kind. See LICENSE for full disclaimer.

### Limitation of Liability

The authors are not liable for:
- Damages from use or inability to use
- Security breaches on systems running Baby Pluto Guard
- False positives/negatives in security scanning
- Any direct, indirect, incidental, or consequential damages

---

## Questions?

For non-security questions, please use:
- [GitHub Issues](https://github.com/YOUR_USERNAME/baby-pluto-guard/issues)
- [GitHub Discussions](https://github.com/YOUR_USERNAME/baby-pluto-guard/discussions)

For security issues, email: **[YOUR_EMAIL@example.com]**

---

**Last Updated:** January 15, 2025  
**Version:** 1.0.0

---

**Remember: Baby Pluto Guard is a learning tool. Use it to learn, not as your primary security defense!** 🐶🛡️
