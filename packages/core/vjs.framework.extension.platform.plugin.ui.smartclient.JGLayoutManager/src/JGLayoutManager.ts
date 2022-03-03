exports.initModule = function (sBox) {
  isc.ClassFactory.defineInterface('JGLayoutManager')

  isc.JGLayoutManager.addInterfaceProperties({
    _Layout: null
  })

  isc.JGLayoutManager.addInterfaceMethods({
    //初始化一个布局器
    initLayout: function () {
      if (this.LayoutType && this.LayoutType == 'BorderLayout') {
        this._Layout = this.createLayoutById(
          isc.WidgetUtils.genLayoutId(this.scopeId, this.getId())
        )
      }
    },

    //创建布局器
    createLayoutById: function (id) {
      let layout = isc.VLayout.create({
        autoDraw: false,
        ID: 'Layout_' + id,
        width: '100%',
        height: '100%',
        //backgroundColor : this.BackColor,
        layoutLeftMargin: this.LayoutLeftMargin,
        layoutTopMargin: this.LayoutTopMargin,
        layoutRightMargin: this.LayoutRightMargin,
        layoutBottomMargin: this.LayoutBottomMargin,
        contents: '',
        canFocus: true,
        members: [
          isc.VLayout.create({
            autoDraw: false,
            ID: 'Top_' + id,
            height: 0,
            contents: '',
            canFocus: true,
            members: []
          }),
          isc.HLayout.create({
            autoDraw: false,
            ID: 'Middle_' + id,
            height: 0,
            contents: '',
            canFocus: true,
            members: [
              isc.HLayout.create({
                autoDraw: false,
                ID: 'Left_' + id,
                width: 0,
                contents: '',
                canFocus: true,
                members: []
              }),
              isc.HLayout.create({
                autoDraw: false,
                ID: 'Center_' + id,
                width: 0,
                contents: '',
                canFocus: true,
                members: []
              }),
              isc.HLayout.create({
                autoDraw: false,
                ID: 'Right_' + id,
                width: 0,
                contents: '',
                canFocus: true,
                members: []
              })
            ]
          }),
          isc.VLayout.create({
            autoDraw: false,
            ID: 'Bottom_' + id,
            zIndex: 100002, //指定一个相对小的zIndex，当上面有其它控件(或滚动条)时不会遮挡
            overflow: isc.Canvas.HIDDEN, //高度设置很小时，防止溢出
            height: 0,
            canFocus: true,
            contents: '',
            members: []
          })
        ]
      })
      return layout
    }
  })
}
