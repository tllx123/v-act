//增强next命令，将其启动进程pid写入到v-act缓存中，解决v-act预览服务关闭时，无法关闭next服务
const path = require('path')
const fs = require('fs')
const nodeModulesPath = path.resolve(__dirname, '../', 'node_modules')
const nextCmdPath = path.resolve(nodeModulesPath, 'next', 'dist', 'bin', 'next')
const content = new String(fs.readFileSync(nextCmdPath))
if (content.indexOf('require("@v-act/cli-utils")') == -1) {
  const lineBreakIndex = content.indexOf('\n')
  const data =
    content.substring(0, lineBreakIndex) +
    '\nconst vactUtils = require("@v-act/cli-utils");vactUtils.saveNextProcessPid(process.pid);\n' +
    content.substring(lineBreakIndex)
  fs.writeFileSync(nextCmdPath, data)
}
