# Contributing to Sozu Wallet

Thank you for your interest in contributing to Sozu Wallet! This document provides guidelines and instructions for contributing to the project.

## Development Environment Setup

1. **Prerequisites**

   - Node.js (v14 or higher)
   - Yarn package manager
   - Chrome browser

2. **Clone and Setup**

   ```bash
   git clone https://github.com/your-username/sozu-wallet.git
   cd sozu-wallet
   yarn install
   ```

3. **Development Server**

   ```bash
   yarn dev
   ```

4. **Load Extension in Chrome**
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` directory

## Git Workflow

We follow a simplified Git Flow workflow:

1. **Main Branches**

   - `main` - Production code
   - `develop` - Development code

2. **Feature Development**

   - Create a new branch from `develop`:
     ```bash
     git checkout develop
     git pull origin develop
     git checkout -b feature/your-feature-name
     ```
   - Implement your changes
   - Commit your changes:
     ```bash
     git add .
     git commit -m "feat: your descriptive commit message"
     ```
   - Push your branch:
     ```bash
     git push origin feature/your-feature-name
     ```
   - Open a pull request to merge into `develop`

3. **Bug Fixes**

   - For bugs in production code:
     ```bash
     git checkout main
     git pull origin main
     git checkout -b hotfix/bug-description
     ```
   - For bugs in development code:
     ```bash
     git checkout develop
     git pull origin develop
     git checkout -b fix/bug-description
     ```

4. **Pull Requests**
   - Create a pull request to the appropriate branch
   - Fill in the PR template
   - Request review from at least one team member
   - Address review comments
   - Wait for approval and merge

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- **Format**: `<type>(<scope>): <description>`
- **Types**:
  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation changes
  - `style`: Code style changes (formatting, etc.)
  - `refactor`: Code changes that neither fix bugs nor add features
  - `perf`: Performance improvements
  - `test`: Adding or fixing tests
  - `chore`: Changes to the build process or auxiliary tools
- **Example**: `feat(nft): add agent activation functionality`

## Code Style Guidelines

1. **TypeScript**

   - Use TypeScript for all new code
   - Add proper type definitions
   - Avoid use of `any` when possible

2. **React Components**

   - Use functional components with hooks
   - Split large components into smaller, reusable components
   - Use TypeScript interfaces for props

3. **CSS/Styling**

   - Use TailwindCSS for styling
   - Follow utility-first approach
   - Create custom components for repeated patterns

4. **Testing**
   - Write unit tests for new functionality
   - Maintain or improve test coverage

## Pull Request Process

1. Ensure your code follows the style guidelines
2. Update documentation as needed
3. Add tests for new functionality
4. Make sure all tests pass
5. Update the README.md if needed
6. Have at least one team member review and approve your changes
7. If you're adding new features, update the CHANGELOG.md

## X.com Integration Guidelines

When working on features related to X.com integration:

1. **DOM Manipulation**

   - Use selectors that are less likely to change with X.com UI updates
   - Add fallback strategies for when selectors don't match
   - Use MutationObserver to detect dynamic changes

2. **Performance**

   - Minimize the DOM operations
   - Use debouncing for event handlers
   - Ensure smooth user experience

3. **Styling**

   - Match X.com's design language
   - Test on different themes (light and dark)
   - Ensure accessibility compliance

4. **Testing**
   - Test on different X.com layouts and views
   - Test with different screen sizes
   - Test with other browser extensions active

## License

By contributing to Sozu Wallet, you agree that your contributions will be licensed under the project's MIT License.

## Questions?

If you have any questions or need help, please:

- Open an issue on GitHub
- Contact the maintainers
- Join our community Discord (link TBD)

Thank you for contributing to make Sozu Wallet better!
