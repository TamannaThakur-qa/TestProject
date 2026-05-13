const { test, expect } = require('@playwright/test');

test('OrangeHRM stable login logout CI fixed', async ({ page }) => {

  await page.goto('https://opensource-demo.orangehrmlive.com/', {
    waitUntil: 'domcontentloaded'
  });

  // LOGIN
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');

  await Promise.all([
    page.waitForURL(/dashboard/),
    page.click('button[type="submit"]')
  ]);

  // WAIT dashboard ready (IMPORTANT FIX)
  await expect(page.locator('.oxd-topbar-header-breadcrumb')).toBeVisible();

  // OPEN DROPDOWN (force helps WebKit)
  const userMenu = page.locator('.oxd-userdropdown-tab');
  await userMenu.waitFor({ state: 'visible' });
  await userMenu.click({ force: true });

  // WAIT FOR LOGOUT (CRITICAL FIX FOR WEBKIT)
  const logoutBtn = page.locator('text=Logout');

  await expect(logoutBtn).toBeVisible({ timeout: 10000 });

  // SMALL SAFETY WAIT (ONLY ONCE, NOT 2 SEC)
  await page.waitForTimeout(500);

  await logoutBtn.click();

  // FINAL VERIFY
  await expect(page).toHaveURL(/auth\/login/, { timeout: 15000 });

});