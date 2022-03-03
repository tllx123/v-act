exports.initModule = function (sBox) {
  /**
   *表单类控件基类
   * @author xiedh 2014-02-25
   */
  /**
   * 所有V3控件的基类。
   *
   * 此类自动处理的内容包括：
   * 1、设置控件可以获取焦点，且不显示焦点边框
   * 2、
   * 3、
   */
  isc.ClassFactory.defineClass('JGBaseFormWidget', 'Canvas')
  isc.ClassFactory.mixInInterface('JGBaseFormWidget', 'JGEventManager')

  isc.JGBaseFormWidget.addProperties({
    //控件Id
    id: '',
    //此Id在sc控件体系中不能使用，仅供框架调用
    widgetId: '',
    //域id
    scopeId: null,
    //组件id
    componentId: null,

    name: '',
    //字段绑定事件
    _fieldEvent: null,

    contents: '',

    //绑定数据源
    TableName: null,
    //按布局排版时用
    Dock: null,
    LayoutType: null,
    PercentWidth: null,
    PercentHeight: null,
    StaticLayoutSize: false,
    // 浮动框大小设置。
    hoverWidth: 250,
    //设置控件可以获取焦点，且不显示焦点边框
    canFocus: true, //是否可获取焦点
    showFocusOutline: false,

    //控件默认事件列表
    _defaultListener: ['mouseOver'],

    //表单类基类样式
    className: 'JGBaseFormWidget',

    //控件公布事件列表
    listener: []
  })

  isc.JGBaseFormWidget.addMethods({
    init: function () {
      this.id = isc.WidgetUtils.genWidgetRefId(this.scopeId, this.widgetId)

      this._fieldEvent = {}

      //TODO 初始化控件属性
      this._initProperties()

      this.Super('init', arguments)

      //初始化控件事件
      this._initListener()

      this._afterInitWidget()

      //触发控件mouseOver事件（目前用在浮动提示动态提示内容）
      this.mouseOver = function () {
        this.fireEvent('mouseOver')
      }

      //将控件实例放入控件管理器中
      isc.JGWidgetManager.putWidget(this.id, this)
    },

    /**
     * 初始化事件配置
     * 此方法会做如下转换以支持多次事件绑定
     * 例：['click','blur'] -> {'click':[这里将存放事件触发的handler],'blur':[]}
     */
    _initListener: function () {
      let l = {}
      this.listener = this.listener.concat(this._defaultListener)
      for (let i = 0, len = this.listener.length; i < len; i++) {
        l[this.listener[i]] = []
      }
      this.listener = l
    },

    /**
     * 初始化控件
     */
    _initWidget: function () {},

    /**
     * 控件初始化后执行函数
     */
    _afterInitWidget: function () {},

    /**
     * 覆盖目标类的的方法
     */
    _addMethods: function (des, source) {
      for (let func in source) {
        des[func] = source[func]
      }
    },

    /**
     *触发控件事件
     * @param target 事件目标，即事件的宿主
     * @param eventName 事件名称
     * @param ...Object 事件参数
     */
    fireEvent: function (eventName) {
      let eventHandler = this.listener[eventName]
      if (eventHandler && eventHandler.length > 0) {
        let param = []
        for (let i = 1, len = arguments.length; i < len; i++) {
          param.push(arguments[i])
        }
        for (let j = 0, l = eventHandler.length; j < l; j++) {
          let handler = eventHandler[j]
          handler.apply(this, param)
        }
      }
    },

    /**
     * 获取控件定义Id，提供给框架调用
     */
    getId: function () {
      return this.widgetId
    },

    destroy: function () {
      this.mouseOver = null
      this.listener = null
      this._Layout = null
      isc.JGWidgetManager.destroy(this.id)
      let childrenWidgets = this.childrenWidgets
      if (childrenWidgets) {
        this.childrenWidgets = null
        /*for(var i=0,len=childrenWidgets.length;i<len;i++){
                    var widget = childrenWidgets[i];
                    if(widget){
                        widget.parentWidget = null;
                        widget.destroy();
                    }
                }*/
      }
      this.Super('destroy', arguments)
    },

    /**
     * 获取控件属性
     * @param propertyName 属性名称
     */
    getProperty: function (propertyName) {
      let fun = this['get' + propertyName]
      if (
        typeof fun == 'function' ||
        typeof (fun = this['is' + propertyName]) == 'function'
      ) {
        let param = []
        for (let i = 1, len = arguments.length; i < len; i++) {
          param.push(arguments[i])
        }
        return fun.apply(this, param)
      }
    },

    /**
     * 设置控件属性
     * @param propertyName 属性名称
     * @param propertyValue 属性值
     */
    setProperty: function (propertyName, propertyValue) {
      let fun = this['set' + propertyName]
      if (typeof fun == 'function') {
        let param = []
        for (let i = 1, len = arguments.length; i < len; i++) {
          param.push(arguments[i])
        }
        return fun.apply(this, param)
      } else {
        throw Error(this.getClassName() + '不存在[' + propertyName + ']属性!')
      }
    },

    /**
     * 设置浮动提示
     * @param tips 提示内容
     */
    setTips: function (tips) {
      // 表单类
      if (this.getItems().length > 0) {
        this.getItems()[0].setPrompt(tips)
        if (this.getItems()[0].isA('MultiFieldFormItem')) {
          let items = this.children[0].getItem()
          items.setPrompt(tips)
          if (items.hasOwnProperty('getItems')) {
            for (let i = 0; i < items.length; i++) {
              items[i].setPrompt(tips)
            }
          }
        }
      } else {
        this.setPrompt(tips)
        if (this.children.length > 0) {
          this.children[0].setPrompt(tips)
        }
      }
    },

    /**
     * 设置显示状态
     * @param visible 显示状态
     */
    setVisible: function (visible) {
      this.Visible = visible
      if (visible) {
        this.show()
      } else {
        this.hide()
      }
    },

    /**
     * 获取显示状态
     * @return 显示状态
     */
    getVisible: function () {
      return this.Visible
    },

    /**
     * 获取使能状态
     * @return 使能状态
     */
    isEnabled: function () {
      return this.Enabled
    },

    /**
     * 设置使能状态
     * @param enable 使能
     * @return
     */
    setEnabled: function (enable) {
      this.Enabled = enable
      this.setDisabled(!this.Enabled)
      this.redraw()
    },

    /**
     * 设置使能状态
     * @param enable 使能
     * @return
     */
    setHandleReadOnly: function (newState) {
      for (let i = 0, num = this.items.length; i < num; i++) {
        this.items[i].setCanEdit(!newState)
      }
    },

    /**
     * 设置绑定数据源名称
     */
    setTableName: function (tableName) {
      this.TableName = tableName
    },

    /**
     * 获取绑定数据源名称
     */
    getTableName: function () {
      return this.TableName
    },

    //布局属性get/set
    getDock: function () {
      return this.Dock
    },
    setDock: function (dock) {
      this.Dock = dock
    },
    getLayoutType: function () {
      return this.LayoutType
    },
    setLayoutType: function (layoutType) {
      this.LayoutType = layoutType
    },
    getPercentWidth: function () {
      return this.PercentWidth
    },
    setPercentWidth: function (percentWidth) {
      this.setWidth(percentWidth)
    },
    getPercentHeight: function () {
      return this.PercentHeight
    },
    setPercentHeight: function (percentHeight) {
      //Form类框高度不设置为可变
      //this.setHeight(percentHeight);
    },
    getStaticLayoutSize: function () {
      return this.StaticLayoutSize
    },
    setStaticLayoutSize: function (staticLayoutSize) {
      this.StaticLayoutSize = staticLayoutSize
    },

    addWidgets: function (parent, children) {
      if (!parent.childrenWidgets) parent.childrenWidgets = []
      parent.childrenWidgets.add(children)

      children.parentWidget = parent
    },

    //当父亲设置为只读时,儿子也设置为只读
    parentReadOnly: function (newState) {
      if (this.ReadOnly) return
      this._ReadOnly = newState
      if (this.setHandleReadOnly) {
        this.setHandleReadOnly(newState)
      }
      if (this.childrenWidgets)
        this.childrenWidgets.map('parentReadOnly', newState)
    },
    //返回控件真实状态
    isReadOnly: function () {
      return this._ReadOnly || this.ReadOnly
    },

    //通用的处理方法,真正的实现放在setHandleReadOnly
    setReadOnly: function (newState) {
      //验证参数是否为布尔类型，
      if (!isc.isA.Boolean(newState)) {
        return //如果不是布尔类型的话
      }
      //如果当前状态与需要设置的状态一样，直接返回
      if (this.ReadOnly == newState) {
        return
      }
      //下面是修改状态，不存在真实状态与设置状态是相同

      if (newState == true) {
        //如果参数为true时，即设置该控件为只读
        if (this.isReadOnly()) {
          //如果控件现在为只读时
          this.ReadOnly = newState //设置ReadOnly属性并直接返回
          return
        } else {
          if (this.setHandleReadOnly) {
            //设置该控件为只读状态
            this.setHandleReadOnly(newState)
          }
          this._ReadOnly = newState //设置该控件的真实状态

          if (this.childrenWidgets) {
            //设置该控件的孩子为只读状态
            this.childrenWidgets.map('parentReadOnly', newState)
          }
          this.ReadOnly = newState //设置该控件的状态
        }
      } else {
        if (this.isReadOnly()) {
          //如果控件现在为只读时
          if (this.parentWidget && this.parentWidget.isReadOnly()) {
            //如果父亲状态为只读时
            this.ReadOnly = newState //设置该控件ReadOnly属性并直接返回
            return
          } else {
            if (this.setHandleReadOnly) {
              //设置该控件为只读状态
              this.setHandleReadOnly(newState)
            }
            this._ReadOnly = newState //设置该控件的真实状态

            if (this.childrenWidgets) {
              //设置该控件的孩子为只读状态
              this.childrenWidgets.map('parentReadOnly', newState)
            }
            this.ReadOnly = newState //设置该控件的状态
          }
        } else {
          return
        }
      }
    },

    parentDisabled: function (newState) {
      if (this.disabled) return
      this._disabled = newState
      if (this.setHandleDisabled) this.setHandleDisabled(newState)
      if (this.childrenWidgets)
        this.childrenWidgets.map('parentDisabled', newState)
    },
    isDisabled: function () {
      let target = this
      while (target) {
        if (target._disabled || target.disabled) {
          return true
        }
        target = target.parentElement
        if (target && target.eventProxy) {
          target = target.eventProxy
        }
      }
      return false
    },
    setDisabled: function (newState) {
      if (!isc.isA.Boolean(newState)) return
      if (this.disabled == newState) return
      if (newState == true)
        if (this.isDisabled()) {
          this.disabled = newState
          return
        } else {
          if (this.setHandleDisabled) this.setHandleDisabled(newState)
          this._disabled = newState
          this.disabled = newState
          if (this.childrenWidgets)
            this.childrenWidgets.map('parentDisabled', newState)
        }
      else if (this.isDisabled())
        if (this.parentWidget && this.parentWidget.isDisabled()) {
          this.disabled = newState
          return
        } else {
          if (this.setHandleDisabled) this.setHandleDisabled(newState)
          this._disabled = newState
          this.disabled = newState
          if (this.childrenWidgets)
            this.childrenWidgets.map('parentDisabled', newState)
        }
      else return
    },
    //重写方法，打印预览时不要蓝色的背景色，（sc中不是绝对定位时，是默认有背景色的）
    getPrintTagStartAttributes: function (absPos) {
      if (absPos) {
        return (
          " style='position:absolute;left:" +
          this.getLeft() +
          'px;top:' +
          this.getTop() +
          'px;width:' +
          this.getWidth() +
          'px;height:' +
          this.getHeight() +
          "px;' "
        )
        // If we have absolutely positioned children:
        // - we're going to have to be relatively positioned so the abs-pos children are
        //   rendered within us
        // - we're going to have to have explicit sizing so we take up the right amount of space
        //   in document flow.
        // Handle this by writing out width/height set as calculated scrollWidth/height.
      } else if (this.printChildrenAbsolutelyPositioned) {
        return (
          " style='position:relative;width:" +
          this.getScrollWidth() +
          'px;height:' +
          this.getScrollHeight() +
          "px;' "
        )
      }

      return null
    },

    /**
     * 控件打印预览
     */
    controlPrintPreview: function (controls) {
      //当页面有滚动条时，把它滚到0,0，因为弹出的打印窗体默认是在0,0上的
      if (
        isc.Page &&
        (isc.Page.getScrollTop() > 0 || isc.Page.getScrollLeft() > 0)
      ) {
        isc.Page.scrollTo(0, 0)
      }
      //isc.Canvas.showPrintPreview(controls,{"absPos":true});
      isc.Canvas.showPrintPreview(controls)
    },

    /**
     * 控件打印
     */
    controlPrint: function (controls) {
      //isc.Canvas.printComponents(controls,{"absPos":true});
      isc.Canvas.printComponents(controls)
    },

    /**
     * 获取焦点(支持光标跳转控制规则)
     */
    setControlFocus: function () {
      this.focus()
    },

    getFieldEvent: function () {
      return this._fieldEvent
    },

    setScopeId: function (scopeId) {
      this.scopeId = scopeId
    },

    getScopeId: function () {
      return this.scopeId
    },

    setComponentId: function (componentId) {
      this.componentId = componentId
    },

    getComponentId: function () {
      if (this.componentId) {
        return this.componentId
      } else if (this.scopeId) {
        let lastIndex = this.scopeId.lastIndexOf('_')
        let compId = this.scopeId.substring(lastIndex + 1, this.scopeId.length)
        this.componentId = compId
        return compId
      } else {
        return null
      }
    },

    show: function () {
      if (this._needToBuildRelation === true) {
        this.buildRelation()
      }
      this.Super('show', arguments)
    },

    getCanvasWidget: function () {},
    /**
     *构建父子关系
     */
    buildRelation: function () {
      if (!this.getVisible()) {
        //如果面板为隐藏，则其子控件暂不构建父子关系
        this._needToBuildRelation = true
        return
      }
      let componentId = this.getComponentId()
      let componentIndex = isc.JGComponent.getComponentIndex(componentId)
      let childrenIds = isc.WidgetContext.getChildrenIds(
        this.scopeId,
        this.widgetId
      )
      if (childrenIds && childrenIds.length > 0) {
        let LayoutType = this.getProperty('LayoutType')
        if (LayoutType && LayoutType == 'BorderLayout') {
          //取用布局排版
          let topTotalPercent = 0,
            bottomTotalPercent = 0,
            leftTotalPercent = 0,
            rightTotalPercent = 0,
            centerTotalPercent = 0
          let topTotal = 0,
            bottomTotal = 0,
            leftTotal = 0,
            rightTotal = 0
          for (let i = 0, childId; (childId = childrenIds[i]); i++) {
            let childRefId = isc.WidgetUtils.genWidgetRefId(
              this.scopeId,
              childId
            )
            let child = isc.JGWidgetManager.getWidget(childRefId)
            if (!child) continue
            //布局属性
            let Dock = child.getProperty('Dock')
            let PercentWidth = child.getProperty('PercentWidth')
            let PercentHeight = child.getProperty('PercentHeight')
            let Width = child.getProperty('Width')
            let Height = child.getProperty('Height')
            //是否固定高或固定宽，Top/Bottom时是否固定高，Left/Right时是否固定宽
            let StaticLayoutSize = child.getProperty('StaticLayoutSize')
            switch (Dock) {
              case 'Top':
                var top = this._Layout.getMember(
                  'Top_' +
                    isc.WidgetUtils.genLayoutId(this.scopeId, this.getId())
                )
                child.setPercentWidth('100%')
                if (!StaticLayoutSize) {
                  child.setPercentHeight('100%')
                }
                top.addMember(child)
                topTotalPercent = topTotalPercent + parseFloat(PercentHeight)
                topTotal = topTotal + Height
                if (StaticLayoutSize) {
                  top.setHeight(topTotal)
                } else {
                  top.setHeight(topTotalPercent + '%')
                }
                break

              case 'Bottom':
                var bottom = this._Layout.getMember(
                  'Bottom_' +
                    isc.WidgetUtils.genLayoutId(this.scopeId, this.getId())
                )
                child.setPercentWidth('100%')
                if (!StaticLayoutSize) {
                  child.setPercentHeight('100%')
                }
                bottom.addMember(child)
                bottomTotalPercent =
                  bottomTotalPercent + parseFloat(PercentHeight)
                bottomTotal = bottomTotal + Height
                if (StaticLayoutSize) {
                  bottom.setHeight(bottomTotal)
                } else {
                  bottom.setHeight(bottomTotalPercent + '%')
                }
                break

              case 'Left':
                var middle = this._Layout.getMember(
                  'Middle_' +
                    isc.WidgetUtils.genLayoutId(this.scopeId, this.getId())
                )
                var left = middle.getMember(
                  'Left_' +
                    isc.WidgetUtils.genLayoutId(this.scopeId, this.getId())
                )
                if (!StaticLayoutSize) {
                  child.setPercentWidth('100%')
                }
                child.setPercentHeight('100%')
                left.addMember(child)
                leftTotalPercent = leftTotalPercent + parseFloat(PercentWidth)
                leftTotal = leftTotal + Width
                if (StaticLayoutSize) {
                  left.setWidth(leftTotal)
                } else {
                  left.setWidth(leftTotalPercent + '%')
                }
                middle.setHeight(PercentHeight)
                break

              case 'Right':
                var middle = this._Layout.getMember(
                  'Middle_' +
                    isc.WidgetUtils.genLayoutId(this.scopeId, this.getId())
                )
                var right = middle.getMember(
                  'Right_' +
                    isc.WidgetUtils.genLayoutId(this.scopeId, this.getId())
                )
                if (!StaticLayoutSize) {
                  child.setPercentWidth('100%')
                }
                child.setPercentHeight('100%')
                right.addMember(child)
                rightTotalPercent = rightTotalPercent + parseFloat(PercentWidth)
                rightTotal = rightTotal + Width
                if (StaticLayoutSize) {
                  right.setWidth(rightTotal)
                } else {
                  right.setWidth(rightTotalPercent + '%')
                }
                middle.setHeight(PercentHeight)
                break

              case 'Fill':
                var middle = this._Layout.getMember(
                  'Middle_' +
                    isc.WidgetUtils.genLayoutId(this.scopeId, this.getId())
                )
                var center = middle.getMember(
                  'Center_' +
                    isc.WidgetUtils.genLayoutId(this.scopeId, this.getId())
                )
                child.setPercentWidth('100%')
                child.setPercentHeight('100%')
                center.addMember(child)
                center.setWidth(PercentWidth)
                middle.setHeight(PercentHeight)
                break

              default:
                this.addChild(child)
                break
            }
            //子控件的index要以组件的index为前缀
            if (child.setIndexPreJoinComponentIndex) {
              child.setIndexPreJoinComponentIndex(componentIndex)
            }
            child.buildRelation()
            //添加关系（只读使能）
            this.addWidgets(this, child)
            if (this.ReadOnly || this.isReadOnly()) {
              child.parentReadOnly(true)
            }
            if (this.Enabled == false || this.isDisabled()) {
              child.parentDisabled(true)
            }
          }
          //当没有Fill控件时，保证Middle，Center占有空白值
          let middle = this._Layout.getMember(
            'Middle_' + isc.WidgetUtils.genLayoutId(this.scopeId, this.getId())
          )
          if (middle.getHeight() == 0) {
            middle.setHeight(100 - topTotalPercent - bottomTotalPercent + '%')
          }
          let center = middle.getMember(
            'Center_' + isc.WidgetUtils.genLayoutId(this.scopeId, this.getId())
          )
          if (center.getWidth() == 0) {
            center.setWidth(100 - leftTotalPercent - rightTotalPercent + '%')
          }
        } else {
          //不用布局排版
          for (let i = 0, childId; (childId = childrenIds[i]); i++) {
            let childRefId = isc.WidgetUtils.genWidgetRefId(
              this.scopeId,
              childId
            )
            let child = isc.JGWidgetManager.getWidget(childRefId)
            if (!child) continue
            this.addChild(child)
            //添加关系（只读使能）
            if (this.ReadOnly || this.isReadOnly()) {
              child.parentReadOnly(true)
            }
            if (this.Enabled == false || this.isDisabled()) {
              child.parentDisabled(true)
            }
            //子控件的index要以组件的index为前缀
            if (child.setIndexPreJoinComponentIndex) {
              child.setIndexPreJoinComponentIndex(componentIndex)
            }
            this.addWidgets(this, child)
            child.buildRelation()
          }
          this._needToBuildRelation = false
        }
      }
    },

    revert: function (isRe) {
      if (this.listener) {
        for (let eventName in this.listener) {
          this.listener[eventName] = []
        }
      }
      if (isRe !== false) {
        let childrenIds = isc.WidgetContext.getChildrenIds(
          this.scopeId,
          this.widgetId
        )
        if (childrenIds && childrenIds.length > 0) {
          for (let i = 0, childId; (childId = childrenIds[i]); i++) {
            let childRefId = isc.WidgetUtils.genWidgetRefId(
              this.scopeId,
              childId
            )
            let child = isc.JGWidgetManager.getWidget(childRefId)
            if (!child) continue
            if (child.revert) {
              child.revert()
            }
          }
        }
      }
    },

    un: function (target, eventNames) {
      if (target && eventNames && eventNames.length > 0) {
        for (let i = 0, len = eventNames.length; i < len; i++) {
          let eventName = eventNames[i]
          target[eventName] = null
        }
      }
    },
    /*getHandle : function () {
            var returnVal = this.Super("getHandle",arguments);
            var index = 0;
            var me = this;
            if(this.AutoTest){
                if(returnVal){
                    setDOMProperty(returnVal,me);
                }
                function setDOMProperty(handle,me){
                    if(handle.setAttribute){
                        handle.setAttribute("autoTest",me.Code+"_"+index);
                        index++;
                    }
                    var childNodes = handle.childNodes;
                    if(childNodes && childNodes.length > 0){
                        for ( var i = 0; i < childNodes.length; i++) {
                            setDOMProperty(childNodes[i],me);
                        }
                    }
                }
            }
            return returnVal;
        },*/
    redraw: function () {
      this.Super('redraw', arguments)
      //this.getHandle();
    }
  })
}
