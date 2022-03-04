class TreeNode {
  id: string
  pId: string
  value?: any
  children: Array<TreeNode>
  searchChildren?: boolean
  storage: TreeStorage | null
  constructor(id: string, value: any, pId: string, storage: TreeStorage) {
    this.id = id
    this.pId = pId
    this.value = value
    this.children = []
    this.searchChildren = false
    this.storage = storage
  }

  /**
   *获取树节点id
   * @return String
   */
  getId() {
    return this.id
  }
  /**
   *获取树节点值
   * @return Object
   */
  getValue() {
    return this.value
  }
  /**
   *获取父节点id
   * @return String
   */
  getPId() {
    return this.pId
  }
  /**
   *获取子节点：第一代子节点
   *  @return Array
   */
  getChildren() {
    if (!this.searchChildren && this.storage) {
      let storage = this.storage.storage
      for (let id in storage) {
        if (storage.hasOwnProperty(id)) {
          let node = storage[id]
          if (this.id == node.pId) {
            this.children.push(node)
          }
        }
      }
      this.searchChildren = true
    }
    return this.children
  }

  _clearCache() {
    this.searchChildren = false
    this.children = []
  }
  /**
   * 销毁树
   */
  destroy() {
    this.storage = null
  }
}

let iterateChildren = function (children: TreeNode[], container: TreeNode[]) {
  let childrenArray = []
  for (let i = 0, len = children.length; i < len; i++) {
    let child = children[i]
    let childs = child.getChildren()
    container = container.concat(childs)
    childrenArray.push(childs)
  }
  for (let i = 0, len = childrenArray.length; i < len; i++) {
    container = iterateChildren(childrenArray[i], container)
  }
  return container
}

/**
 * @namespace TreeStorage
 * @class TreeStorage
 * @desc 树形存储仓库<br/>
 * vjs名称：vjs.framework.extension.platform.interface.storage<br/>
 * 该实例无法直接创建，请通过存储仓库管理器({@link StorageManager#newInstance|StorageManager})创建
 * @author xiedh
 */
class TreeStorage {
  storage: { [id: string]: TreeNode }
  constructor() {
    this.storage = {}
  }
  /**
   * 添加数据
   * @param {String} pId 父节点id
   * @param {String} id id值
   * @param {Any} obj
   */
  add(pId: string, id: string, obj: any) {
    if (this.storage) {
      this.storage[id] = new TreeNode(id, obj, pId, this)
      let parent = this.storage[pId]
      if (parent) {
        parent._clearCache()
      }
    }
  }

  /**
   * 获取数据
   * @param {String} id id值
   * @return Any
   */
  get(id: string) {
    let node = this.storage[id]
    return node ? node.getValue() : null
  }

  getTreeNode(id: string) {
    return this.storage[id]
  }

  /**
   * 移除数据，子孙数据都会被移除
   * @param {String} id id值
   */
  remove(id: string) {
    let node = this.storage[id]
    if (node) {
      let children = node.getChildren()
      for (let i = 0, len = children.length; i < len; i++) {
        let child = children[i]
        let childId = child.getId()
        this.remove(childId)
      }
      try {
        delete this.storage[id]
      } catch (e) {}
    }
  }

  /**
   * 是否包含指定树节点
   * @param {String} id 树节点id
   * @return Boolean
   */
  has(id: string) {
    return this.storage.hasOwnProperty(id)
  }

  /**
   * 获取树节点值
   * @param {String} id 树节点id
   * @return Any
   */
  getParent(id: string) {
    let node = this.storage[id]
    if (node) {
      let pId = node.getPId()
      return this.get(pId)
    }
    return null
  }
  /**
   * 获取子节点值
   * @param {Object} id 树节点id
   * @return Array
   */
  getChildren(id: string) {
    let node = this.storage[id]
    if (node) {
      let children = node.getChildren()
      let result = []
      for (let i = 0, len = children.length; i < len; i++) {
        result.push(children[i].getValue())
      }
      return result
    }
    return null
  }

  /**
   *　获取子孙节点值
   * @param {String} id 树节点id
   * @return Array
   */
  getDescendants(id: string) {
    let descendants = []
    let node = this.storage[id]
    if (node) {
      let childrenNode: TreeNode[] = []
      let children = node.getChildren()
      childrenNode = childrenNode.concat(children)
      childrenNode = iterateChildren(children, childrenNode)
      for (let i = 0, len = childrenNode.length; i < len; i++) {
        descendants.push(childrenNode[i].getValue())
      }
    }
    return descendants
  }
  /**
   * 获取兄弟节点值
   * @param {String} id 树节点id
   * @return Array
   */
  getBrothers(id: string) {
    let brothers = []
    let node = this.storage[id]
    if (node) {
      let pId = node.getPId()
      let parent = this.storage[pId]
      if (parent) {
        let children = parent.getChildren()
        for (let i = 0, len = children.length; i < len; i++) {
          let child = children[i]
          if (child != node) {
            brothers.push(child.getValue())
          }
        }
      }
    }
    return brothers
  }

  /**
   * 遍历
   * @param {Function} fn 遍历函数
   *  fn参数为：1、id id值
   * 					 2、value
   */
  iterate(fn: (key: string, val: any) => void) {
    for (let key in this.storage) {
      if (this.storage.hasOwnProperty(key)) {
        fn(key, this.storage[key].getValue())
      }
    }
  }
}

export default TreeStorage
