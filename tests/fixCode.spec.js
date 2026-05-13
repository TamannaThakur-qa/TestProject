const { test, expect } = require('@playwright/test');

test('OrangeHRM login and logout stable CI', async ({ page }) => {

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

  // ✅ WAIT FOR REAL ELEMENT (NOT timeout)
  await expect(page.locator('.oxd-topbar-header-breadcrumb')).toBeVisible();

  // OPEN DROPDOWN
  const userMenu = page.locator('.oxd-userdropdown-tab');
  await expect(userMenu).toBeVisible();
  await userMenu.click();

  // WAIT FOR LOGOUT
  const logoutBtn = page.locator('text=Logout');
  await expect(logoutBtn).toBeVisible();

  // LOGOUT
  await logoutBtn.click();

  // VERIFY LOGOUT
  await expect(page).toHaveURL(/auth\/login/);

});