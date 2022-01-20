const isIndex = function (code: string) {
  return code === getIndexCode()
}

const getIndexCode = function () {
  return '__$__index'
}

interface MenuData {
  code: string
  title: string
  type?: string
  data?: string
  children?: MenuData[]
}

export { getIndexCode, isIndex, type MenuData }
