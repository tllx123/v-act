/**
 * 页签头显示位置
 */
enum Aligment {
  /**
   * 顶部
   */
  Top = 'top',
  /**
   * 左边
   */
  Left = 'left',
  /**
   * 底部
   */
  Bottom = 'bottom',
  /**
   * 右边
   */
  Right = 'right'
}

const valueofAligment = function (val: string): Aligment {
  switch (val) {
    case 'top':
      return Aligment.Top
    case 'bottom':
      return Aligment.Bottom
    case 'left':
      return Aligment.Left
    case 'right':
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
  valueofAligment,
  ScrollbarDirection,
  valueofScrollbarDirection,
  TabAppearance,
  valueofTabAppearance
}
