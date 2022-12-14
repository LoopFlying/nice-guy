# nice-guy 好好先生
用来页面性能分析统计

## Install
```bash
npm install d -g nice-guy

# or use yarn(recommend):
# yarn global add pmat
```

## Usage
nice-guy --help 

Commands:

  url  <url>        单独处理一个url的操作
  file  <filePath>  批量处理一个文件的操作

For instance

```bash
# 单独处理百度，加载次数3次
nice-guy url https://www.baidu.com -n 3

# 批量处理文件中的url, 加载次数3次
nice-guy file ./example/test.json -n 3 

```

test.json文件格式
```json
[
  { "name": "登录页", "url": "https://xxxx/login" },
  { "name": "详情页", "url": "https://xxxx/detail" },
]
```

## 输出
运行后会在当前执行命令的目录下生成out文件