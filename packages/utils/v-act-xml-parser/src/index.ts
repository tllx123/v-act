import CDDataEndToken from './token/impls/CDDataEndToken'
import CDDataStartToken from './token/impls/CDDataStartToken'
import ElementAttrKeyToken from './token/impls/ElementAttrKeyToken'
import ElementAttrValueToken from './token/impls/ElementAttrValueToken'
import ElementEndToken from './token/impls/ElementEndToken'
import ElementStartToken from './token/impls/ElementStartToken'

let tokens = [
  ElementStartToken,
  ElementEndToken,
  ElementAttrKeyToken,
  ElementAttrValueToken,
  CDDataStartToken,
  CDDataEndToken
].sort((item, item1) => {
  return item1.getWeight() - item.getWeight()
})

const _parse = function (
  xml: string,
  index: number
): { offset: number; element: XMLElement } {
  return 0
}

export function parse(xml: string) {
  if (typeof xml == 'string' && xml.length > 0) {
    const stack: Token[] = []
    let index = 0
    let strArray: string[] = []
    let len = xml.length
    let xmlElement: XMLElement | null = null
    while (index < len) {
      const c = xml.charAt(index)
      if (c == ' ') {
        if (stack.length == 0) {
          //栈中为空，空格字符可以忽略
          index++
        } else {
          const token = stack[stack.length - 1]
          if (token.getToken() == '<') {
            //代表xml标签名称结束，开始属性设置
            if (strArray.length == 0) {
              //无标签名称
              throw Error(
                'xml解析失败，格式不正确，错误开始位置：' +
                  token.getPosition() +
                  '\n' +
                  xml
              )
            } else {
              const tagName = strArray.join('')
              xmlElement = new XMLElement(tagName)
              strArray = []
            }
          }
        }
      } else if (c == '<') {
      } else if (c == '>') {
      } else if (c == '/') {
      } else if (c == '"') {
      } else if (c == '=') {
      } else {
        strArray.push(c)
      }
      index++
    }
  }
  return null
}
