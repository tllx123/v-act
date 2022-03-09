import { xml2js, Element } from 'xml-js'

type XMLElementObj = {
  tagName: string
  attrs: { [key: string]: string | number | undefined }
  children: Array<string | number | boolean | undefined | XMLElementObj>
}

const _parseElement = function (element: Element): XMLElementObj {
  const elements = element.elements
  const children: Array<string | number | boolean | undefined | XMLElementObj> =
    []
  if (elements && elements.length > 0) {
    elements.forEach((ele) => {
      children.push(_parse(ele))
    })
  }
  return {
    tagName: element.name || '',
    attrs: element.attributes || {},
    children
  }
}

const _parseText = function (
  element: Element
): string | number | boolean | undefined {
  return element.text || ''
}

const _parse = function (
  element: Element
): XMLElementObj | string | number | boolean | undefined {
  const type = element.type
  if (type == 'element') {
    return _parseElement(element)
  } else if (type == 'text') {
    return _parseText(element)
  } else {
    throw Error('未识别节点类型：' + type)
  }
}

export function parse(xml: string) {
  if (typeof xml == 'string' && xml.length > 0) {
    const options = {
      trim: true,
      ignoreComment: true,
      alwaysChildren: true,
      alwaysArray: true
    }
    try {
      const result = xml2js(xml, options)
      const children = result.elements
      const res: Array<XMLElementObj | string | number | boolean | undefined> =
        []
      if (children && children.length > 0) {
        children.forEach((child: Element) => {
          res.push(_parse(child))
        })
      }
      return res
    } catch (e) {
      //@ts-ignore
      throw Error('xml格式有误！错误原因：' + e.message + '\n' + xml)
    }
  }
  return null
}
