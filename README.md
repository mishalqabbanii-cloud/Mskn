# Mskn Mock Frontend

This repository hosts a mock property-management dashboard built with React, Vite, TypeScript, and Tailwind CSS. It is a self-contained front-end experience that simulates the core user flows (properties, tenants, contracts, dashboards) while backend services are under development.

## Repository

- Main repository: [https://github.com/mishalqabbanii-cloud/Mskn](https://github.com/mishalqabbanii-cloud/Mskn)
  - Ensure you are signed in to GitHub with access to the `mishalqabbanii-cloud` organization.

## Project Structure

```
frontend/
  ├── src/               # Application source code
  ├── public/            # Static assets served by Vite
  ├── dist/              # Production build output
  ├── package.json       # Frontend dependencies and scripts
  └── README.md          # Module-specific documentation
```

> The root repository intentionally contains only the `frontend` workspace to keep the Git history focused on the active mock application.

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

The development server runs on <http://localhost:5173>. All data is mock-only and stored in local React state; no external services are required.

## Available Scripts

- `npm run dev` – start the Vite dev server.
- `npm run build` – type-check with TypeScript and produce a production build in `dist/`.
- `npm run preview` – preview the production build locally.

## Testing & Quality

- TypeScript provides static type checks.
- ESLint (configured in `frontend/eslint.config.js`) ensures code quality; run `npm run lint` if added in the future.
- For production readiness, consider integrating unit tests (e.g., Vitest + React Testing Library) and end-to-end smoke tests.

## Security Considerations

This mock app runs entirely in the browser. Nonetheless, follow secure defaults:

- Do not embed secrets in the codebase; use environment variables if backend integration is introduced.
- Sanitize and validate all user input before sending it to any future API.
- When integrating uploads, whitelist file types and enforce size limits.

## Deployment

1. Build the project: `npm run build`.
2. Serve the generated `frontend/dist` directory with any static hosting solution (e.g., GitHub Pages, Netlify, Vercel, or an S3 bucket + CDN).

## Maintenance Notes

- Keep dependencies updated (`npm outdated` / `npm update`) to receive security patches.
- Review accessibility, localization, and responsiveness when adding new UI features.
- Update this README whenever the project structure or build requirements change.

## License

This project is currently unlicensed; add a LICENSE file if you intend to open-source it formally or share usage terms.

