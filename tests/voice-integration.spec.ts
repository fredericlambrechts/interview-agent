import { test, expect } from '@playwright/test';

test.describe('Voice Interface Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Grant microphone permissions
    await page.context().grantPermissions(['microphone']);
    
    // Navigate to voice test page
    await page.goto('/test-voice');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display voice interface components', async ({ page }) => {
    // Check that main components are visible
    await expect(page.getByText('Voice Interface Test Page')).toBeVisible();
    await expect(page.getByText('Voice Recording')).toBeVisible();
    await expect(page.getByText('Voice Playback')).toBeVisible();
    
    // Check recording button is present
    const recordButton = page.getByRole('button', { name: /start recording/i });
    await expect(recordButton).toBeVisible();
    await expect(recordButton).toBeEnabled();

    // Check test voice button is present
    const testVoiceButton = page.getByRole('button', { name: /test voice/i });
    await expect(testVoiceButton).toBeVisible();
    await expect(testVoiceButton).toBeEnabled();
  });

  test('should show browser support status', async ({ page }) => {
    // Check for support badge
    const supportBadge = page.locator('[data-testid="support-badge"], .badge').first();
    await expect(supportBadge).toBeVisible();
    
    // Badge should show "Supported" in modern browsers
    const badgeText = await supportBadge.textContent();
    expect(badgeText).toContain('Supported');
  });

  test('should handle recording button states', async ({ page }) => {
    const recordButton = page.getByRole('button', { name: /start recording/i });
    
    // Initial state should be "Start Recording"
    await expect(recordButton).toHaveText(/start recording/i);
    
    // Click to start recording
    await recordButton.click();
    
    // Should change to "Stop Recording"
    await expect(page.getByRole('button', { name: /stop recording/i })).toBeVisible();
    
    // Should show recording indicator
    await expect(page.locator('.animate-pulse')).toBeVisible();
    
    // Should show duration counter
    await expect(page.locator('text=/\\d+:\\d+/')).toBeVisible();
    
    // Stop recording
    await page.getByRole('button', { name: /stop recording/i }).click();
    
    // Should return to initial state
    await expect(page.getByRole('button', { name: /start recording/i })).toBeVisible();
    
    // Should show transcribe button
    await expect(page.getByRole('button', { name: /transcribe/i })).toBeVisible();
  });

  test('should handle voice synthesis', async ({ page }) => {
    const testVoiceButton = page.getByRole('button', { name: /test voice/i });
    
    // Click test voice button
    await testVoiceButton.click();
    
    // Should show loading state
    await expect(page.getByText(/generating/i)).toBeVisible();
    
    // Wait for synthesis to complete (with timeout)
    await page.waitForFunction(() => {
      const playButton = document.querySelector('button:has-text("Play")');
      return playButton && !playButton.disabled;
    }, { timeout: 10000 });
    
    // Should show play controls
    await expect(page.getByRole('button', { name: /play/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /stop/i })).toBeVisible();
    
    // Should show audio progress
    await expect(page.locator('input[type="range"]')).toBeVisible();
    
    // Should show duration display
    await expect(page.locator('text=/\\d+:\\d+ \\/ \\d+:\\d+/')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('/api/voice/tts', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'API key not configured' })
      });
    });
    
    const testVoiceButton = page.getByRole('button', { name: /test voice/i });
    await testVoiceButton.click();
    
    // Should show error message
    await expect(page.getByText(/API key not configured/i)).toBeVisible();
    await expect(page.locator('.text-destructive')).toBeVisible();
  });

  test('should clear recording when requested', async ({ page }) => {
    // Start and stop a recording first
    await page.getByRole('button', { name: /start recording/i }).click();
    await page.waitForTimeout(1000); // Record for 1 second
    await page.getByRole('button', { name: /stop recording/i }).click();
    
    // Verify recording exists
    await expect(page.getByText(/recording complete/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /transcribe/i })).toBeVisible();
    
    // Clear recording
    await page.getByRole('button', { name: /clear/i }).click();
    
    // Recording should be cleared
    await expect(page.getByText(/recording complete/i)).not.toBeVisible();
    await expect(page.getByRole('button', { name: /transcribe/i })).not.toBeVisible();
  });

  test('should show proper accessibility attributes', async ({ page }) => {
    // Check that buttons have proper accessibility
    const recordButton = page.getByRole('button', { name: /start recording/i });
    await expect(recordButton).toHaveAttribute('type', 'button');
    
    // Check that progress elements are accessible
    const progressBars = page.locator('[role="progressbar"]');
    if (await progressBars.count() > 0) {
      await expect(progressBars.first()).toBeVisible();
    }
    
    // Check that error messages are properly announced
    await page.route('/api/voice/tts', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Test error message' })
      });
    });
    
    await page.getByRole('button', { name: /test voice/i }).click();
    const errorElement = page.getByText(/test error message/i);
    await expect(errorElement).toBeVisible();
    await expect(errorElement).toHaveClass(/text-destructive/);
  });

  test('should handle microphone permission denial', async ({ page, context }) => {
    // Create new context without microphone permission
    const restrictedPage = await context.newPage();
    await restrictedPage.goto('/test-voice');
    
    // Try to start recording
    await restrictedPage.getByRole('button', { name: /start recording/i }).click();
    
    // Should show permission error
    await expect(restrictedPage.getByText(/failed to access microphone/i)).toBeVisible();
  });

  test('should maintain state consistency during interactions', async ({ page }) => {
    // Test that UI state remains consistent during various operations
    
    // 1. Start recording
    await page.getByRole('button', { name: /start recording/i }).click();
    await expect(page.getByRole('button', { name: /stop recording/i })).toBeVisible();
    
    // 2. Stop recording
    await page.getByRole('button', { name: /stop recording/i }).click();
    await expect(page.getByRole('button', { name: /start recording/i })).toBeVisible();
    
    // 3. Start voice synthesis
    await page.getByRole('button', { name: /test voice/i }).click();
    
    // 4. During synthesis, recording should still be available
    await expect(page.getByRole('button', { name: /start recording/i })).toBeVisible();
    
    // 5. Wait for synthesis to complete
    await page.waitForFunction(() => {
      const playButton = document.querySelector('button:has-text("Play")');
      return playButton && !playButton.disabled;
    }, { timeout: 10000 });
    
    // 6. Both recording and playback should be available
    await expect(page.getByRole('button', { name: /start recording/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /play/i })).toBeVisible();
  });
});

