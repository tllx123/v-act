let sandBox
let controlRelation: { [code: string]: any } = {}
let parentRelation: { [code: string]: any } = {}

export function initModule(sb: any) {
  sandBox = sb
}

let register = function (domID: string, child: string, property: any) {
  //窗体与容器关系
  if (controlRelation[domID] == null) {
    controlRelation[domID] = {}
    controlRelation[domID].children = []
  }

  controlRelation[domID].children.push({ id: child, property: property })

  if (parentRelation[child] == null) {
    parentRelation[child] = {}
  }
  parentRelation[child].parent = domID
}

let unregister = function (domID: string) {
  delete controlRelation[domID]
}

let getParent = function (domID: string) {
  for (let str in controlRelation) {
    let list = controlRelation[str].children
    for (let i = 0, num = list.length; i < num; i++) {
      if (list[i].id == domID) {
        return str
      }
    }
  }
}

let getChild = function (domID: string) {
  let childrens = controlRelation[domID] && controlRelation[domID].children
  let list = []
  if (childrens) {
    for (let i = 0, num = childrens.length; i < num; i++) {
      list.push(childrens[i].id)
    }
  }
  return list
}

let getComponet = function (domID: string) {
  let list: { [code: string]: any } = []
  if (controlRelation[domID]) {
    let childrens = controlRelation[domID].children
    for (let i = 0, num = childrens.length; i < num; i++) {
      if (childrens[i].property.type == 'Component') {
        list.push(domID)
      } else {
        list.addAll(getComponet(childrens[i].id))
      }
    }
  }
  return list
}

let getChildComponent = function (domID: string) {
  return getComponet(domID)
}

export { register, unregister, getParent, getChild, getChildComponent }
