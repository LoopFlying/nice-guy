const isSupportPerformance = () => {
  const { performance } = window
  return (
    performance &&
    !!performance.getEntriesByType &&
    !!performance.now &&
    !!performance.mark
  )
}

/**
 * @param {Number} ms
 * 把毫秒数转化为人类可读的字符串
 */
const format = (ms, readable = true) => {
  let ret = `${ms.toFixed(2)} ms`
  if (!readable) return ret
  const ONE_SECOND = 1000
  const ONE_MINUTE = 60 * ONE_SECOND
  const ONE_HORE = 60 * ONE_MINUTE
  // 小于1秒，那么用毫秒为单位
  if (ms >= ONE_SECOND && ms < ONE_MINUTE) {
    // 大于一秒小于一分钟，用秒作为单位
    ret = `${(ms / 1000).toFixed(2)} s`
  } else if (ms >= ONE_MINUTE && ms < ONE_HORE) {
    // 大于一分钟，小于一小时，用分钟作单位
    ret = `${(ms / 1000 / 60).toFixed(2)} m`
  } else if (ms >= ONE_HORE) {
    // 大于一个小时，用小时作单位
    ret = `${(ms / 1000 / 60 / 60).toFixed(2)} h`
  }
  return ret
}

const scoreLevel = ['fast', 'moderate', 'slow']

scores = {
  fcp: [2000, 4000],
  lcp: [2500, 4500],
  fid: [100, 300],
  tbt: [300, 600],
  cls: [0.1, 0.25],
}

const getScore = (type, data) => {
  const score = scores[type]
  for (let i = 0; i < score.length; i += 1) {
    if (data <= score[i]) return scoreLevel[i]
  }

  return scoreLevel[2]
}

/**
 * Maps the values of an object using the provided function, generating a new object with the same keys.
 * @param obj
 * @param fn
 * @returns
 */
const mapValues = (obj, fn) =>
  Object.keys(obj).reduce((acc, k) => {
    acc[k] = fn(obj[k], k, obj)
    return acc
  }, {})

/**
 * Checks if the a value is an empty object/collection
 * @param val
 * @returns
 */
const isEmpty = (val) => val == null || !(Object.keys(val) || val).length

module.exports = {
  isSupportPerformance,
  format,
  getScore,
  mapValues,
  isEmpty,
}
