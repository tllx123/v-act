interface obj {
  [key: string]: any
}

class TaffyDB {
  constructor(
    public indexData: obj = {},
    public datas: Array<any> = [],
    public primaryKey = 'id'
  ) {
    return this
  }

  _load(datas: Array<any>, isAppend: boolean) {
    if (!isAppend) {
      this.datas.splice(0, this.datas.length)
      this.indexData = {}
    }
    //不触发插入事件
    for (let i = 0, l = datas.length; i < l; i++) {
      let data = datas[i]
      this.indexData[data[this.primaryKey]] = data
      this.datas.push(data)
    }
  }

  _getPrimaryKey(idstr: string) {
    this.primaryKey = idstr
  }

  _insert(records: Array<any>, index: number) {
    let datas = []
    for (let i = 0; i < records.length; i++) {
      let record = records[i]
      let data = record.toMap()
      datas.push(data)
      //			同时把数据插入到indexData中
      this.indexData[data[this.primaryKey]] = data
      record._setOriginalData(data)
    }
    if (typeof index == 'number' && index != -1) {
      let param: any = [index, 0]
      param = param.concat(datas)
      this.datas.splice.apply(this.datas, param)
    } else {
      this.datas.push.apply(this.datas, datas)
    }
    return datas
  }

  _update(records: Array<any>) {
    let oldDatas = []
    for (let i = 0; i < records.length; i++) {
      let record = records[i]
      let id = record.get(this.primaryKey)
      let data = this._getById(id)
      if (!data) {
        throw Error('[TaffyDB.update]未找到更新记录! 记录id:' + id)
      }
      oldDatas.push(Object.create(data))
      let changeDatas = record.getChangedData()
      for (let field in changeDatas) {
        if (changeDatas.hasOwnProperty(field)) {
          data[field] = changeDatas[field]
        }
      }
      //同时要修改indexData里的数据
      this.indexData[data[this.primaryKey]] = data
    }
    return oldDatas
  }

  _remove(ids: Array<string>) {
    let removeDatas = []
    for (let i = 0, l = ids.length; i < l; i++) {
      let id = ids[i]
      let data = this.indexData[id]
      if (this._getIndex(id) <= this.datas.length) {
        let removedata = this._getById(id)
        removeDatas.push(removedata)
        //从数据集里删除
        this.datas.splice(this._getIndex(id), 1)
        //从索引集里删除
        delete this.indexData[id]
      }
    }
    return removeDatas
  }

  _getById(id: string) {
    let rs = this.indexData[id]
    return rs
  }

  _getByIndex(index: number) {
    if (index <= this.datas.length) {
      return this.datas[index]
    } else {
      return null
    }
  }

  _getAll() {
    return this.datas
  }

  _getIndex(id: string) {
    let records: any = this.datas
    let primaryKey = this.primaryKey
    if (records) {
      for (let i = 0, l = records.length; i < l; i++) {
        if (records[i][primaryKey] == id) {
          return i
        }
      }
    }
    return -1
  }

  _query(criteria: any) {
    let querydata = []
    //拿到该对象的查询条件,返回的是Operator对象数组
    let OperatorArr = criteria.getConditions()
    if (OperatorArr != null && OperatorArr.length >= 0) {
      for (let i = 0; i < this.datas.length; i++) {
        let count = 0
        for (let j = 0; j < OperatorArr.length; j++) {
          let fieldCode = OperatorArr[j].getFieldCode()
          let oper = OperatorArr[j].getOperator()
          let value = OperatorArr[j].getValue()
          if (this.datas[i][fieldCode] != null) {
            if (oper == 'Eq' && this.datas[i][fieldCode] == value) {
              count = count + 1
              continue
            }
            if (oper == 'Sw' && this.datas[i][fieldCode].indexOf(value) == 0) {
              count = count + 1
            }
          } else {
            //如果查询为null的数据，那么无论是等于null还是sw Null,都是成立的
            if ((oper == 'Eq' || oper == 'Sw') && value == null) {
              count = count + 1
            }
          }
        }
        if (count == OperatorArr.length) {
          querydata.push(this.datas[i])
        }
      }
    }
    return querydata
  }
  getNextRecordId() {
    return null
  }
}

/**
 *
 * @param {Object} input
 */
let unSerialize = function (input: any) {
  //			var dataSourceName = input.dataSource;
  //			var dataCfg = input.datas;
  //			var metadataCfg = input.metadata;
  //			var scopeId = ScopeManager.getCurrentScopeId();
  let db = DB()
  db._load(input.datas, false)
  //			db.init({id:dataSourceName});
  //			db.loadData(input,true,false,true);

  return db
}

let DB = function () {
  return new TaffyDB()
}

let isDB = function (db: any) {
  return db instanceof TaffyDB
}

const getConstructor = function () {
  return TaffyDB
}

export { DB, unSerialize, isDB, getConstructor }
