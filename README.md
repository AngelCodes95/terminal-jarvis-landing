<div align="center">
  <img src="public/updated-main-logo.jpg" alt="Terminal Jarvis" width="400">
  
  # Terminal Jarvis Landing
  
  A modern, responsive landing page showcasing Terminal Jarvis - a unified command center for coding tools.
  
  [![GitHub Stars](https://img.shields.io/github/stars/BA-CalderonMorales/terminal-jarvis?style=flat-square&logo=github&logoColor=white)](https://github.com/BA-CalderonMorales/terminal-jarvis)
  [![NPM Version](https://img.shields.io/npm/v/terminal-jarvis?style=flat-square&logo=npm&logoColor=white)](https://www.npmjs.com/package/terminal-jarvis)
  [![NPM Downloads](https://img.shields.io/npm/dw/terminal-jarvis?style=flat-square&logo=npm&logoColor=white)](https://www.npmjs.com/package/terminal-jarvis)
  [![GitHub Forks](https://img.shields.io/github/forks/BA-CalderonMorales/terminal-jarvis?style=flat-square&logo=github&logoColor=white)](https://github.com/BA-CalderonMorales/terminal-jarvis)
  
  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
  
</div>

---

## Features

- **Brand New Design** - Updated with official Terminal Jarvis color scheme (v0.0.2)
- **Responsive Design** - Optimized for mobile and desktop with repositioned navigation
- **Live Statistics** - Real time data from GitHub and crates.io APIs  
- **Interactive Elements** - Clickable logo, enhanced loading screen, and smooth animations
- **Security Focused** - CSP headers, secure external links, and API caching
- **Performance Optimized** - 5 minute API caching and faster load times

## Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Clean API** for API client management

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is set up for automatic deployment to GitHub Pages via GitHub Actions.

### Setup Instructions:

1. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "GitHub Actions"

2. **Update Repository Name:**
   - Update the `base` field in `vite.config.js` to match your repository name
   - Current setting: `base: '/terminal-jarvis-landing/'`

3. **Automatic Deployment:**
   - Push to `main` branch triggers automatic deployment
   - Includes quality checks (lint, type-check) before deployment
   - Live site will be available at: `https://username.github.io/repository-name`

## Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## Project Structure

```
src/
├── api/                    # API client and types
├── components/             # React components
│   ├── SectionNavigator/   # Mobile/desktop navigation
│   ├── ToolsShowcase/      # Tools display component
│   └── TJarvisRetroLogo/   # Logo component
└── shared/                 # Shared utilities and styles
```

## License

MIT
