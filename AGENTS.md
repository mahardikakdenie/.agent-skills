# AI Agent Guidance - Project Patterns & Standards

This document outlines the architectural patterns, coding standards, and project structure that **MUST** be followed by all AI agents working on this repository to ensure consistency and maintainability.

## 1. Project Structure & Architecture

The project uses Next.js (App Router) but separates routing from business logic and presentation using a **View Pattern**.

### Key Directories
- **`src/app`**: Contains **ONLY** the routing logic and page definitions.
    - Files here (e.g., `page.tsx`) should be minimal.
    - **Pattern**: A `page.tsx` should typicaly import and render a corresponding View component.
    - **Example**: `src/app/dashboard/page.tsx` -> renders `<DashboardView />`.
- **`src/views`**: Contains the actual page logic and UI assembly.
    - This is where `useEffect`, state management for the page, and layout composition happen.
    - **Example**: `src/views/dashboard/dashboard.view.tsx`.
- **`src/components`**: Reusable UI components.
    - Atomic components used across multiple Views.
- **`src/services`**: API interaction layer.
    - Contains service files (e.g., `auth.service.ts`) that wrap Axios calls.
    - **Pattern**: Use named exports or singleton objects for services.
- **`src/context`**: React Context providers.
    - Global state management (Auth, Screen, etc.).
- **`src/config`**: Configuration files.
    - Environment variable mapping and static config.

## 2. Naming Conventions

### Files
- **Kebab-case**: All files should use kebab-case.
    - Correct: `microsoft-login-button.tsx`, `auth.service.ts`, `home.view.tsx`.
    - Incorrect: `MicrosoftLoginButton.tsx`, `AuthService.ts`, `HomeView.tsx`.
- **Extensions**:
    - `.tsx` for React components.
    - `.ts` for logic/services/utils.

### Components
- **PascalCase**: Component functions and class names.
    - Example: `export const MicrosoftLoginButton = () => { ... }`

## 3. Coding Standards

### Imports
- **Absolute Imports**: Always use the `@/` alias for imports.
    - Correct: `import { useAuth } from "@/context/auth.context";`
    - Incorrect: `import { useAuth } from "../../context/auth.context";`

### State Management
- Use `useState` and `useEffect` within Views or Components.
- Use `useContext` for global state (Auth, Theme, etc.).

### Environmental Variables
- Access via `process.env`.
- **Pattern**: Mapped in `src/config` files where possible, rather than raw usage in components.

### Authentication (Entra ID)
- This project implements a **manual PKCE flow** for Microsoft Entra ID.
- **Do NOT** introduce `@azure/msal-browser` or similar heavy libraries unless explicitly requested and approved.
- Logic resides in `microsoft-login-button.tsx` (request) and `msal-callback.view.tsx` (response).

## 4. "Do's and Don'ts" for Agents

- **DO** read existing files in a directory before creating a new one to match the pattern.
- **DO** keep Logic in `src/views`, not `src/app`.
- **DO NOT** leave `console.log` statements in production code. Use them for debugging, then remove them.
- **DO NOT** create unnecessary subdirectories if a flat structure suffices (check depth).
- **DO NOT** introduce new heavy dependencies if a lightweight implementation works (e.g., manual OAuth vs MSAL).

---
*Created by Antigravity Agent*
