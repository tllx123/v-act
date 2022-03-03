exports.initModule = function (sBox) {
  isc.ClassFactory.defineClass('JGDataList', 'JGBaseWidget')

  isc.JGDataList.addProperties({
    //包装控件
    _widget: null,
    //图片url
    imageUrlReg: '',
    //上边距
    Top: 50,
    //左边距
    Left: 50,
    //标题行数
    RowsFixedCount: 1,
    //宽度
    Width: 50,
    //高度
    Height: 50,
    //中文标题
    SimpleChineseTitle: '',
    //数据源名称
    TableName: null,
    //只读
    ReadOnly: false,
    //使能
    Enabled: true,

    _currentRecord: null,

    _preGetCellStyleIndexFunc: null,

    _preDrawFunc: null,

    _preCellIsEnabled: null,

    _getRawCellValueFunc: null,

    _preGetValueIconHTMLFunc: null,

    _getValueIconFunc: null,

    _chooseModelSetMap: {
      '0': '单选(不显示单选框)',
      '1': '单选(不显示单选框)',
      '2': '多选(显示多选框)',
      '3': '多选(显示多选框)'
    }
  })

  isc.JGDataList.addMethods({
    _initWidget: function () {
      this._beforeWidgetInit()
      this._widget = this._buildWidget()
      this._afterWidgetInit()
      this._overrideInitFunc()
      this._preDrawFunc = this._widget.draw
      this._widget.draw = this._referFunc(this, '_onDraw')
      // 必须添加到本控件的内部SC画布中，否则无法支持SC的父子控件层次关系
      this.addChild(this._widget)
    },

    _overrideInitFunc: function () {
      if (!this._getRawCellValueFunc) {
        //没有时才复写该方法，防止重画时造成死循环
        this._getRawCellValueFunc = this._widget.getRawCellValue
        this._widget.getRawCellValue = this._referFunc(this, '_getRawCellValue')
      }
      if (!this._preGetValueIconHTMLFunc) {
        this._preGetValueIconHTMLFunc = this._widget.getValueIconHTML
        this._widget.getValueIconHTML = this._referFunc(
          this,
          '_getValueIconHTML'
        )
      }
      if (!this._getValueIconFunc) {
        this._getValueIconFunc = this._widget.getValueIcon
        this._widget.getValueIcon = this._referFunc(this, '_dataImgFunc')
      }
    },
    setHandleReadOnly: function (newState) {
      this._widget.setCanEdit(!newState)
      this._widget.redraw()
    },
    setHandleDisabled: function (newState) {
      this._widget.setDisabled(newState)
      this._widget.redraw()
    },
    _overrideDrawFunc: function () {
      if (!this._preGetCellStyleIndexFunc) {
        this._preGetCellStyleIndexFunc = this._widget.body.getCellStyleIndex
        this._widget.body.getCellStyleIndex = this._referFunc(
          this,
          '_getCellStyleIndex'
        )
      }
      if (!this._preCellIsEnabled) {
        this._preCellIsEnabled = this._widget.body.cellIsEnabled
        this._widget.body.cellIsEnabled = this._referFunc(this, 'cellIsEnabled')
      }
    },

    _onDraw: function () {
      let result = this._preDrawFunc.apply(this._widget, arguments)
      this._overrideDrawFunc()
      this.setCurrentAndUpdateRowStyle(this._currentRecord)
      return result
    },

    _revertFuns: function () {
      if (this._widget) {
        this._widget.getRawCellValue = this._getRawCellValueFunc
        this._widget.getValueIconHTML = this._preGetValueIconHTMLFunc
        this._widget.getValueIcon = this._getValueIconFunc
        this._widget.draw = this._preDrawFunc
        if (this._widget.body) {
          this._widget.body.getCellStyleIndex = this._preGetCellStyleIndexFunc
          this._widget.body.cellIsEnabled = this._preCellIsEnabled
        }
      }
      this._getValueIconFunc = null
      this._preGetValueIconHTMLFunc = null
      this._getRawCellValueFunc = null
      this._preGetCellStyleIndexFunc = null
      this._preCellIsEnabled = null
      this._preDrawFunc = null
    },
    /**
     * 控件初始化前
     */
    _beforeWidgetInit: function () {},
    /**
     * 构建控件
     */
    _buildWidget: function () {},
    /**
     * 控件初始化后
     */
    _afterWidgetInit: function () {},
    /**
     *重写列表getRawCellValue方法
     */
    _getRawCellValue: function (record, recordNum, fieldNum, isFieldName) {
      let value = this._getRawCellValueFunc.apply(this._widget, arguments)
      if (this._widget.fields) {
        let field = isFieldName
          ? this.getFieldByName(fieldNum)
          : this._widget.fields[fieldNum]
        if (value && field && field.type == 'image') {
          if (value && value.indexOf('itop/vjs/icons') > -1) {
          } else {
            field.extraStuff =
              "style='cursor:pointer;' onclick='" +
              this.ID +
              '.fireLink(' +
              recordNum +
              ',' +
              fieldNum +
              ")'"
            value = this._dealUrl('value', value, this.imageUrlReg)
          }
        } else if (field && field.type == 'boolstr') {
          if (value == false || value == field.NotSelectValue) {
            value = field.NotSelectValue
          } else {
            value = field.SelectValue
          }
        }
      }
      return value
    },

    _dataImgFunc: function (field, value, record, recordNum) {
      let editorType = field.editorType || field.type
      if (editorType == 'checkbox') {
        //布尔列特殊处理
        return this._getValueIconFunc.apply(this._widget, arguments)
      }
      if (editorType == 'baseComboBox' || editorType == 'baseDictBox') {
        if (!field._dataImgSrc || field._dataImgSrc == '') {
          return '_noicon'
        }
      }
      if (field._dataImgSrc) {
        return this.getStaticImagePath(field._dataImgSrc) + '?rNum=' + recordNum
      }
    },

    _getValueIconHTML: function (icon, field) {
      let editorType = field.editorType || field.type
      if (icon && editorType === 'image') {
        // 处理图片列“拉伸”属性值
        let imgPosition = field.imagePosition
        if (imgPosition + '' === 'fill') {
          let _dataGrid = this._widget.parentElement
          let rowBorderWidth = 1
          if (_dataGrid.ShowRowBorder + '' === 'false') rowBorderWidth = 0

          field.valueIconLeftPadding = 0
          field.valueIconRightPadding = 0
          field.valueIconWidth = '100%'
          field.valueIconHeight = this._widget.cellHeight * 1 - rowBorderWidth // 处理 bottom 边框
        }
      }

      if (editorType == 'baseComboBox' && icon == '_noicon') {
        return (html = '<span class="JGBaseGrid_ComboBox_showIcon"></span>')
      }

      if (editorType == 'baseDictBox' && icon == '_noicon') {
        return (html = '<span class="JGBaseGrid_DictBox_showIcon"></span>')
      }

      let html = this._preGetValueIconHTMLFunc.apply(this._widget, arguments)

      // 处理图片列“拉伸”属性值
      if (html.contains('%px')) html = html.replace('%px', '%')

      if (editorType == 'checkbox' || !field._dataImgSrc) {
        return html
      } else {
        let recordNum
        let rowNum = /\?rNum=(\d+)/.exec(html).pop()
        html = html.replace(
          /\s{1}/,
          " onclick='" +
            this.ID +
            '.fireLink(' +
            rowNum +
            ',' +
            this._widget.getFieldNum(field) +
            ")' "
        )
        let hasLinkEvnet = this._hasLinkEvent(field)
        if (hasLinkEvnet) {
          let hasStyle = false
          html = html.replace(/style\s*=\s*(['"])/i, function (str, $1) {
            hasStyle = true
            return 'style=' + $1 + 'cursor:pointer;'
          })
          if (!hasStyle) {
            html = html.replace(/\s{1}/, " style='cursor:pointer;'")
          }
        }
        if (editorType == 'baseComboBox') {
          html = '<span class="JGBaseGrid_ComboBox_showIcon"></span>' + html
        }
        return html
      }
    },

    /**
     *是否绑定有链接事件
     */
    _hasLinkEvent: function (field) {
      if (!this._columnListener) return false
      let linkListeners = this._columnListener['Link']
      return (
        linkListeners &&
        linkListeners[field.columnId] &&
        linkListeners[field.columnId].length > 0
      )
    },

    _dealUrl: function (reg, val, regText) {
      // 支持三种类型的图片URL
      // 暂时方案，在图片ID字段支持3中类型的图片，URL，文件目录，文件ID
      if (val.startsWith('http'))
        // val为http地址开头的图片
        return val
      else if (val.startsWith('/'))
        // val以"/"开头的资源路径，/表示服务根目录
        return val.substring(1)
      else {
        let regex = new RegExp('\\[' + reg + '\\]', 'g') // 文件ID类型
        return regText.replace(regex, val)
      }
    },

    /**
     *根据字段名获取字段配置
     * @param fieldName 字段名称
     */
    getFieldByName: function (fieldName) {
      let fields = this.fields
      if (fields && fields.length > 0) {
        for (let i = 0, len = fields.length; i < len; i++) {
          let field = fields[i]
          if (field.name == fieldName) {
            return field
          }
        }
      }
    },

    _genSelectModel: function () {
      let cfg
      switch (this.ChooseModelSetValue) {
        case 1:
          cfg = {
            selectionType: 'single'
          }
          break
        case 2:
        case 3:
          cfg = {
            selectionAppearance: 'checkbox'
          }
          break
        default:
          cfg = {
            selectionType: 'single'
          }
      }
      // 滚动模式下，暂时不显示选择列
      if (this.FetchMode == 'scroll') {
        cfg = {}
      }
      return cfg
    },
    /**
     * 行点击内置逻辑
     */
    _rowClick: function () {
      if (this._widget) {
        this._widget.RowSpanningLastClick = this._widget.RowSpanningClick
        this._widget.RowSpanningClick = arguments[2]
      }
      let _checkbox = this._widget.getCurrentCheckboxField()
      let record = arguments[1]
      let param = [this, '']
      for (let i = 0, len = arguments.length; i < len; i++) {
        param.push(arguments[i])
      }
      let selectionChanged = this._selectionChanged(record)
      //注意：先触发当前行事件，再触发记录切换事件
      if (selectionChanged) {
        //if((_checkbox === null&&selectionChanged)||(_checkbox !== null&&_checkbox!==arguments[3])){
        this._callEvent(this, 'currentRowClick', record)
      }
      if (selectionChanged) {
        param[1] = 'selectionChanged'
        this._callEvent.apply(this, param)
        //this._callEvent(this,'selectionChanged',arguments);
      }
      param[1] = 'rowClick'
      this._callEvent.apply(this, param)
    },
    /**
     * 选中行是否改变
     */
    _selectionChanged: function (record) {
      let primaryKey = this.getPrimaryKey()
      return (
        (this._currentRecord == null && record != null) ||
        (record == null && this._currentRecord != null) ||
        (this._currentRecord &&
          record &&
          this._currentRecord[primaryKey] !== record[primaryKey])
      )
    },

    /**
     * 点击时添加选中样式
     */
    _getCellStyleIndex: function (record, rowNum, colNum) {
      if (
        this._currentRecord &&
        record &&
        this._currentRecord['id'] == record['id']
      ) {
        return 2
      } else {
        let field = this._widget.getField(colNum)
        if (field.disabled) {
          return this._preGetCellStyleIndexFunc.apply(this._widget.body, [
            record,
            rowNum,
            0
          ])
        } else {
          return this._preGetCellStyleIndexFunc.apply(
            this._widget.body,
            arguments
          )
        }
      }
    },
    /**
     *编辑完成
     */
    acceptChanges: function (values) {
      if (values) {
        let form = this._widget.getEditForm()
        let editedValues = form.getValues()
        isc.addProperties(editedValues, values)
        this._widget.updateData(editedValues)
      }
      this._widget.cellEditEnd(isc.ListGrid.CLICK_OUTSIDE)
    },
    /**
     *选中行
     */
    selectRecords: function (records, isSel) {
      if (this.ChooseModelSetValue < 2) {
        //单选情况下无需选中记录
        return
      }
      if (!isc.isA.Array(records)) records = [records]
      let data = this._widget.data
      let selectRecords
      if (isc.isA.Tree(data)) {
        let _wd = this._widget
        selectRecords = this._getNodesFromTree(records, function (node) {
          var seled = _wd.isSelected(node)
          if (isSel) {
            //待选中
            return !seled
          } else {
            //待取消选中
            var isPartially = _wd.isPartiallySelected(node)
            return seled && !isPartially
          }
        })
      } else if (isc.isA.ResultSet(data) || (data && data.length > 0)) {
        selectRecords = this._getRecordsFromResultSet(records)
      } else {
        selectRecords = records
      }
      if (selectRecords && selectRecords.length > 0)
        this._widget.selectRecords(selectRecords, isSel)
    },

    _getNodesFromTree: function (records, fn) {
      let treeData = this._widget.data
      let ds = isc.DataSource.getDataSource(this.TableName)
      let primaryKey = ds.getPrimaryKeyFieldName()
      let rs = []
      for (let i = 0, len = records.length; i < len; i++) {
        let record = records[i]
        if (record) {
          let id = record[primaryKey]
          // var node = treeData.findById(id); 未能获取对应节点 调整为以下方式
          let node = treeData.getDescendants().find(primaryKey, id)
          if (fn) {
            if (fn(node)) rs.push(node)
          } else {
            rs.push(node)
          }
        }
      }
      return rs
    },

    _getRecordsFromResultSet: function (records) {
      let resultSet = this._widget.data
      let ds = isc.DataSource.getDataSource(this.TableName)
      let primaryKey = ds.getPrimaryKeyFieldName()
      let rs = []
      let keys = []
      let critera = {
        fieldName: primaryKey,
        operator: 'inSet',
        value: keys
      }
      for (let i = 0, len = records.length; i < len; i++) {
        keys.push(records[i][primaryKey])
      }
      let datas
      if (isc.isA.Array(resultSet)) {
        datas = resultSet
      } else if (isc.isA.ResultSet(resultSet)) {
        datas = resultSet.getAllCachedRows()
      } else {
        return []
      }
      return ds.applyFilter(datas, critera)
    },
    /**
     * 设置当前行
     */
    setCurrentRecord: function (record) {
      record = this.getRecordFromDS(record)
      let selectionChanged = this._selectionChanged(record)
      if (selectionChanged) {
        this._callEvent.apply(this, [this, 'selectionChanged'])
      }
      this.setCurrentAndUpdateRowStyle(record)
    },
    /**
     *设置当前行及更新行样式
     */
    setCurrentAndUpdateRowStyle: function (current) {
      let rowStyleUpdate = []
      if (this._currentRecord) {
        let index = this.getRecordIndex(this._currentRecord)
        if (index != -1) {
          rowStyleUpdate.push(index)
        }
      }
      let index = current ? this.getRecordIndex(current) : -1

      /**
       * 滚动条滚到相应的位置
       * default是手选或翻页，当default以及index为0时，是翻页动作，需要设置滚动条
       */
      if (index != -1 && this._widget.body) {
        //如当前行不在可视区域内，则滚动记录
        let rs = this._widget.getVisibleRows()
        if (rs && rs.length > 0 && rs[0] != -1) {
          if (index < rs[0] || index > rs[1]) {
            this._widget.scrollToRow(index)
          }
        }
      }
      rowStyleUpdate.push(index)
      this._currentRecord = current
      this._widget._setCurrentAndUpdateRowStyle = true
      for (let i = 0, len = rowStyleUpdate.length; i < len; i++) {
        if (this._widget.body) {
          //控件渲染后才执行行样式更改
          this._refreshRowStyle(rowStyleUpdate[i])
        }
      }
      this._widget._setCurrentAndUpdateRowStyle = false
    },

    _refreshRowStyle: function (rowNum) {
      let isSimple = this.ChooseModelSetValue == 0
      if (!isSimple) {
        this._widget.refreshCell(rowNum, 1)
      }
      let fields = this._widget.fields
      if (fields && fields.length > 0) {
        for (let i = 0, len = fields.length; i < len; i++) {
          this._widget.refreshCellStyle(rowNum, i)
        }
      }
    },

    reset: function () {
      this._currentRecord = null
      let selection = this._widget.selection
      if (selection) {
        this._widget.deselectAllRecords()
      }
    },

    /**
     *获取记录下标(在数据源中获取,以主键做对比)
     */
    getRecordIndex: function (record) {
      let primaryKey = this.getPrimaryKey()
      let datas = this._widget.data

      let groupField = this._widget.groupByField + ''
      let isGroupField = false
      if (
        groupField !== 'null' &&
        groupField !== 'undefined' &&
        groupField.trim() !== ''
      ) {
        isGroupField = true
      }

      if (this.type == 'JGTreeGrid' || this.type == 'JGTreeView')
        datas = this._widget.data.getAllItems()
      if (datas) {
        if (
          isc.isA.ResultSet(datas) ||
          isc.isA.ResultTree(datas) ||
          isGroupField
        ) {
          return this._widget.getRecordIndex(record)
        } else {
          let index = 0
          for (let i = 0, len = datas.length; i < len; i++) {
            if (record[primaryKey] == datas[i][primaryKey]) {
              index = i
              break
            }
          }
          return index
        }
      }
      return -1
    },
    /**
     *获取绑定数据源主键
     */
    getPrimaryKey: function () {
      let ds = isc.DataSource.getDataSource(this.TableName)
      return ds ? ds.getPrimaryKeyFieldName() : null
    },
    /**
     *从数据源中获取记录
     */
    getRecordFromDS: function (record) {
      let ds = isc.DataSource.getDataSource(this.TableName)
      let primaryKey = ds.getPrimaryKeyFieldName()
      return ds.findById(record[primaryKey])
    },
    /**
     *获取控件中的记录
     */
    getRecordFromLocal: function (record) {
      if (
        this._widget &&
        record &&
        this._widget.data &&
        (isc.isA.Array(this._widget.data) ||
          (this._widget.data.localData &&
            this._widget.data.localData.length > 0))
      ) {
        let datas = isc.isA.Array(this._widget.data)
          ? this._widget.data
          : this._widget.data.localData
        let ds = isc.DataSource.getDataSource(this.TableName)
        let primaryKey = ds.getPrimaryKeyFieldName()
        for (let i = 0, len = datas.length; i < len; i++) {
          let data = datas[i]
          if (data[primaryKey] == record[primaryKey]) {
            return data
          }
        }
      }
    },

    getTableName: function () {
      return this.TableName
    },

    // liangmf 2013-06-06 修改不能直接调用，需要外部配合把DB的是否多选同步修改
    getChooseModelSetValue: function () {
      return this.ChooseModelSetValue
    },

    // liangmf 2013-06-06 修改不能直接调用，需要外部配合把DB的是否多选同步修改
    setChooseModelSetValue: function (chooseModelSetValue) {
      chooseModelSetValue = isc.isA.Number(chooseModelSetValue)
        ? chooseModelSetValue
        : parseInt(chooseModelSetValue)
      chooseModelSetValue = isNaN(chooseModelSetValue) ? 0 : chooseModelSetValue
      this.ChooseModelSetValue = chooseModelSetValue

      if (this.ChooseModelSetValue == 0 || this.ChooseModelSetValue == 1) {
        this._widget.setSelectionType('single')
      } else {
        this._widget.setSelectionType('simple')
      }

      let cfg = this._genSelectModel()
      this._widget.setSelectionAppearance(cfg.selectionAppearance)
    },

    getChooseModelSet: function () {
      //TODO 兼容处理,后续需要删除
      return this._chooseModelSetMap[this.ChooseModelSetValue + '']
    },

    getRowsFixedCount: function () {
      return this.RowsFixedCount
    },

    //放在容器中按布局排版时设置比例
    setPercentWidth: function (percentWidth) {
      this.Super('setPercentWidth', arguments)
      //this._widget.setWidth(percentWidth);
      this._widget.setWidth('100%')
    },
    setPercentHeight: function (percentHeight) {
      this.Super('setPercentHeight', arguments)
      //this._widget.setHeight(percentHeight);
      this._widget.setHeight('100%')
    },

    _getFieldByColumnId: function (columnId) {
      let fields = this.fields
      if (fields && fields.length > 0) {
        for (let i = 0, len = fields.length; i < len; i++) {
          let field = fields[i]
          if (field.columnId == columnId) {
            return field
          }
        }
      }
    },
    setColumnVisible: function (columnId, visible) {
      let field = this._getFieldByColumnId(columnId)
      if (field) {
        visible ? this._widget.showField(field) : this._widget.hideField(field)
      }
    },
    readOnlyColumn: function (columnId, readOnly) {
      let field = this._getFieldByColumnId(columnId)
      if (field) {
        field.canEdit = !readOnly
      }
    },
    getFields: function () {
      return this._widget.fields
    },

    bindDataSource: function (ds) {
      this._widget.setDataSource(ds, this.getFields())
      let fetchMode = this.getFetchMode()
      ds = typeof ds == 'string' ? isc.DataSource.getDataSource(ds) : ds
      this.TableName = ds.ID
      if (fetchMode === 'paged' || fetchMode === 'all') {
        this.setData(ds.getCacheData())
      }
      if (fetchMode === 'scroll') {
        let rs = isc.ResultSet.create({
          dataSource: this.TableName
        })
        this.setData(rs)
      }
    },

    setDataSource: function (dataSource, fields) {
      this._widget.setDataSource(dataSource, fields)
    },

    getOrginalFields: function () {
      return this.fields
    },

    getFieldName: function (columnId) {
      let fields = this._widget.fields
      if (fields && fields.length > 0) {
        for (let i = 0, field; (field = fields[i]); i++) {
          if (field.columnId == columnId) {
            return field.name
          }
        }
      }
      return null
    },

    destroyEditorForm: function (columnId) {
      let form = this._widget.$286 || this._widget._editRowForm
      if (form) {
        let fields = this.fields
        if (fields && fields.length > 0) {
          for (let i = 0, len = fields.length; i < len; i++) {
            let field = fields[i]
            if (field.columnId == columnId) {
              let fieldName = field.name
              let item = form.getItem(fieldName)
              if (item) {
                form.destroy()
                delete this._widget.$286
                delete this._widget._editRowForm
                delete this._widget._editorShowing
                delete this._widget.$30a
                delete this._widget.$30u
                delete this._widget.$285
                delete this._widget._editRowNum
                delete this._widget._editColNum
              }
              break
            }
          }
        }
      }
    },

    destroy: function () {
      //var widget = this._widget;
      //if(widget){
      //widget.destroy();
      //}
      this._revertFuns()
      this._widget = null
      this.Super('destroy', arguments)
    }
  })
}
