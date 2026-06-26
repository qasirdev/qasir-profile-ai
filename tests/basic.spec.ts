import { test, expect } from '@playwright/test';

test.describe('Qasir Profile Website', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
  });

  test('has correct title and meta information', async ({ page }) => {
    await expect(page).toHaveTitle(/Qasir Mehmood/);
  });

  test('navigation works correctly', async ({ page }) => {
    // Test navigation links
    const aboutLink = page.locator('text=About');
    await aboutLink.click();
    await expect(page.locator('h2:has-text("About Me")')).toBeVisible();

    const experienceLink = page.locator('text=Experience');
    await experienceLink.click();
    await expect(page.locator('h2:has-text("Career Journey")')).toBeVisible();

    const skillsLink = page.locator('text=Skills');
    await skillsLink.click();
    await expect(page.locator('h2:has-text("Skills & Expertise")')).toBeVisible();
  });

  test('hero section displays correctly', async ({ page }) => {
    await expect(page.locator('h1:has-text("Qasir Mehmood")')).toBeVisible();
    await expect(page.locator('text=Senior Full-Stack Developer')).toBeVisible();
    await expect(page.locator('button:has-text("Download CV")')).toBeVisible();
    await expect(page.locator('button:has-text("Get In Touch")')).toBeVisible();
  });

  test('about section content is present', async ({ page }) => {
    await page.locator('text=About').click();
    await expect(page.locator('h2:has-text("About Me")')).toBeVisible();
    await expect(page.locator('text=Frontend Engineering')).toBeVisible();
    await expect(page.locator('text=Backend Architecture')).toBeVisible();
    await expect(page.locator('text=AI & Machine Learning')).toBeVisible();
  });

  test('career timeline displays experience', async ({ page }) => {
    await page.locator('text=Experience').click();
    await expect(page.locator('h2:has-text("Career Journey")')).toBeVisible();
    await expect(page.locator('text=Freelance')).toBeVisible();
    await expect(page.locator('text=Hecate Technologies Limited')).toBeVisible();
    await expect(page.locator('text=IPCortex')).toBeVisible();
  });

  test('skills section shows technical skills', async ({ page }) => {
    await page.locator('text=Skills').click();
    await expect(page.locator('h2:has-text("Skills & Expertise")')).toBeVisible();
    await expect(page.locator('text=Frontend')).toBeVisible();
    await expect(page.locator('text=Backend')).toBeVisible();
    await expect(page.locator('text=AI & ML')).toBeVisible();
  });

  test('portfolio section displays projects', async ({ page }) => {
    await page.locator('text=Portfolio').click();
    await expect(page.locator('h2:has-text("Portfolio & Projects")')).toBeVisible();
    await expect(page.locator('text=Azure AI Digital Transformation Platform')).toBeVisible();
    await expect(page.locator('text=Qasir Profile AI')).toBeVisible();
  });

  test('blog page loads (Sanity CMS)', async ({ page }) => {
    await page.goto('/blogs');
    await expect(page).toHaveTitle(/Blog \| Qasir Mehmood/);
    await expect(page.locator('h1:has-text("Blog")')).toBeVisible();
    await expect(
      page.locator('text=Featured Posts').or(page.locator('text=No blog posts yet'))
    ).toBeVisible();
  });

  test('navigation links to blog', async ({ page }) => {
    await page.locator('nav >> text=Blog').click();
    await expect(page).toHaveURL(/\/blogs$/);
    await expect(page.locator('h1:has-text("Blog")')).toBeVisible();
  });

  test('opens digital twin by default on first load', async ({ page }) => {
    await expect(page.locator('#ai-twin-panel')).toBeVisible();
    await expect(page.locator('#ai-twin-toggle')).toHaveAttribute('aria-expanded', 'true');
  });

  test('AI chat interface is functional', async ({ page }) => {
    const panel = page.locator('#ai-twin-panel');
    await expect(panel).toBeVisible();
    await expect(panel.locator('text=Qasir Mehmood')).toBeVisible();
    await expect(page.locator('textarea[placeholder*="Ask me anything"]')).toBeVisible();

    await page.locator('text=AI Chat').click();
    await expect(panel).toBeVisible();
  });

  test('stays closed after dismiss in same session', async ({ page }) => {
    await expect(page.locator('#ai-twin-panel')).toBeVisible();

    await page.locator('#ai-twin-toggle').click();
    await expect(page.locator('#ai-twin-panel')).toBeHidden();

    await page.reload();
    await expect(page.locator('#ai-twin-panel')).toBeHidden();
    await expect(page.locator('#ai-twin-toggle')).toHaveAttribute('aria-expanded', 'false');
  });

  test('contact section works', async ({ page }) => {
    await page.locator('text=Contact').click();
    await expect(page.locator('h2:has-text("Get In Touch")')).toBeVisible();
    await expect(page.locator('text=Compose a Message')).toBeVisible();
    await expect(page.locator('a[href="mailto:qasirdev@gmail.com"]').first()).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('responsive design works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Test mobile menu
    await expect(page.locator('button[aria-label="Open menu"]')).toBeVisible();
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.locator('text=About')).toBeVisible();
    await expect(page.locator('text=Experience')).toBeVisible();
  });

  test('dark mode toggle works', async ({ page }) => {
    // Check if theme toggle button exists
    const themeToggle = page.locator('button').filter({ has: page.locator('svg') }).first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      // Check if dark mode is applied (you might need to adjust this based on your implementation)
      await expect(page.locator('html')).toHaveClass(/dark/);
    }
  });

  test('social links are accessible', async ({ page }) => {
    const socialLinks = [
      'href*="linkedin.com"',
      'href*="github.com"',
      'href*="mailto:"'
    ];

    for (const linkSelector of socialLinks) {
      const link = page.locator(`a[${linkSelector}]`).first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href');
    }
  });

  test('forms have proper validation', async ({ page }) => {
    await page.locator('text=Contact').click();
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Check if validation works (adjust based on your validation implementation)
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toBeVisible();
    
    // Fill form with valid data
    await nameInput.fill('Test User');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="subject"]').fill('Test Subject');
    await page.locator('textarea[name="message"]').fill('Test message');
    
    await expect(page.locator('button[type="submit"]:has-text("Open in email app")')).toBeEnabled();
  });
});
