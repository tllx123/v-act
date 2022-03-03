exports.initModule = function (sBox) {
  /**
   * 定义v3ui表单类控件的抽象类
   * 型如： 文本 + 输入框 ， 文本 + 下拉框
   *
   * 此类自动处理的内容包括：
   * 1、标题宽度
   * 2、标题左右对其
   * 3、控件必填时增加红色“*”标识
   * 4、自动处理表单标题的字体样式、标题颜色
   * 5、处理标题的背景色
   * 6、统一处理字体样式
   * 7、统一使用新的样式(带边框的)
   * 8、解决标题文字过长导致撑开的问题
   * 9、统一处理title的内容
   *
   *
   * 子类例子：
   * isc.ClassFactory.defineClass("JGXXX", "JGSingleFormItemWidget");
   * isc.JGXXX.addMethods({
   * 	_initItem : function() {
   * 		var _item = {
   * 		};
   * 		return _item;
   * 	}
   * });
   *
   *
   */
  isc.ClassFactory.defineClass('JGSingleFormItemWidget', 'JGFormItemWidget')
  isc.ClassFactory.mixInInterface('JGSingleFormItemWidget', 'JGStyleHelper')
  isc.ClassFactory.mixInInterface('JGSingleFormItemWidget', 'JGFormatHelper')
  isc.ClassFactory.mixInInterface('JGSingleFormItemWidget', 'JGFormError')

  isc.JGSingleFormItemWidget.addProperties({
    /**
     * 控件宽度
     */
    Width: 220,
    /**
     * 标题宽度
     */
    TitleWidth: 76,

    /**
     *
     */
    LabelTextAlign: 'center'
  })

  isc.JGSingleFormItemWidget.addMethods({
    _initItems: function () {
      //把Form本身设置为不可取得焦点，焦点直接设置在Item上
      this.canFocus = false

      let item = this._initItem()
      let properties = {
        //implicitSave : true,
        requiredTitlePrefix: "<span class='formError'>*</span>",
        //implicitSaveOnBlur : true,
        formCssText: ''
      }

      item.globalTabIndex = this.TabIndex

      //统一处理标题是否显示的问题
      if (this.TitleVisible != undefined) {
        //某些控件没有titleVisible这个属性
        item.showTitle = this.TitleWidth > 0 && this.TitleVisible == true //标题宽度大于0且显示标题为true才显示
      } else {
        item.showTitle = this.TitleWidth > 0
      }

      //统一处理标题左右对齐的问题
      if (isc.isA.nonemptyString(this.LabelTextAlign)) {
        item.titleAlign = this.LabelTextAlign
      }
      //统一处理值左右对齐的问题
      if (isc.isA.nonemptyString(this.ValueTextAlign)) {
        item.textAlign = this.ValueTextAlign
      }

      //item.titleCssText = item.titleCssText ? item.titleCssText : '';
      //统一处理标题背景色
      //item.titleCssText += this.genBackgroundColorCssText(this.LabelBackColor,true);
      //统一处理字体样式
      //item.titleCssText += this.genFontCssText(this.LabelFontStyle,this.LabelForeColor);

      //item.textCssText = item.textCssText ? item.textCssText : '';
      //统一处理文本框字体样式
      //item.textCssText += this.genFontCssText(this.ValueFontStyle,this.ValueForeColor);
      //统一处理标题背景色
      //item.textCssText += this.genBackgroundColorCssText(this.ValueBackColor);
      //item.cssText = this.genBackgroundColorCssText(this.ValueBackColor);

      //if (isc.Browser.isIE) {
      //item.textCssText += ';margin:0px;';
      // }

      //统一使用新的样式(带边框的)
      if (!item.titleStyle) item.titleStyle = 'borderFormTitle'
      if (!item.cellStyle) item.cellStyle = 'borderFormCell'

      //解决标题文字过长导致撑开的问题
      item.titleCssText = 'overflow:hidden;word-break: break-all; ' //white-space:pre;
      properties.formCssText += 'table-layout:fixed; '

      //统一处理title的内容
      item.title = this.genTitleContent(this.SimpleChineseTitle)

      //统一处理标题以及输入区域的布局问题
      if (item.showTitle) {
        properties['numCols'] = 2
        properties['colWidths'] = [
          this.TitleWidth,
          this.Width - this.TitleWidth
        ]
      } else {
        properties['numCols'] = 1
        properties['colWidths'] = [this.Width]
      }

      //统一处理高度宽度的问题
      if (item.showTitle) {
        item.width = this.Width - this.TitleWidth
        item.height = this.Height - this.getVBorderPaddingSize(item.cellStyle) //解决sc的一个bug
      } else {
        item.width = this.Width
        item.height = this.Height - this.getVBorderPaddingSize(item.cellStyle)
      }

      //控制标题换行的问题
      item.clipTitle = false
      item.wrapTitle = true

      properties['width'] = this.Width
      properties['height'] = this.Height

      //properties.overflow = isc.Canvas.HIDDEN;

      //解决表单类型控件只读时没有输入框
      if (item.type) {
        item.readOnlyEditorType = item.type
      }
      if (item.editorType) {
        item.readOnlyEditorType = item.editorType
      }
      //是否立即触发
      if (item.implicitSave) {
        properties.implicitSaveDelay = 0
      }

      this._formProperties = this._formProperties || {}

      isc.addProperties(this._formProperties, properties)
      return [item]
    },

    _initItem: function () {},

    //显示格式的几个方法抽到这里
    formatDisplayValue: function (value, record, form, item) {
      if (value != undefined && value != null) {
        if (this.DisplayFormat && this.DisplayFormat.displayFormat) {
          let numType = this.DisplayFormat.numType
          let pattern = this.DisplayFormat.displayFormat
          //把真实值记录下来
          let itemFieldName = '_realValue' + item.name
          if (isc.isA.Date(value)) {
            item[itemFieldName] = value.toJapanShortDate()
          } else {
            item[itemFieldName] = value
          }
          return this.valueFormat(value, pattern, numType)
        }
      }
      return value
    },

    //把已格式化的日期，反转为 yyyy-MM-dd 或者 yyyy-MM-dd HH:mm:ss 或者 HH:mm:ss 格式的日期串
    parseDateValue: function (value, form, item) {
      if (value != undefined && value != null) {
        if (this.DisplayFormat && this.DisplayFormat.displayFormat) {
          let numType = this.DisplayFormat.numType
          let pattern = this.DisplayFormat.displayFormat
          let itemFieldName = '_realValue' + item.name
          if (!item[itemFieldName]) {
            item[itemFieldName] = value
          }
          let realValue = item[itemFieldName]
          return this.dateUnformat(value, pattern, realValue)
        }
      }
      return value
    },

    unUseFormat: function () {
      if (this.DisplayFormat && this.DisplayFormat.displayFormat) {
        this._form.getItems()[0].formatEditorValue = null
        let value = this._form.getItems()[0].getValue()
        if (value != undefined && value != null) {
          this._form.getItems()[0].setValue(value)
        }
      }
    },

    useFormat: function () {
      if (this.DisplayFormat && this.DisplayFormat.displayFormat) {
        this._form.getItems()[0].formatEditorValue = this._referFunc(
          this,
          'formatDisplayValue'
        )
      }
    },

    //真正控制子控件只读的方法
    setHandleReadOnly: function (isReadOnly) {
      this._form.getItems()[0].setCanEdit(!isReadOnly)
      this._form.redraw()
    },

    /**
     * 读取真正的只读状态
     * @return {*}
     */
    isReadOnly: function () {
      if (
        this._form &&
        this._form.getItems()[0] &&
        this._form.getItems()[0].isReadOnly
      ) {
        return this._form.getItems()[0].isReadOnly()
      } else {
        return this.Super('isReadOnly')
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
      this._form.getItems()[0].title = title
      this._form.redraw()
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
      color = this.parseColor(color)
      this.LabelBackColor = color
      let newTitleCssText = this.cssTextExtend(
        this._form.getItems()[0].titleCssText,
        { background: color },
        false,
        true
      )
      this._form.getItems()[0].titleCssText = newTitleCssText
      this._form.redraw()
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
      color = this.parseColor(color)
      this.LabelBackColor = color
      let newTitleCssText = this.cssTextExtend(
        this._form.getItems()[0].titleCssText,
        { color: color }
      )
      this._form.getItems()[0].titleCssText = newTitleCssText
      this._form.redraw()
    },

    /**
     * 设置标签字体
     */
    setLabelFontStyle: function (fontStyle) {
      fontStyle = this.parseFontStyle(fontStyle)
      this.LabelFontStyle = fontStyle
      let newTitleCssText = this.cssTextExtend(
        this._form.getItems()[0].titleCssText,
        fontStyle,
        true
      )
      this._form.getItems()[0].titleCssText = newTitleCssText
      this._form.redraw()
    },

    /**
     * 获取值背景色
     * @return 值背景色
     */
    getValueBackColor: function () {
      return this.ValueBackColor
    },
    /**
     * 设置值背景色
     * @param color 值背景色
     */
    setValueBackColor: function (color) {
      color = this.parseColor(color)
      this.ValueBackColor = color
      let newTextCssText = this.cssTextExtend(
        this._form.getItems()[0].textCssText,
        { background: color }
      )
      this._form.getItems()[0].textCssText = newTextCssText
      let newCssText = this.cssTextExtend(this._form.getItems()[0].cssText, {
        background: color
      })
      this._form.getItems()[0].cssText = newCssText
      this._form.redraw()
    },
    /**
     * 获取值前景色
     * @return 值前景色
     */
    getValueForeColor: function () {
      return ValueForeColor
    },
    /**
     * 设置值前景色
     * @param color 值前景色
     */
    setValueForeColor: function (color) {
      color = this.parseColor(color)
      this.ValueForeColor = color
      let newTextCssText = this.cssTextExtend(
        this._form.getItems()[0].textCssText,
        { color: color }
      )
      this._form.getItems()[0].textCssText = newTextCssText
      this._form.redraw()
    },

    /**
     * 设置值字体
     */
    setValueFontStyle: function (fontStyle) {
      fontStyle = this.parseFontStyle(fontStyle)
      this.ValueFontStyle = fontStyle
      let newTextCssText = this.cssTextExtend(
        this._form.getItems()[0].textCssText,
        fontStyle,
        true
      )
      this._form.getItems()[0].textCssText = newTextCssText
      this._form.redraw()
    }
  })
}
