const { test, expect } = require('@playwright/test');

test('OrangeHRM CI stable login logout', async ({ page }) => {

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

  // WAIT DASHBOARD READY
  await expect(page.locator('.oxd-topbar-header-breadcrumb')).toBeVisible();

  // OPEN DROPDOWN (FIX FOR WEBKIT)
  const userMenu = page.locator('.oxd-userdropdown-tab');

  await expect(userMenu).toBeVisible();
  await userMenu.click({ force: true });   // 🔥 KEY FIX

  // WAIT FOR MENU
  const logoutBtn = page.locator('text=Logout');

  await expect(logoutBtn).toBeVisible({ timeout: 10000 });

  // EXTRA SAFETY FOR WEBKIT
  await page.waitForTimeout(300);

  await logoutBtn.click();

  // FINAL CHECK
  await expect(page).toHaveURL(/auth\/login/, { timeout: 15000 });

});