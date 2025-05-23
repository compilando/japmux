# Technical Documentation - JAPM

This document provides more specific technical details about the JAPM application.

## 1. Frontend Technology Stack

*   **Core Framework:** Next.js 15 (React 19)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4, PostCSS, Autoprefixer.
    *   Utility classes are primarily used, with global styles in `src/globals.css`.
    *   `clsx` and `tailwind-merge` for conditional and merging of class names.
*   **API Client:** Axios. A typed API client is generated using `openapi-generator-cli` from an OpenAPI specification located at `service/openapi.json`. The generated client resides in `generated/japmux-api` and is wrapped by services in `src/services/api.ts`.
*   **State Management:** Primarily React Context API. Key contexts include:
    *   `AuthContext`: Manages user authentication state and profile.
    *   `ProjectContext`: Manages selected project and related project data.
    *   `PromptContext`: Manages selected prompt information.
    *   `SidebarContext`: Manages sidebar state (e.g., open/closed, active items).
    *   `ThemeContext`: Manages light/dark mode.
    *   `NotificationContext`: Used by `react-hot-toast` for displaying notifications.
*   **Forms:** Standard React controlled components. UI components for forms are likely in `src/components/form/`.
*   **Linting & Formatting:** ESLint and Prettier (configurations present in the project root).
*   **Key Dependencies:** `date-fns` for date manipulation, `@heroicons/react` for icons.

## 2. Backend API (Interaction Perspective)

*   **Specification:** The frontend interacts with a backend via a REST API defined by an OpenAPI (Swagger) specification (`service/openapi.json`).
*   **Authentication:** Bearer Token (JWT) authentication. The `apiClient` in `src/services/api.ts` includes an interceptor to attach the token to outgoing requests.
*   **Data Transfer Objects (DTOs):** The generated API client provides TypeScript interfaces for DTOs used in requests and responses (e.g., `CreateProjectDto`, `PromptDto`, `CreatePromptVersionDto`, `UpdatePromptVersionDto`, etc.). The frontend often extends these DTOs with additional client-side properties (e.g., `PromptVersionData`, `PromptVersionMarketplaceDetails` in the versions page).
*   **Error Handling:** The `apiClient` includes a response interceptor for global error handling, displaying toasts for errors (except 401).
*   **Tenant Handling:** The backend automatically manages `tenantId` for all entities. **The frontend should NEVER send `tenantId` in create requests.** When creating assets, prompts, or other tenant-scoped entities, the backend infers the tenant from the authenticated user. The frontend uses custom DTOs like `CreatePromptAssetDtoFrontend` which exclude `tenantId` from the generated `CreatePromptAssetDto`.

    **Important:** The frontend services explicitly create clean payloads without `tenantId` to prevent validation errors like "tenantId should not be empty". Any `tenantId` field sent (even as `undefined` or empty string) will cause backend validation to fail.

    **Temporary Solution (Until Backend Update):** Currently, the backend still requires `tenantId` in the payload. The frontend services extract `tenantId` from the JWT token and include it in requests as a temporary workaround. Once the backend is updated to infer `tenantId` automatically from the JWT, this code should be removed.

## 3. Key Data Models & Interfaces (Frontend Perspective)

This is a non-exhaustive list based on observed usage:

*   **Project:** `CreateProjectDto`, `UpdateProjectDto` (from generated), `ProjectContext` uses these.
*   **Prompt:** `PromptDto`, `CreatePromptDto`, `UpdatePromptDto` (from generated).
*   **Prompt Version:**
    *   `CreatePromptVersionDto`, `UpdatePromptVersionDto` (from generated).
    *   `PromptVersionData` (local interface in versions page, extends `CreatePromptVersionDto` with `id`, `versionTag`, `isActive`, `promptId`).
    *   `PromptVersionMarketplaceDetails` (local interface, extends `PromptVersionData` with `marketplaceStatus`, `createdAt`).
    *   `PromptVersionDetail` (local interface in `src/services/api.ts` for `findOne` return type, includes `id`, `versionTag`, `isActive`).
*   **Prompt Asset:**
    *   `CreatePromptAssetDto`, `UpdatePromptAssetDto` (from generated).
    *   `CreatePromptAssetDtoFrontend` (custom frontend type, excludes `tenantId` from `CreatePromptAssetDto` since backend handles it automatically).
    *   `PromptAssetData` (local interface in `PromptAssetsTable.tsx`, extends `CreatePromptAssetDto` with `enabled`, `projectId`, `promptId`).
    *   `CreatePromptAssetVersionDto`, `UpdatePromptAssetVersionDto` (from generated).
*   **Translation:** `CreatePromptTranslationDto`, `UpdatePromptTranslationDto`, `CreateAssetTranslationDto`, `UpdateAssetTranslationDto` (from generated).
*   **User:** `UserProfileResponse`, `LoginDto`, `RegisterDto` (from generated).
*   **Prompt Wizard Structure (`StructureData` in `prompt-wizard/page.tsx`):**
    *   `PromptInfo { name, description }`
    *   `VersionInfo { promptText, changeMessage, assets[], translations[] }`
    *   `AssetInfo { key, value, changeMessage, translations[] }`
    *   `Translation { languageCode, promptText?, value? }`
    *   Loaded via `LoadPromptStructureDto` (defined in `src/types/prompt-structure.ts`).
*   **AI Model:** `CreateAiModelDto`, `UpdateAiModelDto`, `AiModelResponseDto` (from generated).
*   **Other Entities (from generated DTOs):** Tags (`TagDto`), Environments (`CreateEnvironmentDto`), Regions (`CreateRegionDto`), Cultural Data (`CulturalDataResponse`).

