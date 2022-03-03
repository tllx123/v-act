import * as vAsync from './impl/VAsync'

//声明依赖模块变量
let undefined

/**
 * 模块初始化的统一入口，实现依赖模块的初始化逻辑
 * @return {[type]} [description]
 */
exports.initModule = function () {}

let getBuilder = function (builderName) {
  if (builderName === 'vAsync') {
    return vAsync.getInstance()
  }
}

export { getBuilder }
