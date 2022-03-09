import * as Tree from './Tree'

export function initModule() {}

const isTree = function (tree) {
  return tree instanceof Tree
}

export { isTree }
