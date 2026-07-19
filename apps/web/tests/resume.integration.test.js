const { test, expect } = require('@playwright/test');

test.describe('Resume Prediction Dashboard Integration Tests', () => {
  
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

  test('should upload resume, process PDF, extract features and show inline prediction', async ({ page }) => {
    let interceptedRequest = null;
    
    // Intercept POST /api/predict/resume and mock successful parsing + prediction
    await page.route('**/api/predict/resume', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        interceptedRequest = request.postData();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            extracted_features: {
              name: 'Alice Johnson',
              job_title: 'Software Engineer',
              experience: 5.0,
              education_level: "Bachelor's",
              skills: ['Python', 'React', 'SQL', 'Git']
            },
            prediction: {
              salary: 95000.00,
              currency: 'USD'
            }
          })
        });
      } else {
        await route.continue();
      }
    });

    // 1. Navigate to resume prediction page
    await page.goto('/predict/resume');

    page.on('console', msg => console.log('RESUME PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('RESUME PAGE ERROR:', err.message));

    // 2. Select file and upload using setInputFiles on the hidden file input
    const fileBuffer = Buffer.from('%PDF-1.4 mock pdf text content');
    await page.setInputFiles('input[type="file"]', {
      name: 'resume.pdf',
      mimeType: 'application/pdf',
      buffer: fileBuffer
    });

    // 3. Verify file card is displayed
    await expect(page.locator('text=resume.pdf')).toBeVisible();

    // 4. Click continue to process resume
    await page.click('button:has-text("Continue")');

    // 5. Verify progress step text shows up
    await expect(page.locator('text=Uploading encrypted document')).toBeVisible();

    // 6. Wait for simulation progress bar and the mock API completion
    await page.waitForTimeout(5000); // Allow progress animation (150ms * ~20 intervals) to complete

    // 7. Verify correct information preview is extracted & displayed
    await expect(page.locator('text=Extracted Profile Summary')).toBeVisible();
    await expect(page.locator('text=Alice Johnson')).toBeVisible();
    await expect(page.locator('text=Software Engineer')).toBeVisible();
    await expect(page.locator('text=5 Years')).toBeVisible();
    await expect(page.locator('text=Bachelor\'s')).toBeVisible();
    
    // Skills matrix tags
    await expect(page.locator('text=Python')).toBeVisible();
    await expect(page.locator('text=React')).toBeVisible();

    // 8. Verify predicted salary card is visible with formatted median value
    await expect(page.locator('text=Estimated Salary Range')).toBeVisible();
    await expect(page.locator('text=$95,000')).toBeVisible();

    // 9. Click navigation to detail dashboard and verify routing success
    await page.click('button:has-text("View Detailed Analytics")');
    await page.waitForURL('**/predict/result');
    await expect(page.locator('text=Predicted Base Salary')).toBeVisible();
    await expect(page.locator('text=$95,000')).toBeVisible();
  });

  test('should show error states when PDF parsing fails', async ({ page }) => {
    // Intercept and mock 422 Unprocessable Entity error (e.g. unreadable scanned PDF)
    await page.route('**/api/predict/resume', async (route) => {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Unprocessable Entity',
          message: 'Invalid or corrupted PDF file: PDF is unreadable or empty.'
        })
      });
    });

    // 1. Navigate to page
    await page.goto('/predict/resume');

    // 2. Select file
    const fileBuffer = Buffer.from('%PDF-1.4 mock scan');
    await page.setInputFiles('input[type="file"]', {
      name: 'scanned.pdf',
      mimeType: 'application/pdf',
      buffer: fileBuffer
    });

    // 3. Submit
    await page.click('button:has-text("Continue")');

    // 4. Wait for processing progress completion
    await page.waitForTimeout(5000);

    // 5. Verify error notification is rendered inline
    await expect(page.locator('text=Resume Analysis Failed')).toBeVisible();
    await expect(page.locator('text=Invalid or corrupted PDF file: PDF is unreadable or empty.')).toBeVisible();
    await expect(page.locator('button:has-text("Retry Analysis")')).toBeVisible();
  });
});
