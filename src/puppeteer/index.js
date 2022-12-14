const puppeteer = require('puppeteer')

class Puppeteer {
  async init() {
    const browser = await puppeteer.launch({
      product: 'chrome',
      args: ['--no-sandbox'],
      timeout: 10000,
    })
    const cache = '--no-cache'

    const page = await browser.newPage()
    await page.setCacheEnabled(cache);
    await page.setBypassCSP(true)

    return { page, browser }
  }
}

module.exports = Puppeteer
