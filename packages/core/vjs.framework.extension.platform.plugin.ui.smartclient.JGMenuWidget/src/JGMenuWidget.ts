exports.initModule = function (sBox) {
  /**
   * 实现下拉菜单出现的时候,根菜单保持选中状态
   */
  isc.ClassFactory.defineClass('JGDropMenu', 'Menu')
  isc.JGDropMenu.addProperties({
    //在源码的基础上加一个“cellHeight”属性，设置行高的，子菜单也要继承设置此行高
    submenuInheritanceMask: [
      // Allow the developer to specify some custom class for submenus (advanced!)
      'submenuConstructor',

      '_treeData', // Tree data model for tree menus

      'className',
      'submenuDelay',
      'submenuOffset',
      'defaultWidth',

      'backgroundColor',

      'tableStyle',
      'showRollOver',

      'baseStyle',

      'emptyMessage',

      'canDrag',
      'canAcceptDrop',
      'canReorderRecords',

      'useKeys',
      'showKeys',
      'showIcons',
      'showSubmenus',
      'submenuDirection',
      'cellPadding',
      'iconWidth',
      'iconHeight',
      'autoSetDynamicItems',
      'skinImgDir',
      'submenuImage',
      'submenuDisabledImage',
      'checkmarkImage',
      'checkmarkDisabledImage',
      'showHiliteInCells',
      'bodyProperties',
      'getSubmenuImage',
      'bodyDefaults',
      'menuConstructor',

      // actual behaviors
      'itemClick',
      'canSelectParentItems',

      // updated on the fly
      'childrenProperty',

      // A freeform object - can be used for custom overrides that need to percolate down
      // the submenu chain.
      'inheritedProperties',
      'cellHeight'
    ]
  })
  isc.JGDropMenu.addMethods({
    hide: function () {
      this.Super('hide', arguments)
      if (this._menuButton) {
        this._menuButton.setSelected(false)
        this._menuButton.setState(isc.StatefulCanvas.STATE_UP)
      }
    },
    show: function () {
      this.Super('show', arguments)
      if (this._menuButton) {
        this._menuButton.setSelected(true)
        //this._menuButton.setState(isc.StatefulCanvas.STATE_OVER);
      }
    }
  })

  isc.ClassFactory.defineClass('JGMenuWidget', 'JGBaseWidget')

  isc.JGMenuWidget.addProperties({
    //菜单项事件
    _itemListener: ['click'],
    //菜单类型
    MenuDataSourceTypeEnum: null
  })

  isc.JGMenuWidget.addMethods({
    //====绑定菜单项的点击事件
    _initListener: function () {
      this.Super('_initListener', arguments)
      let l = {}
      let itemListener = this._itemListener
      for (let i = 0, len = itemListener.length; i < len; i++) {
        l[itemListener[i]] = {}
      }
      this._itemListener = l
    },

    /**
     * 菜单项事件绑定
     * @param eventName 事件名称
     * @param handler 事件句柄
     * @param name 菜单项id
     */
    onItemEvent: function (eventName, handler, name) {
      let listeners = this._itemListener[eventName]
      if (listeners) {
        let l = listeners[name]
        if (!l) {
          l = []
          listeners[name] = l
          l.push(handler)
        }
        //l.push(handler);
      } else {
        throw Error('菜单项不支持' + eventName + '事件！')
      }
    },

    /**
     * 解除菜单项事件绑定
     * @param eventName 事件名称
     * @param name 菜单项id
     */
    unItemEvent: function (eventName, name) {
      let listeners = this._itemListener[eventName]
      if (listeners) {
        listeners[name] = []
      } else {
        throw Error('菜单项不支持' + eventName + '事件！')
      }
    },

    /**
     * 触发单击事件
     */
    _fireItemClickEvent: function (item) {
      this._callEvent(this, 'menuClick', item)
    },

    /**
     * 恢复禁用
     */
    _enabledItem: function (menu, name) {
      let menuItem = menu.getMenuItem(name)
      if (menuItem && menuItem.enabled != true) {
        menuItem.enabled = true
        menu.markForRedraw()
      }
    },

    /**
     * 禁用菜单
     */
    _disabledItem: function (menu, name) {
      let menuItem = menu.getMenuItem(name)
      if (menuItem && menuItem.enabled != false) {
        menuItem.enabled = false
        menu.markForRedraw()
      }
    },

    //菜单类型get/set
    getMenuDataSourceTypeEnum: function () {
      return this.MenuDataSourceTypeEnum
    },
    setMenuDataSourceTypeEnum: function (menuDataSourceTypeEnum) {
      this.MenuDataSourceTypeEnum = menuDataSourceTypeEnum
    },
    bindDataSource: function (dataSource) {
      if (this.MenuDataSourceTypeEnum == 'Query') {
        //查询方式，需要关联dataSource
        //不用设置数据源，否则菜单menu会显示列表的形式。只要用到setData接口就可以了
        //this._menu.setDataSource(dataSource,fields);
      }
    },
    destroy: function () {
      this._itemListener = null
      this.Super('destroy', arguments)
    }
  })
}
