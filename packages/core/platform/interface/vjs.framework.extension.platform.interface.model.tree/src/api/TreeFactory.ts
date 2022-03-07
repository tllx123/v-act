import * as Tree from './api/Tree'

export function initModule() {}

const isTree = function (tree) {
  return tree instanceof Tree
}

export { isTree }
