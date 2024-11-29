<!-- PROJECT LOGO -->
<br />
<div align="center">

![Logo](/Images/banner2.svg)

  <p align="center">
    notki is a  tool for viewing your notes in a better way.
    </br>
    </br>
    <a href="https://notki-app.netlify.app/"><strong>Visit the web app</strong></a>
    ·
    <a href="https://github.com/Seryjnyy/notki/releases"><strong>Download the desktop app</strong></a>
    <br />
    <a href="https://github.com/Seryjnyy/notki/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=">Report Bug</a>
    ·
    <a href="https://github.com/Seryjnyy/notki/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<!-- <details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About</a>
    </li>
    <li><a href="#built-with">Built with</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#status">Status</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#locally">Locally</a>
          <ul>
            <li><a href="#for-development">For development</a></li>
            <li><a href="#locally">Just running it</a></li>
          </ul>
        </li>
      </ul>
    </li>
  </ol>
</details> -->

## About

WIP

[Web app README](/apps/www/README.md)

[Desktop app README](/apps/app/README.md)

## Built with

- React
- Tauri v1
- Vite
- shadcn/ui
- TailwindCSS
- Turborepo
- Typescript

## Project structure

```
├── apps/
│   ├── app/
│   ├── www/
├── packages/
│   ├── eslint-config/
│   ├── lib/
│   ├── typescript-config/
│   ├── ui/
├── turbo.json
├── package.json
└── README.md
```

## Folder Details

- `apps/www`: Contains the React application for the website.
- `apps/app`: Tauri app with React as the frontend.
- `packages/ui`: Shared components or logic used by both apps.
- `packages/lib`: Shared utility functions, hooks, stores etc.
- `packages/eslint-config`: Shared eslint config.
- `packages/typescript-config`: Shared typescript config.

## Status

WIP

## Getting started

### Prerequisites

- Node.js (>= 16)
- npm (preferred) or another package manager
- Tauri 1.0
  - For desktop app development.
  - Installation depends on platform.
    - [Windows](https://v1.tauri.app/v1/guides/getting-started/prerequisites)
    - [macOS](https://v1.tauri.app/v1/guides/getting-started/prerequisites#setting-up-macos)
    - [Linux](https://v1.tauri.app/v1/guides/getting-started/prerequisites#setting-up-macos)

### Installation

1. Clone this repository:

   ```
   git clone https://github.com/Seryjnyy/notki.git
   ```

2. Install dependencies

   ```
   npm install
   ```

### Running the project

- Start the web app

  ```
  npm run dev --workspace=www
  ```

- Start the desktop app

  ```
  npm run dev --workspace=app
  ```

- Run all apps concurrently

  ```
  npm run dev
  ```

## Scripts

| Script                        | Description                                |
| ----------------------------- | ------------------------------------------ |
| npm run install               | Installs dependencies for the project.     |
| npm run dev                   | Run all apps in development mode.          |
| npm run dev --workspace=www   | Start the web app in development mode.     |
| npm run dev --workspace=app   | Start the desktop app in development mode. |
| npm run build                 | Builds all apps and shared packages.       |
| npm run build --workspace=www | Builds the web app.                        |
| npm run build --workspace=app | Builds the desktop app.                    |
| npm run lint                  | Runs lint checks for code quality.         |

### Development workflow

1. Code sharing

- Use `packages/ui` for reusable components and logic.
- Use `packages/lib` for shared utilities, hooks, stores etc.

2. Turborepo Caching:

- Turborepo caches build and lint tasks for faster development.
  Use `--no-cache` to bypass the cache when necessary.

3. Tauri Development:

- Start the desktop app with `npm run dev --workspace=app` to enable hot-reloading.
  - You can see the frontend in your browser separately by visiting `localhost:5174` in your browser.

## Deployment

### Web app

1. Build the React app:

   ```
   npm run build --workspace=www
   ```

2. Deploy the `apps/www/dist` directory to your hosting provider (e.g Vercel, Netlify).

### Desktop app

1. Build the Tauri app:

   ```
   npm run build --workspace=app
   ```

2. You will find the installers in `apps/app/???` WIP

#### Notes

- Tauri detects your operating system and builds a bundle accordingly.

- View more build options in [Tauri docs](https://v1.tauri.app/v1/guides/building/).

## Contributing

1. Fork the repository.
2. Create a new branch:

   ```
   git checkout -b feature-name
   ```

3. Commit your changes:

   ```
   git commit -m "Add new feature"
   ```

4. Push to the branch:

   ```
   git push origin feature-name
   ```

5. Open a pull request.

## FAQ

WIP

## Known issues

WIP

## Future plans

WIP
