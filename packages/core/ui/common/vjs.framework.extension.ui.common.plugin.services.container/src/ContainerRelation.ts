let sandBox
let controlRelation = {}
let parentRelation = {}

exports.initModule = function (sb) {
  sandBox = sb
}

let register = function (domID, child, property) {
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

let unregister = function (domID) {
  delete controlRelation[domID]
}

let getParent = function (domID) {
  for (let str in controlRelation) {
    let list = controlRelation[str].children
    for (let i = 0, num = list.length; i < num; i++) {
      if (list[i].id == domID) {
        return str
      }
    }
  }
}

let getChild = function (domID) {
  let childrens = controlRelation[domID] && controlRelation[domID].children
  let list = []
  if (childrens) {
    for (let i = 0, num = childrens.length; i < num; i++) {
      list.push(childrens[i].id)
    }
  }
  return list
}

let getComponet = function (domID) {
  let list = []
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

let getChildComponent = function (domID) {
  return getComponet(domID)
}

export { register, unregister, getParent, getChild, getChildComponent }
