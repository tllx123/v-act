const program = require('commander')
const metadataUtil = require('../src/utils/Metadata')
const consoleUtils = require('../src/utils/ConsoleUtils')

program.option('-c, --componentCode <componentCode>', '构件编号').option('-w, --windowCode <windowCode>', '窗体编号')

program.parse(process.argv)

const options = program.opts()

if (options.componentCode && options.windowCode) {
  const componentCode = options.componentCode
  const windowCode = options.windowCode
  const metadata = metadataUtil.get()
  const previewPort = metadata.previewPort
  consoleUtils.out({
    success: true,
    type: 'getViewUrl',
    title: '获取预览地址',
    content: `http://localhost:${previewPort}/${componentCode}/${windowCode}`
  })
} else {
  consoleUtils.out({
    success: false,
    type: 'llegalArgumentException',
    title: '参数不正确',
    content: '未传递构件编号或窗体编号！'
  })
}
