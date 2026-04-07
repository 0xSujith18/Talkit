# Talkit - Testing Guide

## 🧪 Testing Strategy

This guide covers testing approaches for the Talkit platform.

---

## Backend Testing

### Setup

```bash
cd backend
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

### Jest Configuration

Create `backend/jest.config.js`:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### Test Structure

```
backend/src/
├── __tests__/
│   ├── auth.test.ts
│   ├── posts.test.ts
│   ├── reports.test.ts
│   └── moderation.test.ts
└── ...
```

### Example: Auth Tests

Create `backend/src/__tests__/auth.test.ts`:
```typescript
import request from 'supertest';
import app from '../server';
import User from '../models/User';
import { connectDB } from '../config/db';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await User.deleteMany({});
});

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'citizen'
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('should not register duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          name: 'Test User 2',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.status).toBe(401);
    });
  });
});
```

### Example: Reports Tests

Create `backend/src/__tests__/reports.test.ts`:
```typescript
import request from 'supertest';
import app from '../server';

describe('Reports API', () => {
  let token: string;
  let reportId: string;

  beforeAll(async () => {
    // Login to get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    token = res.body.token;
  });

  describe('POST /api/reports', () => {
    it('should create a new report', async () => {
      const res = await request(app)
        .post('/api/reports')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'infrastructure',
          title: 'Test Report',
          description: 'Test description',
          media: ['data:image/png;base64,test'],
          location: {
            address: 'Test Address',
            coordinates: { lat: 12.9716, lng: 77.5946 }
          },
          privacy: 'public'
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('reportId');
      expect(res.body.reportId).toMatch(/^TLK-/);
      reportId = res.body._id;
    });

    it('should require photo upload', async () => {
      const res = await request(app)
        .post('/api/reports')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'infrastructure',
          title: 'Test Report',
          description: 'Test description',
          media: [],
          location: { address: 'Test', coordinates: { lat: 0, lng: 0 } }
        });
      
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/reports', () => {
    it('should get user reports', async () => {
      const res = await request(app)
        .get('/api/reports')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('reports');
      expect(Array.isArray(res.body.reports)).toBe(true);
    });
  });
});
```

### Run Tests

```bash
cd backend
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

---

## Frontend Testing

### Setup

```bash
cd web
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
```

### Vitest Configuration

Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts'
  }
});
```

### Test Setup

Create `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

### Example: Component Tests

Create `src/components/__tests__/PostCard.test.tsx`:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PostCard from '../PostCard';

const mockPost = {
  _id: '1',
  user: { name: 'Test User', role: 'citizen', isVerified: false },
  caption: 'Test post',
  likes: [],
  createdAt: new Date().toISOString()
};

describe('PostCard', () => {
  it('renders post content', () => {
    render(
      <BrowserRouter>
        <PostCard post={mockPost} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Test post')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('handles like button click', () => {
    const onLike = jest.fn();
    render(
      <BrowserRouter>
        <PostCard post={mockPost} onLike={onLike} />
      </BrowserRouter>
    );
    
    const likeButton = screen.getByRole('button', { name: /like/i });
    fireEvent.click(likeButton);
    expect(onLike).toHaveBeenCalledWith('1');
  });
});
```

### Run Tests

```bash
cd web
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

---

## E2E Testing with Playwright

### Setup

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Configuration

Create `playwright.config.ts`:
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true
  }
});
```

### Example: E2E Tests

Create `e2e/auth.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should register new user', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/feed');
  });

  test('should login existing user', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/feed');
  });
});
```

Create `e2e/reports.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('should create new report', async ({ page }) => {
    await page.goto('/create-report');
    
    await page.selectOption('select[name="category"]', 'infrastructure');
    await page.fill('input[name="title"]', 'Test Report');
    await page.fill('textarea[name="description"]', 'Test description');
    await page.fill('input[name="address"]', 'Test Address');
    
    // Upload image
    await page.setInputFiles('input[type="file"]', 'test-image.jpg');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/reports');
  });
});
```

### Run E2E Tests

```bash
npx playwright test

# UI mode
npx playwright test --ui

# Debug mode
npx playwright test --debug
```

---

## Manual Testing Checklist

### Authentication
- [ ] Register new user (citizen)
- [ ] Register new user (authority)
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout
- [ ] Access protected routes without auth
- [ ] Update profile
- [ ] Request verification
- [ ] Forgot password
- [ ] Reset password

### Social Feed
- [ ] View feed
- [ ] Create post
- [ ] Like post
- [ ] Unlike post
- [ ] Comment on post
- [ ] View comments
- [ ] Edit post
- [ ] Delete post
- [ ] View trending posts
- [ ] Search by hashtag
- [ ] View user posts

### Reports
- [ ] Create report with all fields
- [ ] Create report without photo (should fail)
- [ ] View reports list
- [ ] Filter by category
- [ ] Filter by status
- [ ] View report details
- [ ] Publish report to feed
- [ ] Update report status (authority)
- [ ] Add action proof (authority)

### Authority Dashboard
- [ ] View analytics
- [ ] View all reports
- [ ] Filter reports
- [ ] Update report status
- [ ] Add action proof
- [ ] View report details

### Moderation
- [ ] Report post
- [ ] Report comment
- [ ] Report user
- [ ] View moderation reports (admin)
- [ ] Review report (admin)
- [ ] Take action (admin)

### Notifications
- [ ] Receive like notification
- [ ] Receive comment notification
- [ ] Receive status update notification
- [ ] Mark notification as read
- [ ] Mark all as read

---

## Performance Testing

### Load Testing with Artillery

```bash
npm install -g artillery

# Create artillery.yml
artillery quick --count 10 --num 100 http://localhost:5000/api/posts/feed
```

### Lighthouse Audit

```bash
npm install -g lighthouse

lighthouse http://localhost:5173 --view
```

---

## Security Testing

### OWASP ZAP
1. Download OWASP ZAP
2. Configure proxy
3. Run automated scan
4. Review findings

### Manual Security Checks
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Authentication bypass
- [ ] Authorization bypass
- [ ] Sensitive data exposure

---

## CI/CD Testing

### GitHub Actions

Create `.github/workflows/test.yml`:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install
      - run: cd backend && npm test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

---

## Test Coverage Goals

- **Backend:** 80%+ coverage
- **Frontend:** 70%+ coverage
- **E2E:** Critical user flows

---

## Continuous Testing

1. Run tests before commit
2. Run tests in CI/CD
3. Monitor test results
4. Fix failing tests immediately
5. Add tests for new features
6. Update tests for bug fixes

---

**Happy Testing! 🧪**
