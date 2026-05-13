const { test, expect } = require('@playwright/test');

test('OrangeHRM login and logout stable', async ({ page }) => {

  // 1. Open app
  await page.goto('https://opensource-demo.orangehrmlive.com/', {
    waitUntil: 'domcontentloaded'
  });

  // 2. Login
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');

  await Promise.all([
    page.waitForURL(/dashboard/, { timeout: 20000 }),
    page.click('button[type="submit"]')
  ]);

  // 3. Wait full dashboard load (IMPORTANT)
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // extra stability delay

  // 4. Open dropdown
  const userMenu = page.locator('.oxd-userdropdown-tab');
  await userMenu.waitFor({ state: 'visible', timeout: 15000 });
  await userMenu.click();

  // 5. WAIT for dropdown animation to finish
  await page.waitForTimeout(2000);

  // 6. Wait for Logout option properly
  const logoutBtn = page.locator('text=Logout');
  await logoutBtn.waitFor({ state: 'visible', timeout: 15000 });

  // 7. Click logout (slight delay before click helps UI settle)
  await page.waitForTimeout(1000);
  await logoutBtn.click();

  // 8. Verify logout
  await expect(page).toHaveURL(/login12/, { timeout: 15000 });

});