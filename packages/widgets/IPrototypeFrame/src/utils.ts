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

type ListItem = {
  code: string
  type: string
  data: string
  title: string
}

export { getIndexCode, isIndex, type ListItem, type MenuData }
