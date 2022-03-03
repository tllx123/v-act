exports.initModule = function (sBox) {
  /**
   * 样式处理工具类
   *
   * 调用方式:
   * var color = isc.JGStyleTools.parseColor("255,255,255")
   */
  isc.ClassFactory.defineClass('JGStyleTools')
  isc.JGStyleTools.addClassProperties({})
  isc.JGStyleTools.addClassMethods({
    /**
     * 解析开发系统颜色字符串。转换成为样式中用的颜色
     * @param colorValue
     * @return {String}
     *
     * 如：255,255,255
     * 返回：rgb(255,255,255)
     */
    toColor: function (colorValue) {
      if (colorValue.indexOf(',') == -1) {
        return colorValue.toString().toLowerCase()
      } else {
        //return 'rgb(' + colorValue + ')';
        //return RGBToHexs(colorValue);
        //RGB颜色转换为16进制
        let aColor = colorValue.split(',')
        //0, 255, 255, 255  四位前面为0的代表为透明色
        if (aColor.length == 4 && aColor[0].toString() == '0') {
          return 'transparent'
        }
        let strHex = '#'
        /*
                for(var i=0; i<aColor.length; i++){
                    var hex = Number(aColor[i]).toString(16);
                    if(hex == "0"){
                        hex = "00";
                    }
                    strHex += hex;
                }*/
        if (strHex.length > 0) {
          strHex = 'rgb(' + colorValue + ')'
        }
        return strHex
      }
    },

    /**
     * 转换字体标签样式信息 如果style如传,则新建一个json对象,否则,在原有json对象上增加
     *
     * @param fontStyle
     *            属性名前缀
     */
    toFontStyle: function (fontStyle) {
      let style = {}
      if (fontStyle.toString() == '') {
        return style
      }
      try {
        fontStyle = eval('(' + fontStyle + ')')
        // 标签样式
        if (fontStyle['Size'].toString() != '') {
          style['font-size'] = parseInt(fontStyle['Size']) + 'px'
        }
        if (fontStyle['Family'].toString() != '') {
          style['font-family'] = fontStyle['Family'].toString()
        }
        let textDecoration = ''
        if (fontStyle['Underline'].toString().toLocaleLowerCase() == 'true') {
          textDecoration += 'underline'
        }
        if (fontStyle['Strikeout'].toString().toLocaleLowerCase() == 'true') {
          textDecoration += ' line-through'
        }
        if (textDecoration != '') {
          style['text-decoration'] = textDecoration
        } else {
          style['text-decoration'] = 'none'
        }
        if (fontStyle['Bold'].toString().toLocaleLowerCase() == 'true') {
          style['font-weight'] = 'bold'
        } else {
          style['font-weight'] = 'normal '
        }
        if (fontStyle['Italic'].toString().toLocaleLowerCase() == 'true') {
          style['font-style'] = 'italic'
        } else {
          style['font-style'] = 'normal'
        }
      } catch (e) {
        //log("异常错误：字体设置不符合json数据规范，系统采用默认设置，请联系相关人员。字体属性值未fontStyle="+fontStyle+ "  详细错误信息如下："+e);
      }

      return style
    },

    /**
     * 把cssText串转为json对象
     */
    cssTextToObj: function (cssText) {
      let styleObj = {}
      if (cssText) {
        let styles = cssText.split(';')
        for (let i = 0, len = styles.length; i < len; i++) {
          let styleStr = styles[i]
          if (styleStr) {
            let style = styleStr.split(':')
            if (style[0] && style[1]) {
              let key = style[0].replace(/(^\s*)|(\s*$)/g, '') //去掉左右空格
              let value = style[1].replace(/(^\s*)|(\s*$)/g, '') //去掉左右空格
              styleObj[key] = value
            }
          }
        }
      }
      return styleObj
    },

    /**
     * 把cssText串转为json对象
     */
    objToCssText: function (styleObj) {
      let newCssText = ''
      for (let key in styleObj) {
        newCssText += key + ':' + styleObj[key] + ';'
      }
      return newCssText
    },

    /**
     * 样式叠加
     * @param styleCssText 原有样式
     * @param newStyleCssText 需要增加的样式
     * @return {*}
     */
    addStyle: function (styleCssText, styleObj) {
      let a = isc.JGStyleTools.cssTextToObj(styleCssText)
      if (typeof styleObj == 'string') {
        styleObj = isc.JGStyleTools.cssTextToObj(styleObj)
      }
      return isc.JGStyleTools.objToCssText(isc.addProperties({}, a, styleObj))
    },

    /**
     * 自动根据已有的cssText增加line-height的样式
     * 解决单行文本无法居中的问题。
     * 多行文本不要使用此方法
     * @param cssText
     */
    addLineHeightCssText: function (cssText) {
      return (
        cssText &&
        cssText.replace(
          /height[ ]*:[ ]*([0-9]*)px/i,
          'height:$1px;line-height:$1px'
        )
      ) //增加行高，文字直接居中
    },

    /**
     * 去掉样式中的背景色
     * @param cssText
     */
    removeBackgroundColor: function (cssText) {
      /*替换，会先替换background-color的样式然后替换color的样式，否则会把样式表弄乱*/
      return (
        cssText &&
        cssText.replace(
          /(^|;)[ ]*background\-color[ ]*:[ ]*(rgb\([^\)]*\)|#[a-f|A-F|0-9]*)/i,
          ''
        )
      )
    },

    /**
     * 去掉样式中的颜色
     * @param cssText
     */
    removeColor: function (cssText) {
      return (
        cssText &&
        cssText.replace(
          /(^|;)[ ]*color[ ]*:[ ]*(rgb\([^\)]*\)|#[a-f|A-F|0-9]*)/i,
          ''
        )
      )
    },

    /**
     * 获取item对象的样式名称
     * @param itemObj
     * @return {*}
     */
    getItemStyleName: function (itemObj) {
      if (!itemObj) {
        return 'normal'
      }
      let baseStyle = itemObj.textBoxStyle
      let hasErrors = itemObj.hasErrors()
      if (hasErrors) {
        return itemObj.hasFocus
          ? baseStyle + 'ErrorFocused'
          : baseStyle + 'Error'
      } else {
        if (itemObj.isDisabled()) {
          return baseStyle + 'Disabled'
        } else if (itemObj.getCanEdit() == false) {
          return baseStyle + 'ReadOnly'
        } else if (itemObj.hasFocus) {
          return baseStyle + 'Focused'
        } else {
          return baseStyle
        }
      }
    }
  })
}
