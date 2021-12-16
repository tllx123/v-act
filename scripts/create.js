import { resolve } from 'path'
import * as p from 'path'
import * as fs from 'fs'
import artTemplate from 'art-template'

export async function createWidget(arg) {
  if (arg._[0].toLowerCase() !== 'create') {
    console.log('--------无效命令---------')
  } else if (arg._.length !== 2) {
    console.log('--------无效命令---------')
  } else if (!/[A-Z]/.test(arg._[1].substring(0, 1))) {
    console.log('--------首字母要大写---------')
  } else {
    let dirName = arg._[1]
    let dirNameLowerCase = arg._[1].toLowerCase()
    let dirNameProps = arg._[1] + 'Props'
    let dirNameExport = arg._[1].toLowerCase().substring(2)

    const rootDir = resolve()
    const widgetsDir = p.resolve(rootDir, 'packages', 'widgets')
    const wNewDir = p.resolve(widgetsDir, '__dev__', 'src', 'widgets', dirName)
    const newDir = p.resolve(widgetsDir, dirName)

    if (fs.existsSync(newDir) || fs.existsSync(wNewDir)) {
      console.log('该组件已存在,请检查目录')
    } else {
      //创建文件
      fs.mkdirSync(wNewDir)
      fs.mkdirSync(newDir)

      const packagePathFrom = p.resolve(
        rootDir,
        'packages',
        'assert',
        'templates',
        'package.txt'
      )
      const indexPathFrom = p.resolve(
        rootDir,
        'packages',
        'assert',
        'templates',
        'src',
        'index.txt'
      )
      const JGTempPathFrom = p.resolve(
        rootDir,
        'packages',
        'assert',
        'templates',
        'src',
        'JGTemp.txt'
      )
      const srcDir = p.resolve(newDir, 'src')
      fs.mkdirSync(srcDir)
      const packagePath = p.resolve(newDir, 'package.json')
      const indexPath = p.resolve(srcDir, 'index.tsx')
      const newFilePath = p.resolve(srcDir, dirName + '.tsx')
      let packageContent = artTemplate(packagePathFrom, {
        dirNameLowerCase: dirNameLowerCase,
        dirName: dirName
      })
      fs.writeFileSync(packagePath, packageContent, { flag: 'a+' })
      let indexContent = artTemplate(indexPathFrom, {
        dirNameLowerCase: dirNameLowerCase,
        dirName: dirName,
        dirNameProps: dirNameProps
      })
      fs.writeFileSync(indexPath, indexContent, { flag: 'a+' })
      let tempContent = artTemplate(JGTempPathFrom, {
        dirNameLowerCase: dirNameLowerCase,
        dirName: dirName,
        dirNameProps: dirNameProps
      })
      fs.writeFileSync(newFilePath, tempContent, { flag: 'a+' })

      const WTempIndexFrom = p.resolve(
        rootDir,
        'packages',
        'assert',
        'widgetsTemp',
        'index.txt'
      )
      const wIndexPath = p.resolve(wNewDir, 'index.tsx')
      let WTempContent = artTemplate(WTempIndexFrom, {
        dirNameLowerCase: dirNameLowerCase,
        dirName: dirName,
        dirNameExport: dirNameExport
      })
      fs.writeFileSync(wIndexPath, WTempContent, { flag: 'a+' })

      //写入路由
      const routerPath = p.resolve(widgetsDir, '__dev__', 'src', 'routes.tsx')
      const data = fs.readFileSync(routerPath, 'utf8').split('\n')
      let dataTemp = data.concat()
      let importIndex = 0
      let routerIndex = 0
      let importVal =
        'const ' +
        dirName +
        " = lazy(() => import('./widgets/" +
        dirName +
        "'))"
      let routerVal =
        "{path: '/" + dirName + "', element: <" + dirName + ' />},'
      dataTemp.some((item, index) => {
        if (item.indexOf('lazy(') > -1) {
          importIndex = index
        }

        if (item.indexOf('useRoutes') > -1) {
          routerIndex = index
        }
      })
      data.splice(routerIndex + 1, 0, routerVal)
      data.splice(importIndex + 1, 0, importVal)
      fs.writeFileSync(routerPath, data.join('\n').toString())

      //写入home
      const homePath = p.resolve(
        widgetsDir,
        '__dev__',
        'src',
        'widgets',
        'Home.tsx'
      )
      const data_home = fs.readFileSync(homePath, 'utf8').split('\n')
      let dataTemp_home = data_home.concat()
      let homeIndex = 0
      let homeVal = "<Link href='/" + dirName + "'>" + dirName + '</Link> <br/>'
      dataTemp_home.some((item, index) => {
        let itemTemp = item.replace(/\s+/g, '')
        if (itemTemp.indexOf('<br/>') > -1) {
          homeIndex = index
        }
      })
      data_home.splice(homeIndex + 1, 0, homeVal)
      fs.writeFileSync(homePath, data_home.join('\n').toString())
    }
  }
}
