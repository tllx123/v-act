exports.initModule = function (sBox) {
  /**
   * 表单类控件的帮助类，帮助表单类控件快速建立控件。
   * 此类会提供封装item的容器类，标题是否显示的公共逻辑方法等。
   * 用法:isc.ClassFactory.mixInInterface("JGTextBox", "JGFormWidget");
   */
  isc.ClassFactory.defineInterface('JGFormWidget')

  isc.JGFormWidget.addInterfaceProperties({
    /**
     * 实例
     */
    form: null,

    /**
     * 表单封装类，以前为DynamicForm
     */
    formConstructor: isc.FormItemView,
    /**
     * 表单封装类的默认属性
     */
    formDefaults: {
      cellPadding: 0,
      width: 222,
      height: 24,
      itemLayout: 'absolute',
      writeFormTag: false,
      errorOrientation: 'right'
    }
  })

  isc.JGFormWidget.addInterfaceMethods({
    /**
     *
     * @return {Object}
     */
    getTitleProperties: function () {
      return {
        top: 0,
        left: 0,
        width: this.TitleWidth,
        height: this.Height,
        type: 'SingleLineLabelItem',
        readOnlyEditorType: 'SingleLineLabelItem',
        title: this.SimpleChineseTitle,
        textAlign: this.LabelTextAlign,
        //		            canSelectText : true,   //标题可选中复制
        textBoxStyle: this.WidgetStyle + 'Title',
        showRequiredSign: this.IsMust,
        canEdit: !this.ReadOnly,
        requiredStyle: this.WidgetStyle + 'Required',
        click: this._handleTitleClick //支持标题点击事件
      }
    },
    getFormProperties: function () {
      return {
        left: this.Left,
        top: this.Top,
        width: this.Width,
        height: this.Height,
        itemLayout: 'absolute',
        implicitSave: false,
        writeFormTag: false
      }
    },

    initFormProperties: function () {
      this.autoDraw = false
      this.left = this.Left
      this.top = this.Top
      //统一处理显示隐藏的问题
      if (isc.isA.Boolean(this.Visible)) {
        this.visibility = this.Visible ? isc.Canvas.INHERIT : isc.Canvas.HIDDEN
      }
      this.width = this.Width
      this.height = this.Height
      this.itemLayout = 'absolute'
      this.writeFormTag = false
      this.overflow = isc.Canvas.IGNORE
      this.disabled = !this.Enabled

      this.setHandleDisabled = function (disabled) {
        this.disabled = false
        if (this.parentWidget && this.parentWidget.isDisabled()) {
          this._disabled = true
          disabled = true
        }
        if (this.isDrawn()) {
          if (this.redrawOnDisable) this.markForRedraw('setDisabled')
          this.disableKeyboardEvents(disabled, null, true)
        }
        this._disabled = false
        let items = this.getItems()
        for (let i = 0; i < items.length; i++) items[i].setDisabled(disabled)
        this.redraw()
      }
      //设置配置浮动提示
      this.valueHoverHTML = function (item) {
        if (item.prompt) return item.prompt
        //return item.getDisplayValue();
      }
    },
    getTextProperties: function () {
      return {
        top: 0,
        left: this.isShowTitle ? this.TitleWidth : 0,
        width: this._calTextBoxWidth(),
        height: this.Height,
        type: 'v3Text',
        visible: this._calTextBoxWidth() > 0,
        name: this.ColumnName,
        required: this.IsMust,
        length: this.TextLength,
        canEdit: !this.ReadOnly,
        globalTabIndex: this.TabIndex,
        hasErrors: function () {
          // 处理必填提示为简洁模式下的样式效果
          var returnVal = this.Super('hasErrors', arguments)
          if (this.form && this.form.IsMustBehavior + '' === 'Simple')
            return false
          else return returnVal
        },
        getInnerHTML: function () {
          var returnVal = this.Super('getInnerHTML', arguments)
          if (returnVal.length > 5 && returnVal[5] == null) {
            if (returnVal[2] != null)
              returnVal[2] = "' STYLE='-webkit-box-shadow:none;box-shadow:none;"
            //解决IE下 错误图片显示间距问题
            if (returnVal[7] != null)
              returnVal[7] = returnVal[7].replace('padding:0px;', '')

            var hasErrors = this.hasErrors()
            if (hasErrors) {
              returnVal[2] =
                "' STYLE='-webkit-box-shadow:none;box-shadow:none;" +
                this.cssText
              returnVal[5] = this.hasFocus
                ? this.controlStyle + 'ErrorFocused'
                : this.controlStyle + 'Error'
            } else {
              if (this.isReadOnly() && this.disabled != true) {
                returnVal[5] = this.controlStyle + 'ReadOnly'
              } else {
                returnVal[5] = this.controlStyle
              }
            }
          }
          return returnVal
        },
        getTextBoxHeight: function () {
          var returnVal = this.Super('getTextBoxHeight', arguments)
          if (this.hasErrors()) {
            styleObject = isc.Element.getStyleEdges(this.controlStyle + 'Error')
            if (styleObject) {
              var w =
                parseInt(
                  styleObject.borderTopWidth ? styleObject.borderTopWidth : 0
                ) +
                parseInt(
                  styleObject.borderBottomWidth
                    ? styleObject.borderBottomWidth
                    : 0
                ) +
                parseInt(
                  styleObject.paddingBottom ? styleObject.paddingBottom : 0
                ) +
                parseInt(styleObject.paddingTop ? styleObject.paddingTop : 0)
              returnVal = returnVal - (isNaN(w) ? 0 : w)
            }
          }
          return returnVal
        },
        getElementWidth: function () {
          var returnVal = this.Super('getElementWidth', arguments)
          if (this.hasErrors()) {
            styleObject = isc.Element.getStyleEdges(this.controlStyle + 'Error')
            if (styleObject) {
              var w =
                parseInt(
                  styleObject.paddingLeft ? styleObject.paddingLeft : 0
                ) +
                parseInt(
                  styleObject.paddingRight ? styleObject.paddingRight : 0
                )
              returnVal = returnVal - (isNaN(w) ? 0 : w)
            }
          }
          return returnVal
        },
        getErrorHTML: function () {
          var returnVal = this.Super('getErrorHTML', arguments)
          return returnVal.replace('&nbsp;', '').replace('padding:0px;', '')
        },
        controlStyle: this.WidgetStyle + 'Cell',
        textBoxStyle: this.WidgetStyle + 'Text',
        textAlign: this.ValueTextAlign,
        focus: this._handleFocus, //获取焦点事件
        blur: this._handleBlur, //失去焦点事件
        keyUp: this._handleKeyUp //获取键盘事件
      }
    },
    //计算文本框宽度
    _calTextBoxWidth: function () {
      return this.isShowTitle ? this.Width - this.TitleWidth : this.Width
    },

    _handleTitleClick: function () {
      if (this.form) {
        //暂时不放开标题选中功能
        //		        	//2019-07-09 zhaoyf：解决标题支持选中后，点击标题无法聚焦问题
        //		        	var text = window.getSelection?window.getSelection():document.selection.createRange().text;
        //		        	if(text == '' || !text){
        //		        		this.form.setFocus(true);
        //		        	}
        //
        this.form.fireEvent('titleClick')
      }
    },

    _handleBlur: function () {
      let form = this.form
      if (form) {
        if (!form.isReadOnly()) {
          this.validate()
          form.dataSyn()
        }
        // 处理控件只读时，移除错误提示框
        form.hideError.apply(this.form, arguments)
        form.fireEvent('blur')
      }
    },

    handleKeyUp: function () {
      this.dataSynOnEnter.apply(this, arguments, false)
      this.fireEvent('keydown')
    },

    _handleFocus: function () {
      let form = this.form
      if (form) {
        form.showError.apply(this.form, arguments, true)
        form.fireEvent('focus')
      }
    },

    textBoxHeightFix: function (height, styleName) {
      /* styleObject = isc.Element.getStyleEdges(styleName);
             if(styleObject){
                 var w = //parseInt(styleObject.borderTopWidth) + parseInt(styleObject.borderBottomWidth) +
                     parseInt(styleObject.paddingTop) + parseInt(styleObject.paddingBottom);
                 height = height - (isNaN(w)?0:w);
             }*/
      return height
    },

    /**
     * 工具方法，判断标题是否显示
     * @param titleVisible
     * @param titleWidth
     */
    isShowTitle: function (titleVisible, titleWidth) {
      if (titleWidth == undefined) {
        return undefined
      }
      if (titleVisible != undefined) {
        if (titleVisible == true) {
          if (titleWidth > 0) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      } else {
        if (titleWidth > 0) {
          return true
        } else {
          return false
        }
      }
    },

    /**
     *数据同步
     */
    dataSyn: function () {
      let vm = this.valuesManager
      if (vm) {
        try {
          //将vm中的数据提交到datasource中
          this.performImplicitSave(this, false)
        } catch (e) {
          if (typeof isc != 'undefined') {
            isc.Log.$am(e)
          }
        }
      }
    },

    /**
     * 当输入按键为"回车"时，进行数据同步
     * 用于按键事件，回车后自动同步数据之后再
     */
    dataSynOnEnter: function () {
      if (event.keyCode == 13) {
        //解决IE下 密码输入后直接“回车” 后获取数据问题
        if (isc.Browser.isIE) {
          for (let i = 0; i < this.items.length; i++) {
            this.elementChanged(this.items[i])
          }
        }
        this.dataSyn()
      }
    },

    /**
     *绑定数据源
     * @param {Object} ds
     */
    bindDataSource: function (ds) {
      let vm = isc.JGFormItemModel.getByDataSource(ds)
      let dy = vm.getMember(this.ID)
      if (!dy) {
        vm.addMember(this)
      }
    },

    //设置控件的index要以组件的index为前缀
    setIndexPreJoinComponentIndex: function (componentIndex) {
      let items = this.items
      if (items && items.length > 0) {
        items.last().setGlobalTabIndex(parseInt(componentIndex + this.TabIndex))
      }
    },
    useFormat: function () {
      if (this.DisplayFormat && this.DisplayFormat.displayFormat) {
        this.items.last().formatEditorValue = this.fireEvent(
          this,
          'formatDisplayValue'
        )
      }
    },

    //======================  支持多值
    /**
     * JGFormItemModel.js类下方法 _setMemberValues
     */
    getFieldItems: function () {
      return this.getItems()
    },

    /**
     * JGFormItemView 下 方法 setValue : function (fieldName, value, updatingDisplayValue)
     * 重写了this.getFieldItem方法
     */
    getFieldItem: function (fieldName, updatingDisplayValue) {
      return this.getItem(fieldName, updatingDisplayValue)
    },

    getBoundFieldNames: function () {
      let items = this.getItems()
      let fieldArray = []
      for (let i = 0; i < items.length; i++) {
        let item = items[i]
        if (item.name) {
          fieldArray.push(item.name)
        }
      }
      return fieldArray
    }
  })
}
