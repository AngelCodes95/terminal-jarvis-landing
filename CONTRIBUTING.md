# Contributing to Terminal Jarvis Landing Page

**Thank you for your interest in contributing to the Terminal Jarvis Landing Page!**

This project is the frontend showcase for the Terminal Jarvis CLI tool, introducing developers to AI coding tools integration.

## **FIRST STEP: Join Our Discord**

**BEFORE opening any Pull Request**, please:

**[Join Terminal Jarvis Discord](https://discord.gg/pZmQYExR)**

## Contribution Types

We welcome contributions. Add an issue if one doesn't exist and ask to be assigned. Suggestions are welcome in Discord before creating issues:

### **Code Contributions**
- UI/UX improvements and bug fixes
- Performance optimizations
- Responsive design enhancements
- API integration improvements
- Accessibility improvements

### **Documentation**
- README improvements
- Setup and deployment guides
- Code documentation and comments

### **Design & Content**
- Visual design improvements
- Content accuracy and clarity
- Typography and layout enhancements

## **Bug Fix Process**

Follow this general process **when applicable** (use judgment for simple changes like font sizes, color tweaks, or typo fixes):

### **For Functional Bugs & Complex Issues:**

1. **Make sure you are up to date on branch**
   ```bash
   git checkout development
   git pull origin development
   ```

2. **Replicate bug**
   - Document exact steps to reproduce
   - Note expected vs actual behavior

3. **If you can replicate, create feature branch**
   ```bash
   git checkout -b fix/my-specific-issue
   ```

4. **If you cannot replicate, document what you tried and talk with the dev team** (Brandon Calderon, Carlos Degante, Joshua Smith, or community in Discord `#bug-reporting` channel)

5. **If you have a functional bug, create a failing test** (when applicable - not needed for simple styling changes)

6. **Once you have a failing test, work on a fix. After you get a fix, create another test to keep track of expected behavior**

7. **Run quality checks and fix errors until all clear**
   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```

8. **Raise a PR against development branch**

9. **Add reviewers as needed** - Brandon Calderon, Angel Vazquez, Carlos Degante, or Joshua Smith as reviewers when possible. Always get at least one review. 

### **For Simple Changes:**
- **Font sizes, colors, spacing, typos**: Skip the "create a failing test" steps, just make the change and document it well, screenshots if possible or video clips.

- **Documentation updates**: Review for accuracy and clarity

- **Content corrections**: Verify factual accuracy with Terminal Jarvis CLI

## **Development Setup**

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn

### **Getting Started**
```bash
# Fork the repository on GitHub
git clone https://github.com/your-username/terminal-jarvis-landing.git
cd terminal-jarvis-landing
git checkout development

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## **Code Quality Standards**

### **Frontend Code Requirements**
- **TypeScript strict mode compliance**
- **ESLint clean**: `npm run lint`
- **Type checking**: `npm run type-check`
- **Successful builds**: `npm run build`

### **Project-Specific Standards**
- **No emojis in code or commits** (per project guidelines)
- **No unnecessary hyphens** unless required
- **Professional documentation and comments**
- **camelCase naming** (unless React components require PascalCase)
- **No AI language remnants** in user-facing text

### **Commit Message Standards**
Use conventional commits following [Semantic Versioning](https://semver.org/) with Terminal Jarvis prefixes:

```bash
# Examples:
git commit -m "Fix: resolve mobile responsive layout issue"
git commit -m "Feature: add new tool showcase animation"
git commit -m "Docs: update development setup instructions"
git commit -m "Style: improve typography and spacing consistency"
git commit -m "Refactor: reorganize component structure for better maintainability"

# Prefixes: Feature, Fix, Docs, Style, Refactor, Test, Chore
```

**Semantic Versioning**
- `Feature:` minor version bump (1.0.0 → 1.1.0)
- `Fix:` patch version bump (1.0.0 → 1.0.1)
- `BREAKING CHANGE:` in commit body, major version bump (1.0.0 → 2.0.0)
- Other prefixes (Docs, Style, Refactor, Test, Chore) may be patch bumps

**Note:** Follow these conventions for proper [semantic versioning](https://semver.org/) practices. While not yet automated, consistent commit messages help with manual version management and future automation plans.

### **Testing Approach**

**When testing is needed** (functional changes, API integration, complex components):
- Write component tests for interactive elements
- Test responsive behavior across devices
- Verify accessibility compliance
- Test API integration endpoints

**When testing may not be needed** (simple visual changes):
- Font size adjustments
- Color scheme updates
- Spacing and padding tweaks
- Content text corrections

## **Project Structure**

```
terminal-jarvis-landing/
├── src/
│   ├── api/                 # Terminal Jarvis API integration
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── shared/             # Shared utilities and types
│   └── styles/             # CSS and styling
├── public/                 # Static assets
├── docs/                   # Documentation
├── CONTRIBUTING.md         # This file
├── CLAUDE.md              # Project specifications
└── package.json
```

## **Branch Strategy**

- **`main`**: Production branch (GitHub Pages deployment)
- **`development`**: Active development branch
- **Feature branches**: `feature/description` or `fix/description`

## **Integration with Terminal Jarvis CLI**

This landing page showcases the main Terminal Jarvis CLI project. When making content changes:

- **Verify accuracy** with the main CLI repository
- **Maintain consistency** with CLI terminology and features
- **Reference CLI documentation** for technical details
- **Coordinate major changes** through Discord `#feature-requests` or `#general` channels


## **Please, NONE of the following:**
- emojis anywhere (code, commits, documentation)
- force pushing to main or development branches
- combining unrelated changes in one commit
- vague commits like "fix stuff" or "update things"
- breaking changes without Discord discussion
- direct pushes to main branch

## **Getting Help**

- **Discord**: Real-time help in `#general` or `#bug-reporting` channels
- **GitHub Issues**: Browse existing issues for contribution ideas
- **README.md**: Project overview and setup instructions
- **CLAUDE.md**: Comprehensive project specifications

## **Useful Links**

- **[Discord Community](https://discord.gg/pZmQYExR)** - Primary communication channel
- **[Terminal Jarvis CLI](https://github.com/BA-CalderonMorales/terminal-jarvis)** - Main project repository

---

**Ready to contribute? Join our Discord community.**

**Remember**: For simple changes like styling tweaks, feel free to skip the heavy testing process. For functional changes and new features, follow the full development workflow.