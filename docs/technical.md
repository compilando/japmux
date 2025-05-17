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
*   **Next.js Config:** `next.config.ts`.
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

This technical documentation should be expanded as new complex features are added or significant technical decisions are made. 