const { test, expect } = require('@playwright/test');

test.describe('Prediction Dashboard Integration Tests', () => {
  
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
  
  test('should submit manual entry prediction form and display results', async ({ page }) => {
    // Intercept API calls to /api/predict and mock successful prediction response
    let interceptedRequest = null;
    await page.route('**/api/predict', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        interceptedRequest = request.postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            prediction: {
              salary: 95000.00,
              currency: 'USD',
              model: 'Ridge Regression'
            }
          })
        });
      } else {
        await route.continue();
      }
    });

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    // 1. Go to manual entry form page
    await page.goto('/predict/manual');

    // 2. Step 0: Professional Info
    await page.fill('input[name="role"]', 'Software Engineer');
    await page.fill('input[name="experience"]', '5');
    await page.selectOption('select[name="employmentType"]', 'full-time');
    await page.selectOption('select[name="workMode"]', 'remote');
    await page.fill('input[name="location"]', 'San Francisco, USA');
    
    // Click Next
    await page.click('button:has-text("Next Step")');

    // 3. Step 1: Education
    await page.selectOption('select[name="education"]', 'bachelors');
    await page.fill('input[name="specialization"]', 'Computer Science');
    await page.fill('input[name="primarySkills"]', 'React, Node.js, Python');
    
    // Click Next
    await page.click('button:has-text("Next Step")');

    // 4. Step 2: Salary Context
    await page.fill('input[name="currentSalary"]', '95000');
    await page.fill('input[name="expectedSalary"]', '120000');
    await page.selectOption('select[name="industry"]', 'tech');
    await page.selectOption('select[name="careerLevel"]', 'mid');
    
    // Click Next
    await page.click('button:has-text("Next Step")');

    // 5. Step 3: Review Page
    await expect(page.locator('text=Review Information')).toBeVisible();

    // Submit form and trigger prediction request
    await page.click('button:has-text("Generate Prediction")');

    // 6. Verify correct API payload format is converted & sent
    await page.waitForTimeout(1000); // Wait briefly for route interception
    expect(interceptedRequest).not.toBeNull();
    expect(interceptedRequest.age).toBeDefined();
    expect(interceptedRequest.gender).toBeDefined();
    expect(interceptedRequest.education_level).toBe("Bachelor's");
    expect(interceptedRequest.job_title).toBe("Software Engineer");
    expect(interceptedRequest.years_of_experience).toBe(5);

    // 7. Verify redirect to result dashboard and display predicted values
    await page.waitForURL('**/predict/result');
    await expect(page.locator('text=Predicted Base Salary')).toBeVisible();
    await expect(page.locator('text=$95,000')).toBeVisible();
  });

  test('should handle validation/network errors gracefully and show user-friendly message', async ({ page }) => {
    // Intercept API calls to /api/predict and mock internal validation failure (HTTP 422)
    await page.route('**/api/predict', async (route) => {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Validation Error',
          message: 'The request payload did not pass validation rules.'
        })
      });
    });

    page.on('console', msg => console.log('PAGE LOG 2:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR 2:', err.message));

    // 1. Go to manual entry form page
    await page.goto('/predict/manual');

    // 2. Step 0: Fill profile
    await page.fill('input[name="role"]', 'Software Engineer');
    await page.fill('input[name="experience"]', '5');
    await page.selectOption('select[name="employmentType"]', 'full-time');
    await page.selectOption('select[name="workMode"]', 'remote');
    await page.fill('input[name="location"]', 'San Francisco, USA');
    await page.click('button:has-text("Next Step")');

    // 3. Step 1: Education
    await page.selectOption('select[name="education"]', 'bachelors');
    await page.fill('input[name="specialization"]', 'Computer Science');
    await page.fill('input[name="primarySkills"]', 'React, Node.js, Python');
    await page.click('button:has-text("Next Step")');

    // 4. Step 2: Salary Context
    await page.fill('input[name="currentSalary"]', '95000');
    await page.fill('input[name="expectedSalary"]', '120000');
    await page.selectOption('select[name="industry"]', 'tech');
    await page.selectOption('select[name="careerLevel"]', 'mid');
    await page.click('button:has-text("Next Step")');

    // 5. Step 3: Review and click Generate
    await page.click('button:has-text("Generate Prediction")');

    // 6. Verify error screen is displayed inline on the manual entry page
    await expect(page.locator('text=Prediction Failed')).toBeVisible();
    await expect(page.locator('text=The request payload did not pass validation rules.')).toBeVisible();
  });
});
