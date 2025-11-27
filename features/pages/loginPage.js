class LoginPage {
  constructor(page) {
    this.page = page;
    this.selectors = {
      username: '#user-name',
      password: '#password',
      loginButton: '#login-button'
    };
  }

  async goto() {
    // default SauceDemo URL
    await this.page.goto('https://www.saucedemo.com');
    await this.page.waitForSelector(this.selectors.loginButton, { timeout: 5000 });
  }

  async fillCredentials(username, password) {
    await this.page.fill(this.selectors.username, username);
    await this.page.fill(this.selectors.password, password);
  }

  async clickLogin() {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'load' }).catch(() => {}),
      this.page.click(this.selectors.loginButton)
    ]);
  }

  async isDisplayed() {
    return await this.page.isVisible(this.selectors.loginButton);
  }
}

module.exports = LoginPage;
