/* eslint-disable no-param-reassign */
const { isEmpty, format, getScore } = require('../../utils')

class Metric {
  name = 'metric'
  metricList = []

  beforeStart(options) {
    const { page } = options
    page.evaluateOnNewDocument(getLCP)
    page.evaluateOnNewDocument(getPaint)
    page.evaluateOnNewDocument(getCLS)
    page.evaluateOnNewDocument(getFID)
    page.evaluateOnNewDocument(getTBT)
  }

  async start(options) {
    const { page, tti = false } = options

    await page.waitForSelector('body', { visible: true })
    await page.click('body')

    let TTI = null

    if (tti) {
      // await page.addScriptTag({
      //   path: './src/puppeteer/observers/tti-polyfill.js',
      // })

      // // Time to Interactive
      // TTI = await page.evaluate(() =>
      //   window.ttiPolyfill
      //     ? window.ttiPolyfill.getFirstConsistentlyInteractive()
      //     : -1
      // )
    } else {
      await page.waitForTimeout(50)
    }

    const metrics = await page.evaluate(() => {
      const { FP, FCP, LCP, CLS, FID, TBT } = window
      return { FP, FCP, LCP, CLS, FID, TBT }
    })

    this.metricList.push({ ...metrics, TTI })
  }

  calculate() {
    if (isEmpty(this.metricList)) {
      return {}
    }

    const result = this.metricList.reduce((prev, next) => {
      Object.keys(next).forEach((key) => {
        prev[key] = next[key] + (prev[key] || 0)
      })
      return prev
    }, {})

    const { length } = this.metricList // 分析次数

    return [
      {
        key: 'FP',
        name: 'FP  (First Paint)',
        measure: this.getAverage(result.FP, length),
      },
      {
        key: 'FCP',
        name: 'FCP (First Content Paint)',
        measure: this.getAverage(result.FCP, length),
        score: getScore('fcp', this.getAverage(result.FCP, length)),
      },
      {
        key: 'LCP',
        name: 'LCP (Largest Contentful Paint)',
        measure: this.getAverage(result.LCP, length),
        score: getScore('lcp', this.getAverage(result.LCP, length)),
      },
      {
        key: 'CLS',
        name: 'CLS (Cumulative Layout Shift)',
        measure: this.getAverage(result.CLS, length).toFixed(5),
        score: getScore('cls', this.getAverage(result.CLS, length)),
      },
      {
        key: 'FID',
        name: 'FID (First Input Delay)',
        measure: this.getAverage(result.FID, length),
        score: getScore('fid', this.getAverage(result.FID, length)),
      },
      {
        key: 'TBT',
        name: 'TBT (Total Blocking Time)',
        measure: this.getAverage(result.TBT, length),
        score: getScore('tbt', this.getAverage(result.TBT, length)),
      },
      result.TTI
        ? {
            key: 'TTI',
            name: 'TTI (Time to Interactive)',
            measure: this.getAverage(result.TTI, length),
          }
        : {
            name: '',
            measure: '',
          },
    ]
  }

  getAverage(total, length) {
    return total / length
  }
}

/**
 * First Paint
 * First Contentful Paint
 */
function getPaint() {
  window.FP = 0
  window.FCP = 0

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const { startTime, name } = entry
      if (name === 'first-contentful-paint') {
        window.FCP = startTime
      } else {
        window.FP = startTime
      }
    }
  })

  observer.observe({ entryTypes: ['paint'] })
}

/**
 * Largest Contentful Paint
 */
function getLCP() {
  window.LCP = 0
  console.log('start ---- getLCP -------')
  const observer = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries()
    const lastEntry = entries[entries.length - 1]

    console.log('entries', entries)
    console.log('lastEntry', lastEntry)
    window.LCP = lastEntry.renderTime || lastEntry.loadTime
  })

  observer.observe({ entryTypes: ['largest-contentful-paint'], buffered: true })
}

/**
 * Cumulative Layout Shift
 */
function getCLS() {
  window.CLS = 0

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        window.CLS += entry.value
      }
    }
  })

  observer.observe({ entryTypes: ['layout-shift'] })
}

/**
 * First Input Delay
 */
function getFID() {
  window.FID = 0
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      window.FID = entry.processingStart - entry.startTime
    }
  })

  observer.observe({ type: 'first-input', buffered: true })
}

function getTBT() {
  window.TBT = 0
  window.__tti = { e: [] }

  const observer = new PerformanceObserver((list) => {
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]
      .startTime
    const entries = list.getEntries()

    window.__tti.e = window.__tti.e.concat(entries)

    for (const entry of entries) {
      if (entry.name !== 'self' || entry.startTime < fcp) {
        return
      }
      // long tasks mean time over 50ms
      const blockingTime = entry.duration - 50
      if (blockingTime > 0) window.TBT += blockingTime
    }
  })

  observer.observe({ entryTypes: ['longtask'] })
}

module.exports = new Metric()
exports = {
  getPaint,
  getLCP,
  getCLS,
  getFID,
  getTBT,
}
