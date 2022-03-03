exports.initModule = function (sBox) {
  isc.ClassFactory.defineInterface('JGColumnAssistant', 'JGFormatHelper')
  //isc.ClassFactory.mixInInterface("JGColumnAssistant", "JGFormatHelper");

  isc.JGColumnAssistant.addInterfaceProperties({
    //行高
    HeadRowHeight: 26,
    //行高
    RowHeight: 20,
    //冻结列数
    FrozenCol: 0,

    staticHeaderSpans: [],

    _notSupportFormatCell: ['checkbox', 'image'],

    _headerSpans: null
  })

  isc.JGColumnAssistant.addInterfaceMethods({
    /**
     * 冻结列
     */
    _frozenColumns: function () {
      let count = this.FrozenCol
      let fields = this.fields
      for (let i = 0; i < count; i++) {
        let fileld = fields[i]
        fileld.frozen = true
      }
    },

    _getHeaderRowNum: function (headerSpans) {
      let deepth = 0
      if (headerSpans && headerSpans.length > 0) {
        deepth++
        let childMaxDeepth = 0
        for (let i = 0, len = headerSpans.length; i < len; i++) {
          let d = this._getSpanDeepth(headerSpans[i])
          childMaxDeepth = childMaxDeepth < d ? d : childMaxDeepth
        }
        deepth += childMaxDeepth
      }
      deepth = deepth === 0 ? 1 : deepth
      return deepth
    },

    /**
     * 根据标题合并配置生成标题高度
     * @param headerSpans 标题合并配置
     * @return 标题高度
     */
    _genHeaderHeightByHeaderSpans: function (headerSpans) {
      let deepth = this._getHeaderRowNum(headerSpans)
      return this.getHeadRowHeight() * deepth
    },
    /**
     *因sc原生控件不支持列禁用，复写此方法来达到需求
     */
    cellIsEnabled: function (rowNum, colNum, preFunc) {
      if (this._widget) {
        if (this._widget.body.fields[colNum])
          colNum = this._widget.body.fields[colNum].masterIndex

        let field = this._widget.getField(colNum)
        if (field && field.disabled) {
          return false
        } else {
          return this._preCellIsEnabled.apply(this._widget.body, [
            rowNum,
            colNum
          ])
        }
      }
    },
    /**
     * 获取标题合并深度
     */
    _getSpanDeepth: function (spanCfg) {
      let deepth = 0
      if (spanCfg.fields) {
        return ++deepth
      } else if (spanCfg.spans) {
        let spans = spanCfg.spans
        if (spans && spans.length > 0) {
          ++deepth
          let childMaxDeepth = 0
          for (let i = 0, len = spans.length; i < len; i++) {
            let span = spans[i]
            let d = this._getSpanDeepth(span)
            childMaxDeepth = childMaxDeepth < d ? d : childMaxDeepth
          }
          deepth += childMaxDeepth
        }
      }
      return deepth
    },

    _addFormatCellValue: function (fields) {
      if (fields && fields.length > 0) {
        for (let i = 0, len = fields.length; i < len; i++) {
          let field = fields[i]
          let editorType = field.editorType || field.type
          if (this._notSupportFormatCell.contains(editorType)) {
            continue
          }
          let ID = this.ID

          // 添加单元格双击事件
          let hasCellDoubleClickEvent = field.hasCellDoubleClick ? true : false
          if (hasCellDoubleClickEvent) {
            field.cellDoubleClickEvent = ID.fireCellDoubleClick
          }

          field.formatCellValue = function (
            value,
            record,
            rowNum,
            colNum,
            fieldObject
          ) {
            let innerHtml = ''
            let originValue = value
            value = window[ID]._formatDisplayValue(
              value,
              record,
              rowNum,
              colNum,
              window[ID]._widget
            )
            value = typeof value == 'undefined' || value == null ? '' : value
            let hasLinkEvent = this.hasClick ? true : false
            if (this.widgetType && this.widgetType == 'JGPercentColumn') {
              let cellColors = fieldObject.parentElement.genCellCssText(
                record,
                rowNum,
                colNum,
                true
              )
              //处理接口返回 undefined
              let backgroundSetting = ''
              if (cellColors) {
                let _tmpHtml = $("<div style='" + cellColors + "'></div")
                backgroundSetting = _tmpHtml.css('color')
              }

              //百分比列的显示格式特殊处理
              let frontColor = this.frontColor ? this.frontColor : 'red'
              /*
                            var tableWidth = 0;
                            if(this.width.toString().indexOf("%") != -1){
                                var gridWidth = window[ID].getVisibleWidth();
                                tableWidth = Math.round(gridWidth * parseFloat(this.width)/100);
                            }else{
                                tableWidth = this.width;
                            }
                            tableWidth = tableWidth - 4;//边框
                            */
              let tableHeight = this.editorProperties.height - 4
              let progressPercentWidth = 0
              originValue = parseFloat(originValue)
              if (isNaN(originValue)) {
                originValue = 0
              }
              let percentValueShow = Math.round(originValue * 10000) / 100
              if (originValue > 1) {
                progressPercentWidth = 100
              } else if (originValue < 0) {
                progressPercentWidth = 0
              } else {
                progressPercentWidth = percentValueShow
              }
              let notDonePercentWidth = 100 - progressPercentWidth
              //给个中间值，当大于这个值，显示在比例区间里，当小于这个值，显示在比例区间外（左靠）
              let notDonePercentText =
                originValue != 0 && originValue < 0.5
                  ? percentValueShow + '%'
                  : ''

              // 处理显示进度为0%
              if (originValue === 0) notDonePercentText = '0%'

              let progressPercentText =
                progressPercentWidth > 0 && originValue >= 0.5
                  ? percentValueShow + '%'
                  : ''
              let progressBackground = ''
              if (frontColor.indexOf('-') != -1) {
                progressBackground = frontColor.substr(
                  0,
                  frontColor.indexOf('-')
                )
              } else {
                progressBackground = frontColor
              }
              //添加 显示进度不为空,可以触发点击事件
              let onclick =
                hasLinkEvent &&
                (originValue != null || originValue != undefined)
                  ? "onclick='" +
                    ID +
                    '.fireLink(' +
                    rowNum +
                    ',' +
                    colNum +
                    ")'"
                  : ''
              let cursor =
                hasLinkEvent &&
                (originValue != null || originValue != undefined)
                  ? 'cursor:pointer'
                  : ''
              //已设置背景色
              if (backgroundSetting) {
                innerHtml =
                  "<table width='100%' height='" +
                  tableHeight +
                  "' border='0' cellpadding='0' cellspacing='0' " +
                  onclick +
                  " style='" +
                  cursor +
                  "'><tr><td align='right' style='background-color:" +
                  backgroundSetting +
                  ';width:' +
                  progressPercentWidth +
                  "%;'>" +
                  progressPercentText +
                  "</td><td align='left' style='width:" +
                  notDonePercentWidth +
                  "%;'>" +
                  notDonePercentText +
                  '</td></tr></table>'
              } else {
                //未设置背景色，则取默认颜色
                innerHtml =
                  "<table width='100%' height='" +
                  tableHeight +
                  "' border='0' cellpadding='0' cellspacing='0' " +
                  onclick +
                  " style='" +
                  cursor +
                  "'><tr><td align='right' style='background-color:" +
                  progressBackground +
                  ';width:' +
                  progressPercentWidth +
                  "%;'>" +
                  progressPercentText +
                  "</td><td align='left' style='width:" +
                  notDonePercentWidth +
                  "%;'>" +
                  notDonePercentText +
                  '</td></tr></table>'
              }
              return innerHtml
            }

            if (hasLinkEvent && this.disabled == false) {
              //颜色，下划线的放在条件样式那里一起处理
              if (
                fieldObject.parentElement.noPermission &&
                fieldObject.parentElement.noPermission[this.columnId] == false
              ) {
                innerHtml += '<span>' + value + '</span>'
              } else {
                let styleString = 'cursor:pointer;'
                innerHtml +=
                  '<span onclick="' +
                  ID +
                  '.fireLink(' +
                  rowNum +
                  ',' +
                  colNum +
                  ')" style="' +
                  styleString +
                  '" href="javascript:void(0);">' +
                  value +
                  '</span>'
              }
            } else {
              innerHtml += value
            }
            return innerHtml
          }
        }
      }
    },
    /**
     *是否绑定有链接事件
     */
    _hasLinkEvent: function (field) {
      let linkListeners = this._columnListener['Link']
      return (
        linkListeners &&
        linkListeners[field.columnId] &&
        linkListeners[field.columnId].length > 0
      )
    },

    //显示格式的几个方法抽到这里
    _formatDisplayValue: function (value, record, rowNum, colNum, grid) {
      if (value != undefined && value != null) {
        let item = grid.getField(colNum)
        let displayFormatCfg = item._displayFormatCfg
        if (displayFormatCfg && displayFormatCfg.displayFormat) {
          let numType = displayFormatCfg.numType
          let pattern = displayFormatCfg.displayFormat
          value = this.valueFormat(value, pattern, numType)
          return value
        }
      }

      if (value && typeof value == 'string') {
        if ((window._vGridSupportHTML + '').toLowerCase() !== 'true')
          value = value.replace(/\</g, '\x26lt;').replace(/\>/g, '\x26gt;')

        // 支持在列表在自适应行高下识别“回车换行符”和“空格符”
        if (this.AdaLineHeight + '' === 'True')
          value = value.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')
      }

      return value
    },
    /**
     * 获取行高
     * @return 行高
     */
    getHeadRowHeight: function () {
      return this.HeadRowHeight
    },
    /**
     * 获取行高
     * @return 行高
     */
    getRowHeight: function () {
      return this.RowHeight
    },
    /**
     * 设置标题合并
     * @param headerSpans 标题合并配置
     */
    setHeaderSpans: function (headerSpans) {
      let _spans = this.staticHeaderSpans || []
      this._headerSpans = _spans.concat(headerSpans)
      let headerHeight = this._genHeaderHeightByHeaderSpans(this._headerSpans)
      this._widget.setHeaderHeight(headerHeight)
      this._widget.setHeaderSpans(this._headerSpans)
      // 重新定制大小
      // #TaskB20180104014 添加逻辑处理异常
      if (this._widget.sorter) {
        this._widget.sorter.getHeight = function () {
          return headerHeight
        }
        this._widget.sorter.redraw()
      }
    },
    /**
     * 列表列事件绑定
     * @param columnId 列Id
     * @param eventName 事件名称
     * @param handler 事件句柄
     */
    onColumnEvent: function (columnId, eventName, handler) {
      let listeners = this._columnListener[eventName]
      if (listeners) {
        let l = listeners[columnId]
        if (!l) {
          l = []
          listeners[columnId] = l
        }
        l.push(handler)
      } else {
        throw Error('列表列不支持' + eventName + '事件！')
      }
    },
    /**
     * 解除列表列事件绑定
     * @param columnId 列Id
     * @param eventName 事件名称
     */
    unColumnEvent: function (columnId, eventName) {
      let listeners = this._columnListener[eventName]
      if (listeners) {
        listeners[columnId] = []
      } else {
        throw Error('列表列不支持' + eventName + '事件！')
      }
    }
  })
}
