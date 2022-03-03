import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
let sandbox
exports.initModule = function (sBox) {
  sandbox = sBox
  // 定义v3ui控件类型
  isc.ClassFactory.defineClass('JGTree', 'JGDataList')
  isc.ClassFactory.mixInInterface('JGTree', 'JGColumnAssistant')

  isc.JGTree.addProperties({
    _treeData: null,
    //标识字段
    IDColumn: null,
    //显示字段
    DisplayColumnName: null,

    //父字段
    PIDColumn: '_$parentId',
    //实现方式（0:父子节点,1:左右编码）
    RealizeWay: 0,
    //叶子字段
    LeafNode: null,
    //显示模式（0：普通树，1：单选树，2：多选树）
    DisplayModeValue: 0,
    //排序字段
    OrderNoColumn: null,
    //编码字段
    CodeColumn: null,
    //是否级联
    CascadeCheck: false,
    //是否显示序号列(默认显示false)
    ShowRowNumbers: false,
    //设置默认行高度
    RowHeight: 29,
    _treeDataPid: '_$treePid',

    _folderProperty: '_$isParent',

    _openProperty: '_$state',

    _preOpenFolderFunc: null,

    _closeIcon: '_$closeIcon',

    _openIcon: '_$openIcon',

    _iconProperty: '_$icon',

    listener: [
      'rowClick',
      'rowSelected',
      'rowsSelected',
      'currentRowClick',
      'selectionChanged',
      'expandRecord',
      'expand',
      'drop',
      'collapse',
      'dblclick',
      'genCellCssText',
      'generateCellCanEdit',
      'selectionUpdated'
    ],
    WidgetStyle: 'JGDataGrid',
    /**
     *  树表状态值（默认inited loading loaded）
     */
    WidgetDataStatus: 'inited',
    CascadeCheckType: 'Default'
  })

  isc.JGTree.addMethods({
    /**
     * 控件初始化前
     */
    _beforeWidgetInit: function () {
      this._folderProperty = this._genFolderProperty()
      this._treeData = isc.Tree.create({
        modelType: 'parent',
        idField: this.IDColumn,
        nameProperty: this.IDColumn,
        parentIdField: this._treeDataPid,
        isFolderProperty: this._folderProperty,
        openProperty: this._openProperty,
        showConnectors: true,
        data: []
      })
      //当一个窗体有多棵树绑定到同一实体后，因数据公用，且子节点属性一样，会导致数据混乱，引发树节点父子关系展现不对，如：2棵树绑定同一数据源，当分层加载时，展开父节点，会显示两个同样的子节点 2016-09-30 xiedh
      this._treeData.childrenProperty = '_children_' + this._treeData.ID
    },
    /**
     * 构建控件
     */
    _buildWidget: function () {
      if (
        this.WidgetStyle == 'JGTreeView' ||
        this.WidgetStyle == 'JGTreeGrid' ||
        this.WidgetStyle == 'JGTree'
      ) {
        this.WidgetStyle = 'JGBaseGrid'
      }

      let fields = this._initFields()
      this._headerSpans = this.staticHeaderSpans
      this._addFormatCellValue(this.fields)
      let that = this
      let initHoverColumn = function (widget, field, ignoreValue) {
        field['showHover'] = true
        if (undefined != field.name && null != field.name && '' != field.name) {
          field['hoverHTML'] = function (record) {
            if (
              field.hoverTips &&
              field.hoverTips !== '' &&
              !isc.isAn.emptyObject(field.hoverTips)
            ) {
              field.nowRecord = record
              let hoveHtml = that._callEvent(that, '_genHoverContent', {
                _field: field
              })
              // 从特定的canvas获取到vueJs解释后的html, 可能会遇到vueJs解释速度不够快，导致获取到未解释的dom
              let hoverDomID = isc.Hover.hoverCanvas.getCanvasName(),
                $hoverDom = $('#' + hoverDomID)

              let hoverHtml = $hoverDom.html()
              if (hoverHtml === '' || hoverHtml === '&nbsp;') return null //兼容处理IE8下不支持vueJs
              return hoverHtml
            } else if (ignoreValue) {
              // 兼容旧版本开发系统，未配置浮动提示则不显示hover内容
              return null
            } else {
              let value = record[field.name]
              if (value && typeof value == 'string') {
                value = value.replace(/\\</g, '&lt;').replace(/\\>/g, '&gt;')
              }
              return value
            }
          }
        } else {
          field['hoverHTML'] = ''
        }
      }

      let initBaseColumn = function (widget, field) {
        field['editorProperties']['height'] = widget.RowHeight
        field['editorProperties']['changed'] = function (form, item, value) {
          this.validate()
        }
        field['editorProperties']['blur'] = function (form, item) {
          if (!this.validate()) {
            let oldValue = this.form.getOldValue(this.name)
            this.setValue(oldValue)
          }
        }
        field['editorProperties']['onBeforeBlur'] = function () {
          this.blur()
        }
        initHoverColumn(widget, field)
      }

      let initJGTextBoxColumn = function (widget, field) {
        initBaseColumn(widget, field)
        field['editorProperties']['length'] = !isNaN(field.length)
          ? Number(field.length)
          : 255
        field['editorProperties']['textBoxStyle'] = 'JGTextBoxEditorText'
        field['editorProperties']['validators'] = [
          {
            errorMessage: '内容最大长度为:' + field.length,
            type: 'maxLength'
          }
        ]
      }

      let initJGLongTextBoxColumn = function (widget, field) {
        initBaseColumn(widget, field)
        field['editorProperties']['length'] = !isNaN(field.length)
          ? Number(field.length)
          : 2000
        field['editorProperties']['textBoxStyle'] = 'JGLongTextBoxGridEditor'
        field['editorProperties']['validators'] = [
          {
            errorMessage: '内容最大长度为:' + field.length,
            type: 'maxLength'
          }
        ]
      }

      let initJGIntegerBoxColumn = function (widget, field) {
        initBaseColumn(widget, field)
        field['editorProperties']['textBoxStyle'] = 'JGIntegerBoxEditorText'
        field['editorProperties']['keyPressFilter'] = '[0-9\\-]'
      }

      let initJGFloatBoxColumn = function (widget, field) {
        initBaseColumn(widget, field)
        field['editorProperties']['textBoxStyle'] = 'JGFloatBoxEditorText'
        field['editorProperties']['keyPressFilter'] = '[0-9.\\-]'
      }

      let initJGPercentColumnColumn = function (widget, field) {
        field['editorProperties']['height'] = widget.RowHeight
        initHoverColumn(widget, field)
      }

      let initJGCheckBoxColumn = function (widget, field) {
        if (field.editModel.toLowerCase() == 'false') {
          field['editorProperties']['minDate'] = function (val) {
            if (val == field.selectVal) {
              val = true
            } else if (val == field.notSelectVal) {
              val = false
            }
            return field.Super('getValueIcon', arguments)
          }
        }
        initHoverColumn(widget, field, true)
      }

      let initJGComboBoxColumn = function (widget, field) {
        initHoverColumn(widget, field)
      }

      let initJGLongDateTimePickerColumn = function (widget, field) {
        field['editorProperties']['textBoxStyle'] =
          'JGLongDateTimePickerEditorText'
        field['editorProperties']['sdatetype'] = 'datetime'
        field['editorProperties']['height'] = widget.RowHeight
        field['editorProperties']['minDate'] = field.minDate
        field['editorProperties']['maxDate'] = field.maxDate
        initHoverColumn(widget, field, true)
      }

      let initJGDateTimePickerColumn = function (widget, field) {
        field['editorProperties']['textBoxStyle'] = 'JGDateTimePickerEditorText'
        field['editorProperties']['sdatetype'] = 'date'
        field['editorProperties']['height'] = widget.RowHeight
        field['editorProperties']['minDate'] = field.minDate
        field['editorProperties']['maxDate'] = field.maxDate
        initHoverColumn(widget, field, true)
      }

      let initJGImageColumn = function (widget, field) {
        initHoverColumn(widget, field, true)
      }

      let initJGBaseDictBoxColumn = function (widget, field) {
        initHoverColumn(widget, field)
      }

      for (let i = 0; i < fields.length; i++) {
        let field = fields[i]
        if (!field.editorProperties) field.editorProperties = {}
        if (field.type == 'JGTextBoxColumn') initJGTextBoxColumn(this, field)
        else if (field.type == 'JGLongTextBoxColumn')
          initJGLongTextBoxColumn(this, field)
        else if (field.type == 'JGPercentColumn')
          initJGPercentColumnColumn(this, field)
        else if (field.type == 'JGIntegerBoxColumn')
          initJGIntegerBoxColumn(this, field)
        else if (field.type == 'JGFloatBoxColumn')
          initJGFloatBoxColumn(this, field)
        else if (field.type == 'JGLongDateTimePickerColumn')
          initJGLongDateTimePickerColumn(this, field)
        else if (field.type == 'JGDateTimePickerColumn')
          initJGDateTimePickerColumn(this, field)
        else if (field.type == 'boolean') initJGCheckBoxColumn(this, field)
        else if (field.type == 'JGComboBoxColumn')
          initJGComboBoxColumn(this, field)
        else if (field.type == 'image') initJGImageColumn(this, field)
        else if (field.type == 'JGBaseDictBoxColumn')
          initJGBaseDictBoxColumn(this, field)
      }
      /*区分树和树表，分别加载不同的样式*/
      if (this.type == 'JGTreeView') {
        let _className = this.WidgetStyle + 'Tree'
        let _headerBarStyle = this.WidgetStyle + 'TreeHeader'
      } else if (this.type == 'JGTreeGrid') {
        let _className = this.WidgetStyle + 'TreeList'
        let _headerBarStyle = this.WidgetStyle + 'TreeListHeader'
      }

      let option = {
        //调整滚动条，使用浏览器自带滚动条
        //showCustomScrollbars:false, by xiedh 2016-06-12 设置此属性会导致树动态渲染失效，引发性能问题
        data: this._treeData,
        autoDraw: false,
        width: this.Width,
        height: this.Height,
        canEdit: !this.ReadOnly,
        editEvent: this.EditTrigger + '' === 'click' ? 'click' : 'doubleClick',
        //dataSource : this.TableName,
        autoFetchData: false, //true时，vm上的dataChange被赋值成另一个方法（原本是空方法），导致死循环（复制的对象相互引用）TaskB20191029004
        alternateRecordStyles: true,
        editByCell: true,
        animateFolders: false,
        validateByCell: true,
        modalEditing: true,
        //canReorderRecords: true,
        //canAcceptDroppedRecords: true,
        showRowNumbers: this.ShowRowNumbers, //是否显示序号列
        sortField: this.OrderNoColumn,
        headerSpans: this._headerSpans,
        folderOpened: this._referEvent(this, 'expand'),
        folderClosed: this._referFunc(this, '_collapse'),
        folderDrop: this._referEvent(this, 'drop'),
        recordDoubleClick: this._referFunc(this, '_dblclick'),
        showSelectedStyle: false,
        disabled: !this.Enabled,
        customIconProperty: this._iconProperty,
        fields: fields,
        emptyMessage: '',
        defaultEmptyMessage:
          '<br>' + i18n.get('无数据!', '普通窗体表类控件无数据提示'),
        loadingDataMessage:
          '<br>${loadingImage}&nbsp;' +
          i18n.get('加载中...', '普通窗体表类控件加载数据提示'),
        nodeClick: this._referFunc(this, '_rowClick'),
        openModuleClick: this._referFunc(this, '_openModuleClick'), //处理下拉框自动提示
        selectionChanged: this._referFunc(this, '_selectionChangedEvent'),
        hasLinkEvent: this._referFunc(this, '_hasLinkEvent'),
        genCellCssText: this._referFunc(this, ['genCellCssText']),
        genCellCanEdit: this._referFunc(this, ['genCellCanEdit']),
        currentRowClick: this._referEvent(this, ['currentRowClick']),
        selectionUpdated: this._referFunc(this, '_selectionUpdatedEvent'),
        cellHeight: this.RowHeight,
        className: _className,
        headerBarStyle: _headerBarStyle,
        headerMenuButtonBaseStyle: this.WidgetStyle + 'HeaderMenu',
        sorterConstructor: 'Button',
        headerButtonConstructor: 'Button',
        showHeaderMenuButton: false,
        openerIconSize: 18,

        /**
         *  2015-05-05 liangchaohui：
         *  添加updateEditorItemsInPlace:false属性，修复树表下拉框备选发生改变，重新进入编辑状态时没有创建新的编辑器导致不会刷新备选数据问题
         */
        updateEditorItemsInPlace: false,
        iconPadding: 4,
        getNodeTitle: function () {
          var value = this.Super('getNodeTitle', arguments)
          if (value && typeof value == 'string')
            value = value.replace(/\</g, '&lt;').replace(/\>/g, '&gt;')
          return value
        },
        initWidget: function () {
          this.Super('initWidget', arguments)
          this.sorterDefaults.baseStyle = this.className + 'SorterButton'
          this.sorterDefaults.isSorterButton = false
          this.sorterDefaults.src = '[SKIN]ListGrid/headers.png'
        },
        rowNumberFieldProperties: {
          showAlternateStyle: true
        },
        headerButtonProperties: {
          align: 'center',
          baseStyle: this.WidgetStyle + 'HeaderButton',
          showTitle: false,
          getAriaLabel: function () {
            return null
          }
        },
        getOpenIcon: function (param) {
          // 处理树实体字段包含和sc框架冲突的关键字 openIcon
          if (param.openIcon) param.openIcon = null

          var result = null

          try {
            result = this.Super('getOpenIcon', param)
          } catch (e) {
            // 有时候存在异常, 暂未发现影响功能
          }

          return result
        },
        bodyStyleName: this.WidgetStyle + 'Body',
        leaveScrollbarGap: false, //取消没出现滚动条的时候，表头出现滚动条位置
        //设置在编辑的时候，重新计算form显示的高度
        getEditorProperties: function (editField, editedRecord, rowNum) {
          // 处理弹出选择控件
          if (editField.editorType == 'baseDictBox') {
            if (
              editField.isEdit &&
              (editField.isEdit + '').toLowerCase() === 'true'
            )
              editField.isEdit = true
            else editField.isEdit = false

            var textFieldName = editField.displayField
            var valueFieldName = editField.name
            editField.editorProperties.itemFields.valueField = textFieldName
            editField.editorProperties.itemFields.textField = valueFieldName
            editField.editorProperties.titleClick = this.openModuleClick
            editField.editorProperties.isEdit = editField.isEdit

            if (!editField.isEdit) {
              editField.editorProperties.blur = function () {
                _this._widget.body._openClick = true
                _this._widget.hideInlineEditor(true)
              }

              if (this._widget) {
                this._widget.body.redraw = function () {
                  this.Super('redraw', arguments)
                  if (this._openClick) {
                    this.parentElement.dataChanged()
                    this._openClick = false
                  }
                }
              }
            }
          }

          var styleObject = isc.Element.getStyleEdges(this.baseStyle)
          if (styleObject) {
            var w =
              parseInt(
                styleObject.borderTopWidth ? styleObject.borderTopWidth : 0
              ) +
              parseInt(
                styleObject.borderBottomWidth
                  ? styleObject.borderBottomWidth
                  : 0
              )
            if (!editField.editorProperties) editField.editorProperties = {}
            editField.editorProperties.height =
              this.cellHeight - (isNaN(w) ? 0 : w)
          }
          return isc.addProperties(
            {},
            this.editorProperties,
            editField.editorProperties
          )
        }
      }

      let selectModel = this._genSelectModel()

      if (option.showRowNumbers) {
        //行号宽度自适应
        option.drawAreaChanged = function () {
          this.autoFitField(0)
        }
        //处理行号展开折叠后，序号不变
        option.rowNumberFieldProperties.formatCellValue = function (
          _1,
          _2,
          _3,
          _4,
          _5
        ) {
          if (_5.isGrouped) {
            if (_2 == null || _2.$52e) return '&nbsp;'
            let _6 = _5.getGroupedRecordIndex(_2)
            if (_6 == -1) return null
            return _5.rowNumberStart + _6
          } else {
            //处理树表展开折叠时，序号不变
            let nodeList = _5.getParentElements()[0]._treeData.getNodeList()
            for (let i = 0; i < nodeList.length; i++) {
              if (_2.id === nodeList[i].id) {
                return i + 1
              }
            }
          }
        }
      }

      if ((this.AdaLineHeight + '').toLowerCase() === 'true') {
        option.wrapCells = true
        option.fixedRecordHeights = false
      }

      isc.addProperties(option, selectModel)
      // 自适应行内容处理

      /**
       * 是否需要显示边框线的样式
       */
      if (this.ShowCellBorder) {
        let cellStyle = {
          rowNumberStyle: this.WidgetStyle + 'LineSpecialCol',
          baseStyle: this.WidgetStyle + 'LineTallCell',
          groupNodeStyle: this.WidgetStyle + 'LineGroupNodeStyle'
        }
        isc.addProperties(option, cellStyle)
      } else {
        let cellStyle = {
          rowNumberStyle: this.WidgetStyle + 'SpecialCol',
          baseStyle: this.WidgetStyle + 'TallCell',
          groupNodeStyle: this.WidgetStyle + 'GroupNodeStyle'
        }
        isc.addProperties(option, cellStyle)
      }

      if (
        typeof this.RowsFixedCount !== 'undefined' &&
        this.RowsFixedCount.toString() === '0'
      )
        option.showHeader = false
      option.headerHeight = this._genHeaderHeightByHeaderSpans(
        this._headerSpans
      )
      // 处理最后一条数据无法显示
      /*option.bodyProperties ={
                    redrawOnScroll:function(_1) {
                        this.showAllRows  = true;
                        if (this.frozen)
                            this.$1055 = true;
                        return this.Super("redrawOnScroll", arguments)
                    }
                }by xiedh 2016-06-12 此段逻辑会导致动态渲染失效，引发性能问题*/
      return isc.VTreeGrid.create(option)
    },
    /**
     *重写draw方法
     */
    _onDraw: function () {
      let result = this.Super('_onDraw', arguments)
      this._widget.setData(this._treeData)
      let _this = this
      return result
    },

    /**
     * 条件样式解释处理
     */
    genCellCanEdit: function (rowNum, colNum) {
      //树表会重写此方法，树不会用到条件编辑功能，要加个基类空方法
    },

    /**
     * 条件样式解释处理
     */
    genCellCssText: function (record, rowNum, colNum) {
      //树表会重写此方法，树不会用到条件样式功能，要加个基类空方法
    },
    /**
     * 列双击事件
     */
    fireCellDoubleClick: function (rowNum, colNum) {
      let record = this._widget.getRecord(rowNum)
      let field = this._widget.getField(colNum)
      this._rowClick(this, record, rowNum, field, colNum, null, null)

      let columnId = field.columnId
      this._callEvent(this, 'cellDoubleClick', columnId)
    },
    /**
     * 弹出选择控件 链接事件
     */
    _openModuleClick: function (viewer, record, recordNum, fieldNum) {
      let _widget = this._widget
      let colNum = _widget.getEditCol()
      let _field = _widget.getEditField(colNum)

      // 调整列表弹出选择逻辑，如果用户触发点击右边图标事件后执行失焦, 即失去选中编辑状态
      _widget && _widget.cellEditEnd && _widget.cellEditEnd()

      this._callEvent(this, 'openModuleClick', _field.columnId)
    },
    /**
     *双击事件前先选中
     */
    _dblclick: function (viewer, record, recordNum, fieldNum) {
      let selectionChanged = this._selectionChanged(record)
      //注意：先触发当前行事件
      if (selectionChanged) {
        this._callEvent(this, 'currentRowClick', record)
      }
      this.fireCellDoubleClick(recordNum, fieldNum.masterIndex)
      this._callEvent(this, ['dblclick'])
    },
    /**
     * 级联类型：父级联动 / 子级联动
     * @param {*} node 选择的节点
     * @param {*} state 取消 / 选中
     */
    _cascadeParentOrChildCheck: function (node, state) {
      if (this.CascadeCheckType === 'ParentCascadeCheck') {
        //父级联动
        let parentId = this.getParentId(node.id)
        let parentRecord = this.getNodeById(parentId)
        if (state == true) {
          this.selectRecord(parentRecord, state)
        } else {
          let brotherId = this.getChildrenIds(parentId)
          brotherId.splice(brotherId.indexOf(node.id), 1)
          let brotherIsSelect = false
          for (let i = 0; i < brotherId.length; i++) {
            brotherRecord = this.getNodeById(brotherId[i])
            brotherIsSelect = this._widget.isSelected(brotherRecord)
            if (brotherIsSelect) {
              break
            }
          }
          if (!brotherIsSelect) {
            this.selectRecord(parentRecord, state)
          }
        }
        this.redraw()
      } else if (this.CascadeCheckType === 'ChildrenCascadeCheck') {
        //子级联动
        let childrenId = this.getChildrenIds(node.id)
        let childRecords = []
        for (let i = 0; i < childrenId.length; i++) {
          childRecords.push(this.getNodeById(childrenId[i]))
        }
        this.selectRecord(childRecords, state)
        this.redraw()
      }
    },
    /**
     *选择改变时
     */
    _selectionChangedEvent: function (node, state) {
      // 是否级联触发事件
      let notCasTriEvent =
        (this.CascadeTriggerEvent + '').toLowerCase() === 'false'
      if (this._widget) {
        let isPartially = this._widget.isPartiallySelected(node)

        this._cascadeParentOrChildCheck(node, state)
        if (isPartially && this.CascadeCheckType != 'AllCascadeCheck') {
          if (!notCasTriEvent) {
            //级联触发事件为true
            this._callEvent(this, 'rowSelected', node, false)
          }
        } else {
          if (!notCasTriEvent) {
            //级联触发事件为true
            this._callEvent(this, 'rowSelected', node, state)
          }
          this._callEvent(this, 'selectionChanged', node, state)
        }
      }
    },

    /**
     * 选中更改后事件
     */
    _selectionUpdatedEvent: function (record, records) {
      let notCasTriEvent =
        (this.CascadeTriggerEvent + '').toLowerCase() === 'false'
      if (this._widget) {
        let seledIds = []
        for (let i = 0, rd; (rd = records[i]); i++) {
          let isPartially = this._widget.isPartiallySelected(rd)
          if (!isPartially) {
            seledIds.push(rd.id)
          }
        }
        this._callEvent(this, 'selectionUpdated', seledIds)

        if (notCasTriEvent && this._getSelectionUpdatedStated()) {
          //级联触发事件为false
          this._callEvent(this, 'rowsSelected', seledIds, true)
        }
      }
    },
    _getSelectionUpdatedStated: function (state) {
      // 控制是否触发 _selectionUpdatedEvent 事件
      if (state + '' === 'undefined' || state + '' === 'null') {
        return this._allowTriSelUpdatedEvent
      } else {
        this._allowTriSelUpdatedEvent = state
      }
    },
    _getSelectionRowData: function () {
      let _widget = this._widget
      let treeBody = _widget.getBody()
      let rowNumClicked = treeBody.getEventRow()
      return treeBody.grid.data.get(rowNumClicked)
    },

    _genSelectModel: function () {
      let cfg
      switch (this.DisplayModeValue) {
        case 0:
          cfg = {
            selectionType: 'single'
          }
          break
        case 1:
          cfg = {
            selectionAppearance: 'radio',
            selectionType: 'single'
          }
          break
        case 2:
          cfg = {
            selectionAppearance: 'checkbox'
          }
          if (this.CascadeCheck) {
            if (this.CascadeCheckType === 'Default') {
              cfg.showPartialSelection = true
              cfg.cascadeSelection = true
            } else if (this.CascadeCheckType === 'AllCascadeCheck') {
              //父子级联动 =》选中一个，子节点全部选中，父节点全部选中
              //             取消一个，子节点全部取消，兄弟节点有选中，父节点不取消，兄弟节点无选择，父节点全取消
              cfg.cascadeSelection = true
            }
          }
          break
        default:
          cfg = {}
      }
      return cfg
    },
    /**
     *设置级联
     */
    setCascadeCheck: function (cascade) {
      this.CascadeCheck = cascade
      this._widget.cascadeSelection = cascade
      this._widget.showPartialSelection = cascade
      this._widget.selection.cascadeSelection = cascade
      this._widget.redraw()
    },
    /**
     *获取级联设置
     */
    getCascadeCheck: function () {
      return this.CascadeCheck
    },

    /**
     *  获取列表属性值 WidgetDataStatus
     */
    getWidgetDataStatus: function () {
      return this.WidgetDataStatus
    },
    /**
     *  设置列表属性值
     */
    setWidgetDataStatus: function (state) {
      this.WidgetDataStatus = state
    },
    /**
     * 设置当前行
     */
    setCurrentRecord: function (record) {
      let node = this._treeData.findById(record[this.IDColumn])
      // 处理node值为null时出异常
      if (node) {
        let parentId = node[this.PIDColumn]
        let selectionChanged = this._selectionChanged(node)
        if (selectionChanged) {
          this._openNodeTo(parentId) // 处理目标节点未展开问题
          this._callEvent.apply(this, [this, 'selectionChanged'])
        }
        this.setCurrentAndUpdateRowStyle(node)
      }
    },
    _openNodeTo: function (nodeId) {
      // 打开根据节点ID展开到目标节点
      let nodeParIds = this._getCloseParNodeId(nodeId)
      if (!nodeParIds || nodeParIds.length === 0) return

      for (let i = 0, len = nodeParIds.length; i < len; i++) {
        let tmpId = nodeParIds[i]
        let tmpNode = this.getNodeById(tmpId)
        this.openFolderByNode(tmpNode, false)
      }
    },
    _getCloseParNodeId: function (nodeId, nodeIds) {
      // 根据节点ID获取所有父节点中关闭的节点
      if (!nodeIds) nodeIds = []
      if (!nodeId || nodeId === '') return
      let node = this.getNodeById(nodeId)
      if (node) {
        let isOpened = node[this._treeData.openProperty]
        if (!isOpened) {
          nodeIds.unshift(nodeId)
          let parentNodeId = node[this.PIDColumn]
          this._getCloseParNodeId(parentNodeId, nodeIds)
        }
      }
      return nodeIds
    },
    /**
     * 控件初始化后
     */
    _afterWidgetInit: function () {
      this.addChild(this._widget)
      this._widget.setData(this._treeData)
      this._preOpenFolderFunc = this._widget.openFolder
      this._widget.openFolder = this._referFunc(this, '_expand')
    },

    _initFields: function () {
      return [
        {
          name: this.DisplayColumnName
        }
      ]
    },

    _collapse: function (record) {
      if (record[this._closeIcon]) {
        record[this._iconProperty] = record[this._closeIcon]
      }
      this._callEvent(this, 'collapse', record)
    },

    _expand: function (record) {
      if (record[this._openIcon]) {
        record[this._iconProperty] = record[this._openIcon]
      }
      this._callEvent(this, ['expandRecord'], record)
      this._preOpenFolderFunc.apply(this._widget, [record])
    },

    _genFolderProperty: function () {
      return '__$$isFolder$$__'
    },

    _dealData: function (data) {
      if (data) {
        if (data.hasOwnProperty(this.LeafNode)) {
          data[this._folderProperty] = !(
            data[this.LeafNode] == null || data[this.LeafNode]
          )
        }
        data[this._openProperty] = data['state'] == 'open'
        if (data.closeIcon) {
          data.icon = data.closeIcon.src
          data._closeIcon = data.closeIcon
          delete data.closeIcon
        }
        if (data.openIcon) {
          data._openIcon = data.openIcon
          delete data.openIcon
        }
        if (!data.icon && data._closeIcon) {
          data.icon = data._closeIcon.src
        }
      }
      return data
    },

    _dealDatas: function (datas) {
      for (let i = 0, len = datas.length; i < len; i++) {
        let data = datas[i]
        this._dealData(data)
      }
      return datas
    },

    _validateRecords: function (records) {
      return records && records.length > 0
    },

    _referPartFunc: function () {
      this._referFuncs(this._widget, [
        'resort',
        'getAllFields',
        'getField',
        'setData',
        'markForRedraw',
        'scrollToRow'
      ])
      this._referFuncs(this._treeData, [
        'getParent',
        'getChildren',
        'getParents'
      ])
    },

    bindDataSource: function (dataSource) {
      this._widget.setDataSource(dataSource, this.getFields())
      this._widget.setData(this._treeData)
    },

    setDataSource: function (dataSource, fields) {
      this._widget.setDataSource(dataSource, fields)
      this._widget.setData(this._treeData)
    },

    getTreeData: function () {
      return this._treeData
    },
    /**
     * 加载数据
     * @param datas
     */
    loadData: function (datas, parentId) {
      let parent = this._treeData.findById(parentId)
      parent = parent ? parent : this._treeData.getRoot()
      let children = this._treeData.getChildren(parent)
      if (children && children.length > 0) {
        this._treeData.removeList(children)
      }
      if (this._validateRecords(datas)) {
        //var _datas = this._dealDatas(datas);
        //this._treeData.addList(_datas,parent);
        for (let i = 0, len = datas.length; i < len; i++) {
          let data = datas[i]
          let childrenDatas = data.children
          delete data.children
          let clone = {}
          isc.addProperties(clone, data)
          this._dealData(clone)
          this._treeData.add(clone, parent)
          this.loadData(childrenDatas, data[this.IDColumn])
        }
      }
    },

    linkNodes: function (values) {
      /*var root = this._treeData.getRoot();
            if(this._treeData.isLoaded(root)&&this._treeData.getChildren(root).length>0){
                var removeList = [];
                for(var i=0,len=values.length;i<len;i++){
                    var data = values[i];
                    var node = this._treeData.findById(data[this.IDColumn]);
                    if(node){
                        removeList.push(node);
                    }
                }
                this._treeData.removeList(removeList);
            }*/
      this._treeData.linkNodes(values)
      //防止树结构显示不正确
      this._widget.markForRedraw()
    },

    removeAll: function () {
      let nodes = this._treeData.getAllNodes()
      this._treeData.removeList(nodes)
    },

    addDatas: function (datas) {
      if (datas && datas.length > 0) {
        for (let i = 0, len = datas.length; i < len; i++) {
          let data = datas[i]
          data = this._dealData(data)
          let parentId = data[this.PIDColumn]
          let parentNode = this._treeData.find('id', parentId)
          let parentNotRoot = !!parentNode
          parentNode = parentNode ? parentNode : this._treeData.getRoot()
          this._treeData.add(data, parentNode)
          this._treeData.openFolder(parentNode)
          if (this.CascadeCheck && parentNotRoot) {
            //级联模式下，父节点如果选中，则子节点也需要选中，触发节点选中事件

            if (
              this._widget.isSelected(parentNode) &&
              this.CascadeCheckType != 'ParentCascadeCheck'
            ) {
              this._callEvent(this, 'rowSelected', data, true)
            }
          }
        }
        this._widget.resort()
      }
    },

    updateDatas: function (datas) {
      if (datas && datas.length > 0) {
        let treeDataPid = this.getInnerTreeParentField()
        let openProperty = this.getOpenProperty()
        let indexs = []
        let needToResort = false
        for (let i = 0, len = datas.length; i < len; i++) {
          let data = datas[i]
          if (!needToResort && data.hasOwnProperty(this.OrderNoColumn)) {
            //是否需要重新排序
            needToResort = true
          }
          //无需更新打开状态
          //delete data[openProperty];
          let node = this._treeData.findById(data[this.IDColumn])
          if (!node) continue
          isc.addProperties(node, data)
          let index = this.getRecordIndex(node)
          indexs.push(index)
          if (data.hasOwnProperty(openProperty)) {
            let isOpen = data[openProperty]
            let nodeOpened = this._treeData.isOpen(node)
            if (isOpen ^ nodeOpened) {
              isOpen
                ? this._treeData.openFolder(node)
                : this._treeData.closeFolder(node)
            }
          }
          if (data.hasOwnProperty(treeDataPid)) {
            //需要移动节点
            let pid = data[treeDataPid]
            let parent = this._treeData.findById(pid)
            parent = parent ? parent : this._treeData.getRoot()
            this._treeData.move(node, parent)
          }
        }
        for (let i = 0, len = indexs.length; i < len; i++) {
          this._widget.refreshRow(indexs[i])
        }
        if (needToResort) {
          this._widget.resort()
        }
      }
    },

    removeDatas: function (datas) {
      if (datas && datas.length > 0) {
        let nodeList = []
        for (let i = 0, len = datas.length; i < len; i++) {
          let data = datas[i]
          let node = this._treeData.findById(data[this.IDColumn])
          //20160909 liangzc:此处解决删除数据时候，没有重新渲染父节点的样式
          this.deselectRecord(node)
          if (node) {
            nodeList.push(node)

            // 处理子节点为空的情况下父节点图标未更新问题
            let _pid = node[this.PIDColumn]
            let _pidNodeChildren = this.getChildrenNode(_pid)
            if (_pidNodeChildren && _pidNodeChildren.length === 1)
              this.closeFolder(_pid)
          }
        }
        this._treeData.removeList(nodeList)
      }
    },
    /**
     *根据id获取节点
     * @param nodeId 节点Id
     */
    getNodeById: function (nodeId) {
      return this._treeData.findById(nodeId)
    },

    /**
     *获取子节点(如果parentId为undefined，则获取第一级节点)
     * @param parentId 父节点Id
     */
    getChildrenNode: function (parentId) {
      let node =
        typeof parentId == 'undefined'
          ? this.getRoot()
          : this.getNodeById(parentId)
      return node ? this._treeData.getChildren(node) : []
    },
    /**
     *获取根节点
     */
    getRoot: function () {
      return this._treeData.getRoot()
    },
    /**
     * 打开节点
     * @param {Object} nodeId
     */
    openFolder: function (nodeId, res) {
      let node = this.getNodeById(parentId)
      this.openFolderByNode(node, res)
    },

    openFolderByNode: function (node, res) {
      if (this._treeData.isFolder(node)) {
        this._treeData.openFolder(node)

        //如果节点不是展开的，触发展开事件
        if (!this._treeData.isOpen(node)) {
          // 触发节点展开事件
          this._callEvent(this, ['expand'], node)
        }

        if (res !== false) {
          let children = this.getChildrenNode(node.id)
          if (children && children.length > 0) {
            for (let i = 0, len = children.length; i < len; i++) {
              let child = children[i]
              this.openFolderByNode(child, res)
            }
          }
        }
      }
    },

    closeFolder: function (nodeId) {
      let node =
        typeof nodeId == 'undefined' ? this.getRoot() : this.getNodeById(nodeId)
      this._treeData.closeFolder(node)
      // 处理节点关闭时图标未更新问题
      node._$icon = node._$closeIcon

      // 触发折叠事件
      this._callEvent(this, 'collapse', node)
    },

    nodeExist: function (nodeId) {
      let node = this.getNodeById(nodeId)
      return !!node
    },

    _removeByParentId: function (parentId) {
      let nodes = this._treeData.find(this.PIDColumn, parentId)
      if (nodes && nodes.length > 0) {
        for (let i = 0, len = nodes.length; i < len; i++) {
          let node = nodes[i]
          this._removeByParentId(node[this.IDColumn])
        }
        this._treeData.removeList(nodes)
      }
    },
    /**
     *获取父节点ID
     */
    getParentId: function (nodeId) {
      let node = this._treeData.findById(nodeId)
      if (node) {
        let parent = this._treeData.getParent(node)
        return this._treeData.isRoot(parent) ? null : parent[this.IDColumn]
      } else {
        throw Error('未找到节点！id=' + nodeId)
      }
    },
    /**
     *获取子节点Id,如果parentId为null，则获取第一级节点id
     * @param parentId 父节点Id
     */
    getChildrenIds: function (parentId) {
      let parent = parentId
        ? this._treeData.findById(parentId)
        : this._treeData.getRoot()
      let children = this._treeData.getChildren(parent)
      if (children && children.length > 0) {
        let rs = []
        for (let i = 0, len = children.length; i < len; i++) {
          rs.push(children[i][this.IDColumn])
        }
        return rs
      }
      return []
    },
    /**
     *获取子孙ids
     * @param parentId 父节点Id
     */
    getDescendantIds: function (parentId) {
      let parent = parentId
        ? this._treeData.findById(parentId)
        : this._treeData.getRoot()
      let descendants = this._treeData.getDescendants(parent)
      if (descendants && descendants.length > 0) {
        let rs = []
        for (let i = 0, len = descendants.length; i < len; i++) {
          rs.push(descendants[i][this.IDColumn])
        }
        return rs
      }
      return []
    },

    /**
     *父节点字段
     */
    getParentField: function () {
      return this.PIDColumn
    },

    getLeafField: function () {
      return this.LeafNode
    },
    /**
     *
     */
    getfolderProperty: function () {
      return this._folderProperty
    },

    getOpenProperty: function () {
      return this._openProperty
    },

    getCloseIconProperty: function () {
      return this._closeIcon
    },

    getOpenIconProperty: function () {
      return this._openIcon
    },

    getInnerTreeParentField: function () {
      return this._treeDataPid
    },

    getIconProperty: function () {
      return this._iconProperty
    },

    getBusinessCode: function () {
      return this.CodeColumn
    },

    getTreeStructColumnId: function () {
      let fields = this.getFields()
      if (fields && fields.length > 0) {
        for (let i = 0, field; (field = fields[i]); i++) {
          if (field.hasOwnProperty('columnId')) {
            return field.columnId
          }
        }
      }
      return null
    },

    destroy: function () {
      let treeData = this._treeData
      if (treeData) {
        this._treeData = null
        treeData.destroy()
      }
      this.Super('destroy', arguments)
    },
    markLoaded: function () {
      this.WidgetDataStatus = 'loaded'
      this._widget.emptyMessage = this._widget.defaultEmptyMessage
      this.redraw()
    },
    showLoading: function (flag, isRestoreData) {
      // isRestoreData 用于判断是否还原备份数据
      // 暂时禁用数据还原，因为无法判断用户打开和关闭动画之间是否做了其他数据操作，导致数据错乱
      this.WidgetDataStatus = 'loading'
      isRestoreData = false
      let showFlag = flag == true ? true : false
      if (showFlag) {
        this._widget.emptyMessage = this._widget.loadingDataMessage
        if (isRestoreData) this._backupData = this._treeData.getAllNodes()
        else this.reset()

        this.removeAll()
      } else {
        this._widget.emptyMessage = this._widget.defaultEmptyMessage
        if (isRestoreData) this._treeData.linkNodes(this._backupData)
      }
      this.redraw()
    },
    //通过id获取该行在树中的行号
    getIndexById: function (id) {
      let nodeList = this._treeData.getNodeList()
      for (let i = 0; i < nodeList.length; i++) {
        if (id === nodeList[i].id) {
          return i + 1
        }
      }
    }
  })
}