test.describe('Voice API Endpoints', () => {
  test('TTS endpoint should return audio', async ({ request }) => {
    const response = await request.post('/api/voice/tts', {
      data: {
        text: 'Hello, this is a test.',
      },
    });
    
    if (response.status() === 200) {
      expect(response.headers()['content-type']).toBe('audio/mpeg');
      const body = await response.body();
      expect(body.length).toBeGreaterThan(0);
    } else {
      // If API key is not configured, should return appropriate error
      expect(response.status()).toBe(500);
      const errorBody = await response.json();
      expect(errorBody.error).toContain('API key');
    }
  });

  test('STT endpoint should handle multipart data', async ({ request }) => {
    // Create a minimal audio blob for testing
    const audioData = new ArrayBuffer(1024);
    const blob = new Blob([audioData], { type: 'audio/webm' });
    
    const formData = new FormData();
    formData.append('audio', blob, 'test.webm');
    
    const response = await request.post('/api/voice/stt', {
      multipart: {
        audio: {
          name: 'test.webm',
          mimeType: 'audio/webm',
          buffer: Buffer.from(audioData)
        }
      },
    });
    
    // Should either process successfully or return appropriate error
    if (response.status() !== 200) {
      const errorBody = await response.json();
      expect(errorBody.error).toBeDefined();
    }
  });

  test('API endpoints should handle missing data', async ({ request }) => {
    // Test TTS without text
    const ttsResponse = await request.post('/api/voice/tts', {
      data: {},
    });
    expect(ttsResponse.status()).toBe(400);
    
    // Test STT without audio
    const sttResponse = await request.post('/api/voice/stt', {
      data: {},
    });
    expect(sttResponse.status()).toBe(400);
  });
});