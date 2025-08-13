# Terminal Jarvis Landing

## Overview
Terminal Jarvis Landing is the official frontend companion for the [Terminal Jarvis](https://github.com/BA-CalderonMorales/terminal-jarvis) project by Brandon Calderon. While the original Terminal Jarvis provides a unified command-line interface for AI-assisted coding and automation, this repository implements a modern, browser-based landing and interaction layer that introduces, demonstrates, and can connect to the CLI.

This frontend is built with a focus on clarity, maintainability, and rapid iteration. It is designed to serve as both a public-facing introduction to Terminal Jarvis and a functional bridge for users who prefer a graphical entry point before engaging with the CLI.

## Relationship to Terminal Jarvis
- **Terminal Jarvis**: Core CLI tool for orchestrating AI coding workflows and utilities.
- **Terminal Jarvis Landing**: Frontend application that presents key features, setup instructions, and potential interactive elements that interface with the CLI.

The two projects remain separate to ensure clear separation of concerns: the CLI remains lightweight and terminal-focused, while the landing site handles presentation, onboarding, and potential API integrations.

## Technology Stack
- **Framework**: [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Linting & Formatting**: ESLint, Prettier
- **Testing Structure**: Preconfigured test directory
- **Build System**: Vite’s optimized dev/build pipeline

## Features
- Clean, minimal UI tailored for technical audiences
- Responsive design via Tailwind utility classes
- Modular file structure based on Screaming Architecture principles
- TypeScript for type safety and maintainability
- ESLint and Prettier for consistent code style
- Ready-to-extend testing setup

## Development Setup
### Prerequisites
- Node.js (LTS recommended)
- npm (default) or an alternative package manager

### Installation
Clone the repository:
```bash
git clone https://github.com/<your-username>/terminal-jarvis-landing.git
cd terminal-jarvis-landing
