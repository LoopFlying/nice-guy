const Puppeteer = require('./puppeteer')
const Observer = require('./puppeteer/observers')

class Performance {
  puppeteer
  observer

  constructor() {
    this.puppeteer = new Puppeteer()
    this.observer = new Observer()
  }

  async run(options) {
    const puppeteer = await this.puppeteer.init(options)

    this.observer.init(options, puppeteer)

    const { count = 3, url } = options
    const { page, browser } = puppeteer

    console.log('🚀 start executing')
    for (let i = 0; i < count; i += 1) {
      await this.observer.beforeStart()

      await page.goto(url, { waitUntil: 'networkidle0' })
      await this.observer.start()
    }

    console.log('🚀 start calculating')
    await this.observer.calculate()

    await browser.close()
  }
}

module.exports = Performance;


// // const url = 'https://lighting-cn.wgine.com/merchantHome/projectManage'
// const urlList = [
//   { name: '登录页', url: 'https://lighting-cn.wgine.com/login' },
//   {
//     name: '项目管理页',
//     url: 'https://lighting-cn.wgine.com/merchantHome/projectManage',
//   },
// ]

// for (let index = 0; index < urlList.length; index++) {
//   const {url} = urlList[index]
//   new Performance().run({
//     url,
//     count: 3,
//     tti: true,
//   })
// }
