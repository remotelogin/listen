# LISTEN

---

A lightweight, modern and super modular bot detection framework.

Listen is a framework that analyzes and stores requests from nginx and analyzes them with modular and customizable analyzers for bot detection, ddos protection and automated reporting to third parties, like abuseipdb.

Everything is implemented with low coupling, that allows for easy expanding and customizing, by simply providing your own implementation of the interface you want to change.

At the moment the technologies used are NestJS, React, Vite, and PostgreSQL.

### Features:

- Automated bot detection with custom analyzers in the backend/src/analyzers directory.
- Automated reporting to third parties.
- Logging of all requests in DB for later analysis.
- Batch processing capabilities.
- API for custom SQL queries on the stored data and meta information.

### Setup:

View the README.md files in the backend or ui directories for installation instructions.
