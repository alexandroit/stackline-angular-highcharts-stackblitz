# Security Policy

## Supported playground

The Angular 22 directory is the maintained playground. Its checked-in lockfile
must pass a zero-finding `npm audit`, and CI builds it on a currently supported
Node.js release.

Angular 9 through Angular 21 are executable compatibility snapshots. Their
framework and build-tool majors are end of life and contain known advisories
that cannot be removed without changing the compatibility target. They are not
production templates, are not deployed services, and must not expose their
development servers to untrusted networks.

Dependency alerts tied exclusively to those historical majors may be dismissed
as tolerable risk after confirming that the maintained Angular 22 graph is
clean. A dismissal does not mean the affected dependency was fixed.

## Reporting a vulnerability

Report suspected vulnerabilities privately through
[GitHub Security Advisories](https://github.com/alexandroit/stackline-angular-highcharts-stackblitz/security/advisories/new).
Do not disclose exploit details in a public issue.

Include the affected Angular directory, Node.js version, a minimal synthetic
reproduction, realistic impact, and any known mitigation.
