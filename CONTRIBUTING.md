# Contributing to MoltyDEX

Thank you for your interest in contributing to MoltyDEX! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

- Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Include steps to reproduce
- Provide environment details (Node.js version, OS, etc.)
- Include error messages and logs

### Suggesting Features

- Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)
- Clearly describe the use case
- Explain why this feature would be valuable
- Consider implementation complexity

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the code style
   - Add tests if applicable
   - Update documentation
4. **Test your changes**
   ```bash
   cd api && npm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
   Use conventional commits:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for code refactoring
   - `test:` for tests
   - `chore:` for maintenance
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**
   - Use the PR template
   - Reference related issues
   - Request review from maintainers

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Solana wallet (for testing)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/agentdex.git
   cd agentdex
   ```

2. **Install dependencies**
   ```bash
   cd api
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your JUPITER_API_KEY
   ```

4. **Run the API**
   ```bash
   npm start
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## Code Style

- Use ESLint configuration (if available)
- Follow existing code patterns
- Write clear, self-documenting code
- Add comments for complex logic
- Keep functions focused and small

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Add integration tests for API endpoints
- Test error cases and edge cases

## Documentation

- Update README.md for user-facing changes
- Update API docs for endpoint changes
- Add code comments for complex logic
- Update CHANGELOG.md for significant changes

## Project Structure

```
agentdex/
├── api/              # Express.js API
│   ├── routes/       # API route handlers
│   ├── utils/        # Utility functions
│   └── middleware/   # Express middleware
├── frontend/         # Next.js frontend
├── sdk/              # Python SDK
├── agent/            # x402 Auto-Pay Agent
└── tests/            # Test files
```

## Questions?

- Open an issue for questions
- Check existing issues and PRs
- Review the documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
