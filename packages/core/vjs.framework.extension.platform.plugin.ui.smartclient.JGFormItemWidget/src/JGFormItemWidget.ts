exports.initModule = function (sBox) {
  isc.DynamicForm.addMethods({
    getValues: function () {
      this.updateFocusItemValue()
      let data = this.values
      if (data) {
        let fieldNames = this._getFieldNames()
        for (let attr in data) {
          if (!fieldNames.contains(attr)) {
            delete data[attr]
          }
        }
        return data
      } else {
        return null
      }
    },

    _getFieldNames: function () {
      let fieldNames = ['id']
      let items = this.getItems()
      for (let i = 0, len = items.length; i < len; i++) {
        let item = items[i]
        if (
          this.parentElement &&
          this.parentElement.items &&
          this.parentElement.items[0] &&
          this.parentElement.items[0].isA('MultiFieldFormItem')
        ) {
          let fields = this.parentElement.items[0].itemFields
          for (let attr in fields) {
            let fieldName = fields[attr]
            fieldNames.push(fieldName)
          }
        } else if (item.isA('MultiFieldFormItem')) {
          let fields = item.itemFields
          for (let attr in fields) {
            let fieldName = fields[attr]
            fieldNames.push(fieldName)
          }
        } else {
          let fieldName = item.name
          fieldNames.push(fieldName)
        }
      }
      return fieldNames
    },
    /**
     *重写错误显示方法，去除校验失败是控件无法失去焦点
     */
    showErrors: function (errors, hiddenErrors, suppressAutoFocus) {
      let undef
      if (hiddenErrors === undef) hiddenErrors = this.getHiddenErrors()
      if (errors === undef) errors = this.getErrors()
      if (
        errors &&
        !this.showInlineErrors &&
        (!this._errorItem ||
          this._errorItem.destroyed ||
          !this.items.contains(this._errorItem))
      ) {
        this.createErrorItem()
      }
      this.markForRedraw('Validation Errors Changed')
      if (!this.showInlineErrors) {
        this.delayCall('scrollIntoView', [0, 0], 100)
      }
      if (hiddenErrors) {
        if (errors == null || isc.isAn.emptyObject(errors)) return
        let returnVal
        if (this.handleHiddenValidationErrors) {
          returnVal = this.handleHiddenValidationErrors(errors)
        }
        if (returnVal == false) return
        let errorString =
          'Validation errors occurred for the following fields ' +
          'with no visible form items:'
        for (let fieldName in errors) {
          let fieldErrors = errors[fieldName]
          if (!isc.isAn.Array(fieldErrors)) fieldErrors = [fieldErrors]
          if (fieldErrors.length == 0) continue
          errorString += '\n' + fieldName + ':'
          for (let i = 0; i < fieldErrors.length; i++) {
            errorString += (i == 0 ? '- ' : '\n - ') + fieldErrors[i]
          }
        }
        this.logWarn(errorString, 'validation')
      }
    }
  })
  /**
   * 表单类控件的基类
   *
   * 该类中实现的功能有：
   * 1、增加对表单item标题的样式支持 titleCssText
   * 2、增加对表单样式的支持 formCssText
   * 3、表单类控件的抽象类 子类只需关注并重写_initItems方法即可
   * 4、子类中可以通过修改_formProperties属性来更新表单对象的属性
   * 5、子类中可以通过在_formMethods中定义方法，来修改表单对象的原生方法
   */

  // 定义v3ui表单类控件的抽象类
  isc.ClassFactory.defineClass('JGFormItemWidget', 'JGBaseWidget')

  // 定义v3ui控件的公共属性
  isc.JGFormItemWidget.addProperties({
    _form: null,
    _items: null,
    _formProperties: null,
    _formMethods: null,
    Top: 0,
    Left: 0,
    Width: 222,
    Height: 20,
    ReadOnly: false,
    Enabled: true,
    //Visible : true,
    SimpleChineseTitle: ''
  })

  // 定义v3ui控件抽象类的方法
  isc.JGFormItemWidget.addMethods({
    _initWidget: function () {
      this._beforeFormInit()
      this._items = this._initItems()

      let formProperties = {
        cellPadding: 0,
        width: this.Width,
        height: this.Height,
        titleAlign: this.LabelTextAlign,
        //tabIndex : this.TabIndex,
        errorOrientation: 'left',
        //canEdit :   !this.ReadOnly,
        //disabled :  !this.Enabled,
        //visibility : this.Visible ? isc.Canvas.VISIBLE:isc.Canvas.HIDDEN,
        //dataSource : this.TableName,
        items: this._items,
        /*下面四个属性控制标题的前缀和后缀*/
        titlePrefix: '',
        titleSuffix: '',
        requiredTitlePrefix: '',
        requiredTitleSuffix: ''
      }
      let fProperties = this._formProperties || {}
      isc.addProperties(formProperties, fProperties)

      // 表单可输入类控件统一使用DynamicForm包装
      this._form = isc.CustomDynamicForm.create(formProperties)

      // 必须添加到本控件的内部SC画布中，否则无法支持SC的父子控件层次关系
      this.addChild(this._form)

      this._afterFormInit()
      let formMethods = this._formMethods || {}
      this._addMethods(this._form, formMethods)
    },

    _referPartFunc: function () {
      this._referFuncs(this._form, [
        'setDataSource',
        'clearValues',
        'editRecord',
        'editNewRecord'
      ])
    },

    _initItems: function () {},

    _beforeFormInit: function () {},
    _afterFormInit: function () {},
    editRecord: null,
    clearValues: null,
    saveData: null,
    setDataSource: null,
    getAllFields: null,
    /**
     *数据同步
     */
    dataSyn: function () {
      if (this._form) {
        this._form.performImplicitSave(this._form, false)
      }
    },

    /**
     *键盘按下事件
     */
    _keyDownEvent: function () {
      if (event.keyCode == 13) {
        this.dataSyn()
      }
      let param = [this, 'keydown']
      for (let i = 0, len = arguments.length; i < len; i++) {
        param.push(arguments[i])
      }
      this._callEvent.apply(this, param)
    },

    /**
     * 获取焦点(支持光标跳转控制规则)
     */
    setControlFocus: function () {
      this._form.getItems()[0].focusInItem() //多个item的情况,默认跳到第一个item内
    },

    //放在容器中按布局排版时设置比例
    setPercentWidth: function (percentWidth) {
      this.Super('setPercentWidth', arguments)
      //this._form.setWidth(percentWidth);
      //this._form.getItems()[0].setWidth(percentWidth);
      this._form.setWidth('100%')
      if (this._form.colWidths) {
        if (this._form.colWidths.length == 1) {
          this._form.colWidths = ['*']
        }
        if (this._form.colWidths.length == 2) {
          this._form.colWidths = [this.TitleWidth, '*']
        }
        this._form.getItems()[0].setWidth('*')
      }
    },
    setPercentHeight: function (percentHeight) {
      this.Super('setPercentHeight', arguments)
      //this._form.setHeight(percentHeight);
      //this._form.getItems()[0].setHeight(percentHeight);
      this._form.setHeight('100%')
    },

    getFields: function () {
      return this._form.getItems()
    },

    //设置控件的index要以组件的index为前缀
    setIndexPreJoinComponentIndex: function (componentIndex) {
      let items = this._form.getItems()
      if (items && items.length > 0) {
        //var localIndex = items[0].getTabIndex();
        //var orginalIndex = localIndex + this.TabIndex;
        let orginalIndex = this.TabIndex
        items[0].setGlobalTabIndex(parseInt(componentIndex + orginalIndex))
      }
    },

    destroy: function () {
      let lastEventItem = isc.EH.lastEvent.itemInfo
        ? isc.EH.lastEvent.itemInfo.item
        : null
      let mouseDownEventItem =
        isc.EventHandler.mouseDownEvent &&
        isc.EventHandler.mouseDownEvent.itemInfo
          ? isc.EventHandler.mouseDownEvent.itemInfo.item
          : null
      let items = this._form ? this._form.items : null
      if ((lastEventItem || mouseDownEventItem) && items && items.length > 0) {
        for (let i = 0, len = items.length; i < len; i++) {
          let item = items[i]
          if (lastEventItem && item.ID == lastEventItem.ID) {
            isc.EH.lastEvent = {}
          }
          if (mouseDownEventItem && item.ID == mouseDownEventItem.ID) {
            isc.EventHandler.mouseDownEvent = {}
          }
        }
      }
      this._items = null
      //var form = this._form;
      //if(form){
      this._form = null
      //form.destroy();
      //}
      this.Super('destroy', arguments)
    }
  })
}
