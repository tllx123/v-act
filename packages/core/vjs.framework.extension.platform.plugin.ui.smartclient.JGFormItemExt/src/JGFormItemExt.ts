exports.initModule = function (sBox) {
  if (isc.Canvas && isc.Canvas._v3script_loadCount != 1) {
    //防止脚本重复执行
    let interfaceInit = isc.Canvas.getPrototype().init
    let getIFrameHTML = isc.Canvas.getPrototype().getIFrameHTML
    isc.Canvas.addMethods({
      init: function (A, B, C, D, E, F, G, H, I, J, K, L, M) {
        interfaceInit.apply(this, arguments)
        if (this.useBackMask && isc.Browser.isChrome) {
          this.makeBackMask()
        }
      },
      getIFrameHTML: function (url) {
        let iframHtml = getIFrameHTML.apply(this, arguments)
        let index = iframHtml.indexOf('>')
        iframHtml =
          iframHtml.substring(0, index) +
          ' allowtransparency="true" style="vertical-align: middle;" ' +
          iframHtml.substring(index)
        return iframHtml
      }
    })
    isc.Canvas._v3script_loadCount = 1
  }

  isc.ClassFactory.defineClass('V3StyleUtil')
  isc.V3StyleUtil.addClassMethods({
    getReadOnlyStyleNmae: function (_styleName) {
      return _styleName + 'ReadOnly'
    }
  })

  isc.PrintWindow.addProperties({
    styleName: 'JGModalWindowBackground',
    headerStyle: 'JGModalWindowHeader',
    bodyStyle: 'JGModalWindowBody',
    bodyColor: '',
    edgeCenterBackgroundColor: '',
    contents: '',
    headerLabelDefaults: {
      wrap: false,
      align: isc.Canvas.LEFT,
      styleName: 'JGModalWindowHeaderText',
      width: 10,
      inherentWidth: true,
      layoutAlign: isc.Page.isRTL() ? isc.Canvas.RIGHT : isc.Canvas.LEFT
    },
    headerDefaults: {
      layoutMargin: 0,
      membersMargin: 6,
      layoutRightMargin: 2,
      layoutLeftMargin: 5,
      contents: '',
      height: 30
    },
    closeButtonDefaults: {
      width: 40,
      height: 20,
      src: '[SKIN]/headerIcons/cclose.png',
      layoutAlign: 'top',
      baseStyle: 'JGModalWindowCloseButton',
      click: function () {
        return this.creator.handleCloseClick()
      }
    },
    maximizeButtonDefaults: {
      width: 12,
      height: 20,
      src: '[SKIN]/headerIcons/cmaximize.png',
      layoutAlign: 'top',
      click: function () {
        if (
          !this.creator.onMaximizeClick ||
          this.creator.onMaximizeClick() != false
        ) {
          this.creator.maximize()
        }
        return false
      }
    },
    restoreButtonDefaults: {
      width: 12,
      height: 20,
      src: '[SKIN]/headerIcons/ccascade.png',
      layoutAlign: 'top',
      click: function () {
        if (
          !this.creator.onRestoreClick ||
          this.creator.onRestoreClick() != false
        ) {
          this.creator.restore()
        }
        return false
      }
    },
    initWidget: function () {
      this.printButtonDefaults.title = this.printButtonTitle
      this.Super('initWidget', arguments)
    }
  })

  isc.Hover.hoverCanvas = isc.Canvas.create({
    width: '*',
    height: 10,
    maxWidth: 299, // 最大299px宽度
    resizeTo: function () {},
    setContents: function (newContents) {
      if (newContents != null) {
        this.contents =
          "<div id='canvasHover' class='canvasHover' style='word-wrap:break-word;max-width:299px;width:auto;display:inline-block;float:left;'>" +
          newContents +
          '</div>'

        this.markForRedraw('setContents')
        if (this.isDrawn() && this.isDirty()) this.redraw()
        if (this.getClipHandle()) {
          this.getClipHandle().style.width = 'unset' //重新计算宽度
          this.width = this.getClipHandle().clientWidth
        }
      } else {
        this.markForRedraw('setContents')
      }
    },
    setRect: function (left, top, width, height, animating) {
      this.Super('setRect', arguments)
      if (top != -9999) this.width = '*'
    }
  })

  let _$disableStyle = ''

  //个性化的DynamicForm主要定制了样式部分
  isc.ClassFactory.defineClass('CustomDynamicForm', 'DynamicForm')
  isc.CustomDynamicForm.addMethods({
    /**
     * 寻找第一个空格，插入样式字符串,注入标题样式
     * <TD  _containsItem='isc_TextItem_0' _itemPart='_title' ID=isc_G CLASS='formTitle' ALIGN='Center' VALIGN='middle'><LABEL FOR=isc_H>用户名</LABEL>
     * @return {*|Array}
     */
    getTitleCellHTML: function (item, error) {
      let _html = this.invokeSuper(null, 'getTitleCellHTML', item, error)
      if (item.titleCssText && _html) {
        let _index = _html.search(/ /i)
        if (_index != -1) {
          _html =
            _html.substr(0, _index) +
            " style='" +
            item.titleCssText +
            "' " +
            _html.substr(_index)
        }
      }
      return _html
    },

    /**
     * 寻找第一个空格，插入样式字符串,注入标题样式
     * <DIV style='overflow:hidden;text-overflow:ellipsis;width:75px;height:18px;'>
     *     <TABLE height=18 border=0 cellspacing=0 cellpadding=0><tr>
     *         <td class='borderFormTitle'
     *         style='margin:0px;border:0px;padding:0px;background-image:none;background-color:transparent;-webkit-box-shadow:none;box-shadow:none;'
     *         ALIGN='Center'>
     *             <NOBR><LABEL FOR=isc_D>文本</LABEL>
     *         </td>
     *     </tr></TABLE>
     * </DIV>
     * @return {*|Array}
     */
    getTitleCellInnerHTML: function (item, error) {
      let _html = this.invokeSuper(null, 'getTitleCellInnerHTML', item, error)
      if (item.titleCssText && _html) {
        let _index1 = _html.search(/style='.*'/)
        if (_index1 != -1) {
          //找到第一个style
          let firstString = _html.substr(0, _index1 + 5)
          if (item.isDisabled() /* || !item.canEdit*/) {
            let secondString = _html
              .substr(_index1 + 5)
              .replace(
                /style='([^']*)'/,
                "style='$1;" + item.titleCssText + _$disableStyle + "'"
              )
          } else {
            let secondString = _html
              .substr(_index1 + 5)
              .replace(
                /style='([^']*)'/,
                "style='$1;" + item.titleCssText + "'"
              )
          }
          _html = firstString + secondString
        }
      }
      return _html
    },

    /**
     * 寻找第一个空格，注入表格样式。
     * <TABLE role='presentation' ID='isc_F' WIDTH=310 CELLSPACING=0 CELLPADDING=0 BORDER=0>
     * @return {*}
     */
    getTableStartHTML: function () {
      let _html = this.invokeSuper(null, 'getTableStartHTML')
      if (this.formCssText && _html) {
        let _index = _html.search(/ /i)
        if (_index != -1) {
          _html =
            _html.substr(0, _index) +
            " style='" +
            this.formCssText +
            "' " +
            _html.substr(_index)
        }
      }
      return _html
    },

    /**
     * 原方法逻辑是判断当前控件是否可以编辑,不可编辑则直接返回不需要.
     * 现在改为:不管控件是否可以编辑,直接返回控件真实情况.
     * @param item
     * @return 是否需要填写
     */
    isRequired: function (item) {
      return item.required || this.isXMLRequired(item)
    },

    /**
     * 更改校验，无论校验是否成功，都返回true
     * @param {Object} validateHiddenFields
     * @param {Object} ignoreDSFields
     * @param {Object} typeValidationsOnly
     * @param {Object} checkValuesOnly
     * @param {Object} skipServerValidation
     */
    validate: function (
      validateHiddenFields,
      ignoreDSFields,
      typeValidationsOnly,
      checkValuesOnly,
      skipServerValidation
    ) {
      if (
        !(
          this.parentElement &&
          this.parentElement.isReadOnlys &&
          this.parentElement.isReadOnlys()
        )
      )
        this.Super('validate', arguments)
      return true
    },

    validateField: function (field, validators, value, record, options) {
      if (field.isA('MultiFieldFormItem')) {
        field.canvas.validate()
        return null
      }
      return this.Super('validateField', arguments)
    },
    /**
     * 重写setFields方法，防止数据源绑定时触发二次渲染
     * @param {Object} fields
     */
    setFields: function (fields) {
      if (this.isDrawn() && this.items == fields) {
        return
      }
      this.Super('setFields', arguments)
    },

    _isEmptyObj: function (obj) {
      if (obj) {
        for (let attr in obj) {
          if (obj.hasOwnProperty(attr)) {
            return false
          }
        }
        return true
      }
      return false
    },

    setData: function (obj) {
      let data = this.getData()
      if (data == null) {
        this.values = data = {}
        let isEmpty = this._isEmptyObj(obj)
        if (isEmpty || obj == null) return
      }
      let hasDiff = false
      for (let field in obj) {
        if (data[field] != obj[field]) {
          hasDiff = true
          break
        }
      }
      if (hasDiff) this.Super('setData', arguments)
    },

    markForRedraw: function (reason) {
      if (reason != 'bind') {
        this.Super('markForRedraw', arguments)
      }
    },

    clearValues: function () {
      //如果表单中没有记录,则终止清空
      let data = this.getData()
      if (data) {
        let isEmpty = this._isEmptyObj(data)
        if (!isEmpty) {
          this.Super('clearValues', arguments)
        }
      }
    },

    setDataSource: function (dataSource, fields) {
      if (isc._traceMarkers) arguments.__this = this
      this.dataSource = dataSource || this.dataSource
      if (this.getFields) {
        let oFields = this.getFields()
        if (oFields != fields && this.isDrawn() && this.setFields) {
          this.setFields(fields)
        }
      } else if (this.isDrawn() && this.setFields) {
        this.setFields(fields)
      }
      if (this.dataSource) {
        this.setData({})
      }
      this.markForRedraw('bind')
    }
  })

  let _$updateState = function () {
    this.invokeSuper(null, 'updateState')
    let textBoxHandle = this.getDataElement()
    if (textBoxHandle) {
      let cssObj = textBoxHandle.style
      if (cssObj) {
        if (this.isDisabled() && this.textCssText) {
          cssObj.cssText += ';' + this.textCssText + _$disableStyle
        } else {
          cssObj.cssText += ';' + this.textCssText
        }
      }
    }
  }
  let _$getPickerIconStyle = {
    getPickerIconStyle: function (icon, over, disabled, focused) {
      var _style = this.invokeSuper(null, 'getPickerIconStyle')
      if (this.isReadOnly() && this.disabled != true) {
        return this.pickerIconStyle + 'ReadOnly'
      }
      return _style
    }
  }

  let _$styleFunction = {
    getElementStyleHTML: function () {
      var _style = this.invokeSuper(null, 'getElementStyleHTML')
      var _index = _style.lastIndexOf("'")
      if (_index != -1) {
        var extCss = this.genLineHeightString(_style)
        if (isc.isA.nonemptyString(this.textCssText)) {
          extCss += this.textCssText
          if (this.isDisabled()) {
            extCss += _$disableStyle
          }
        }

        return _style.substr(0, _index) + extCss + _style.substr(_index)
      }

      return _style
    },
    updateState: _$updateState,

    getTextBoxStyle: function () {
      var _style = this.invokeSuper(null, 'getTextBoxStyle')

      //if(!this.canEdit && this.canEdit!=undefined){
      if (this.isReadOnly() && this.disabled != true) {
        //alert(this.canEdit+"   **");
        return isc.V3StyleUtil.getReadOnlyStyleNmae(this.textBoxStyle) // 定制 只读属性是为只读状态 输入框 背景色 #F1F1F1   字体颜色 #000000
      }

      return _style
    }
  }

  //FormItem类中handleChange里的transformInput方法扩展
  //文本、长文本（包括列表中）输入值长度校验问题处理，sc中是默认是以字符进行校验截取的，要修改为按字节进行校验，一个中文算三个字节（按数据库中最长的一种来算，DB2是用三个字节的）
  let _$transformInputExt = {
    getErrorIconHTML: function () {
      return "<span class='iconfont icon-warn JGFormErrorIconShow '></span>"
    },
    shouldShowErrorIconPrompt: function () {
      return null
    },
    transformInput: function (form, item, value, oldValue) {
      if (item.length != null && isc.isA.String(value)) {
        var inputNum = value.replace(/[^\x00-\xff]/g, 'aaa').length //随便用三个字符替换中文计算总字节数
        if (inputNum > item.length) {
          // 原字符串长度
          var inputValueLen = value.length
          var cutLen = item.length
          var cutSubString
          var lenCount = 0
          var okFlag = false
          if (inputValueLen <= cutLen / 3) {
            cutSubString = value
            okFlag = true
          }

          if (!okFlag) {
            for (var i = 0; i < inputValueLen; i++) {
              var charCode = value.charCodeAt(i)
              if (charCode >= 0 && charCode <= 128) {
                lenCount += 1
              } else {
                lenCount += 3
              }

              if (lenCount > cutLen) {
                cutSubString = value.substring(0, i)
                okFlag = true
                break
              } else if (lenCount == cutLen) {
                cutSubString = value.substring(0, i + 1)
                okFlag = true
                break
              }
            }
          }

          if (!okFlag) {
            cutSubString = value
          }

          return cutSubString
        } else {
          return value
        }
      }
      return value
    }
  }

  //列表中同时支持此逻辑
  isc.TextItem.addMethods(_$transformInputExt)
  isc.TextAreaItem.addMethods(_$transformInputExt)
  //isc.ClassFactory.defineClass("V3TextItem","TextItem");
  //isc.ClassFactory.mixInInterface("V3TextItem", "JGStyleHelper");
  //isc.V3TextItem.addMethods(_$styleFunction);
  /*isc.ClassFactory.defineClass("V3SIconItem","SIconItem");
    isc.ClassFactory.mixInInterface("V3SIconItem", "JGStyleHelper");
    isc.V3SIconItem.addMethods(_$styleFunction);
    isc.V3SIconItem.addMethods(_$getPickerIconStyle);*/

  /*isc.ClassFactory.defineClass("V3FloatItem","FloatItem");
    isc.ClassFactory.mixInInterface("V3FloatItem", "JGStyleHelper");
    isc.V3FloatItem.addMethods(_$styleFunction);*/
  /*isc.ClassFactory.defineClass("V3SDateItem","SDateItem");
    isc.ClassFactory.mixInInterface("V3SDateItem", "JGStyleHelper");
    isc.V3SDateItem.addMethods(_$styleFunction);
    isc.V3SDateItem.addMethods(_$getPickerIconStyle);*/

  /* 
    isc.TextAreaItem.addMethods(_$transformInputExt);
    isc.ClassFactory.defineClass("V3TextAreaItem","TextAreaItem");
    isc.V3TextAreaItem.addMethods({
        getElementStyleHTML:function(){
            var _style = this.invokeSuper(null, "getElementStyleHTML");
            var _index = _style.lastIndexOf("'");
            if(_index != -1){
                var extCss = '';
                if(isc.isA.nonemptyString(this.textCssText)){
                    extCss += this.textCssText;
                    if(this.isDisabled()){
                        extCss += _$disableStyle;
                    }
                }
                return _style.substr(0,_index) + extCss + _style.substr(_index);
            }
            return _style;
        },
        updateState:_$updateState,
        getTextBoxStyle:function(){
            var _style = this.invokeSuper(null, "getTextBoxStyle");
            
             //if(!this.canEdit && this.canEdit!=undefined){
            if(this.isReadOnly() && this.disabled!=true){
                 //alert(this.canEdit+"   **");
                 return "longTextItemReadOnlyBackgrund";// 定制 只读属性是为只读状态 输入框 背景色 #F1F1F1   字体颜色 #000000
             }

             return _style;
       }
    });*/

  let _$styleFunction2 = {
    getElementHTML: function () {
      var _style = this.invokeSuper(null, 'getElementHTML')

      var _index = _style.lastIndexOf("style=''")
      if (_index != -1) {
        var extCss = ''
        if (isc.isA.nonemptyString(this.textCssText)) {
          extCss += this.textCssText
          if (this.isDisabled()) {
            extCss += _$disableStyle
          }
        }
        return _style.substr(0, _index + 7) + extCss + _style.substr(_index + 7)
      }
      return _style
    },
    updateState: _$updateState
  }

  /*isc.ClassFactory.defineClass("V3RadioItem","RadioItem");
    isc.ClassFactory.mixInInterface("V3RadioItem", "JGStyleHelper");
    isc.V3RadioItem.addMethods(_$styleFunction2);*/

  /**
   * 当行文本的item
   *
   */
  isc.ClassFactory.defineClass('SingleLineLabelItem', 'FormItem')
  isc.SingleLineLabelItem.addMethods({
    left: 0,
    top: 0,
    width: 76, //默认宽度
    height: 24, //默认高度
    title: '',
    textBoxStyle: 'normal',
    textAlign: isc.Canvas.CENTER,
    showRequiredSign: false, //是否显示必填标志
    requiredStyle: 'normal',
    validateOnChange: false,

    /*以下内容保持原有值即可，创建时最好别修改*/
    shouldSaveValue: false, //不保存值
    wrap: false, //默认不换行
    clipValue: true, //超出是否显示"..."
    overflow: isc.Canvas.HIDDEN,
    applyHeightToTextBox: true,
    canSelectText: false,
    redrawOnShowIcon: false,
    canEscapeHTML: false, //让内容支持html
    textVAlign: isc.Canvas.CENTER,
    getTextBoxCSS: function () {
      let _cssText = this.invokeSuper(null, 'getTextBoxCSS')
      if (this.textVAlign == isc.Canvas.CENTER) {
        //垂直居中
        if (this.wrap != true) {
          //不换行
          _cssText = isc.JGStyleTools.addLineHeightCssText(_cssText) //增加行高，文字直接居中
        } else {
          //多行文本的暂时无法处理
        }
        if (this.cssText) {
          //增加一个样式扩展
          let statefulCssText = this.cssText
          if (this.showDisabled && this.isDisabled()) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
            statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
          }
          _cssText = _cssText + ';' + statefulCssText
        }
      }
      return _cssText
    },
    getTextBoxStyle: function () {
      return isc.JGStyleTools.getItemStyleName(this)
    },
    //鼠标移上标题时，显示浮动提示内容
    mapValueToDisplay: function (value) {
      return this.title
    },
    //控制控件设置必填处理
    getElementHTML: function (value, dataValue) {
      let titlehtml = this.title
      if (this.showRequiredSign) {
        titlehtml =
          '<span class=' + this.requiredStyle + '>*</span>' + titlehtml
      }
      return this.Super('getElementHTML', titlehtml, dataValue)
    },
    //取消比较标题宽度与标题显示宽度
    valueClipped: function () {
      return true
    }
  })
  /**
   * 文本控件
   */
  isc.ClassFactory.defineClass('V3TextItem', 'TextItem')
  isc.V3TextItem.addMethods({
    getErrors: function () {
      // 处理必填提示为简洁模式下的样式效果
      if (this.form && this.form.IsMustBehavior + '' === 'Simple') return false
      else return this.invokeSuper(null, 'getErrors')
    },
    getElementStyleHTML: function () {
      let _style = this.invokeSuper(null, 'getElementStyleHTML')

      if (
        this.textAlign === 'right' &&
        this.editorType === 'v3Text' &&
        (isc.Browser.isIE9 || isc.Browser.isIE8 || isc.Browser.isIE8Strict)
      ) {
        // 处理IE9 8 列控件设置为右泊靠的时编辑状态下无法查看光标
        let _width = _style.match(/.+WIDTH:(\d+)px;.+/)[1]
        if (Number(_width) + '' !== 'NaN') {
          _width = _width * 1 - 1
          _style = _style.replace(
            /(.+.+WIDTH:)\d+(px;.+)'(.+)/,
            '$1' + _width + '$2' + "padding-right: 3px;'" + '$3'
          )
        }
      }

      let _style = isc.JGStyleTools.addLineHeightCssText(_style)
      let _index = _style.lastIndexOf("'")
      if (_index != -1) {
        if (this.cssText) {
          let statefulCssText = this.cssText
          if (this.showDisabled && this.isDisabled()) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
            statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
          } else if (this.getCanEdit() == false) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
          }
          _style =
            _style.substr(0, _index) + statefulCssText + _style.substr(_index)
        }
      }
      return _style
    },
    getTextBoxStyle: function () {
      return isc.JGStyleTools.getItemStyleName(this)
    },
    //取消比较标题宽度与标题显示宽度
    valueClipped: function () {
      return true
    }
  })

  isc.ClassFactory.defineClass('V3FloatItem', 'TextItem')
  isc.V3FloatItem.addMethods({
    getErrors: function () {
      // 处理必填提示为简洁模式下的样式效果
      if (this.form && this.form.IsMustBehavior + '' === 'Simple') return false
      else return this.invokeSuper(null, 'getErrors')
    },
    getElementStyleHTML: function () {
      let _style = this.invokeSuper(null, 'getElementStyleHTML')
      let _style = isc.JGStyleTools.addLineHeightCssText(_style)
      let _index = _style.lastIndexOf("'")
      if (_index != -1) {
        if (this.cssText) {
          let statefulCssText = this.cssText
          if (this.showDisabled && this.isDisabled()) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
            statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
          } else if (this.getCanEdit() == false) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
          }
          _style =
            _style.substr(0, _index) + statefulCssText + _style.substr(_index)
        }
      }
      return _style
    },
    getTextBoxStyle: function () {
      return isc.JGStyleTools.getItemStyleName(this)
    },
    //取消比较标题宽度与标题显示宽度
    valueClipped: function () {
      return true
    }
  })

  isc.ClassFactory.defineClass('V3Integer', 'TextItem')
  isc.V3Integer.addMethods({
    getErrors: function () {
      // 处理必填提示为简洁模式下的样式效果
      if (this.form && this.form.IsMustBehavior + '' === 'Simple') return false
      else return this.invokeSuper(null, 'getErrors')
    },
    getElementStyleHTML: function () {
      let _style = this.invokeSuper(null, 'getElementStyleHTML')
      let _style = isc.JGStyleTools.addLineHeightCssText(_style)
      let _index = _style.lastIndexOf("'")
      if (_index != -1) {
        if (this.cssText) {
          let statefulCssText = this.cssText
          if (this.showDisabled && this.isDisabled()) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
            statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
          } else if (this.getCanEdit() == false) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
          }
          _style =
            _style.substr(0, _index) + statefulCssText + _style.substr(_index)
        }
      }
      return _style
    },
    getTextBoxStyle: function () {
      return isc.JGStyleTools.getItemStyleName(this)
    },
    //取消比较标题宽度与标题显示宽度
    valueClipped: function () {
      return true
    }
  })

  isc.ClassFactory.defineClass('V3TextReadOnlyItem', 'V3TextItem')
  isc.V3TextReadOnlyItem.addMethods({
    getElementHTML: function () {
      let _style = this.invokeSuper(null, 'getElementHTML')
      let _index = _style.lastIndexOf('>')
      if (_index != -1) {
        return (
          _style.substr(0, _index) + ' READONLY=TRUE ' + _style.substr(_index)
        )
      }
      return _style
    },
    setElementReadOnly: function (readOnly) {
      //此控件永远只读，无法进行设置
    },
    //取消比较标题宽度与标题显示宽度
    valueClipped: function () {
      return true
    }
  })

  isc.ClassFactory.defineClass('V3TextAreaItem', 'TextAreaItem')
  isc.V3TextAreaItem.addMethods({
    getErrors: function () {
      // 处理必填提示为简洁模式下的样式效果
      if (this.form && this.form.IsMustBehavior + '' === 'Simple') return false
      else return this.invokeSuper(null, 'getErrors')
    },
    getElementStyleHTML: function () {
      let _style = this.invokeSuper(null, 'getElementStyleHTML')
      let _index = _style.lastIndexOf("'")
      if (_index != -1) {
        let statefulCssText = ''
        if (this.cssText) {
          statefulCssText = this.cssText
          if (this.showDisabled && this.isDisabled()) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
            statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
          } else if (this.getCanEdit() == false) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
          }
        }
        //statefulCssText += "white-space:normal;";//兼容ie11，防止长文本不换行问题
        statefulCssText += 'white-space:pre-wrap;' //处理ie浏览器换行问题
        _style =
          _style.substr(0, _index) + statefulCssText + _style.substr(_index)
      }
      return _style
    },
    getTextBoxStyle: function () {
      return isc.JGStyleTools.getItemStyleName(this)
    },
    //取消比较标题宽度与标题显示宽度
    valueClipped: function () {
      return true
    },
    resetToLastSelection: function (_1) {
      if (!this.isDrawn() || this.$17r == null) return
      let _2,
        _3 = this.getElementValue(),
        _4 = this.$17q
      if (!_1) _2 = _3 == _4
      else {
        _2 = true
        if (this.$17r == 0 && this.$17s == _4.length) this.$17s = _3.length
        else if (_3.toLowerCase() != _4.toLowerCase()) {
          let _valLen = _3.length
          let _valPressLen = _4.length
          let _v = 0
          if (_valPressLen > _valLen) _v = _valPressLen - _valLen
          this.$17r -= _v
          if (this.$17r < 0) this.$17r = 0
          this.$17s = this.$17r
        }
      }
      if (_2) this.setSelectionRange(this.$17r, this.$17s)
      delete this.$17r
      delete this.$17s
      delete this.$17q
    },
    _getMaxLenErrorInfo: function (item) {
      let validators = item.validators
      for (let i = 0, len = validators.length; i < len; i++) {
        let tmpObj = validators[i]
        if (tmpObj.type === 'maxLength') return tmpObj['errorMessage']
      }
      return ''
    },
    _isMaxLengthError: function (item) {
      if (!item.hasErrors()) return false

      let currErrors = item.getErrors()
      let maxLenErrInfo = this._getMaxLenErrorInfo(item)
      if (isc.isA.String(currErrors) && currErrors === maxLenErrInfo) {
        return true
      } else if (isc.isAn.Array(currErrors)) {
        for (let i = 0, len = currErrors.length; i < len; i++) {
          let tmpInfo = currErrors[i]
          if (tmpInfo === maxLenErrInfo) return true
        }
      }
      return false
    },
    transformInput: function (form, item, value, oldValue) {
      let maxTextLength = item.length
      let valLength = 0

      if (value && value + '' !== 'null') {
        value += ''
        valLength = value.replace(/[^\x00-\xff]/g, 'aaa').length //随便用三个字符替换中文计算总字节数
      }

      if (valLength > maxTextLength) {
        item.setError(this._getMaxLenErrorInfo(item))
        form.showError.apply(form, arguments)
        return oldValue
      } else {
        if (this._isMaxLengthError(item)) {
          item.clearErrors()
          item.form.hideError.apply(form, arguments)
        }
        return _$transformInputExt.transformInput.call(
          this,
          form,
          item,
          value,
          oldValue
        )
      }
    }
  })

  isc.ClassFactory.defineClass('V3SDateItem', 'SDateItem')
  isc.V3SDateItem.addMethods({
    getErrors: function () {
      // 处理必填提示为简洁模式下的样式效果
      if (this.form && this.form.IsMustBehavior + '' === 'Simple') return false
      else return this.invokeSuper(null, 'getErrors')
    },
    getElementStyleHTML: function () {
      let _style = this.invokeSuper(null, 'getElementStyleHTML')
      let _style = isc.JGStyleTools.addLineHeightCssText(_style)
      let _index = _style.lastIndexOf("'")
      if (_index != -1) {
        if (this.cssText) {
          let statefulCssText = this.cssText
          if (this.showDisabled && this.isDisabled()) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
            statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
          } else if (this.getCanEdit() == false) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
          }
          _style =
            _style.substr(0, _index) + statefulCssText + _style.substr(_index)
        }
      }
      return _style
    },
    getControlTableCSS: function () {
      let _style = this.invokeSuper(null, 'getControlTableCSS')
      let statefulCssText = this.cssText
      if (this.showDisabled && this.isDisabled()) {
        statefulCssText =
          isc.JGStyleTools.removeBackgroundColor(statefulCssText)
        statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
      } else if (this.getCanEdit() == false) {
        statefulCssText =
          isc.JGStyleTools.removeBackgroundColor(statefulCssText)
      }
      return _style + statefulCssText
    },
    getPickerIconStyle: function (icon, over, disabled, focused) {
      let _style = this.invokeSuper(null, 'getPickerIconStyle')
      if (this.isReadOnly() && this.disabled != true) {
        return this.pickerIconStyle + 'ReadOnly'
      }
      return _style
    },
    getControlStyle: function () {
      let _style = this.invokeSuper(null, 'getControlStyle')
      if (this.hasErrors()) {
        return null
      }
      if (this.isReadOnly() && this.disabled != true) {
        return this.controlStyle + 'ReadOnly'
      }
      return _style
    },
    /* getTextBoxStyle:function(){
             return isc.JGStyleTools.getItemStyleName(this);
         },*/
    //取消比较标题宽度与标题显示宽度
    valueClipped: function () {
      return true
    }
  })

  isc.ClassFactory.defineClass('V3SIconItem', 'SIconItem')
  isc.V3SIconItem.addMethods({
    getElementStyleHTML: function () {
      let _style = this.invokeSuper(null, 'getElementStyleHTML')
      let _style = isc.JGStyleTools.addLineHeightCssText(_style)
      let _index = _style.lastIndexOf("'")
      if (_index != -1) {
        if (this.cssText) {
          let statefulCssText = this.cssText
          if (this.showDisabled && this.isDisabled()) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
            statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
          } else if (this.getCanEdit() == false) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
          }
          _style =
            _style.substr(0, _index) + statefulCssText + _style.substr(_index)
        }
      }
      return _style
    },
    getControlTableCSS: function () {
      let _style = this.invokeSuper(null, 'getControlTableCSS')
      let statefulCssText = this.cssText
      if (this.showDisabled && this.isDisabled()) {
        statefulCssText =
          isc.JGStyleTools.removeBackgroundColor(statefulCssText)
        statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
      } else if (this.getCanEdit() == false) {
        statefulCssText =
          isc.JGStyleTools.removeBackgroundColor(statefulCssText)
      }
      return _style + statefulCssText
    },
    getPickerIconStyle: function (icon, over, disabled, focused) {
      let _style = this.invokeSuper(null, 'getPickerIconStyle')
      if (this.isReadOnly() && this.disabled != true) {
        return this.pickerIconStyle + 'ReadOnly'
      }
      return _style
    },
    getControlStyle: function () {
      let _style = this.invokeSuper(null, 'getControlStyle')
      if (this.isReadOnly() && this.disabled != true) {
        return this.controlStyle + 'ReadOnly'
      }
      return _style
    },
    /*getTextBoxStyle:function(){
            return isc.JGStyleTools.getItemStyleName(this);
        },*/
    //取消比较标题宽度与标题显示宽度
    valueClipped: function () {
      return true
    }
  })

  isc.ClassFactory.defineClass('V3BaseDictBox', 'V3SIconItem')
  isc.V3BaseDictBox.addMethods({
    getElementHTML: function () {
      let _style = this.invokeSuper(null, 'getElementHTML')
      if (this.isEdit) return _style
      else {
        let _index = _style.lastIndexOf('>')
        return (
          _style.substr(0, _index) + " READONLY='TRUE'" + _style.substr(_index)
        )
      }
    },
    getTextBoxStyle: function () {
      return isc.JGStyleTools.getItemStyleName(this)
    },
    blur: function () {
      //解决列表中弹出选择列在ie下无法弹出问题,原因：ie下先触发了输入框的焦点离开事件，导致列表先退出了编辑状态
      this.Super('blur', arguments)

      //处理无法触发失去焦点事件
      let form = this.form
      if (form && form.isReadOnly) {
        if (!form.isReadOnly()) {
          this.validate()
          form.dataSyn()
        }
        // 处理控件只读时，移除错误提示框
        form.hideError.apply(this.form, arguments)
        form.fireEvent('blur')
      }

      return false
    }
  })

  isc.ClassFactory.defineClass('V3ButtonItem', 'ButtonItem')
  isc.V3ButtonItem.addMethods({})

  isc.ClassFactory.defineClass('V3Button', 'Button')
  isc.V3Button.addMethods({
    stateChanged: function () {
      this.Super('stateChanged')
      let _tcell = this.getTitleCell()
      if (_tcell && _tcell.style) {
        if (
          this._cssText &&
          this._cssText.indexOf('background-image:url;') != -1
        ) {
          //已设置了背景图的不处理
          //有背景色时会抖动，不知是什么原因，鼠标经过动作不更新样式，否则会抖动，暂时这样处理
          return
        }
        //如果用户配置了自定义文字颜色,当按钮为禁用的时候,文字的颜色设置为灰色
        _tcell.style.cssText += this._cssText
        if (_tcell.style.color && _tcell.style.color != '') {
          if (this.isDisabled()) {
            _tcell.style.cssText += this._cssText + _$disableStyle
          } else {
            _tcell.style.cssText += this._cssText
            //当按钮可用时,恢复用户自定义的颜色
          }
        }
      }
    }
  })

  isc.ClassFactory.defineClass('V3BaseDictBoxItem', 'BaseDictBoxItem')
  isc.V3BaseDictBoxItem.addMethods({
    getErrors: function () {
      // 处理必填提示为简洁模式下的样式效果
      if (this.form && this.form.IsMustBehavior + '' === 'Simple') return false
      else return this.invokeSuper(null, 'getErrors')
    },
    getTextBoxStyle: function () {
      return isc.JGStyleTools.getItemStyleName(this)
    },
    getOuterTableCSS: function () {
      let _style = this.invokeSuper(null, 'getOuterTableCSS')
      if (this.cssText) {
        let statefulCssText = this.cssText
        if (this.showDisabled && this.isDisabled()) {
          statefulCssText =
            isc.JGStyleTools.removeBackgroundColor(statefulCssText)
          statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
        } else if (this.getCanEdit() == false) {
          statefulCssText =
            isc.JGStyleTools.removeBackgroundColor(statefulCssText)
        }
        _style = _style + statefulCssText
      }
      return _style
    },
    //取消比较标题宽度与标题显示宽度
    valueClipped: function () {
      return true
    }
  })

  isc.ClassFactory.defineClass('V3StaticTextItem', 'StaticTextItem')
  isc.V3StaticTextItem.addMethods({
    getTextBoxCSS: function () {
      let _style = this.invokeSuper(null, 'getTextBoxCSS')
      _style = isc.JGStyleTools.addLineHeightCssText(_style)
      if (this.cssText) {
        let statefulCssText = this.cssText
        if (this.showDisabled && this.isDisabled()) {
          statefulCssText =
            isc.JGStyleTools.removeBackgroundColor(statefulCssText)
          statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
        } else if (this.getCanEdit() == false) {
          statefulCssText =
            isc.JGStyleTools.removeBackgroundColor(statefulCssText)
        }
        _style = _style + statefulCssText
      }
      return _style
    },
    updateState: function () {
      this.invokeSuper(null, 'updateState')
      let textBoxHandle = this.getFocusElement()
      if (textBoxHandle) {
        let cssObj = textBoxHandle.style
        if (cssObj) {
          if (this.isDisabled() && this.cssText) {
            cssObj.cssText += ';' + this.cssText + _$disableStyle
          } else {
            cssObj.cssText += ';' + this.cssText
          }
        }
      }
    },
    getTextBoxStyle: function () {
      return isc.JGStyleTools.getItemStyleName(this)
    },
    //取消比较标题宽度与标题显示宽度
    valueClipped: function () {
      return true
    }
  })

  isc.ClassFactory.defineClass('V3PasswordItem', 'PasswordItem')
  isc.V3PasswordItem.addMethods({
    getErrors: function () {
      // 处理必填提示为简洁模式下的样式效果
      if (this.form && this.form.IsMustBehavior + '' === 'Simple') return false
      else return this.invokeSuper(null, 'getErrors')
    },
    getElementStyleHTML: function () {
      let _style = this.invokeSuper(null, 'getElementStyleHTML')
      let _style = isc.JGStyleTools.addLineHeightCssText(_style)
      let _index = _style.lastIndexOf("'")
      if (_index != -1) {
        if (this.cssText) {
          let statefulCssText = this.cssText
          if (this.showDisabled && this.isDisabled()) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
            statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
          } else if (this.getCanEdit() == false) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
          }
          _style =
            _style.substr(0, _index) + statefulCssText + _style.substr(_index)
        }
      }
      return _style
    },
    getTextBoxCSS: function () {
      let _style = this.invokeSuper(null, 'getTextBoxCSS')
      if (isc.isA.nonemptyString(this.cssText)) {
        _style += this.cssText + this.genLineHeightString(_style)
        if (this.isDisabled()) {
          _style += _$disableStyle
        }
      }
      return _style
    },
    updateState: function () {
      this.invokeSuper(null, 'updateState')
      let textBoxHandle = this.getFocusElement()
      if (textBoxHandle) {
        let cssObj = textBoxHandle.style
        if (cssObj) {
          if (this.isDisabled() && this.cssText) {
            cssObj.cssText += ';' + this.cssText + _$disableStyle
          } else {
            cssObj.cssText += ';' + this.cssText
          }
        }
      }
    },
    getTextBoxStyle: function () {
      return isc.JGStyleTools.getItemStyleName(this)
    },
    //取消比较标题宽度与标题显示宽度
    valueClipped: function () {
      return true
    }
  })

  isc.ClassFactory.defineClass('V3SelectItem', 'SelectItem')
  isc.ClassFactory.mixInInterface('V3SelectItem', 'JGStyleHelper')
  isc.V3SelectItem.addMethods({
    formatPickListValue: function (_1, _2, _3) {
      // 处理下拉数据源中包含特殊的HTML字符，比如 30天<X<=60天， 导致浏览器显示结果不正确
      let _val = this.invokeSuper(null, 'formatPickListValue', _1, _2, _3)
      _val = this._handleHtmlChar(_val)

      return _val
    },
    setElementValue: function (key, value) {
      // 重写 setElementValue 处理数据中包含HTML特殊字符
      let _key = this._handleHtmlChar(key),
        _val = this._handleHtmlChar(value)

      return this.invokeSuper(null, 'setElementValue', _key, _val)
    },
    // 处理下拉框显示字段和保存字段一致时，返回值无法获取问题
    $190: function (value) {
      if (this.name === this._displayName) return value
      else return this.invokeSuper(null, '$190', value)
    },
    getTextBoxCSS: function () {
      let _style = this.invokeSuper(null, 'getTextBoxCSS')
      _style = isc.JGStyleTools.addLineHeightCssText(_style)
      if (this.cssText) {
        let statefulCssText = this.cssText
        if (this.showDisabled && this.isDisabled()) {
          statefulCssText =
            isc.JGStyleTools.removeBackgroundColor(statefulCssText)
          statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
        } else if (this.getCanEdit() == false) {
          statefulCssText =
            isc.JGStyleTools.removeBackgroundColor(statefulCssText)
        }
        _style = _style + statefulCssText
      }
      return _style
    },
    showPickList: function (waitForData, queueFetches) {
      if (this.parentItem.hasCheck) {
        let data = this.parentItem.updateData
        this.updateValueMap()
        if (data) {
          let valueMap = this.dataToValueMap(data)
          this.valueMap = valueMap
        }
        this.orderItemArray = null
      }
      let interfaceShowPickList = isc.PickList.getPrototype().showPickList
      interfaceShowPickList.apply(this, arguments)
      if (this.pickList) {
        this.pickList.deselectAllRecords()
        if (this.getValue() != null) this.selectItemFromValue(this.getValue())
      }
    },
    dataToValueMap: function (data) {
      let valueMap = {}
      this.defaultValue = []
      if (data) {
        for (i = 0; i < data.length; i++) {
          let itemObj = data[i]
          let itemText = '',
            itemVal = ''
          if (this.itemFields.textField === this.itemFields.valueField) {
            itemVal = itemText = itemObj.text
            // 处理下拉列显示字段和保存字段一致时取数据源的显示字段
            // itemVal = itemObj.id;
          } else {
            itemText = itemObj[this.itemFields.textField]
            itemVal = itemObj[this.itemFields.valueField]
          }
          valueMap[itemVal] = itemText
          if (itemObj['default']) {
            this.defaultValue.add(itemVal) // 设置默认值
          }
        }
      }
      return valueMap
    },
    updateState: function () {
      this.invokeSuper(null, 'updateState')
      let textBoxHandle = this.getFocusElement()
      if (textBoxHandle) {
        let cssObj = textBoxHandle.style
        if (cssObj) {
          if (this.isDisabled() && this.cssText) {
            cssObj.cssText += ';' + this.cssText + _$disableStyle
          } else {
            cssObj.cssText += ';' + this.cssText
          }
        }
      }
    },
    getControlStyle: function () {
      let _style = this.invokeSuper(null, 'getControlStyle')
      if (this.isReadOnly() && this.disabled != true) {
        return this.controlStyle + 'ReadOnly'
      }
      return _style
    },
    getControlTableCSS: function () {
      let _style = this.invokeSuper(null, 'getControlTableCSS')
      let statefulCssText = this.cssText
      if (this.showDisabled && this.isDisabled()) {
        statefulCssText =
          isc.JGStyleTools.removeBackgroundColor(statefulCssText)
        statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
      } else if (this.getCanEdit() == false) {
        statefulCssText =
          isc.JGStyleTools.removeBackgroundColor(statefulCssText)
      }
      return _style + statefulCssText
    },
    getTextBoxStyle: function () {
      return isc.JGStyleTools.getItemStyleName(this)
    },
    getPickerIconStyle: function (icon, over, disabled, focused) {
      let _style = this.invokeSuper(null, 'getPickerIconStyle')
      if (this.isReadOnly() && this.disabled != true) {
        return this.pickerIconStyle + 'ReadOnly'
      }
      return _style
    },
    //取消比较标题宽度与标题显示宽度
    valueClipped: function () {
      return true
    },
    _handleHtmlChar: function (val) {
      if (val === null || val === undefined) return val

      return (val + '').replace(/>/g, '&gt;').replace(/</g, '&lt;')
    }
  })

  isc.ClassFactory.defineClass('V3ComboBoxItem', 'ComboBoxItem')
  isc.ClassFactory.mixInInterface('V3ComboBoxItem', 'JGStyleHelper')
  isc.V3ComboBoxItem.addMethods({
    //  getValueMap: function(){
    //      // TODO: 待处理
    //      var _valueMap = this.invokeSuper(arguments, "getValueMap");
    //      if(_valueMap + "" !== "null" && _valueMap + "" !== "undefined" && typeof _valueMap === "object"){
    //          var _tmpValueMap = {};
    //          for(var _tmp in _valueMap){
    //              if(!(_tmp === "null" || _tmp === "undefined")){
    //                  if(!_valueMap[_tmp])
    //                      _valueMap[_tmp] = "";
    //                  if(this._isSameKeyValue)
    //                      _tmpValueMap[_tmp] = _tmp;
    //                  else
    //                      _tmpValueMap[_tmp] = _valueMap[_tmp];
    //              }
    //          }
    //      }
    //      return _tmpValueMap;
    //  },
    formatPickListValue: function (_1, _2, _3) {
      // 处理下拉数据源中包含HTML标签 < > 导致显示异常
      let _val = this.invokeSuper(null, 'formatPickListValue', _1, _2, _3)
      _val = this._handleHtmlChar(_val)
      return _val
    },
    _handleHtmlChar: function (val) {
      if (val === null || val === undefined) return val
      return (val + '').replace(/>/g, '\x26gt;').replace(/</g, '\x26lt;')
    },
    updateValueMap: function () {
      // 可输入状态下禁止执行updateValueMap,处理中文输入法无法输入问题
      if (this._isAutomaticPrompt) return
      else this.invokeSuper(arguments, 'updateValueMap')
    },
    getTextBoxCSS: function () {
      let _style = this.invokeSuper(null, 'getTextBoxCSS')
      _style = isc.JGStyleTools.addLineHeightCssText(_style)
      if (this.cssText) {
        let statefulCssText = this.cssText
        if (this.showDisabled && this.isDisabled()) {
          statefulCssText =
            isc.JGStyleTools.removeBackgroundColor(statefulCssText)
          statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
        } else if (this.getCanEdit() == false) {
          statefulCssText =
            isc.JGStyleTools.removeBackgroundColor(statefulCssText)
        }
        _style = _style + statefulCssText
      }
      return _style
    },
    showPickList: function (waitForData, queueFetches) {
      if (this.parentItem.hasCheck) {
        let data = this.parentItem.updateData
        let eleVal = this.getElementValue()
        this.updateValueMap()

        // 处理列表中的下拉框无法输入值问题
        let isPickListFields =
          this.parentItem.DropDownSource.DataSourceSetting.DataConfig
            .IsPickListFields + ''
        if (isPickListFields === 'true') this.setElementValue(eleVal) //updateValueMap方法导致值清除，需要重新写入输入框

        if (data) {
          let valueMap = this.dataToValueMap(data)
          this.valueMap = valueMap
        }

        if (
          this.parentItem.DropDownSource.DataSourceSetting.DataConfig
            .IsPickListFields +
            '' !==
          'true'
        )
          this.orderItemArray = null
      }
      let interfaceShowPickList = isc.PickList.getPrototype().showPickList
      interfaceShowPickList.apply(this, arguments)
      if (this.pickList) {
        this.pickList.deselectAllRecords()
        if (this.getValue() != null) this.selectItemFromValue(this.getValue())
      }
    },
    dataToValueMap: function (data) {
      let valueMap = {}
      this.defaultValue = []
      if (data) {
        for (i = 0; i < data.length; i++) {
          let itemObj = data[i]
          let itemText = itemObj[this.itemFields.textField]
          let itemVal = itemObj[this.itemFields.valueField]
          valueMap[itemVal] = itemText
          if (itemObj['default']) {
            this.defaultValue.add(itemVal) // 设置默认值
          }
        }
      }
      return valueMap
    },
    updateState: function () {
      this.invokeSuper(null, 'updateState')
      let textBoxHandle = this.getFocusElement()
      if (textBoxHandle) {
        let cssObj = textBoxHandle.style
        if (cssObj) {
          if (this.isDisabled() && this.cssText) {
            cssObj.cssText += ';' + this.cssText + _$disableStyle
          } else {
            cssObj.cssText += ';' + this.cssText
          }
        }
      }
    },
    getControlStyle: function () {
      let _style = this.invokeSuper(null, 'getControlStyle')
      if (this.isReadOnly() && this.disabled != true) {
        return this.controlStyle + 'ReadOnly'
      }
      return _style
    },
    getControlTableCSS: function () {
      let _style = this.invokeSuper(null, 'getControlTableCSS')
      let statefulCssText = this.cssText
      if (this.showDisabled && this.isDisabled()) {
        statefulCssText =
          isc.JGStyleTools.removeBackgroundColor(statefulCssText)
        statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
      } else if (this.getCanEdit() == false) {
        statefulCssText =
          isc.JGStyleTools.removeBackgroundColor(statefulCssText)
      }
      return _style + statefulCssText
    },
    getTextBoxStyle: function () {
      return isc.JGStyleTools.getItemStyleName(this)
    },
    getPickerIconStyle: function (icon, over, disabled, focused) {
      let _style = this.invokeSuper(null, 'getPickerIconStyle')
      if (this.isReadOnly() && this.disabled != true) {
        return this.pickerIconStyle + 'ReadOnly'
      }
      return _style
    },
    //取消比较标题宽度与标题显示宽度
    valueClipped: function () {
      return true
    }
  })

  isc.ClassFactory.defineClass('V3RadioItem', 'RadioItem')
  isc.V3RadioItem.addMethods({
    isDisabled: function () {
      let target = this
      while (target) {
        if (target._disabled || target.disabled) {
          return true
        }
        target = target.parentElement || target.parentItem
        if (target && target.eventProxy) {
          target = target.eventProxy
        }
      }
      return false
    },
    getElementHTML: function () {
      let _style = this.invokeSuper(null, 'getElementHTML')
      _style = _style.substring(_style.indexOf('<INPUT'))

      // 处理单选组选项值布局方向，竖直、水平
      let _css = ''
      if (
        this.form &&
        (this.form.FlowDirection + '').toLowerCase() === 'vertical'
      )
        _css += 'float: none;'

      _style =
        '<div class=' +
        this.textBoxStyle +
        ' style="' +
        _css +
        '"><label style="vertical-align: middle;"><div>' +
        _style.substring(0, _style.indexOf('>')) +
        "/><span style='vertical-align: middle;'>" +
        this.getTitle() +
        '</span></div></label></div>'

      let _index = _style.lastIndexOf("style='")
      if (_index != -1) {
        if (this.form.ValueFontStyle) {
          _style =
            _style.substr(0, _index + 7) +
            isc.JGStyleTools.addStyle(
              '',
              isc.JGStyleTools.toFontStyle(this.form.ValueFontStyle)
            ) +
            _style.substr(_index + 7)
        }
      }

      return _style
    },
    getElementStyleHTML: function () {
      let _style = this.invokeSuper(null, 'getElementStyleHTML')
      let _style = isc.JGStyleTools.addLineHeightCssText(_style)
      let _index = _style.lastIndexOf("'")
      if (_index != -1) {
        if (this.cssText) {
          let statefulCssText = this.cssText
          if (this.showDisabled && this.isDisabled()) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
            statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
          } else if (this.getCanEdit() == false) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
          }
          _style =
            _style.substr(0, _index) + statefulCssText + _style.substr(_index)
        }
      }
      return _style
    },
    getTextBoxStyle: function () {
      return isc.JGStyleTools.getItemStyleName(this)
    },
    updateState: function () {
      this.invokeSuper(null, 'updateState')
      let textBoxHandle = this.getFocusElement()
      if (textBoxHandle) {
        let cssObj = textBoxHandle.style
        if (cssObj) {
          if (this.isDisabled() && this.cssText) {
            cssObj.cssText += ';' + this.cssText + _$disableStyle
          } else {
            cssObj.cssText += ';' + this.cssText
          }
        }
      }
    },
    getTextBoxCSS: function () {
      let _style = this.invokeSuper(null, 'getTextBoxCSS')
      _style = isc.JGStyleTools.addLineHeightCssText(_style)
      if (this.cssText) {
        let statefulCssText = this.cssText
        if (this.showDisabled && this.isDisabled()) {
          statefulCssText =
            isc.JGStyleTools.removeBackgroundColor(statefulCssText)
          statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
        } else if (this.getCanEdit() == false) {
          statefulCssText =
            isc.JGStyleTools.removeBackgroundColor(statefulCssText)
        }
        _style = _style + statefulCssText
      }
      return _style
    },
    //取消比较标题宽度与标题显示宽度
    valueClipped: function () {
      return true
    }
  })

  isc.ClassFactory.defineClass('V3CheckBoxItem', 'VCheckBoxItem')
  isc.V3CheckBoxItem.addMethods({
    isDisabled: function () {
      let target = this
      while (target) {
        if (target._disabled || target.disabled) {
          return true
        }
        target = target.parentElement || target.parentItem
        if (target && target.eventProxy) {
          target = target.eventProxy
        }
      }
      return false
    },
    getElementHTML: function () {
      let _style = this.invokeSuper(null, 'getElementHTML')
      _style = _style.substring(_style.indexOf('<INPUT'))

      // 处理多选组选项值布局方向，竖直、水平
      let _css = ''
      if (
        this.form &&
        (this.form.FlowDirection + '').toLowerCase() === 'vertical'
      )
        _css += 'float: none;'

      _style =
        '<div class=' +
        this.textBoxStyle +
        ' style="' +
        _css +
        '"><label style="vertical-align: middle;"><div>' +
        _style.substring(0, _style.indexOf('>')) +
        "/><span style='vertical-align: middle;'>" +
        this.getTitle() +
        '</span></div></label></div>'
      let _index = _style.lastIndexOf("style='")
      if (_index != -1) {
        if (this.form.ValueFontStyle) {
          _style =
            _style.substr(0, _index + 7) +
            isc.JGStyleTools.addStyle(
              '',
              isc.JGStyleTools.toFontStyle(this.form.ValueFontStyle)
            ) +
            _style.substr(_index + 7)
        }
      }
      return _style
    },
    getElementStyleHTML: function () {
      let _style = this.invokeSuper(null, 'getElementStyleHTML')
      let _style = isc.JGStyleTools.addLineHeightCssText(_style)
      let _index = _style.lastIndexOf("'")
      if (_index != -1) {
        if (this.cssText) {
          let statefulCssText = this.cssText
          if (this.showDisabled && this.isDisabled()) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
            statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
          } else if (this.getCanEdit() == false) {
            statefulCssText =
              isc.JGStyleTools.removeBackgroundColor(statefulCssText)
          }
          _style =
            _style.substr(0, _index) + statefulCssText + _style.substr(_index)
        }
      }
      return _style
    },
    getTextBoxStyle: function () {
      return isc.JGStyleTools.getItemStyleName(this)
    },
    updateState: function () {
      this.invokeSuper(null, 'updateState')
      let textBoxHandle = this.getFocusElement()
      if (textBoxHandle) {
        let cssObj = textBoxHandle.style
        if (cssObj) {
          if (this.isDisabled() && this.cssText) {
            cssObj.cssText += ';' + this.cssText + _$disableStyle
          } else {
            cssObj.cssText += ';' + this.cssText
          }
        }
      }
    },
    getTextBoxCSS: function () {
      let _style = this.invokeSuper(null, 'getTextBoxCSS')
      _style = isc.JGStyleTools.addLineHeightCssText(_style)
      if (this.cssText) {
        let statefulCssText = this.cssText
        if (this.showDisabled && this.isDisabled()) {
          statefulCssText =
            isc.JGStyleTools.removeBackgroundColor(statefulCssText)
          statefulCssText = isc.JGStyleTools.removeColor(statefulCssText)
        } else if (this.getCanEdit() == false) {
          statefulCssText =
            isc.JGStyleTools.removeBackgroundColor(statefulCssText)
        }
        _style = _style + statefulCssText
      }
      return _style
    },
    //取消比较标题宽度与标题显示宽度
    valueClipped: function () {
      return true
    }
  })

  isc.FormItem.addMethods({
    /**
     * 是否需要同步的ITEM,满足以下二条情况的一种都需要
     * 1 有name情况
     * 2 有itemFields
     */
    isSynItem: function () {
      return this.hasOwnProperty('name') || this.hasOwnProperty('itemFields')
        ? true
        : false
    }
  })
}
