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
  const observer = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries()
    observer.disconnect()
    const lastEntry = entries[entries.length - 1]
    window.LCP = entries[entries.length - 1].startTime
    // window.LCP = lastEntry.renderTime || lastEntry.loadTime
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

module.exports  = {
  getPaint,
  getLCP,
  getCLS,
  getFID,
  getTBT,
}
