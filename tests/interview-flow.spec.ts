import { test, expect } from '@playwright/test';

test.describe('Interview Flow', () => {
  const testSessionId = 'test-session-' + Date.now();
  
  test.beforeEach(async ({ page }) => {
    // Grant microphone permissions for voice interface
    await page.context().grantPermissions(['microphone']);
    
    // Set up session storage with user data
    await page.goto('/landing');
    await page.evaluate(() => {
      sessionStorage.setItem('userName', 'John Doe');
      sessionStorage.setItem('userRole', 'CEO');
      sessionStorage.setItem('userLinkedinUrl', 'https://linkedin.com/in/johndoe');
    });
  });

  test('should display interview landing page correctly', async ({ page }) => {
    // Mock the research status API to return completed research
    await page.route(`/api/research/status/${testSessionId}`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          status: 'completed',
          companyUrl: 'brainomix.com',
          analysisContent: 'Sample analysis content',
          completedAt: new Date().toISOString(),
          artifactsCompleted: 23,
          totalArtifacts: 23,
          assessmentSessionId: testSessionId
        })
      });
    });

    // Navigate to interview landing page
    await page.goto(`/interview/${testSessionId}`);
    await page.waitForLoadState('networkidle');

    // Check main title and description
    await expect(page.getByRole('heading', { name: 'Strategic Assessment Interview' })).toBeVisible();
    await expect(page.getByText('Voice-Powered Business Discovery')).toBeVisible();

    // Check research completion indicator
    await expect(page.getByText('Research Completed')).toBeVisible();
    await expect(page.locator('svg').first()).toBeVisible(); // CheckCircle icon

    // Check user information display
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('CEO')).toBeVisible();

    // Check company information
    await expect(page.getByText('brainomix.com')).toBeVisible();
    await expect(page.getByText('23/23 research artifacts completed')).toBeVisible();

    // Check assessment overview parts
    await expect(page.getByText('Part 1')).toBeVisible();
    await expect(page.getByText('Strategic Foundation')).toBeVisible();
    await expect(page.getByText('Part 2')).toBeVisible();
    await expect(page.getByText('Strategy & Positioning')).toBeVisible();
    await expect(page.getByText('Part 3')).toBeVisible();
    await expect(page.getByText('Execution & Operations')).toBeVisible();

    // Check interview details
    await expect(page.getByText('What to Expect')).toBeVisible();
    await expect(page.getByText('Voice-first conversation with AI interviewer')).toBeVisible();
    await expect(page.getByText('30-45 minutes structured discussion')).toBeVisible();

    // Check benefits section
    await expect(page.getByText('Benefits')).toBeVisible();
    await expect(page.getByText('Personalized go-to-market strategy')).toBeVisible();

    // Check main CTA button
    const beginButton = page.getByRole('button', { name: /begin voice interview/i });
    await expect(beginButton).toBeVisible();
    await expect(beginButton).toBeEnabled();
  });

  test('should navigate from landing to conduct page', async ({ page }) => {
    // Mock the research status API
    await page.route(`/api/research/status/${testSessionId}`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          status: 'completed',
          companyUrl: 'brainomix.com',
          assessmentSessionId: testSessionId
        })
      });
    });

    // Start at landing page
    await page.goto(`/interview/${testSessionId}`);
    await page.waitForLoadState('networkidle');

    // Click begin interview button
    const beginButton = page.getByRole('button', { name: /begin voice interview/i });
    await beginButton.click();

    // Should navigate to conduct page
    await expect(page).toHaveURL(`/interview/${testSessionId}/conduct`);
  });

  test('should display interview conduct page correctly', async ({ page }) => {
    // Mock the research status API
    await page.route(`/api/research/status/${testSessionId}`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          status: 'completed',
          companyUrl: 'brainomix.com',
          assessmentSessionId: testSessionId
        })
      });
    });

    // Navigate directly to conduct page
    await page.goto(`/interview/${testSessionId}/conduct`);
    await page.waitForLoadState('networkidle');

    // Check main header
    await expect(page.getByRole('heading', { name: 'Strategic Assessment Interview' })).toBeVisible();
    await expect(page.getByText('Voice conversation with AI interviewer')).toBeVisible();

    // Check back button
    const backButton = page.getByRole('button', { name: /back to overview/i });
    await expect(backButton).toBeVisible();

    // Check left sidebar navigation
    await expect(page.getByRole('heading', { name: 'Strategic Assessment', exact: true })).toBeVisible();
    await expect(page.getByText('Go-to-Market Strategy Analysis')).toBeVisible();
    await expect(page.getByText('Overall Progress')).toBeVisible();

    // Check assessment structure parts
    await expect(page.getByText('Strategic Foundation')).toBeVisible();
    await expect(page.getByText('Strategy & Positioning')).toBeVisible();
    await expect(page.getByText('Execution & Operations')).toBeVisible();

    // Check traffic light status indicators
    const statusIndicators = page.locator('.w-3.h-3.rounded-full');
    await expect(statusIndicators).toHaveCount(9); // 9 total steps

    // Check current step indicator
    await expect(page.getByText('Current: Customer & Market Intelligence')).toBeVisible();
    await expect(page.getByText('Step 2 of 9 • Part 1: Strategic Foundation')).toBeVisible();

    // Check interview instructions
    await expect(page.getByText('Interview Instructions')).toBeVisible();
    await expect(page.getByText('What to expect:')).toBeVisible();
    await expect(page.getByText('Natural voice conversation')).toBeVisible();
    await expect(page.getByText('Tips for best results:')).toBeVisible();

    // Check voice interface sidebar
    await expect(page.getByText('Voice Interview')).toBeVisible();
    const endButton = page.getByRole('button', { name: /end interview/i });
    await expect(endButton).toBeVisible();

    // Check if ElevenLabs script is loaded (may take time)
    await page.waitForTimeout(2000);
    const elevenLabsWidget = page.locator('elevenlabs-convai');
    // Widget may not be visible immediately due to external script loading
    // Just check that the element exists in DOM
    await expect(elevenLabsWidget).toHaveCount(1);
  });

  test('should handle back navigation correctly', async ({ page }) => {
    // Mock the research status API
    await page.route(`/api/research/status/${testSessionId}`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          status: 'completed',
          companyUrl: 'brainomix.com',
          assessmentSessionId: testSessionId
        })
      });
    });

    // Navigate to conduct page
    await page.goto(`/interview/${testSessionId}/conduct`);
    await page.waitForLoadState('networkidle');

    // Click back button
    const backButton = page.getByRole('button', { name: /back to overview/i });
    await backButton.click();

    // Should return to landing page
    await expect(page).toHaveURL(`/interview/${testSessionId}`);
    await expect(page.getByRole('heading', { name: 'Strategic Assessment Interview' })).toBeVisible();
    await expect(page.getByText('Research Completed')).toBeVisible();
  });

  test('should handle missing session data gracefully', async ({ page }) => {
    // Clear session storage
    await page.evaluate(() => {
      sessionStorage.clear();
    });

    // Mock API to return error
    await page.route(`/api/research/status/${testSessionId}`, route => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Session not found'
        })
      });
    });

    // Navigate to interview page
    await page.goto(`/interview/${testSessionId}`);
    await page.waitForLoadState('networkidle');

    // Should still render basic structure with default values
    await expect(page.getByRole('heading', { name: 'Strategic Assessment Interview' })).toBeVisible();
    await expect(page.getByText('Unknown User')).toBeVisible();
    await expect(page.getByText('Unknown Role')).toBeVisible();
  });

  test('should display progress correctly in sidebar', async ({ page }) => {
    // Mock the research status API
    await page.route(`/api/research/status/${testSessionId}`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          status: 'completed',
          companyUrl: 'brainomix.com',
          assessmentSessionId: testSessionId
        })
      });
    });

    await page.goto(`/interview/${testSessionId}/conduct`);
    await page.waitForLoadState('networkidle');

    // Check progress calculation (1 completed + 0.5 * 1 in-progress = 1.5 / 9 = ~17%)
    await expect(page.getByText('17%')).toBeVisible();

    // Check step counts
    await expect(page.getByText('1 completed, 1 in progress, 7 remaining')).toBeVisible();

    // Check part completion indicators
    await expect(page.getByText('1/2')).toBeVisible(); // Part 1: Strategic Foundation
    await expect(page.getByText('0/4')).toBeVisible(); // Part 2: Strategy & Positioning
    await expect(page.getByText('0/3')).toBeVisible(); // Part 3: Execution & Operations
  });

  test('should handle responsive layout', async ({ page }) => {
    // Mock the research status API
    await page.route(`/api/research/status/${testSessionId}`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          status: 'completed',
          companyUrl: 'brainomix.com',
          assessmentSessionId: testSessionId
        })
      });
    });

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`/interview/${testSessionId}`);
    await page.waitForLoadState('networkidle');

    // Assessment overview should adapt to mobile
    const assessmentCards = page.locator('.grid.md\\:grid-cols-3');
    await expect(assessmentCards).toBeVisible();

    // Test conduct page on mobile
    await page.goto(`/interview/${testSessionId}/conduct`);
    await page.waitForLoadState('networkidle');

    // Sidebar should be responsive
    const sidebar = page.locator('.w-80').first();
    await expect(sidebar).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Layout should adapt
    await expect(page.getByRole('heading', { name: 'Strategic Assessment Interview' })).toBeVisible();
  });

  test('should preserve user data across navigation', async ({ page }) => {
    // Mock the research status API
    await page.route(`/api/research/status/${testSessionId}`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          status: 'completed',
          companyUrl: 'brainomix.com',
          assessmentSessionId: testSessionId
        })
      });
    });

    // Start at landing page
    await page.goto(`/interview/${testSessionId}`);
    await page.waitForLoadState('networkidle');

    // Verify user info is displayed
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('CEO')).toBeVisible();

    // Navigate to conduct page
    const beginButton = page.getByRole('button', { name: /begin voice interview/i });
    await beginButton.click();
    await page.waitForLoadState('networkidle');

    // User data should still be available (not directly visible on conduct page but should be loaded)
    // We can verify this by checking that the page loaded successfully without errors
    await expect(page.getByRole('heading', { name: 'Strategic Assessment Interview' })).toBeVisible();

    // Navigate back
    const backButton = page.getByRole('button', { name: /back to overview/i });
    await backButton.click();
    await page.waitForLoadState('networkidle');

    // User info should still be preserved
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('CEO')).toBeVisible();
  });
});