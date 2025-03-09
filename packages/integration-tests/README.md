# E2E Testing with Playwright

This directory contains end-to-end tests for the Charge Point Installation App using [Playwright](https://playwright.dev/).

## Project Structure

```
e2e-tests/
├── .github/            # GitHub Actions workflows
│   └── workflows/      # CI/CD configurations
│       └── scheduled-tests.yml  # Runs tests daily at 8 AM CET/CEST
├── api-helpers/        # API utility functions
│   ├── ApiClient.ts    # Client for REST API calls
│   ├── Logger.ts       # Logging functionality
│   └── chargePointHelpers.ts  # Helper functions for generating test data
├── page-objects/       # Page Object Model classes
│   ├── HomePage.ts     # Homepage interactions
│   └── ChargePointsPage.ts  # Charge points page interactions
├── tests/              # Test files
│   ├── api/            # API tests
│   │   └── chargePoints.api.spec.ts
│   ├── ui/             # UI tests
│   │   ├── homepage.spec.ts
│   │   └── chargePoints.spec.ts
│   └── combined/       # Combined UI/API tests
│       └── combined.spec.ts
└── playwright.config.ts  # Playwright configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation and Application Setup

⚠️ **IMPORTANT**: The application must be running before executing tests.

1. From the project root, install dependencies:

```bash
npm install
```

2. Start the application (both web app and server):

```bash
npm start
```

3. Wait for both the web application and API server to fully start and be available at their respective ports:
   - Web app: http://localhost:3000
   - API server: http://localhost:3001

### Running Tests

Once the application is up and running, you can execute the tests:

```bash
# From the project root directory
cd packages/integration-tests
npm test

# Or use shorthand from the project root
npm run test:e2e
```

### Running Specific Test Types

```bash
# Run all tests
npm run test

# Run only UI tests
npm run test:ui-chromium

# Run only API tests
npm run test:api

# Run only combined tests
npm run test:combined

# Run in debug mode
npm run test:debug

# Run with UI
npm run test:ui

# View test report
npm run report
```

## Test Categories

### UI Tests

UI tests focus on browser-based user interactions. They verify that the web app's UI works correctly from a user's perspective.

Example test cases:

- Adding a new charge point through the UI
- Deleting a charge point through the UI
- Viewing the list of charge points

### API Tests

API tests verify the REST API endpoints directly, without a browser.

Test cases include:

- **CRUD Operations**:

  - Getting all charge points
  - Adding a new charge point
  - Deleting a charge point

- **Input Validation and Error Handling**:

  - Handling duplicate serial numbers
  - Handling invalid serial number formats
  - Error responses for non-existent resources

- **Data Structure and Integrity**:

  - Verifying response data structures
  - Validating property types and values

- **Multiple Operations**:
  - Adding multiple charge points in sequence
  - Batch operations

### Combined Tests

Combined tests use both UI and API interactions to test scenarios that span both layers.

Example test cases:

- Add via API, verify in UI
- Add via UI, verify via API
- Delete via UI, verify via API
- Delete via API, verify in UI

## CI/CD Integration

Tests are scheduled to run automatically at 8 AM Central European Time (either CET or CEST, depending on daylight saving time) every day using GitHub Actions.

The schedule uses:

- 7 AM UTC during winter months (October-March) to run at 8 AM CET
- 6 AM UTC during summer months (April-September) to run at 8 AM CEST

This ensures the tests always run at 8 AM local time in Europe, regardless of daylight saving time changes.

See the configuration in `.github/workflows/scheduled-tests.yml`.

## Test Design and Best Practices

### Page Object Model

The tests follow the Page Object Model pattern, which:

- Separates page interactions from test logic
- Makes tests more maintainable
- Reduces code duplication
- Improves readability

### API Client

The API client class provides a clean interface for interacting with the backend API, making tests more readable and maintainable:

- Encapsulates HTTP request details
- Provides domain-specific methods
- Handles common setup requirements
- Simplifies assertions

### Test Isolation and Cleanup

Each test follows best practices for test isolation:

- Uses unique data for each test run
- Properly cleans up after test execution
- Avoids dependencies between tests

### Arrange-Act-Assert Pattern

Tests follow the AAA pattern:

- **Arrange**: Set up test data and preconditions
- **Act**: Perform the actions being tested
- **Assert**: Verify expected outcomes

## Test Reports

After running tests, reports are available in:

- HTML Report: `playwright-report/`
- JUnit Report: `test-results/junit-report.xml`

View the HTML report with:

```bash
npm run report
```
