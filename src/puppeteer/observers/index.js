

const navigation  = require('./navigation')
const metric  = require('./metric')
const dayjs = require('dayjs')
const fs = require('fs')
const chalk = require("chalk");

class Observer {
  puppeteer = {}
  options = {}
  observers = []
  results = {}

  init(options = {url: '', name:'', count: 1, tti: true}, puppeteer) {
    this.puppeteer = puppeteer;
    this.options = options;
    this.observers = [navigation, metric];
    return this;
  }

  async beforeStart() {
    for (const observer of this.observers) {
      await observer.beforeStart?.(this.puppeteer);
    }
  }

  async start() {
    for (const observer of this.observers) {
      await observer.start(this.puppeteer);
    }
  }

  calculate() {
    const results = {url: this.options?.url, name: this.options.name || 'test'};
    for (const observer of this.observers) {
      results[observer.name] = observer.calculate();
    }
    this.results = results;

    if(!fs.existsSync('./out')) {
      fs.mkdirSync('out')
    }

    const log = '详细查看: ./out'
    console.log(log);
    console.log(results);

    const fileTime = dayjs().format('YYYYMMDDHHmmss')
    fs.writeFileSync(`out/${this.options.name || this.options?.url}-${fileTime}.json`, JSON.stringify(results, null, 2))
  }
}

module.exports = Observer;
