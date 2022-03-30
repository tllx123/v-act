import { Metadata } from '@v-act/vjs.framework.extension.platform.interface.model.metadata'
import Node from './Node'
import Iterator from './NodeSetIterator'
import Tree from './Tree'

/**
 *	@namespace NodeSet
 *  @class NodeSet
 *  @desc 树结果集定义
 *  @author xiedh
 */
class NodeSet {
  tree
  metadata
  datas: Array<{ [fieldCode: string]: any }>
  constructor(
    metadata: Metadata,
    datas: Array<{ [fieldCode: string]: any }>,
    tree: Tree
  ) {
    this.tree = tree
    this.metadata = metadata
    this.datas = datas
  }
  /**
   *获取迭代器
   * @return {@link NodeSetIterator}
   */
  iterator() {
    return new Iterator(this)
  }

  /**
   *结果集是否包含记录
   * @return Boolean
   */
  isEmpty() {
    let size = this.size()
    return size < 1
  }

  /**
   * 结果集记录数量
   * @return Integer
   */
  size() {
    return this.datas ? this.datas.length : 0
  }

  /**
   *获取原始数据
   * @return Array
   */
  getOriginalDatas() {
    return this.datas
  }

  /**
   * 将结果集转换成数组
   * @return Array
   */
  toArray() {
    let records = []
    for (let i = 0, len = this.datas.length; i < len; i++) {
      let record = new Node(this.metadata, this.datas[i], this.tree)
      records.push(record)
    }
    return records
  }

  /**
   *获取元数据
   * @return {@link Metadata}
   */
  getMetadata() {
    return this.metadata
  }

  /**
   * 获取指定下标中的节点值
   * @reuturn {@link Node}
   */
  index(index: number) {
    let data = this.datas[index]
    return new Node(this.metadata, data, this.tree)
  }

  /**
   * 获取第一个树节点
   * @reuturn {@link Node}
   */
  first() {
    return this.isEmpty() ? null : this.index(0)
  }
  /**
   * 获取最后一个树节点
   * @reuturn {@link Node}
   */
  last() {
    return this.isEmpty() ? null : this.index(this.datas.length - 1)
  }
  /**
   * 遍历节点
   * @param {Function} fn 函数
   * 函数参数：1、{@link Node} 树节点
   * 					2、index  下标
   */
  iterate(fn: (node: Node, index: number) => void) {
    for (let i = 0, len = this.datas.length; i < len; i++) {
      let node = new Node(this.metadata, this.datas[i], this.tree)
      fn.call(this, node, i)
    }
  }
}

export default NodeSet
