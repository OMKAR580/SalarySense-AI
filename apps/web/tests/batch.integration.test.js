const { test, expect } = require('@playwright/test');

test.describe('Batch Prediction Integration Tests', () => {
  
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: 'auth_token',
        value: 'mock_integration_test_token',
        domain: 'localhost',
        path: '/',
      }
    ]);
  });
  
  test('should upload CSV, show progress and results, and allow download', async ({ page }) => {
    // Intercept POST to /api/predict/batch
    let interceptedRequest = false;
    await page.route('**/api/predict/batch', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        interceptedRequest = true;
        const csvMock = "age,gender,education_level,job_title,years_of_experience,predicted_salary\n32,Male,Bachelor's,Software Engineer,5,95000.00\n";
        await route.fulfill({
          status: 200,
          contentType: 'text/csv',
          body: csvMock
        });
      } else {
        await route.continue();
      }
    });

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    // 1. Navigate to batch upload page
    await page.goto('/predict/batch');

    // 2. Expect header text to be visible
    await expect(page.locator('text=Batch Salary Prediction')).toBeVisible();

    // 3. Upload a mock CSV file
    const filePayload = {
      name: 'employees.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from("age,gender,education_level,job_title,years_of_experience\n32,Male,Bachelor's,Software Engineer,5\n")
    };
    
    // Set input files on the file input
    await page.setInputFiles('input[type="file"]', filePayload);

    // 4. Verify progress state / processing state transitions to completed state
    await page.waitForSelector('text=Predictions Computed Successfully', { timeout: 10000 });

    // 5. Verify the intercepted API call occurred
    expect(interceptedRequest).toBe(true);

    // 6. Verify table headers are visible
    await expect(page.locator('th:has-text("predicted_salary")')).toBeVisible();

    // 7. Verify table row has the mock prediction value
    await expect(page.locator('td:has-text("$95,000.00")')).toBeVisible();

    // 8. Verify download CSV button is visible
    await expect(page.locator('button:has-text("Download CSV")')).toBeVisible();
  });

  test('should handle validation errors from backend gracefully', async ({ page }) => {
    // Intercept POST and return a 400 Bad Request error
    await page.route('**/api/predict/batch', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: "Missing column: job_title"
        })
      });
    });

    await page.goto('/predict/batch');

    const filePayload = {
      name: 'employees_missing.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from("age,gender,education_level,years_of_experience\n32,Male,Bachelor's,5\n")
    };
    
    await page.setInputFiles('input[type="file"]', filePayload);

    // Expect the error screen to be displayed with the backend error message
    await page.waitForSelector('text=CSV Validation Failure', { timeout: 10000 });
    await expect(page.locator('text=Missing column: job_title')).toBeVisible();
  });
});
