/**
 * 页签头显示位置
 */
enum Aligment {
  /**
   * 顶部
   */
  Top = 'Top',
  /**
   * 左边
   */
  Left = 'Left',
  /**
   * 底部
   */
  Bottom = 'Bottom',
  /**
   * 右边
   */
  Right = 'Right'
}

const valueofAligment = function (val: string): Aligment {
  switch (val) {
    case 'Top':
      return Aligment.Top
    case 'Bottom':
      return Aligment.Bottom
    case 'Left':
      return Aligment.Left
    case 'Right':
      return Aligment.Right
    default:
      throw Error(
        `页签头显示位置不正确！可选择：top,bottom,left,right,当前值：${val}`
      )
  }
}

/**
 * 滚动条位置
 */
enum ScrollbarDirection {
  /**
   * 垂直
   */
  Vertical = 'vertical',

  /**
   * 水平
   */
  Horizontal = 'horizontal',

  /**
   * 垂直及水平
   */
  Both = 'both'
}

const valueofScrollbarDirection = function (val: string): ScrollbarDirection {
  switch (val) {
    case 'vertical':
      return ScrollbarDirection.Vertical
    case 'horizontal':
      return ScrollbarDirection.Horizontal
    case 'both':
      return ScrollbarDirection.Both
    default:
      throw Error(
        `滚动条位置不正确！可选择：vertical,horizontal,both,当前值：${val}`
      )
  }
}

/**
 * 页签外观
 */
enum TabAppearance {
  /**
   * 简洁
   */
  Line = 'line',
  /**
   * 卡式外框
   * @todo
   */
  Card = 'card'
}

const valueofTabAppearance = function (val: string): TabAppearance {
  switch (val) {
    case 'line':
      return TabAppearance.Line
    case 'card':
      return TabAppearance.Card
    default:
      throw Error(`页签外观不正确！可选择：line,card,当前值：${val}`)
  }
}

export {
  Aligment,
  ScrollbarDirection,
  TabAppearance,
  valueofAligment,
  valueofScrollbarDirection,
  valueofTabAppearance
}
