# Contributing to Talkit

Thank you for your interest in contributing to Talkit! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Ways to Contribute
- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Fix issues
- ✨ Add new features
- 🧪 Write tests
- 🎨 Improve UI/UX

---

## 🚀 Getting Started

### 1. Fork the Repository
```bash
# Click "Fork" on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Talkit.git
cd Talkit
```

### 2. Set Up Development Environment
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../web
npm install

# Setup environment variables
cp backend/.env.example backend/.env
# Edit .env with your MongoDB URI
```

### 3. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

---

## 📋 Development Guidelines

### Code Style

**TypeScript:**
- Use TypeScript for all new code
- Define interfaces for data structures
- Use meaningful variable names
- Add JSDoc comments for functions

**React:**
- Use functional components with hooks
- Keep components small and focused
- Use Context API for global state
- Follow React best practices

**Backend:**
- Use async/await for asynchronous code
- Handle errors properly
- Validate input data
- Use middleware for common tasks

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Models: `PascalCase.ts`
- Routes: `camelCase.ts`

**Variables:**
- Constants: `UPPER_SNAKE_CASE`
- Variables: `camelCase`
- Components: `PascalCase`
- Interfaces: `IPascalCase`

### Commit Messages

Follow conventional commits:
```
feat: add certificate generation
fix: resolve login issue
docs: update API documentation
style: format code
refactor: restructure auth module
test: add report tests
chore: update dependencies
```

---

## 🧪 Testing

### Before Submitting
- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] New features have tests
- [ ] Documentation updated
- [ ] No console errors
- [ ] Tested in development

### Run Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd web
npm test
```

---

## 📝 Pull Request Process

### 1. Update Your Branch
```bash
git fetch upstream
git rebase upstream/main
```

### 2. Push Changes
```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request
- Go to GitHub
- Click "New Pull Request"
- Fill in the template
- Link related issues

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested locally
- [ ] Added tests
- [ ] All tests pass

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
```

---

## 🐛 Reporting Bugs

### Before Reporting
- Check existing issues
- Verify it's reproducible
- Test in latest version

### Bug Report Template
```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Additional context**
Any other information
```

---

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution**
How you'd like it to work

**Describe alternatives**
Other solutions you've considered

**Additional context**
Mockups, examples, etc.
```

---

## 🎯 Priority Areas

### High Priority
1. Mobile app development
2. Real-time notifications
3. Certificate generation
4. Cloud storage integration
5. Advanced search

### Medium Priority
1. Video upload support
2. Analytics dashboard
3. Multi-language support
4. Email notifications
5. Performance optimization

### Good First Issues
- UI improvements
- Documentation updates
- Bug fixes
- Test coverage
- Code refactoring

---

## 📚 Resources

### Documentation
- [README.md](./README.md) - Project overview
- [API_DOCS.md](./API_DOCS.md) - API reference
- [QUICK_START.md](./QUICK_START.md) - Setup guide
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing guide

### Tech Stack
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)

---

## 🏗️ Project Structure

```
Talkit/
├── backend/          # Backend API
│   ├── src/
│   │   ├── models/   # Database models
│   │   ├── routes/   # API routes
│   │   ├── middleware/ # Express middleware
│   │   └── server.ts # Entry point
│   └── package.json
│
├── src/              # Frontend
│   ├── pages/        # Page components
│   ├── components/   # Reusable components
│   ├── context/      # React Context
│   └── App.tsx       # Main app
│
└── docs/             # Documentation
```

---

## 🔍 Code Review Process

### What We Look For
- Code quality and readability
- Test coverage
- Documentation
- Performance impact
- Security considerations
- Breaking changes

### Review Timeline
- Initial review: 1-3 days
- Follow-up: 1-2 days
- Merge: After approval

---

## 🎨 UI/UX Guidelines

### Design Principles
- Mobile-first approach
- Clean and minimal
- Consistent spacing
- Accessible colors
- Clear typography

### Component Guidelines
- Reusable components
- Responsive design
- Loading states
- Error states
- Empty states

---

## 🔐 Security

### Reporting Security Issues
**DO NOT** create public issues for security vulnerabilities.

Email: security@talkit.com (or create private security advisory)

### Security Checklist
- [ ] No hardcoded credentials
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

---

## 💬 Communication

### Channels
- GitHub Issues - Bug reports, features
- GitHub Discussions - Questions, ideas
- Discord - Real-time chat (coming soon)
- Email - security@talkit.com

### Response Time
- Issues: 1-3 days
- PRs: 1-3 days
- Security: 24 hours

---

## 📊 Contribution Stats

We track:
- Number of contributions
- Code quality
- Test coverage
- Documentation improvements

---

## 🎓 Learning Resources

### For Beginners
- [First Contributions](https://github.com/firstcontributions/first-contributions)
- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

### For Advanced
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [React Patterns](https://reactpatterns.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## ✅ Checklist Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] Branch is up to date
- [ ] No merge conflicts
- [ ] All tests pass
- [ ] No console errors/warnings
- [ ] Tested in development
- [ ] PR description is clear

---

## 🎉 Thank You!

Every contribution, no matter how small, makes a difference. Thank you for helping make Talkit better!

---

**Questions?** Open an issue or start a discussion!

**Happy Contributing! 🚀**
