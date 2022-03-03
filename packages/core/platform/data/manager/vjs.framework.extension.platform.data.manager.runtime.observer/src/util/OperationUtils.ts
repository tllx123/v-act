let objUtils

exports.initModule = function (sb) {
  objUtils = sb.util.object
}

const combine = function (aim, source) {
  let params = source.getParams()
  let rs = aim.getParams().resultSet
  params.resultSet.iterate(function (rd) {
    let id = rd.getSysId()
    aim.setRecordPosition(rd, source.getRecordPosition(rd))
    rs.addRecord(rd)
  })
  source.markDestroy()
}

;(exports.destroy = function (before, after) {
  var rs = before.getParams().resultSet,
    opRs = after.getParams().resultSet
  var remove = [],
    remove1 = []
  rs.iterate(function (rd, i) {
    var id = rd.getSysId()
    opRs.iterate(function (record, index) {
      if (
        id == record.getSysId() &&
        after.getRecordPosition(record) > before.getRecordPosition(rd)
      ) {
        remove.push(i)
        remove1.push(index)
        return false
      }
    })
  })
  rs.removeByIndexs(remove)
  opRs.removeByIndexs(remove1)
  if (opRs.isEmpty()) {
    after.markDestroy()
  }
  if (rs.isEmpty()) {
    before.markDestroy()
  }
}),
  (exports.destroyBefore = function (before, after) {
    var bRs = before.getParams().resultSet,
      aRs = after.getParams().resultSet
    var remove = []
    bRs.iterate(function (rd, i) {
      var id = rd.getSysId()
      aRs.iterate(function (record, index) {
        if (
          id == record.getSysId() &&
          after.getRecordPosition(record) > before.getRecordPosition(rd)
        ) {
          remove.push(i)
          return false
        }
      })
    })
    bRs.removeByIndexs(remove)
    if (bRs.isEmpty()) {
      before.markDestroy()
    }
  })

const opUpdateWhenInsert = function (insert, update) {
  let resultSet = update.getParams().resultSet
  let iRs = insert.getParams().resultSet
  let toRemove = []
  resultSet.iterate(function (rd, index) {
    let id = rd.getSysId()
    iRs.iterate(function (record) {
      if (
        record.getSysId() == id &&
        update.getRecordPosition(rd) > insert.getRecordPosition(record)
      ) {
        let pre = rd.getChangedData()
        let changes = record.getChangedData()
        changes = changes || {}
        objUtils.extend(changes, pre)
        record.setChangedData(changes)
        toRemove.push(index)
        return false
      }
    })
  })
  resultSet.removeByIndexs(toRemove)
  if (resultSet.isEmpty()) {
    update.markDestroy()
  }
}

const destroyCurrent = function (current, operation) {
  let resultSet = operation.getParams().resultSet
  if (resultSet) {
    let id = current.getParams().currentRecord.getSysId()
    resultSet.iterate(function (rd, i) {
      if (
        rd.getSysId() == id &&
        operation.getRecordPosition(id) > current.getRecordPosition(id)
      ) {
        current.markDestroy()
        return false
      }
    })
  }
}

const destroyWhenLoad = function (operation, load) {
  let params = load.getParams()
  let isAppend = params.isAppend
  if (!isAppend) {
    //如果以覆盖方式加载
    let rs = operation.getParams().resultSet
    if (rs) {
      let toRemove = []
      rs.iterate(function (rd, index) {
        if (operation.getRecordPosition(rd) < load.getOperationPosition()) {
          toRemove.push(index)
        }
      })
      rs.removeByIndexs(toRemove)
      if (rs.isEmpty()) {
        operation.markDestroy()
      }
    }
  }
}

const opSelectWhenDelete = function (select, deleted) {
  let rs = deleted.getParams().resultSet,
    sRs = select.getParams().resultSet
  let index = {}
  rs.iterate(function (rd) {
    index[rd.getSysId()] = rd
  })
  let toRemove = []
  sRs.iterate(function (rd, index) {
    let id = rd.getSysId()
    if (
      index[id] &&
      deleted.getRecordPosition(id) > select.getRecordPosition(id)
    ) {
      toRemove.push(index)
    }
  })
  sRs.removeByIndexs(toRemove)
  if (sRs.isEmpty()) {
    select.markDestroy()
  }
}

export {
  addObserver,
  fire,
  _callAsyncObservers,
  getBindedDatasourceNames,
  destroy,
  addOperation,
  create,
  combine,
  opUpdateWhenInsert,
  destroyCurrent,
  destroyWhenLoad,
  opSelectWhenDelete
}
