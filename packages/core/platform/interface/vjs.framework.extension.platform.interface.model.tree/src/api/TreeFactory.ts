import * as Tree from './api/Tree'

let undefined

exports.initModule = function () {}

const isTree = function (tree) {
  return tree instanceof Tree
}

export { isTree }
