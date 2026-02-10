# Contributing to MoltyDEX

Thank you for your interest in contributing to MoltyDEX! This document provides guidelines and instructions for contributing.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (for API and frontend)
- Python 3.9+ (for SDK and tests)
- Git
- Solana wallet (for testing)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Djtrixuk/moltydex.git
   cd moltydex
   ```

2. **Set up API**
   ```bash
   cd api
   npm install
   cp .env.example .env
   # Add JUPITER_API_KEY to .env
   npm start
   ```

3. **Set up Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Set up Python SDK**
   ```bash
   cd sdk
   pip install -r requirements.txt
   ```

---

## 🧪 Running Tests

### Python Tests

```bash
cd tests
python -m pytest -v
```

### Test Coverage

- **Basic Functionality:** Module imports, class structure
- **x402 Handler:** Payment parsing, balance checking, swap logic
- **Agent Integration:** LangChain, AutoGPT, custom agents

See [TEST_RESULTS.md](./tests/TEST_RESULTS.md) for detailed results.

---

## 📝 Code Style

### JavaScript/TypeScript

- Use ESLint configuration (if present)
- Follow existing code style
- Use async/await for promises
- Add JSDoc comments for functions

### Python

- Follow PEP 8 style guide
- Use type hints where possible
- Add docstrings for functions and classes
- Maximum line length: 100 characters

---

## 🔄 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Changes

- Write clear, readable code
- Add tests for new features
- Update documentation as needed
- Follow existing patterns

### 3. Test Your Changes

```bash
# Run tests
python -m pytest tests/ -v

# Test API locally
cd api && npm start

# Test frontend locally
cd frontend && npm run dev
```

### 4. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git commit -m "feat: add new token recommendation endpoint"
git commit -m "fix: resolve balance checking issue for wrapped SOL"
git commit -m "docs: update API documentation"
```

**Commit Message Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test additions/changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

---

## 📋 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated (if needed)
- [ ] No console.log statements left in code
- [ ] No sensitive data committed

### Pull Request Template

Use the PR template (`.github/pull_request_template.md`) and fill out:
- Description of changes
- Type of change
- Related issues
- Testing performed
- Checklist items

### Review Process

1. PR will be reviewed by maintainers
2. Address any feedback
3. Once approved, PR will be merged

---

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported
2. Try to reproduce the bug
3. Check if it's a known issue

### Bug Report Template

Use the bug report template (`.github/ISSUE_TEMPLATE/bug_report.md`):

- **Description:** Clear description of the bug
- **Steps to Reproduce:** How to reproduce the issue
- **Expected Behavior:** What should happen
- **Actual Behavior:** What actually happens
- **Environment:** Node.js version, OS, etc.
- **Additional Context:** Screenshots, logs, etc.

---

## 💡 Feature Requests

### Before Requesting

1. Check if the feature already exists
2. Check if it's planned
3. Consider if it fits the project scope

### Feature Request Template

Use the feature request template (`.github/ISSUE_TEMPLATE/feature_request.md`):

- **Description:** Clear description of the feature
- **Use Case:** Why is this feature needed?
- **Proposed Solution:** How should it work?
- **Alternatives:** Other solutions considered
- **Additional Context:** Examples, mockups, etc.

---

## 📚 Documentation

### API Documentation

- Update API endpoint documentation in `api/README.md`
- Add examples for new endpoints
- Document request/response formats

### Code Documentation

- Add JSDoc comments for JavaScript functions
- Add docstrings for Python functions
- Update README.md for major changes

### User Documentation

- Update user-facing docs in `docs/`
- Add examples in `examples/`
- Update blog posts if needed

---

## 🔒 Security

### Reporting Security Issues

**Do NOT** create a public GitHub issue for security vulnerabilities.

Instead, email security concerns to: [Your email]

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

---

## 🎯 Areas for Contribution

### High Priority

- Additional SDK languages (Rust, Go)
- More test coverage
- Performance optimizations
- Error handling improvements

### Medium Priority

- UI/UX improvements
- Additional examples
- Documentation improvements
- Integration guides

### Low Priority

- Code refactoring
- Style improvements
- Documentation cleanup

---

## ❓ Questions?

- **GitHub Issues:** For bugs and feature requests
- **Discussions:** For questions and ideas
- **Email:** [Your email]

---

## 📜 Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

---

## 🙏 Thank You!

Your contributions make MoltyDEX better for everyone. Thank you for taking the time to contribute!

---

**Happy Coding!** 🚀
