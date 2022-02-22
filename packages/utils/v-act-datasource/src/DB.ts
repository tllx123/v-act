export default class DB {
  public indexData: Object = {}
  public datas: Array<any> = []
  public primaryKey: string = 'id'
  // constructor(indexData: Object, datas: Array<any>, primaryKey: string) { }
  clear() {}

  remove(ids) {}

  getAll() {
    return this.datas
  }

  getById(id: any) {
    var rs = this.indexData[id]
    return rs
  }

  getByIndex(index) {
    if (index <= this.datas.length) {
      return this.datas[index]
    } else {
      return null
    }
  }
}
