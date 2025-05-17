# Architecture Overview

This document outlines the high-level architecture of the JAPM (Just Another Prompt Manager) application.

## 1. Core Philosophy

The system is designed to be a comprehensive platform for managing and engineering prompts, facilitating versioning, collaboration (implicitly through projects), and interaction with AI models. It aims to provide a structured environment for prompt development and lifecycle management.

## 2. System Components

The architecture can be broadly divided into two main components:

*   **Frontend Application (Client-Side)**
*   **Backend Services (Server-Side)**

### 2.1. Frontend Application

*   **Framework:** [Next.js](https://nextjs.org/) (React framework)
*   **Language:** TypeScript
*   **UI Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **State Management:** React Context API (for global states like Auth, Project, Theme, Sidebar, Notifications). Local component state for UI-specific needs.
*   **Routing:** Next.js App Router (evident from `src/app` structure with route groups like `(admin)`).
*   **API Interaction:** Axios, with a generated API client (via `openapi-generator-cli` from an OpenAPI specification) for type-safe communication with the backend. Found in `src/services/api.ts` and `src/services/generated/`.

**Key Frontend Modules/Features:**

*   **Dashboard/Control Center:** Main landing page for admin users.
*   **Project Management:** CRUD operations for projects.
*   **Prompt Management:**
    *   CRUD operations for prompts within projects.
    *   **Versioning:** Creating and managing different versions of a prompt.
    *   **Asset Management:** Defining and managing dynamic variables (assets) associated with prompts.
    *   **Translations:** Managing translations for prompts and assets.
*   **Prompt Wizard:** An AI-assisted tool to help users structure and generate prompts from plain text descriptions. It also allows loading existing JSON structures.
*   **AI Model Management:** Configuration and management of AI models (inferred from `src/app/(admin)/ai-models/`).
*   **User Management:** Managing user profiles and potentially roles/permissions.
*   **Marketplace (Inferred/Potential):** UI elements and service methods (`requestPublish`, `unpublish` in `promptVersionService`) suggest a feature for publishing prompts.
*   **Authentication:** Handling user login, registration, and session management.
*   **Other Admin Sections:** Management of Tags, Environments, Cultural Data, Regions.

### 2.2. Backend Services (Inferred)

While the backend codebase is not directly visible, its nature can be inferred from the frontend's interactions and project structure:

*   **API Type:** RESTful API, as an OpenAPI specification (`service/openapi.json`) is used to generate the frontend client.
*   **Likely Technology Stack:** Could be Node.js (with frameworks like Express.js, NestJS), Python (Django, Flask), or any other modern backend technology capable of exposing a REST API.
*   **Database:** Prisma ORM is present in the frontend project (`prisma/` directory, though its usage context in the frontend is not fully clear, it often implies a Prisma-compatible database like PostgreSQL, MySQL, SQLite). The backend would be responsible for the primary database interactions.
*   **Authentication:** Token-based authentication (likely JWT, as Bearer tokens are used in `apiClient` interceptors).
*   **Core Responsibilities:**
    *   Business logic for all features (Projects, Prompts, Versions, Assets, Translations, Users, AI Models, etc.).
    *   Database operations (CRUD).
    *   User authentication and authorization.
    *   Interaction with underlying AI models or services for features like the Prompt Wizard's generation capability.
    *   Managing the marketplace lifecycle for prompts.

## 3. Data Flow and Interactions

*   The Next.js frontend makes asynchronous API calls to the backend REST API endpoints using the generated Axios client.
*   Data is exchanged primarily in JSON format. Data Transfer Objects (DTOs) defined in the OpenAPI spec and used by the generated client ensure a contract between frontend and backend.
*   User authentication is handled via tokens, which are stored in `localStorage` or `sessionStorage` and attached to API requests.
*   Global state (e.g., selected project, user profile) is managed using React Context, making it available to relevant components.

## 4. Key Architectural Decisions

*   **Monorepo/Polyrepo:** The current view is of the frontend repository. The backend is likely a separate service/repository.
*   **Client-Side Rendering (CSR) / Server-Side Rendering (SSR) / Static Site Generation (SSG):** As a Next.js application, it can leverage all these rendering strategies. Admin dashboards are typically CSR or SSR. `"use client";` directives indicate client components.
*   **API-Driven Design:** The use of an OpenAPI specification and a generated client emphasizes an API-first or API-driven approach to development, promoting a clear separation of concerns between frontend and backend.
*   **Component-Based UI:** Standard React practice, with components organized by feature/type in `src/components/`.
*   **Type Safety:** TypeScript is used across the frontend, including for API interactions, enhancing code quality and maintainability.

## 5. Scalability and Maintainability

*   **Scalability:**
    *   The backend API can be scaled independently of the frontend.
    *   Next.js offers various deployment options suitable for scaling (e.g., Vercel, AWS Amplify, Docker).
*   **Maintainability:**
    *   TypeScript improves code readability and reduces runtime errors.
    *   The generated API client reduces boilerplate and ensures consistency with the API.
    *   A clear project structure and component-based architecture aid in maintainability.
    *   The OpenAPI specification serves as living documentation for the API.

This overview provides a foundational understanding of the JAPM application's architecture. More detailed designs for specific components or services would reside in further technical documentation. 