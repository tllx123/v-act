const program = require('commander')
const open = require('open')
const metadataUtil = require('../src/utils/Metadata')

program
  .option('-c, --componentCode <componentCode>', '构件编号')
  .option('-w, --windowCode <windowCode>', '窗体编号')

program.parse(process.argv)

const options = program.opts()

if (options.componentCode && options.windowCode) {
  const componentCode = options.componentCode
  const windowCode = options.windowCode
  const metadata = metadataUtil.get()
  const previewPort = metadata.previewPort
  if (previewPort) {
    open(`http://localhost:${previewPort}/${componentCode}/${windowCode}`, {
      wait: true
    })
  } else {
    throw Error('预览失败，预览服务未启动！')
  }
} else {
  throw Error('构件编号，窗体编号不能为空！')
}
