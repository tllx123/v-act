type XMLElementObj = {
  tagName: string
  attrs: { [key: string]: string }
  children: Array<XMLElementObj>
}

class XMLElement {
  tagName: string
  attrs: { [key: string]: string } = {}
  children: Array<XMLElement> = []
  constructor(tagName: string) {
    this.tagName = tagName
  }

  toJson(): XMLElementObj {
    const childrenJson: Array<XMLElementObj> = []
    this.children.forEach((child) => {
      childrenJson.push(child.toJson())
    })
    return {
      tagName: this.tagName,
      attrs: Object.assign({}, this.attrs),
      children: childrenJson
    }
  }

  toString() {
    return JSON.stringify(this.toJson(), null, '\t')
  }
}
