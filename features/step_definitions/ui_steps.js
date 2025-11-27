const { Given, When, Then, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const playwright = require('playwright');
const assert = require('assert');
const LoginPage = require('../pages/loginPage');
const InventoryPage = require('../pages/inventoryPage');

// increase timeout for UI actions
setDefaultTimeout(60 * 1000);

Before({ tags: '@ui' }, async function () {
  // create browser and page for UI scenarios (only for @ui tagged scenarios)
  // Allow running headful by setting UI_HEADLESS=false in the environment
  const headless = process.env.UI_HEADLESS === undefined ? true : !(process.env.UI_HEADLESS === 'false' || process.env.UI_HEADLESS === '0');
  const slowMo = process.env.UI_SLOWMO ? Number(process.env.UI_SLOWMO) : undefined;
  const launchOptions = { headless };
  if (typeof slowMo === 'number' && !Number.isNaN(slowMo)) launchOptions.slowMo = slowMo;

  this._browser = await playwright.chromium.launch(launchOptions);
  this._context = await this._browser.newContext();
  this._page = await this._context.newPage();
  this.loginPage = new LoginPage(this._page);
  this.inventoryPage = new InventoryPage(this._page);
});

After({ tags: '@ui' }, async function () {
  if (this._page && typeof this._page.close === 'function') await this._page.close();
  if (this._context && typeof this._context.close === 'function') await this._context.close();
  if (this._browser && typeof this._browser.close === 'function') await this._browser.close();
});

Given('the SauceDemo login page is displayed', async function () {
  await this.loginPage.goto();
  const ok = await this.loginPage.isDisplayed();
  assert.ok(ok, 'Login page not displayed');
});

When('the username {string} and password {string} are entered', async function (username, password) {
  await this.loginPage.fillCredentials(username, password);
});

When('the login button is clicked', async function () {
  await this.loginPage.clickLogin();
});

Then('the inventory page should be displayed', async function () {
  const shown = await this.inventoryPage.isDisplayed();
  assert.ok(shown, 'Inventory page not displayed');
});

