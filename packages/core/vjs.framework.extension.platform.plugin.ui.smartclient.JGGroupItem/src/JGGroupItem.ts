exports.initModule = function (sBox) {
  /**
   * @author zhangll
   * @class GroupItem
   *
   * 将多选组控件通用部分抽出一
   * (包括：JGCheckBoxGroup JGRadioGroup)
   *
   * @extends JGFormItemWidget
   */

  isc.ClassFactory.defineClass('JGGroupItem', 'JGFormItemView')
  isc.ClassFactory.mixInInterface('JGGroupItem', 'JGFormWidget')
  isc.ClassFactory.mixInInterface('JGGroupItem', 'JGStyleHelper')

  isc.JGGroupItem.addProperties({
    DropDownSource: null,

    //是否显示
    Visible: true,
    //只读
    ReadOnly: false,

    //使能
    Enabled: false,

    /**
     * 事件类型
     *
     * @type {Array}
     */
    listener: [
      'change',

      'cellclick',

      'click',

      'loaddata',

      'labelclick',

      'expand'
    ],

    ButtonCount: 3,

    /**
     * 针对下拉多选来配置的 如果为true,下拉是多选,false则下拉是单选
     */
    multiple: false,

    /**
     * 存放默认值
     */
    defaultValue: [],

    /**
     * item数据
     */
    valueMap: [],

    /**
     * 数据值
     */
    valueField: 'IDColumnName',

    /**
     * 文本值
     */
    textField: 'ColumnName',

    _focusItem: null,

    _form: null
  })

  isc.JGGroupItem.addMethods({
    _initProperties: function () {
      let items = []
      //配置标题部分
      let isShowTitle = this.isShowTitle(this.TitleVisible, this.TitleWidth)
      this.isShowTitle = isShowTitle
      if (isShowTitle) {
        let titleOpt = this.getTitleProperties()

        // 处理无边框的单选组 多选组 BorderStyles：None、Solid
        if ((this.BorderStyles + '').toLowerCase() === 'none')
          titleOpt.cssText = 'border-bottom: 0;'

        titleOpt.click = this._handleTitleClick
        items[items.length] = titleOpt
      }
      //配置文本框部分
      let textOpt = this._initItem()

      items[items.length] = textOpt
      this.initFormProperties()
      this.implicitSaveDelay = 0
      this.className = this.WidgetStyle
      this.overflow = 'hidden'
      //TODO 暂时先将这种情况的校验屏蔽
      if (this.AutoWrap && this.multiple) {
        this.disableValidation = true
      }
      this.ValueFontStyle = null
      this.disabled = !this.Enabled
      this.items = items
    },

    setTips: function (tips) {
      for (let i = 0; i < this.getItems().length; i++) {
        this.items[i].setPrompt(tips)
      }
    },

    _initItem: function () {
      let configItem = this._getConfig()
      this._fieldEvent[this.valueField] = this._formatTextValueField
      this._fieldEvent[this.textField] = this._formatTextValueField
      return configItem
    },

    _referPartFunc: function () {
      this._referFuncs(this, ['clearValues', 'editRecord', 'editNewRecord'])
    },

    _handleTitleClick: function () {
      this.form.fireEvent('labelclick')
    },

    /**
     * 获取配置信息
     */
    _getConfig: function () {
      let overHidden = this.AutoWrap
      let configObj = null
      if (overHidden) {
        configObj = this._getOverHiddenConfig()
      } else {
        configObj = this._getCheckConfig()
      }
      configObj.ID = this.id || this.getID()
      return configObj
    },

    _getCheckConfig: function () {
      let configObj = {
        width: this.Width - (this.isShowTitle ? this.TitleWidth : 0),
        height: this.textBoxHeightFix(this.Height, this.WidgetStyle + 'Cell'),
        left: this.isShowTitle ? this.TitleWidth : 0,
        //top : this.Top,
        showTitle: this.showTitle,
        editorType: 'BaseGroupBoxItem', //this.type, //"VRadioGroup",
        checkType: this.type, // VRadioGroup / CheckBoxGroup
        itemFields: {
          textField: this.textField,
          valueField: this.valueField
        },
        titleAlign: this.LabelTextAlign,
        required: this.IsMust,
        hint: this.hint, // 尾部文字
        defaultValue: this.defaultValue, // 默认值
        overHidden: this.AutoWrap, // true 换行 false 不换行
        //vertical : this.IsHorizontal == 'horizontal' ? true : false ,  // horizontal 横向, vertical 竖向
        valueMap: this.valueMap, // 多选值
        //direcount : this.ButtonCount, // 每行或每列显示多少个
        //			click: this._referEvent(this,'click'),
        //			cellClick: this._referEvent(this,'cellclick'),
        //			change: this._referEvent(this,'change'),
        //			changed: this._referEvent(this,[this.dataSyn,'changed']),
        //			titleClick:this._referEvent(this,'labelclick'),
        readOnly: this.ReadOnly,
        disabled: !this.Enabled,
        implicitSave: true,
        WidgetStyle: this.WidgetStyle,
        getTableStartHTML: function () {
          var _style = this.Super('getTableStartHTML', arguments)
          var _index = _style.lastIndexOf('>')
          if (_index != -1) {
            return (
              _style.substr(0, _index) +
              "style='height:" +
              this.height +
              "px; display:block; border-collapse: separate;'" +
              _style.substr(_index)
            )
          }
          return _style
        }
      }

      return configObj
    },

    /**
     * 格式化数据值为SC需要的格式
     */
    _formatTextValueField: function (val) {
      let valStr = val
      //如果为空数组，返回null
      if (isc.isAn.Array(val) && val.length == 0) {
        return null
      }
      if (isc.isAn.Array(val)) {
        valStr = ''
        for (let j = 0; j < val.length; j++) {
          if (j < val.length - 1) {
            valStr += val[j] + ','
          } else {
            valStr += val[j]
          }
        }
      }
      return valStr
    },

    _setItem: function (item) {
      this._focusItem = item
    },

    _getItem: function () {
      let item = this._focusItem
      return item
    },

    _getOverHiddenConfig: function () {
      let configObj = {
        showTitle: this.showTitle,
        title: this.title, // 标题
        top: 0, //this.Top,
        left: this.TitleWidth,
        editorType: 'BaseComboBoxItem',
        width: this.Width - this.TitleWidth,
        height: this.Height,
        titleAlign: this.LabelTextAlign,
        WidgetStyle: this.WidgetStyle,
        required: this.IsMust,
        itemFields: {
          textField: this.textField,
          valueField: this.valueField
        },
        WidgetStyle: this.WidgetStyle,
        canEdit: !this.ReadOnly,
        hint: this.hint, // 尾部文字
        multipleAppearance: 'picklist',
        defaultValue: this.defaultValue, // 默认值
        multiple: this.multiple, // 是否多选
        valueMap: this.valueMap,
        orderItemArray: [],
        disabled: !this.Enabled,
        pickListWidth: this.pickListWidth,
        titleStyle: this.WidgetStyle + 'Title',
        textBoxStyle: this.WidgetStyle + 'Text',
        //				click: this._referEvent(this,'click'),
        //				expand: this._referEvent(this,'expand'),
        //				change: this._referEvent(this,'change'),
        implicitSave: true
        //				changed: this._referEvent(this,[this.dataSyn,'changed']),
        //				titleClick:this._referEvent(this,'labelclick')
      }
      return configObj
    },

    /**
     * 根据传入的值获取某一个ITEM并根据参数确定是否选中
     *
     * @param {String}
     *            value item的值
     * @param {boolean}
     *            isCheck 是否选中 true/false
     */
    setChecked: function (value, isCheck) {
      let radio = this.getItem()
      let item = radio.itemForValue(value)
      let element = item.getDataElement()
      if (!element) return null
      element.checked = isCheck
      item._handleElementChanged()
    },

    /**
     * 根据传入的值,返回该ITEM是否被选中
     *
     * @param {String}
     *            value item的值
     * @return {boolean}
     * 			  是否选中
     */
    isChecked: function (value) {
      let radio = this.getItem()
      let item = radio.itemForValue(value)
      let element = item.getDataElement()
      if (!element) return null
      return element.checked
    },

    /**
     * 设置值
     *
     * @param {Object}
     *            valueMap 给组重新设置数据
     *
     */
    setValueMap: function (valueMap) {
      if (this.form) this.form.fireEvent('loaddata')
      let groupItem = this.getMultifieldItem().getValueFieldItem()
      groupItem.setValueMap(valueMap)
      groupItem.WidgetStyle = this.WidgetStyle
      let overHidden = this.AutoWrap
      if (!overHidden) groupItem.setItems()

      // 2015-05-22 liangchaohui
      // 以下代码实现：刷新控件不会清除已选值，即使控件的备选项被删除也不会影响已选值，如果备选项还原回来会根据已选值自动勾选
      // 从控件绑定的数据源中获取已选值再把值赋值到控件中
      let cacheDatas = this.dataSource.getCacheData()
      if (cacheDatas.length > 0) {
        let cacheData
        for (let i = 0; i < cacheDatas.length; i++) {
          let rec = cacheDatas[i]
          if (rec.id == this.getData().id) {
            cacheData = rec
            break
          }
        }
        if (undefined != cacheData && null != cacheData) {
          let valueInDB = cacheData[this.getIDColumnName()]
          if (undefined != valueInDB && null != valueInDB) {
            let valueArry = valueInDB.split(',')
            let value = []
            for (let i = 0; i < valueArry.length; i++) {
              value.push(valueArry[i])
            }
            groupItem.setValue(value)
          }
        }
      }
    },

    /**
     * 加载数据，旧的数据会被替换
     *
     * @param {Object}
     *            data 传递的数据
     */
    loadData: function (data) {
      let groupItem = this.getMultifieldItem().getValueFieldItem()
      let overHidden = this.AutoWrap
      //if(this.IsHorizontal == 'horizontal' || overHidden){
      groupItem.itemDatas = data
      //}else{
      //	var data = this.soreItem(data);
      //	groupItem.itemDatas = data;
      //}
      let valueMap = this.dataToValueMap(data)
      this.setValueMap(valueMap)

      let readonly = this.isReadOnly()
      if (readonly) {
        if (groupItem.items) {
          for (let i = 0; i < groupItem.items.length; i++) {
            let item = groupItem.items[i]
            if (item.canEdit) {
              groupItem.items[i].setCanEdit(!readonly)
            }
          }
        } else {
          //兼容单选组设置只读为true时报错问题
          if (groupItem.canEdit) {
            groupItem.setCanEdit(!readonly)
          }
        }
      }
    },

    getMultifieldItem: function () {
      if (this.isShowTitle) {
        return this.getItems()[1]
      } else {
        return this.getItems()[0]
      }
    },

    /**
         * 将横向排列的数组转为竖向排列
         * 列
         *  w c b d a e 
         *  转为
         *  w  b  e
            c  d
            g  a
         */
    soreItem: function (data) {
      let col = this.ButtonCount //行
      let row = Math.ceil(data.length / col) //列
      let items = []
      for (let i = 0; i < col; i++) {
        let index = i
        for (let j = 0; j < row; j++) {
          let obj = data[index]
          if (obj) {
            items.push(obj)
            index += parseInt(col)
          } else {
            //var emptyObj = {};
            //items.push(emptyObj);
            index += parseInt(col)
          }
        }
      }
      return items
    },

    /**
     * 将开发系统中的数据转成sc需要的格式
     * @param {array}
     * 				data 包含多个ITEM的对象
     * return (object)
     * 				valueMap
     */
    dataToValueMap: function (data) {
      let valueMap = {}
      this.defaultValue = []
      let overHidden = this.AutoWrap
      let valueFieldItem = this.getMultifieldItem().getValueFieldItem()
      if (overHidden) {
        valueFieldItem.orderItemArray = []
      }
      if (data) {
        for (i = 0; i < data.length; i++) {
          let itemObj = data[i]
          let itemText = itemObj[this.textField]
          let itemVal = itemObj[this.valueField]
          valueMap[itemVal] = itemText
          if (itemObj['default']) {
            this.defaultValue.add(itemVal) //设置默认值
          }
          if (overHidden) {
            let orderRecord = {}
            orderRecord[this.valueField] = itemVal
            valueFieldItem.orderItemArray.add(orderRecord) //保存排序的数组
          }
        }
      }
      return valueMap
    },

    /*
     *获取标题的item
     */
    _getTitleItem: function () {
      if (this.isShowTitle) {
        return this.getItems()[0]
      } else {
        return null //此时并没有显示标题
      }
    },

    /**
     * 获取中文标题
     * @return 中文标题
     */
    getSimpleChineseTitle: function () {
      return this.SimpleChineseTitle
    },
    /**
     * 设置中文标题
     * @param title 中文标题
     */
    setSimpleChineseTitle: function (title) {
      this.SimpleChineseTitle = title
      if (this.isShowTitle) {
        this._getTitleItem().title = title
        this.redraw()
      }
    },

    /**
     * 获取标签背景色
     * @return 标签背景色
     */
    getLabelBackColor: function () {
      return this.LabelBackColor
    },

    /**
     * 设置标签背景色
     * @param color 背景色
     */
    setLabelBackColor: function (color) {
      this.LabelBackColor = color
      if (this.isShowTitle) {
        let cssText = this._getTitleItem().cssText
        let newStyle = 'background-color:' + isc.JGStyleTools.toColor(color)
        this._getTitleItem().cssText = isc.JGStyleTools.addStyle(
          cssText,
          newStyle
        )
        this.redraw()
      }
    },

    /**
     * 获取标签前景色
     * @return 标签前景色
     */
    getLabelForeColor: function () {
      return this.LabelForeColor
    },
    /**
     * 设置标签前景色
     * @param color 标签前景色
     */
    setLabelForeColor: function (color) {
      this.LabelBackColor = color
      if (this.isShowTitle) {
        let cssText = this._getTitleItem().cssText
        let newStyle = 'color:' + isc.JGStyleTools.toColor(color)
        this._getTitleItem().cssText = isc.JGStyleTools.addStyle(
          cssText,
          newStyle
        )
        this.redraw()
      }
    },

    /**
     * 获取设置标签字体
     *@return 标签字体
     */
    getLabelFontStyle: function () {
      return this.LabelFontStyle
    },
    /**
     * 设置标签字体
     *@param fontStyle 标签字体
     */
    setLabelFontStyle: function (fontStyle) {
      this.LabelFontStyle = fontStyle
      if (this.isShowTitle) {
        let cssText = this._getTitleItem().cssText
        fontStyle = isc.JGStyleTools.toFontStyle(fontStyle)
        this._getTitleItem().cssText = isc.JGStyleTools.addStyle(
          cssText,
          fontStyle
        )
        this.redraw()
      }
    },

    /**
     * 设置值背景色
     * @param color 值背景色
     */
    setValueBackColor: function (color) {
      this.ValueBackColor = color
      let cssText = this.getMultifieldItem().getItems()[0].cssText
      let newStyle = 'background-color:' + isc.JGStyleTools.toColor(color)
      this.getMultifieldItem().getItems()[0].cssText =
        isc.JGStyleTools.addStyle(cssText, newStyle)
      this.redraw()
    },

    /**
     * 设置值前景色
     * @param color 值前景色
     */
    setValueForeColor: function (color) {
      this.ValueForeColor = color
      let cssText = this.getMultifieldItem().getItems()[0].cssText
      let newStyle = 'color:' + isc.JGStyleTools.toColor(color)
      this.getMultifieldItem().getItems()[0].cssText =
        isc.JGStyleTools.addStyle(cssText, newStyle)
      this.redraw()
    },

    /**
     * 设置值字体
     */
    setValueFontStyle: function (fontStyle) {
      this.ValueFontStyle = fontStyle
      let cssText = this.getMultifieldItem().getItems()[0].cssText
      fontStyle = isc.JGStyleTools.toFontStyle(fontStyle)
      this.getMultifieldItem().getItems()[0].cssText =
        isc.JGStyleTools.addStyle(cssText, fontStyle)
      this.redraw()
    },

    /**
     * 返回选择的记录
     * 如果是radio返回{String},checkbox则是数组类型
     * 如果没选择，返回null
     */
    getValue: function () {
      let itemValues = this.getMultifieldItem().getValue()
      if (itemValues.length == 0) {
        return null
      }
      return itemValues.toString()
    },

    //设置控件的index要以组件的index为前缀
    setIndexPreJoinComponentIndex: function (componentIndex) {
      let item = this.getItem()
      if (item) {
        let orginalIndex = this.TabIndex
        item.setGlobalTabIndex(parseInt(componentIndex + orginalIndex))
      }
    },

    /**
     * 销毁
     */
    destroy: function () {
      this._focusItem = null
      this.Super('destroy', arguments)
    },
    redraw: function () {
      let statefulCssText = this.getMultifieldItem().getItems()[0].cssText
      if (this.isDisabled()) {
        statefulCssText =
          isc.JGStyleTools.removeBackgroundColor(statefulCssText)
        statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
      } else if (this.isReadOnly()) {
        statefulCssText =
          isc.JGStyleTools.removeBackgroundColor(statefulCssText)
      } else {
        let newStyle = 'color:' + isc.JGStyleTools.toColor(this.ValueForeColor)
        statefulCssText = isc.JGStyleTools.addStyle(statefulCssText, newStyle)
        newStyle =
          'background-color:' + isc.JGStyleTools.toColor(this.ValueBackColor)
        statefulCssText = isc.JGStyleTools.addStyle(statefulCssText, newStyle)
      }
      this.getMultifieldItem().getItems()[0].cssText = statefulCssText
      this.Super('redraw', arguments)
    },
    getDropDownSource: function () {
      return this.DropDownSource
    },

    getColumnName: function () {
      return this.textField
    },

    getIDColumnName: function () {
      return this.valueField
    },

    setDropDownSource: function (dropDownSource) {
      this.DropDownSource = dropDownSource
    },

    getField: function () {
      return this.getMultifieldItem()
    },

    // =================== JGFormItemModel.js类下方法 _setMemberValues,重写该方法
    getFieldItems: function () {
      return this.getMultifieldItem().getItems()
    },

    // =================== JGFormWidget类下  setValue方法,重写该方法,返回多值控件对应绑定值ITEM
    getFieldItem: function (fieldName, updatingDisplayValue) {
      return this.getMultifieldItem().getItem(fieldName, updatingDisplayValue)
    },

    getBoundFieldNames: function () {
      let itemArray = []
      itemArray.push(this.textField)
      itemArray.push(this.valueField)
      return itemArray
    },
    resized: function (deltaX, deltaY) {
      this.Super('resized', arguments)
      if (this.Dock != 'None') {
        let allWidth = this.getWidth()
        let valueItemWidth = this.isShowTitle
          ? allWidth - this.TitleWidth
          : allWidth
        this.items
          .last()
          .items.first()
          .setWidth(valueItemWidth - 8)

        // 处理泊靠后控件高度自适应
        if (
          this.Dock === 'Left' ||
          this.Dock === 'Right' ||
          this.Dock === 'Fill'
        ) {
          this.setHeight('100%')
          this.getItems()[0].setHeight('100%')
          if (this.isShowTitle) this.getItems()[1].setHeight('100%')
        }
      }
    }
  })
}