## 4. API Client Generation

*   **Tool:** `@openapitools/openapi-generator-cli` (version `^2.20.0`).
*   **Command:** `openapi-generator-cli generate -i service/openapi.json -g typescript-axios -o generated/japmux-api` (from `package.json`).
*   **Output:** TypeScript Axios client in `generated/japmux-api/`.
*   **Important Note:** Recent work highlighted a discrepancy where the `CreatePromptVersionDto` generated interface was missing `versionTag`, but the backend API expected it in the payload. This required a temporary `as any` cast. The long-term solution is to update `service/openapi.json` and regenerate the client.

## 5. UI Components and Structure

*   **General Layout:** `src/app/layout.tsx` (root layout) and `src/app/(admin)/layout.tsx` (admin section layout, likely including sidebar and header).
*   **Sidebar:** Managed by `SidebarContext` and `AppSidebar.tsx` component.
*   **Tables:** Reusable table components are found in `src/components/tables/` (e.g., `PromptVersionsTable`, `PromptAssetsTable`, `PromptsTable`). These tables often feature custom designs for displaying version history or asset details.
*   **Forms:** Components in `src/components/form/` (e.g., `PromptVersionForm`, `PromptAssetVersionForm`). These handle data input for creating and editing entities.
*   **Common Components:** `src/components/common/` likely contains shared UI elements like buttons, breadcrumbs, modals (though some modals have been refactored to inline forms).

## 6. Prompt Versioning UI

*   The UI for displaying prompt versions (e.g., `PromptVersionsTable.tsx`) has been recently updated to a Git-like vertical timeline/tree structure.
*   This includes displaying version tags, publication dates (relative time), change messages, and action buttons.
*   Expandable content for prompt text previews has been implemented.
*   Visual enhancements like hover effects and icons (e.g., GitBranchIcon) have been added.

## 7. Configuration

*   **Environment Variables:** `NEXT_PUBLIC_API_URL` is used to configure the API base URL (defaults to `/api`).
*   **Next.js Config:** `next.config.ts` - configured with `output: 'standalone'` for Docker deployment.
*   **TypeScript Config:** `tsconfig.json`.
*   **Tailwind Config:** `tailwind.config.js` (not directly inspected but assumed standard).
*   **ESLint/Prettier:** Configuration files in project root.

## 8. Build and Development Scripts

From `package.json`:
*   `dev`: Starts Next.js development server.
*   `build`: Builds the application for production.
*   `start`: Starts the Next.js production server.
*   `lint`: Runs ESLint.
*   `generate:api`: Generates the API client.
*   **Docker Scripts:**
    *   `docker:dev`: Starts development environment with Docker.
    *   `docker:build`: Builds production Docker image.
    *   `docker:run`: Runs production container.
    *   `docker:deploy`: Deploys using simple Docker script.
    *   `docker:logs`: Views Docker container logs.
    *   `docker:stop`: Stops Docker container.
    *   `docker:clean`: Cleans up Docker resources.

## 9. Simplified Docker Configuration & Deployment

The application includes a simplified Docker configuration focused on ease of use and minimal complexity:

### 9.1. Simple Architecture

*   **Single Container:** Self-contained Next.js application running on port 3000
*   **No External Dependencies:** No nginx, Redis, or Docker Compose required
*   **Direct Serving:** Next.js serves the application directly
*   **Minimal Setup:** Quick deployment with single commands

### 9.2. Production Deployment

*   **Optimized Dockerfile:** Multi-stage build for production efficiency
*   **Security Features:** Non-root user execution and minimal Alpine base
*   **Health Checks:** Built-in health monitoring at `/api/health` endpoint
*   **Environment Configuration:** Optional environment variables for API URLs

### 9.3. Development Environment

*   **Hot Reload:** Live code updates without container rebuilds
*   **Volume Mounting:** Source code mounted for real-time development
*   **Simple Setup:** Single command deployment with `./scripts/dev.sh`

### 9.4. Key Files

*   `Dockerfile`: Production-optimized build with multi-stage approach
*   `Dockerfile.dev`: Development environment with hot reload support
*   `scripts/deploy.sh`: Simple production deployment script
*   `scripts/dev.sh`: Development environment startup script
*   `.dockerignore`: Build context optimization

### 9.5. Deployment Commands

```bash
# Development
./scripts/dev.sh                    # Start development container
npm run docker:dev                  # Alternative development start

# Production  
./scripts/deploy.sh                 # Full deployment script
npm run docker:deploy               # Alternative deployment
docker build -t japmux:latest .     # Manual build
docker run -d --name japmux -p 3000:3000 japmux:latest  # Manual run
```

### 9.6. Environment Variables

Optional configuration:
*   `NEXT_PUBLIC_API_URL`: Backend API endpoint (default: http://localhost:8000)
*   `NODE_ENV`: Environment mode (development/production)
*   Standard Next.js environment variables

### 9.7. Monitoring & Health Checks

*   **Health Endpoint:** `/api/health` provides application status and metrics
*   **Docker Health Checks:** Automatic container health monitoring
*   **Simple Logging:** Direct container logs via `docker logs`
*   **Container Management:** Standard Docker commands for monitoring

### 9.8. Benefits of Simplified Approach

*   **Easy to Understand:** No complex orchestration or multiple services
*   **Quick Deployment:** Single command deployment
*   **Lightweight:** Minimal resource usage and dependencies
*   **Portable:** Runs anywhere Docker is available
*   **Debuggable:** Simple architecture makes troubleshooting easier

This technical documentation should be expanded as new complex features are added or significant technical decisions are made. 