# Contributing to Portfolio MCP Server

Thank you for your interest in contributing to the Portfolio MCP Server! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Set up the development environment
4. Create a new branch for your changes
5. Make your changes
6. Test your changes
7. Submit a pull request

## Development Setup

### Node.js Development

```bash
# Clone the repository
git clone https://github.com/srikanth-karthi/mcp-portfolio.git
cd mcp-portfolio

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test
```

### Python Development

```bash
# Install in editable mode
pip install -e .

# Run the server
python -m mcp_portfolio_server.server

# Run tests (if available)
pytest
```

### Docker Development

```bash
# Build and run with Docker Compose
docker compose up mcp-portfolio-nodejs    # Node.js version
docker compose up mcp-portfolio-python    # Python version
docker compose up mcp-portfolio-multi     # Multi-runtime version
```

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **Bug fixes**: Fix issues in the codebase
- **New features**: Add new functionality
- **Documentation**: Improve or add documentation
- **Tests**: Add or improve test coverage
- **Code refactoring**: Improve code quality
- **Performance improvements**: Optimize existing code

### Before You Start

1. Check existing issues and pull requests to avoid duplicates
2. For major changes, open an issue first to discuss your proposal
3. Make sure your changes align with the project's goals

## Pull Request Process

1. **Create a branch**: Use a descriptive branch name
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes**: Follow the coding standards

3. **Test your changes**: Ensure all tests pass
   ```bash
   npm test
   ```

4. **Commit your changes**: Write clear commit messages
   ```bash
   git commit -m "Add: Brief description of your changes"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Submit a pull request**:
   - Provide a clear title and description
   - Reference any related issues
   - Ensure CI checks pass

7. **Code review**: Address feedback from maintainers

8. **Merge**: Once approved, your PR will be merged

## Coding Standards

### JavaScript/Node.js

- Follow existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use async/await for asynchronous operations

### Python

- Follow PEP 8 style guidelines
- Use type hints where appropriate
- Write docstrings for functions and classes
- Use meaningful variable and function names

### General Guidelines

- Write self-documenting code
- Keep changes focused and atomic
- Avoid unnecessary dependencies
- Maintain backward compatibility when possible

## Testing

### Node.js Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Writing Tests

- Write tests for new features
- Ensure existing tests pass
- Aim for high test coverage
- Test edge cases and error handling

## Reporting Bugs

When reporting bugs, please include:

1. **Clear title**: Brief description of the issue
2. **Steps to reproduce**: Detailed steps to reproduce the bug
3. **Expected behavior**: What you expected to happen
4. **Actual behavior**: What actually happened
5. **Environment**: OS, Node.js/Python version, package version
6. **Screenshots**: If applicable
7. **Additional context**: Any other relevant information

Use the bug report template when creating an issue.

## Suggesting Enhancements

When suggesting enhancements:

1. **Check existing issues**: Avoid duplicates
2. **Describe the problem**: What problem does this solve?
3. **Propose a solution**: How should it work?
4. **Consider alternatives**: Are there other approaches?
5. **Provide examples**: Show use cases

Use the feature request template when creating an issue.

## Documentation

- Update README.md if you change functionality
- Add JSDoc/docstring comments to new functions
- Update API documentation for new endpoints
- Include examples in documentation

## Questions?

If you have questions:

1. Check existing documentation
2. Search existing issues
3. Open a new issue with the "question" label

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions make this project better. We appreciate your time and effort!
