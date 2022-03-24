import * as vAsync from '../impl/VAsync'

//声明依赖模块变量

/**
 * 模块初始化的统一入口，实现依赖模块的初始化逻辑
 * @return {[type]} [description]
 */
export function initModule() {}

let getBuilder = function (builderName: string) {
  if (builderName === 'vAsync') {
    return vAsync.getInstance()
  }
}

export { getBuilder }
