# Tasks Plan - JAPM Project

This document outlines the planned tasks and future development roadmap for the JAPM project. It is derived from the current project status, identified needs, and long-term goals.

## I. Immediate Tasks (Next 1-2 Sprints)

These tasks are of high priority and should be addressed in the short term.

1.  **Critical: Synchronize API Client with Backend (DTOs)**
    *   **Description:** The `CreatePromptVersionDto` and potentially other DTOs in the generated API client (`generated/japmux-api/`) are out of sync with the backend API, notably missing the `versionTag` field for prompt version creation. This is currently patched with an `as any` cast.
    *   **Action:** Review and update the OpenAPI specification (`service/openapi.json`) to accurately reflect all backend API contracts, especially for create/update payloads.
    *   **Sub-task:** Regenerate the TypeScript-Axios API client using `npm run generate:api` after updating the OpenAPI spec.
    *   **Sub-task:** Remove the temporary `as any` casts in the codebase (e.g., in `src/app/(admin)/projects/[projectId]/prompts/[promptId]/versions/page.tsx`) and ensure type safety.
    *   **Impact:** Critical for data integrity, developer experience, and preventing runtime errors.

2.  **UI/UX Refinements & Consistency**
    *   **Description:** Continue to apply successful UI/UX patterns across the application.
    *   **Sub-task:** Review existing modals and forms. Consider replacing more modals with inline, two-column forms where appropriate (e.g., for editing prompt metadata, asset details), similar to the new prompt version form.
    *   **Sub-task:** Ensure consistent use of visual cues, hover effects, and clickable areas (like full-card links) across all tables and interactive elements.
    *   **Sub-task:** Evaluate the "Prompt Assets" table and its versioning display. Consider if the Git-like timeline used for prompt versions would be beneficial here, or if the current card layout is optimal after review.
    *   **Impact:** Improved usability and a more polished user experience.

3.  **Documentation - Review and Augment**
    *   **Description:** Ensure all generated documentation (`docs/*.md`, `tasks/*.md`) is accurate, comprehensive, and provides value.
    *   **Sub-task:** Review the content of `architecture.md`, `product_requirement_docs.md`, `technical.md`, `active_context.md`, and this `tasks_plan.md` for any gaps or necessary updates.
    *   **Sub-task:** Establish a process for keeping these documents up-to-date as the project evolves.
    *   **Impact:** Better onboarding for new team members, clearer project understanding for all stakeholders.

## II. Medium-Term Goals (Next 1-3 Months)

These tasks build upon the immediate priorities and focus on feature enhancements and robustness.

1.  **Comprehensive Prompt Asset Versioning UI**
    *   **Description:** If not addressed in immediate UI/UX refinements, fully implement a robust and intuitive UI for managing prompt asset versions. This should mirror the clarity and functionality of the prompt versioning UI.
    *   **Considerations:** Git-like history, side-by-side comparison when creating new asset versions, clear display of asset value changes.
    *   **Impact:** Completes a core feature set for prompt management.

2.  **Refine Prompt Wizard Functionality**
    *   **Description:** Gather user feedback (if possible) on the Prompt Wizard (`src/app/(admin)/prompt-wizard/page.tsx`) and identify areas for improvement.
    *   **Sub-task:** Enhance error handling and feedback during the structure generation and loading process.
    *   **Sub-task:** Explore options for more sophisticated AI-driven suggestions or validation within the wizard.
    *   **Impact:** Increased utility of a key feature designed to streamline prompt creation.

3.  **Translation Management Enhancements**
    *   **Description:** Improve the workflow for managing translations of prompts and assets.
    *   **Sub-task:** Evaluate the need for bulk translation import/export.
    *   **Sub-task:** Consider UI improvements for easier navigation between different languages and versions when translating.
    *   **Impact:** Better support for multilingual prompt management.

4.  **Role-Based Access Control (RBAC) - Initial Exploration**
    *   **Description:** Based on `FR7.4` in the PRD, begin exploring the requirements and design for RBAC.
    *   **Sub-task:** Define basic user roles (e.g., Admin, Editor, Viewer) and map them to application features/permissions.
    *   **Sub-task:** Investigate backend and frontend implementation strategies.
    *   **Impact:** Enhanced security and better control over project access (foundational for collaborative features).

5.  **Testing Strategy - Implementation**
    *   **Description:** Define and start implementing a testing strategy (unit, integration, E2E).
    *   **Sub-task:** Identify critical components and user flows for initial test coverage.
    *   **Impact:** Improved code quality, stability, and reduced regressions.

## III. Long-Term Vision & Potential Features (Beyond 3 Months)

These are larger initiatives that align with the product's overall goals.

1.  **Marketplace Feature Development**
    *   **Description:** Fully implement the prompt marketplace functionality (inferred from UI elements and service methods like `requestPublish`).
    *   **Sub-tasks:** Design approval workflows, search/discovery mechanisms for published prompts, and user interfaces for browsing and using marketplace prompts.
    *   **Impact:** Enables prompt sharing and discovery, potentially a core value proposition.

2.  **Direct AI Model Interaction & Testing**
    *   **Description:** Allow users to select a configured AI model and test their prompts (specific versions) directly within JAPM, viewing the generated output.
    *   **Impact:** Significantly streamlines the prompt iteration and testing loop.

3.  **Advanced Collaboration Features**
    *   **Description:** Beyond basic project-level access, implement features like commenting on prompt versions, real-time collaborative editing (if feasible/needed), or assigning prompts/tasks.
    *   **Impact:** Enhanced teamwork for larger prompt engineering teams.

4.  **Analytics and Reporting**
    *   **Description:** Provide insights into prompt usage, version history, performance (if model interaction is added), etc.
    *   **Impact:** Data-driven prompt optimization and management.

5.  **Public API for Programmatic Access**
    *   **Description:** Develop and document a public API for JAPM, allowing other systems to interact with managed prompts.
    *   **Impact:** Extensibility and integration with other developer tools and workflows.

## IV. Ongoing Activities

*   **Code Refactoring and Optimization:** Continuously improve code quality, performance, and maintainability.
*   **Dependency Updates:** Regularly update dependencies to leverage new features and security patches.
*   **Bug Fixing:** Address bugs and issues as they are identified.
*   **User Feedback Collection:** Actively seek and incorporate user feedback where possible.

This task plan is a living document and will be reviewed and updated regularly based on project progress, changing priorities, and new insights. 