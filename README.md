# React Fiori Style

This project is a frontend application for managing attachments in an SAP environment.

The current goal of the app is to provide a Fiori-style experience for common attachment workflows such as browsing files, creating new attachments, uploading new versions, reviewing version history, and checking audit information.

## What The App Currently Includes

- a landing screen for the future login/access flow
- an attachment list with table and grid views
- an attachment detail screen
- creation of new attachments
- upload of new file versions
- version detail and file preview
- audit and version history display

## Project Status

This repository should be understood as an actively growing application, not a finished product.

Some parts are already connected to real SAP services and support real flows. Other parts are still being refined, completed, or expanded step by step. The structure is already moving toward a cleaner feature-based organization so the project can grow without piling everything into one screen.

## General Direction

The app is being developed as a practical UI layer for attachment handling in SAP-based business processes.

The focus is currently on:

- making attachment workflows clearer and easier to use
- keeping the UI aligned with a Fiori-style experience
- organizing the codebase so new features can be added safely
- preserving compatibility with SAP deployment requirements

## Running The Project

Common commands:

- `npm run dev` to start local development
- `npm run build` to create a production build
- `npm run lint` to check code quality
- `npm run deploy` to build and deploy to the configured SAP target

## Notes

- The app uses SAP OData services as its backend source
- local development is configured to work through a proxy
- deployment to an ABAP environment is already part of the repository setup

## Repository Intent

This repo is meant to serve as the working frontend foundation for the thesis/project, with room to continue improving UX, business flows, and domain structure over time.
