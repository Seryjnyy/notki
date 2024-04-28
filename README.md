<!-- PROJECT LOGO -->
<br />
<div align="center">

![Logo](./Images/logo.png)

  <h1>txt-viewer</h1>

  <p align="center">
    A better way to view a bunch of txt files.
    </br>
    <a href="https://txt-viewer.netlify.app/"><strong>Visit the site</strong></a>
    <br />
    <br />
    <a href="https://github.com/Seryjnyy/txt-viewer/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=">Report Bug</a>
    ·
    <a href="https://github.com/Seryjnyy/txt-viewer/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About</a>
      <ul>
        <li ><a href="#why">Why</a></li>
      </ul>
    </li>
    <li><a href="#built-with">Built with</a></li>
    <!-- <li><a href="#usage">Usage</a></li> -->
    <li><a href="#status">Status</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#locally">Locally</a>
          <ul>
            <li><a href="#for-development">For development</a></li>
            <li><a href="#build-and-deploy">Build and deploy</a></li>
          </ul>
        </li>
      </ul>
    </li>
  </ol>
</details>

## About

A better way to deal with text files.
Simply select or drag in your text files to view them.

The site runs locally, so all your files stay with you.

### Why?

I often use Windows Notepad for quick note-taking, resulting in numerous text files. Managing them in the standard way can get annoying. Windows 10 Notepad's interface is dated with no dark mode, and handling multiple open windows isn't ideal. To address this, I created this minimalistic UI for viewing my notes.

## Built with

- React
- Vite
- shadcn/ui
- Zustand

## Status

The project is still in development.

## Getting started

### Locally

- You will need Node installed.

#### For development

- Run it locally.
  ```
  npm run dev
  ```
- Then visit [localhost:5173](localhost:5173) to see the site.
  - Note: Check the console to get the link, as it might use another port.

#### Build and deploy

- Build the site.
  ```
  npm run build
  ```
  - You should lint before building.
    ```
    npm run lint
    ```
