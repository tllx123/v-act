import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
let sandbox
exports.initModule = function (sBox) {
  sandbox = sBox

  /**
   * @author zhangll
   * @class JGPagination
   * @date 2013-4-19 10:03:12
   *
   * 分页控件
   *
   * @extends JGBaseWidget
   */

  isc.ClassFactory.defineClass('JGPagination', 'JGBaseWidget')

  isc.addGlobal('JGPagination', isc.JGPagination)

  isc.JGPagination.addProperties({
    /**
     * 控件绝对定位上边距
     */
    Top: 0,

    /**
     * 控件绝对定位左边距
     *
     * @type {Number}
     */
    Left: 0,

    /**
     * 控件宽度
     *
     * @type {Number}
     */
    Width: 500,

    /**
     * 控件高度
     *
     * @type {Number}
     */
    Height: 25,

    pagination: null,

    /**
     * 记录总数
     *
     * @type {Number}
     */
    total: 0,

    /**
     * 当前页码, 默认值:1
     *
     * @type {Number}
     */
    pageNumber: 1,

    goToInfoMessage: i18n.get('到第', '普通窗体分页控件,建议最多3-6个字符'),

    /**
     * 显示多少条信息
     */
    totalPageMsg:
      i18n.get('共', '普通窗体分页控件') +
      '{total}' +
      i18n.get('条', '普通窗体分页控件'),

    /**
     * 每页显示数选项列表, 默认值:[10,20,30,50]
     *
     * @type {Array}
     */
    pageList: [10, 20, 30, 40, 50],

    /**
     * 每页数据量, 默认值:10
     *
     * @type {Number}
     */
    pageSize: 20,

    onSelectPage: null,

    /**
     * 分页控件所有集合
     */
    members: [],

    /**
     * 分页信息对象
     */
    pageInfoObj: {},

    /**
     * 事件类型
     *
     * @type {Array}
     */
    listener: ['pageChanged'],

    /**
     * 分页数所有控件的集合
     */
    numMembers: [],
    WidgetStyle: 'JGPagination',
    Visible: true
  })

  isc.JGPagination.addMethods({
    /**
     * 初始化分页控件
     */
    _initWidget: function () {
      this.pagination = isc.ToolStrip.create({
        autoDraw: false,
        ID: '_' + this.ID,
        height: 29,
        width:
          this.Dock === 'Fill' || this.Dock === 'Bottom' || this.Dock === 'Top'
            ? '100%'
            : this.Width,
        membersMargin: 6,
        layoutLeftMargin: 16,
        layoutRightMargin: 16,
        disabled: !this.Enabled,
        members: this._getMembers(),
        align: 'center',
        className: this.WidgetStyle + 'Strip'
      })

      // 必须添加到本控件的内部SC画布中，否则无法支持SC的父子控件层次关系
      this.addChild(this.pagination)
      //设置工具栏信息
      this._setToolsInfo()

      /*this.pagination = isc.HLayout.create({
                ID:"HLayout0", 
                membersMargin:6,
                layoutRightMargin:16,
                layoutLeftMargin:16,
                defaultLayoutAlign :"center",
                height:30,
                width:this.Width-32,
                members: this._getMembers(),
                disabled: !this.Enabled,
                className: this.WidgetStyle+"Strip"
            })
            this.addChild(this.pagination); 
            this._setToolsInfo();*/
    },

    /**
     * 根据条件去设置分页栏
     */
    reInit: function () {
      this._setToolsInfo()
    },

    /**
     * 获取记录导航元素
     */
    _getMembers: function () {
      let members = []
      let prevButtonTitle = i18n.get('上一页', '普通窗体分页控件')
      let nextButtonTitle = i18n.get('下一页', '普通窗体分页控件')
      let gotoInfoTitle = this.goToInfoMessage
      let singPageInfoTitle = i18n.get(
        '每页显示',
        '普通窗体分页控件,建议最多3-5个字符'
      )
      let totalPageShow = true
      if (this.Width < 660) {
        prevButtonTitle = ''
        nextButtonTitle = ''
        gotoInfoTitle = i18n.get('到', '普通窗体分页控件，,建议最多3-5个字符')
        singPageInfoTitle = i18n.get(
          '每页',
          '普通窗体分页控件,建议最多3-5个字符'
        )
        totalPageShow = false
      }
      let paginationID = this.ID

      //上一页
      let prevButton = isc.Button.create({
        autoDraw: false,
        ID: 'prevButton_' + paginationID,
        src: '',
        height: '22px',
        width: prevButtonTitle ? '65px' : '22px',
        iconHeight: 20,
        iconWidth: 8,
        baseStyle: this.WidgetStyle + 'Button',
        icon: '[SKIN]/actions/left.png',
        iconOrientation: 'left',
        title: prevButtonTitle,
        click: function () {
          let pagination = this.getWindow()[paginationID]
          if (pagination) {
            let pageCount = Math.ceil(pagination.total / pagination.pageSize)
            if (pagination.pageNumber > 1)
              pagination.selectPage(pagination.pageNumber * 1 - 1, null, true)
          }
        }
      })

      //下一页
      let nextButton = isc.Button.create({
        autoDraw: false,
        ID: 'nextButton_' + paginationID,
        src: '',
        height: '22px',
        width: nextButtonTitle ? '65px' : '22px',
        iconHeight: 20,
        iconWidth: 8,
        baseStyle: this.WidgetStyle + 'Button',
        icon: '[SKIN]/actions/right.png',
        iconOrientation: 'right',
        title: nextButtonTitle,
        click: function () {
          let pagination = this.getWindow()[paginationID]
          if (pagination) {
            let pageCount = Math.ceil(pagination.total / pagination.pageSize)
            if (pagination.pageNumber * 1 < pageCount)
              pagination.selectPage(pagination.pageNumber * 1 + 1, null, true) // 处理pagination.pageNumber类型为文本的异常
          }
        }
      })

      //文字
      let gotoInfo = isc.Label.create({
        autoDraw: false,
        width:
          gotoInfoTitle == '到'
            ? '10px'
            : gotoInfoTitle == '到第'
            ? '25px'
            : '40px',
        height: '22px',
        contents: gotoInfoTitle
      })

      let pageNum = isc.JGFormItemView.create({
        _initProperties: function () {
          this.autoDraw = false
          this.ID = 'pageNum_' + paginationID
          this.height = 22
          this.width = 30
          this.itemLayout = 'absolute'
          this.writeFormTag = false
          let v3ElementStyleHTML =
            isc.TextItem.getPrototype().getElementStyleHTML
          this.items = [
            {
              width: 30,
              height: 22,
              type: 'v3Text',
              textAlign: 'center',
              showTitle: false,
              getElementStyleHTML: function () {
                var _style = v3ElementStyleHTML
                  .apply(this, arguments)
                  .toLowerCase()
                var height =
                  _style
                    .toLowerCase()
                    .replace(/(.*height:)([0-9]+)(.*)/g, '$2') - 4 //border: 1px, padding: 1px 0px;
                _style = _style
                  .toLowerCase()
                  .replace(/(.*height:)([0-9]+)(.*)/g, '$1' + height + '$3')
                return _style
              }
            }
          ]
        }
      })

      let goButton = isc.Button.create({
        autoDraw: false,
        ID: 'goButton_' + paginationID,
        height: '22px',
        width: '22px',
        title: 'GO',
        baseStyle: this.WidgetStyle + 'GoButton',
        click: function () {
          let pagination = this.getWindow()[paginationID]
          let pn = this.getWindow()['pageNum_' + paginationID]
          if (pagination && pn) {
            let num = parseInt(pn.items[0].getValue()) || 1
            pagination.selectPage(num, null, true)
          }
        }
      })
      let singPageInfo = isc.Label.create({
        autoDraw: false,
        ID: 'singPageInfo_' + paginationID,
        width: singPageInfoTitle == '每页' ? '25px' : '50px',
        height: '22px',
        contents: singPageInfoTitle
      })
      //每页显示多少条的下拉框
      let _this = this
      let pageComBox = isc.JGFormItemView.create({
        _initProperties: function () {
          this.autoDraw = false
          this.ID = 'pageComBox_' + paginationID
          this.height = 22
          this.width = 45
          this.itemLayout = 'absolute'
          this.writeFormTag = false
          this.items = [
            {
              width: 45,
              height: 22,
              type: 'select',
              controlStyle: 'JGPaginationStripSelect',
              textBoxStyle: 'JGPaginationStripSelectText',
              showTitle: false,
              pickerIconHeight: 10,
              pickerIconWidth: 10,
              valueMap: _this.pageList,
              defaultValue: [_this.pageSize],
              pickListHeight: 250,
              pickListCellHeight: 25,
              change: function (form, item, value) {
                var pagination = this.getWindow()[paginationID]
                if (pagination) {
                  oldPageSize = pagination.pageSize
                  pagination.pageSize = parseInt((value + '').trim())
                  var pageCount = Math.ceil(
                    pagination.total / pagination.pageSize
                  )
                  pagination.selectPage(
                    pagination.pageNumber * 1,
                    oldPageSize,
                    true
                  )
                }
              },
              getTextBoxCSS: function () {
                var _style = this.invokeSuper(null, 'getTextBoxCSS')
                _style = _style + this.genLineHeightString(_style)
                return _style
              },
              genLineHeightString: function (cssText) {
                var _match = cssText.match(/HEIGHT:([^;]*);/i)
                if (_match && _match.length > 1) {
                  return 'line-height:' + _match[1] + ';'
                } else {
                  return ''
                }
              },
              getControlTableCSS: function () {
                var _style = this.invokeSuper(
                  null,
                  'getControlTableCSS'
                ).toLowerCase()
                var width =
                  _style
                    .toLowerCase()
                    .replace(/(.*width:)([0-9]+)(.*)/g, '$2') - 13 //border: 1px, padding: 0px 4px 0px 7px;
                _style = _style
                  .toLowerCase()
                  .replace(
                    /(.*width:)([0-9]+)(.*)/g,
                    '$1' +
                      width +
                      '$3 display:block; border-collapse: separate;'
                  )
                return _style
              },
              pickListProperties: {
                className: 'JGPaginationMenu',
                bodyStyleName: 'JGPaginationMenuBody',
                normalBaseStyle: 'JGPaginationMenuCell'
              }
            }
          ]
        }
      })

      //总页数

      if (totalPageShow) {
        let totalPage = isc.Label.create({
          autoDraw: false,
          ID: 'totalPage_' + paginationID,
          contents: this.total
        })
      }
      members = [
        prevButton, //上一页
        nextButton, // 下一页
        // "separator" , //分隔符
        gotoInfo, //到第几页文字
        pageNum,
        goButton,
        //"separator",
        singPageInfo,
        pageComBox
      ] //每页显示多少条的下拉框

      if (totalPageShow) {
        members.push(totalPage)
      }
      for (let i = 0; i < members.length; i++) {
        let item = members[i]
        this.members[item.ID] = item
        this.pageInfoObj[item.ID] = item
      }

      return members
    },

    /**
     * 选择页
     */
    selectPage: function (pageNum, oldPageSize, isTriggerByClick) {
      let pageCount = Math.ceil(this.total / this.pageSize),
        pageNumber = pageNum

      if (pageCount == 0) {
        pageCount = 1
      } //无论多少数据，至少会有一页 pageCount必须大于或者等于1

      //检查当前页的范围，不能小于第一页，也不能大于总页数。
      if (pageNum < 1) {
        pageNumber = 1
      } else if (pageNum > pageCount) {
        pageNumber = pageCount
      }

      let isNeedChange =
        pageNum != this.pageNumber ||
        pageNum > pageCount ||
        (oldPageSize ? oldPageSize : this.pageSize) != this.pageSize
          ? true
          : false

      this.pageNumber = pageNumber
      if (typeof this.onSelectPage == 'function') {
        let startRowNum = (this.pageNumber - 1) * this.pageSize + 1
        // startNum 开始行
        // pageSize 每页显示多少条
        this.onSelectPage(startRowNum < 0 ? 1 : startRowNum, this.pageSize)
      }
      this._setToolsInfo()

      if (isNeedChange && (isTriggerByClick + '').toLowerCase() === 'true') {
        this.fireEvent('pageChanged')
      }
    },

    /**
     * 设置分页工具下各个控件的相关信息
     *
     */
    _setToolsInfo: function () {
      if (this.Enabled)
        // 暂时方案，处理下一页按钮置灰
        this.setDisabled(false)
      let totalCon = this.members['totalPage_' + this.ID],
        prevButton = this.members['prevButton_' + this.ID],
        nextButton = this.members['nextButton_' + this.ID],
        pageNumberCon = this.members['pageNumber_' + this.ID],
        pageCount = Math.ceil(this.total / this.pageSize),
        pageNumber = parseInt(this.pageNumber)
      //一,设置总页数标签
      if (totalCon)
        totalCon.setContents(this.totalPageMsg.replace(/{total}/, this.total))

      //二,设置上一页,下一页的按钮
      if (pageNumber == 0 || pageNumber == 1) {
        prevButton.setDisabled(true)
      } else {
        prevButton.setDisabled(false)
      }
      if (pageNumber == pageCount || pageCount == 0) {
        nextButton.setDisabled(true)
      } else {
        nextButton.setDisabled(false)
      }

      this.removeNumMembers()

      this._createPageNav(pageNumber, pageCount)

      //三,设置分页数
      this.addNumMembers()
    },

    /**
     * 加入分页数控件
     */
    addNumMembers: function () {
      //上一页
      this.pagination.addMember(this.numMembers, 1)
    },

    /**
     * 移除分页数控件
     */
    removeNumMembers: function () {
      let numMembers = this.numMembers
      this.numMembers = []
      this.pagination.removeMembers(numMembers)
      for (let i = 0, len = numMembers.length; i < len; i++) {
        let widget = numMembers[i]
        if (widget) {
          widget.destroy()
        }
      }
    },

    /**
     * 创建分数数按钮
     * @param pageNo 页数
     * @param buttonStyle 按钮类型
     */
    _createNumButton: function (pageNo, buttonStyle) {
      // 共用的按钮属性配置
      let numButtonProperties = {
        autoDraw: false,
        height: '22px',
        width: '22px',
        wrap: true,
        overflow: isc.Canvas.VISIBLE,
        src: '',
        showRollOver: false,
        showDown: false
      }
      //不同的按钮需要的属性
      let properties = {}
      if (buttonStyle == 'ellipsis') {
        properties = {
          baseStyle: this.WidgetStyle + 'StripEllipsis',
          title: '....'
        }
      } else if (buttonStyle == 'noCurrPage') {
        properties = {
          ID: '_' + this.ID + '_' + pageNo,
          title: pageNo,
          showRollOver: true,
          showDown: true,
          baseStyle: this.WidgetStyle + 'StripButton',
          click: function () {
            // 参数为 1.页码，2.旧页码，3.是否通过点击页码触发
            this.parentElement.parentElement.selectPage(pageNo, null, true)
          }
        }
      } else if (buttonStyle == 'CurrPage') {
        properties = {
          title: pageNo,
          showRollOver: true,
          showDown: true,
          baseStyle: this.WidgetStyle + 'StripButtonSelect'
        }
      }
      isc.addProperties(numButtonProperties, properties)
      this.numMembers.push(isc.Button.create(numButtonProperties))
    },

    /**
     * 创建分页数
     * @param p为当前页码
     * @param pn为总页数
     */
    _createPageNav: function (p, pn) {
      // 只有一页,直接显示1
      // 只有一页,直接显示1
      if (pn <= 1) {
        this.p = 1
        this.pn = 1
        return this._cretaeCurrPage(1)
      }
      if (pn < p) {
        p = pn
      }
      // 第一页
      if (p <= 1) {
        p = 1
      } else {
        // 非第一页
        // 总是显示第一页页码
        //if(p!=5){
        this._cretaeNoCurrPage(1, pn, '1')
        //}
      }
      // 校正页码
      this.p = p
      this.pn = pn

      // 开始页码
      let start = 2
      let end = pn < 5 ? pn : 5
      // 是否显示前置省略号,即大于10的开始页码

      let astricttemp = 0

      if (p >= 5) {
        this._createNumButton('', 'ellipsis')
        start = parseInt(p) - 1
        let e = parseInt(p) + 1
        end = pn < e ? pn : e
        if (parseInt(p) == pn) {
          if (parseInt(p) == pn && p == 5) {
            let temp = ''
          }
          start = parseInt(p) - 4
        } else if (p != pn && parseInt(p) + 1 == pn) {
          start = parseInt(p) - 3
        } else if (p != pn && parseInt(p) + 2 == pn) {
          start = parseInt(p) - 2
          astricttemp = 1
        } else if (p != pn && parseInt(p) + 3 == pn) {
          start = parseInt(p) - 1
          end++
          astricttemp = 1
        }
      }

      for (let i = start; i < p; i++) {
        if (i > 1) this._cretaeNoCurrPage(i, pn)
      }
      this._cretaeCurrPage(p)
      for (let i = parseInt(p) + 1; i <= end; i++) {
        this._cretaeNoCurrPage(i, pn)
      }
      let temp = 0
      if (end < pn) {
        if (astricttemp == 0) {
          this._createNumButton('', 'ellipsis')
        }
        temp = +1
      }
      if (temp != 0) {
        this._cretaeNoCurrPage(pn, pn)
      }
    },

    // 显示非当前页
    _cretaeNoCurrPage: function (pageNo, pn, showPageNo) {
      showPageNo = showPageNo || pageNo
      this._createNumButton(showPageNo, 'noCurrPage')
    },

    // 显示当前页
    _cretaeCurrPage: function (pageNo) {
      this._createNumButton(pageNo, 'CurrPage')
    },

    /**
     * @param {Object} dataSource
     */
    bindDataSource: function (dataSource) {},

    destroy: function () {
      this.members = null
      this.pagination = null
      this.Super('destroy', arguments)
    },

    /**
     * 设置每页数据量
     */
    setPageSize: function (pageSize) {
      this.pageSize = pageSize
      this._refreshPageInfo()
    },

    /**
     * 设置当前页码
     */
    setPageNumber: function (pageNumber) {
      this.selectPage(pageNumber)
    },

    /**
     * 设置总数据量
     */
    setTotal: function (total) {
      this.total = total
      this._refreshPageInfo()
    },

    /**
     * 获取开始记录数
     */
    getRecordStart: function () {
      let pageNum = this.pageNumber
      let pageSize = this.pageSize
      return (pageNum - 1) * pageSize + 1
    },

    _refreshPageInfo: function () {
      let pageInfoObj = this.pageInfoObj
      let pageComBoxObj = pageInfoObj['pageComBox_' + this.ID]
      pageComBoxObj.items[0].valueMap = this.pageList
      pageComBoxObj.items[0].defaultValue = [this.pageSize]
      pageComBoxObj.items[0].setValue(this.pageSize)
      this.selectPage(this.pageNumber)
    },

    //放在容器中按布局排版时缩放
    resized: function (deltaX, deltaY) {
      this.Super('resized', arguments)
      if (this.Dock === 'Right') {
        let _relWidth = this.pagination.parentElement.width
        let _width = this.pagination.width
        let _moveToLeft = _relWidth - _width
        this.pagination.moveTo(_moveToLeft, 0)
      }
    }
  })
}
