<!-- PROJECT LOGO -->
<br />
<div align="center">

![Logo](/Images/banner.svg)

  <p align="center">
   🕸️ notki is a web app for viewing your notes in a better way.
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

[Main README](/README.md)

[Desktop app README](/apps/app/README.md)

## Built with

- React
- Vite
- shadcn/ui
- TailwindCSS

## Getting started

### Prerequisites

- Node.js (>= 16)
- npm (preferred) or another package manager

### Installation

1. Clone the entire repository:

   ```
   git clone https://github.com/Seryjnyy/notki.git
   ```

2. Install dependencies

   ```
   npm install
   ```

### Running the project

- Start the web app

1. Navigate to www folder:

   ```
     cd apps/www
   ```

2. Start in development mode:

   ```
   npm run dev
   ```

## Scripts

| Script        | Description                            |
| ------------- | -------------------------------------- |
| npm run dev   | Start the web app in development mode. |
| npm run build | Builds the web app.                    |
| npm run lint  | Runs lint checks for code quality.     |

## Deployment

### Web app

1. Build the React app:

   ```
   npm run build
   ```

2. Deploy the `apps/www/dist` directory to your hosting provider (e.g Vercel, Netlify).
