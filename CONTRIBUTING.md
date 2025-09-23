# Contributing to Shein Open SDK

Thank you for your interest in contributing to the Shein Open SDK! We welcome contributions from the community.

## Development Setup

1. **Prerequisites**
   - Node.js >= 16.0.0
   - pnpm >= 8.0.0

2. **Clone and Setup**

   ```bash
   git clone https://github.com/sheinsight/open-sdk-js.git
   cd @shined/open-sdk-js
   pnpm install
   ```

3. **Development Commands**

   ```bash
   pnpm run build        # Build the project
   pnpm run dev          # Build in watch mode
   pnpm test             # Run tests
   pnpm run test:watch   # Run tests in watch mode
   pnpm run lint         # Run linting
   pnpm run format       # Format code
   pnpm run typecheck    # Type checking
   ```

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/sheinsight/open-sdk-js/issues)
2. If not, create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node.js version, OS, etc.)

### Suggesting Features

1. Check existing [Issues](https://github.com/sheinsight/open-sdk-js/issues) and [Discussions](https://github.com/sheinsight/open-sdk-js/discussions)
2. Create a new issue or discussion with:
   - Clear description of the feature
   - Use cases and motivation
   - Proposed implementation (if applicable)

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed
   - Ensure all tests pass

4. **Commit your changes**

   ```bash
   git commit -m "feat: add your feature description"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `test:` for tests
   - `refactor:` for refactoring
   - `chore:` for maintenance

5. **Push and create PR**

   ```bash
   git push origin feature/your-feature-name
   ```

   Then create a Pull Request on GitHub.

## Code Standards

### TypeScript

- Use strict TypeScript settings
- Provide comprehensive type definitions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Testing

- Write tests for all new functionality
- Maintain 100% test coverage
- Use descriptive test names
- Test both success and error cases

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Use meaningful commit messages
- Keep functions small and focused

### Documentation

- Update README for new features
- Add inline code comments where necessary
- Update API documentation
- Provide usage examples

## Project Structure

```
src/
├── index.ts          # Main entry point
├── signature.ts      # Core signature logic
└── types.ts          # Type definitions

tests/
├── signature.test.ts # Core functionality tests
└── index.test.ts     # Export tests

demo/
├── node-example.js   # Node.js example
├── browser-example.html # Browser example
└── typescript-example.ts # TypeScript example
```

## Review Process

1. **Automated Checks**
   - CI pipeline runs tests, linting, and type checking
   - All checks must pass

2. **Code Review**
   - At least one maintainer review required
   - Address feedback and update PR as needed

3. **Merge**
   - PRs are merged using "Squash and merge"
   - Commit message follows conventional commits

## Security

- Never commit sensitive data (API keys, secrets)
- Follow security best practices
- Report security vulnerabilities privately to maintainers

## Questions?

- Create a [Discussion](https://github.com/sheinsight/open-sdk-js/discussions)
- Check existing [Issues](https://github.com/sheinsight/open-sdk-js/issues)
- Review the [README](README.md) and documentation

Thank you for contributing! 🎉
