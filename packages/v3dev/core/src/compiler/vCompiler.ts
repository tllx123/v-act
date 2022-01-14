import tpl from 'art-template'
import { XMLParser } from 'fast-xml-parser'
import { mkdirsSync, writeFileSync } from 'fs-extra'
import { resolve } from 'path'

import type {
  CompileOptions,
  Component,
  Control,
  Properties,
  VComponent,
  VControl,
  VControls,
  VPackage,
  VProperties,
  VWindows,
  Window
} from './'

export const ROOT = './src/assets/__vdev__'

export const COMPILE_OPTIONS: CompileOptions = {
  root: resolve(ROOT),
  outdir: './pages',
  dependencies: {},
  template: {
    page: './../templates/page.art'
  }
}

/**
 * 编译构件包
 *
 * @param vPackageData 构件包数据: package.xml
 * @param complieOptions 编译配置
 * @returns 构件对象
 */
export const compilePackage: (
  vPackageData: string,
  complieOptions: Partial<CompileOptions>
) => Component = (vPackageData, complieOptions = COMPILE_OPTIONS) => {
  // 初始化编译设置
  const options: CompileOptions = { ...COMPILE_OPTIONS, ...complieOptions }

  // 解析配置文件
  const parser = new XMLParser({ ignoreAttributes: false })
  const vPackage: VPackage = parser.parse(vPackageData)

  // 编译构件
  const component = _parseComponent(vPackage.component)
  _compilePages(component, options)

  return component
}

/**
 * 编译构件包页面
 *
 * @param component 构件对象
 * @param complieOptions 编译配置
 */
export const _compilePages = (
  component: Component,
  complieOptions: CompileOptions
) => {
  const { code, wins } = component

  // 创建构件目录
  const { root, outdir, dependencies: deps, template } = complieOptions
  const componentDir = resolve(root, outdir, `./${code}`)
  mkdirsSync(componentDir)

  // 创建页面文件
  const templatePath = resolve(root, template.page)
  for (const win of wins) {
    const { code: winCode } = win
    win._dependencies = win._dependencies.filter((d) => deps[d])
    const winConst = JSON.stringify(win)
    const pageContent = tpl(templatePath, { deps, win, winConst })
    const pagePath = resolve(componentDir, `./${winCode}.tsx`)
    writeFileSync(pagePath, pageContent)
  }
}

/**
 * 解析构件信息
 *
 * @param vComponent 配置构件: 构件信息
 * @returns  构件对象
 */
const _parseComponent: (vComponent: VComponent) => Component = (vComponent) => {
  return {
    code: vComponent['@_code'],
    name: vComponent['@_name'],
    desc: vComponent['@_desc'],
    wins: _parseWindows(vComponent.windows)
  }
}

/**
 * 解析窗体信息
 *
 * @param vWindows 配置构件: 窗体信息
 * @returns 窗体列表
 */
const _parseWindows: (vWindows: VWindows) => Window[] = (vWindows) => {
  if (!(vWindows && vWindows.window)) return []

  vWindows.window = Array.isArray(vWindows.window)
    ? vWindows.window
    : [vWindows.window]

  return vWindows.window.map((vWindow) => {
    const window: Window = {
      type: 'component',
      code: vWindow['@_code'],
      name: vWindow['@_name'],
      desc: vWindow['@_desc'],
      controls: _parseCtrls(vWindow.controls),
      properties: _parseProps(vWindow.propertys),
      _dependencies: []
    }

    window._dependencies = _parseWindowDeps(window)
    return window
  })
}

/**
 * 解析控件列表信息
 *
 * @param vControls 配置构件: 控件列表信息
 * @returns 控件列表
 */
const _parseCtrls: (vControls?: VControls) => Control[] = (vControls) => {
  if (!(vControls && vControls.control)) return []

  const { control: vCtrls } = vControls
  if (Array.isArray(vCtrls)) {
    return vCtrls.map((vControl) => _parseCtrl(vControl))
  }
  return [_parseCtrl(vCtrls)]
}

/**
 * 解析控件信息
 *
 * @param vControls 配置构件: 控件信息
 * @returns 控件对象
 */
const _parseCtrl: (vControl: VControl) => Control = (vControl) => {
  const control: Control = {
    code: vControl['@_code'],
    name: vControl['@_name'],
    type: vControl['@_type'],
    controls: _parseCtrls(vControl.controls),
    properties: _parseProps(vControl.propertys)
  }

  return control
}

/**
 * 解析属性信息
 *
 * @param vProperties 配置构件: 属性信息
 * @returns 属性对象
 */
const _parseProps: (vProperties?: VProperties) => Properties = (
  vProperties
) => {
  if (!(vProperties && vProperties.property)) return {}

  return vProperties.property.reduce((properties, vProperty) => {
    const rawCode = vProperty['@_code']
    const code = rawCode.replace(/^[A-Z]+/, (s) => s.toLowerCase())
    properties[code] = vProperty['#text']
    return properties
  }, {} as Properties)
}

const _parseWindowDeps: (window: Window) => string[] = (window) => {
  const _parseCtrlDeps: (ctrls?: Control[]) => string[] = (ctrls) => {
    if (!ctrls) return []
    return ctrls.reduce((deps, ctrl) => {
      deps.push(ctrl.type)
      deps.push(..._parseCtrlDeps(ctrl.controls))
      return deps
    }, [] as string[])
  }

  return [...new Set(_parseCtrlDeps(window.controls))]
}
