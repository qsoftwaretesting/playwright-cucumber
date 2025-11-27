class InventoryPage {
  constructor(page) {
    this.page = page;
    this.selectors = {
      inventoryContainer: '#inventory_container',
      inventoryList: '.inventory_list',
      inventoryItem: '.inventory_item'
    };
  }

  async isDisplayed() {
    // wait for either container or list
    try {
      await this.page.waitForSelector(this.selectors.inventoryContainer, { timeout: 5000 });
      return true;
    } catch (e) {
      try {
        await this.page.waitForSelector(this.selectors.inventoryList, { timeout: 5000 });
        return true;
      } catch (err) {
        return false;
      }
    }
  }
}

module.exports = InventoryPage;
