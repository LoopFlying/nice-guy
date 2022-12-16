#!/usr/bin/env node

const { program } = require('commander')
const appInfo = require('../package.json')
const { Listr } = require('listr2')

const Performance = require('../src')
const { readFile, getPathName } = require('../src/utils/file')

program.version(appInfo.version)

program
  .command('url <url>')
  .description('单独处理一个url的操作')
  .option('-n, --count [count], 分析次数, 取平均值', 3)
  .action(async (url, option) => {
    const { count } = option
    const name =  getPathName(url)

    console.log(name);
    
    const task = new Listr([
      {
        title: 'start executing: ' + url,
        task: async () => {
          await new Performance().run({ url, name, count: +count <= 0 ? 1 : +count })
        },
      }
    ])
    await task.run()
  })

program
  .command('file <filePath>')
  .description('批量处理一个文件的操作')
  .option('-n, --count [count], 分析次数, 取平均值', 3)
  .action(async (filePath, option) => {
    const { count } = option
    const list = readFile(filePath)
    const task = new Listr(
      list.map((item) => {
        const { url, name } = item
        const testName = name ? name : getPathName(url)
        return {
          title: 'start executing: ' + testName,
          task: async () => {
            await new Performance().run({
              url,
              name: testName,
              count: +count <= 0 ? 1 : +count,
            })
          },
        }
      })
    )
    await task.run()
  })

program.parse(process.argv)
