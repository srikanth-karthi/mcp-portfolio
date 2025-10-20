# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of the Portfolio MCP Server seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Where to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via:

- **Email**: Create an issue with the label "security" and we'll provide a secure communication channel
- **GitHub Security Advisories**: Use the "Report a vulnerability" feature in the Security tab of this repository

### What to Include

When reporting a vulnerability, please include:

1. **Type of vulnerability**: e.g., SQL injection, XSS, authentication bypass
2. **Affected component**: Which part of the system is affected
3. **Steps to reproduce**: Detailed steps to reproduce the vulnerability
4. **Potential impact**: What an attacker could achieve
5. **Suggested fix**: If you have ideas on how to fix it
6. **Proof of concept**: Code or screenshots demonstrating the issue (if applicable)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 7 days
- **Status updates**: Every 7 days until resolved
- **Fix timeline**: Depends on severity and complexity

### Disclosure Policy

- Please give us reasonable time to fix the vulnerability before public disclosure
- We will credit you in the security advisory (unless you prefer to remain anonymous)
- We will coordinate the disclosure timeline with you

## Security Best Practices

### For Users

1. **Keep dependencies updated**: Regularly update to the latest version
2. **Use official packages**: Only install from official registries (npm, PyPI, Docker Hub, GitHub Packages)
3. **Review configurations**: Ensure your Claude Desktop or MCP configuration is secure
4. **Verify images**: When using Docker, verify image signatures and use specific tags

### For Contributors

1. **Never commit secrets**: No API keys, passwords, or sensitive data
2. **Validate inputs**: Always validate and sanitize user inputs
3. **Follow secure coding practices**: Refer to OWASP guidelines
4. **Keep dependencies updated**: Regularly update dependencies
5. **Use security scanning**: Run security scanners on your code

## Known Security Considerations

### Data Handling

- This server serves portfolio data from a JSON file
- No sensitive user data is stored or processed
- All data is read-only

### Network Security

- The MCP server communicates via stdio (standard input/output)
- When using Docker, ensure proper network isolation
- Review firewall rules if exposing the service

### Docker Security

- Images are built from official base images (Node.js Alpine, Python Slim, Ubuntu)
- Multi-architecture support (AMD64, ARM64)
- Images are regularly updated via Dependabot

### Dependencies

- Automated dependency updates via Dependabot
- Regular security audits using npm/pip audit
- Minimal dependency footprint

## Security Updates

Security updates will be released as:

1. **Patch releases**: For minor security fixes
2. **GitHub Security Advisories**: For all security issues
3. **Release notes**: Documented in GitHub releases

Subscribe to repository releases to stay informed about security updates.

## Security Scanning

This project uses:

- **Dependabot**: Automated dependency updates
- **npm audit**: Node.js dependency security scanning
- **pip check**: Python dependency verification
- **Gitleaks**: Secrets detection (via .gitleaksignore configuration)

## Compliance

- **License**: MIT License
- **Open Source**: All code is publicly available
- **No data collection**: No user data is collected or transmitted

## Questions?

If you have questions about security that don't involve reporting a vulnerability, please open a regular GitHub issue with the "security" label.

## Acknowledgments

We appreciate the security research community's efforts in responsibly disclosing vulnerabilities and helping us maintain a secure project.

---

**Last updated**: 2025-01-20
