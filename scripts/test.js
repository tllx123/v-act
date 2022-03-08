import fs from 'fs'
import path from 'path'

const convertWebFuncs = function () {
  const desDir = 'D:\\Workspace\\github\\v-act\\packages\\funcs'
  const sourceDir = 'D:\\Workspace\\github\\vplatform-plugin-function-client'
  const funcDirs = fs.readdirSync(sourceDir)
  funcDirs.forEach((funcDir) => {
    convertWebFunc(path.resolve(sourceDir, funcDir), desDir)
  })
}

const convertWebFunc = function (sourceDir, desDir) {
  const manifestPath = path.resolve(sourceDir, 'manifest.json')
  if (fs.existsSync(manifestPath)) {
    try {
      const content = fs.readFileSync(manifestPath)
      const manifestObj = JSON.parse(new String(content))
      const funcCode = manifestObj.plugins[0].code
      const distDir = path.resolve(desDir, 'WebFunc_' + funcCode)
      const distSrcDir = path.resolve(distDir, 'src')
      deleteDir(distSrcDir)
      const sourceIndexPath = path.resolve(sourceDir, 'src', 'index.js')
      let funcContent = new String(fs.readFileSync(sourceIndexPath))
      const reg = /vds\.import\((.+?)\)[;]/
      const match = funcContent.match(reg)
      if (match) {
        const importStr = match[1]
        const allImportStr = match[0]
        const imports = importStr.split(',')
        const scripts = []
        const tempArray = []
        imports.forEach((ip) => {
          const reg1 = /["'](.+?)\.\*["']/
          const match1 = ip.match(reg1)
          if (match1) {
            const str = match1[1]
            const namespaces = str.split('.')
            if (namespaces.length > 2) {
              throw Error('未识别vds命令空间：' + str)
            } else {
              tempArray.push(namespaces[namespaces.length - 1])
            }
            scripts.push(
              `import * as ${
                namespaces[namespaces.length - 1]
              } from '@v-act/vjs.framework.extension.platform.services.integration.${str}'\n`
            )
          }
        })
        if (tempArray.length > 0) {
          scripts.push(`const vds = {`)
          tempArray.forEach((tm) => {
            scripts.push(tm)
            scripts.push(',')
          })
          scripts.pop()
          scripts.push('}\n')
        }
        funcContent = funcContent.replace(allImportStr, scripts.join(''))
      }
      //console.log(funcContent);
      writeFile(path.resolve(distDir, 'src', 'index.ts'), funcContent)
    } catch (e) {
      console.error('路径：' + manifestPath)
      console.error(e)
    }
  }
}

const convertWebRules = function () {
  const desDir = 'D:\\Workspace\\github\\v-act\\packages\\rules'
  const sourceDir = 'D:\\Workspace\\github\\vplatform-plugin-rule-client'
  const funcDirs = fs.readdirSync(sourceDir)
  funcDirs.forEach((funcDir) => {
    convertWebRule(path.resolve(sourceDir, funcDir), desDir)
  })
}

const convertWebRule = function (sourceDir, desDir) {
  const manifestPath = path.resolve(sourceDir, 'manifest.json')
  if (fs.existsSync(manifestPath)) {
    try {
      const content = fs.readFileSync(manifestPath)
      const manifestObj = JSON.parse(new String(content))
      const funcCode = manifestObj.plugins[0].code
      const distDir = path.resolve(desDir, 'WebRule_' + funcCode)
      const distSrcDir = path.resolve(distDir, 'src')
      deleteDir(distSrcDir)
      const sourceIndexPath = path.resolve(sourceDir, 'src', 'index.js')
      let funcContent = new String(fs.readFileSync(sourceIndexPath))
      const reg = /vds\.import\((.+?)\)[;]/
      const match = funcContent.match(reg)
      if (match) {
        const importStr = match[1]
        const allImportStr = match[0]
        const imports = importStr.split(',')
        const scripts = []
        const tempArray = []
        imports.forEach((ip) => {
          const reg1 = /["'](.+?)\.\*["']/
          const match1 = ip.match(reg1)
          if (match1) {
            const str = match1[1]
            const namespaces = str.split('.')
            if (namespaces.length > 2) {
              throw Error('未识别vds命令空间：' + str)
            } else {
              tempArray.push(namespaces[namespaces.length - 1])
            }
            scripts.push(
              `import * as ${
                namespaces[namespaces.length - 1]
              } from '@v-act/vjs.framework.extension.platform.services.integration.${str}'\n`
            )
          }
        })
        if (tempArray.length > 0) {
          scripts.push(`const vds = {`)
          tempArray.forEach((tm) => {
            scripts.push(tm)
            scripts.push(',')
          })
          scripts.pop()
          scripts.push('}\n')
        }
        funcContent = funcContent.replace(allImportStr, scripts.join(''))
      }
      funcContent = funcContent.replace(
        'var main = function',
        'const main = function'
      )
      //console.log(funcContent);
      writeFile(path.resolve(distDir, 'src', 'index.ts'), funcContent)
    } catch (e) {
      console.error('路径：' + manifestPath)
      console.error(e)
    }
  }
}

const mkDir = function (p) {
  if (!fs.existsSync(p)) {
    const parent = path.resolve(p, '..')
    mkDir(parent)
    fs.mkdirSync(p)
  }
}

const writeFile = function (p, content) {
  mkDir(path.resolve(p, '..'))
  fs.writeFileSync(p, content.toString())
}

const deleteDir = function (dir) {
  if (fs.existsSync(dir)) {
    const names = fs.readdirSync(dir)
    names.forEach((name) => {
      const p = path.resolve(dir, name)
      const stat = fs.statSync(p)
      if (stat.isDirectory()) {
        deleteDir(p)
        fs.rmdirSync(p)
      } else {
        fs.unlinkSync(p)
      }
    })
  }
}

const moveTo = function (dir) {
  const dirNames = fs.readdirSync(dir)
  dirNames.forEach((name) => {
    const p = path.resolve(dir, name, 'package.json')
    const content = fs.readFileSync(p)
    const json = JSON.parse(new String(content))
    json.name = '@v-act/' + name
    fs.writeFileSync(p, JSON.stringify(json, null, '\t'))
  })
}

const dir = path.resolve(
  process.cwd(),
  'packages/core/platform/services/integration/vds'
)
//moveTo(dir)
convertWebFuncs()
//convertWebRules()
//convertWebFunc("D:\\Workspace\\github\\vplatform-plugin-function-client\\Webfunc_WXGetUserInfo", "D:\\Workspace\\github\\v-act\\packages\\funcs");
