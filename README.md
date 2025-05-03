# JAPM

This project is an Prompt Manager built with Next.js and Tailwind CSS, designed to interact with a backend API to manage various application data.

## Overview

The app provides a user interface to perform CRUD (Create, Read, Update, Delete) operations on different entities managed by the backend API. It is built on:

- Next.js 15+
- React 19+
- TypeScript
- Tailwind CSS V4
- Axios (for API calls)

## Implemented Features

-   **Region Management:**
    -   View existing regions.
    -   Create new regions (specifying `languageCode`, `name`, and optional fields).
    -   Edit existing regions (except `languageCode`).
    -   Delete regions.
-   **Cultural Data Management:**
    -   View existing cultural data.
    -   Create new cultural data (specifying `id` (slug), `regionId` selected from a list, and optional fields).
    -   Edit existing cultural data (except `id` and `regionId`).
    -   Delete cultural data.
-   **Backend API Connection:** Centralized configuration of the API URL using environment variables.
-   **User Interface:** Includes reusable components like tables, modals, and forms, with dark mode support.

## Getting Started

### Prerequisites

-   Node.js 18.x or later (Node.js 20.x or later recommended)
-   An instance of the backend API running (see API section).
-   `pnpm` (or `npm`/`yarn`) as the package manager.

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    cd <directory-name>
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    # or
    # npm install
    # or
    # yarn install
    ```
    *(You might need the `--legacy-peer-deps` flag if you encounter peer dependency errors)*

### Environment Configuration

This project needs to connect to your backend API. You must specify your API URL in an environment file.

1.  Create a file named `.env.local` in the project root.
2.  Add the following line, replacing the URL with your local API's URL:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3001
    ```
    *(The `NEXT_PUBLIC_` prefix is important to expose the variable to the browser).* 

### Running the Development Server

Once dependencies are installed and `.env.local` is configured:

```bash
pnpm dev
# or
# npm run dev
# or
# yarn dev
```

This will start the development server, typically at `http://localhost:3000` (unless another port is specified with `-p`). Remember that any changes to `.env.local` require restarting the development server.

## Available Scripts

In the `package.json` file, you'll find several scripts:

-   `pnpm dev`: Starts the application in development mode.
-   `pnpm build`: Compiles the application for production.
-   `pnpm start`: Starts a production server (after `build`).
-   `pnpm lint`: Runs the linter (ESLint) to check the code.

## API Connection

The service for interacting with the API is located in `src/services/api.ts`. It uses `axios` and reads the base URL from the `NEXT_PUBLIC_API_URL` variable defined in your `.env.local` file.

Specific functions for each endpoint (e.g., `getRegions`, `createCulturalData`) are defined in this file.

## Folder Structure (Simplified)

```
.
├── public/           # Static files
├── service/          # Contains openapi.json
├── src/
│   ├── app/          # Routes and Layouts (App Router)
│   │   ├── (admin)/  # Route group for the main layout
│   │   │   ├── layout.tsx
│   │   │   ├── regions/page.tsx
│   │   │   └── cultural-data/page.tsx
│   │   └── ...
│   ├── components/   # Reusable UI components
│   │   ├── common/
│   │   ├── form/
│   │   ├── tables/
│   │   └── ui/       # (Potential base UI components)
│   ├── context/      # React Context (e.g., SidebarContext)
│   ├── icons/        # SVG icon components
│   ├── layout/       # Main Layout components (Sidebar, Header)
│   └── services/     # API communication logic (api.ts)
├── .env.local      # Environment variables (Do not commit to Git!)
├── next.config.ts    # Next.js configuration
├── package.json
├── tsconfig.json
└── README.md
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
