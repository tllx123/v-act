import { CSSProperties } from 'react'

import { Property } from 'csstype'

import { Box, BoxProps, styled } from '@mui/material'

/* 包装器属性 */
export interface JGActivityPanelProps extends BoxProps {
  /* ***************其它*******************/

  /**
   * 控件名称
   */
  alias?: string

  /**
   * 控件编码
   */
  code?: string

  /* ***************格式*******************/

  /**
   * 百分比高度
   */
  percentHeight?: Property.Height

  /**
   * 上边距
   */
  top?: Property.Top

  /**
   * 百分比宽度
   */
  percentWidth?: Property.Width

  /**
   * 是否显示
   */
  visible?: boolean

  /**
   * 界面顺序号
   */
  tabIndex?: number

  /**
   * 背景图片
   */
  imageValue?: string

  /**
   * 高度
   */
  height?: Property.Height

  /**
   * 背景色
   */

  backColor?: string

  /**
   * 左边距
   */
  left?: Property.Left

  /**
   * 图片Code
   */
  imageObject?: string

  /**
   * 泊靠
   */
  dock?: string

  /**
   * 宽度
   */
  width?: Property.Width

  /**
   * 宽度(优先)
   */
  multiWidth?: Property.Width

  /**
   * 高度(优先)
   */
  multiHeight?: Property.Height

  /********************数据**********************/

  /**
   * 备注
   */
  tagData?: string

  /**
   * 活动设置
   */
  activitySetting?: string
}

const getUrlInfo = function () {
  const urlInfo: { [key: string | number | symbol]: any } = {}
  let { origin, search } = window.location
  search = search.slice(1)
  urlInfo.origin = origin
  urlInfo.params = {}
  search.split('&').forEach((item) => {
    let param = item.split('=')
    urlInfo.params[param[0]] = param[1]
  })
  return urlInfo
}
const JGActivityPanel = function (props: JGActivityPanelProps) {
  /* 如果复选框组不可见，直接返回null */
  if (!props.visible) {
    return null
  }

  const activitySetting = props.activitySetting
    ? JSON.parse(props.activitySetting)
    : {}
  console.log(activitySetting)

  const { templates } = activitySetting

  /* 包装器样式 */
  const wrapStyles: CSSProperties = {
    width: props.multiWidth ? props.multiWidth : props.width,
    height: props.multiHeight ? props.multiHeight : props.height,
    fontSize: '14px',
    position: 'absolute',
    left: props.left,
    top: props.top,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }

  /* 编码(唯一) */
  const code = props.code
    ? props.code
    : `${Date.now()}${Math.random().toString(32).slice(2)}`

  const urlInfo = getUrlInfo()

  const StyledDivElement = styled('div')`
    display: inline-block;
    height: 58px;
    width: 58px;
    font-size: 9px;
    margin-left: 5px;
    margin-right: 5px;
    text-align: center;
    padding-top: 5px;
    border: 1px solid transparent;
    &:hover {
      border: 1px solid #cfcfcf;
      background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeDE9IjAuNSIgeTE9IjAuMCIgeDI9IjAuNSIgeTI9IjEuMCI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2Y2ZjdmYiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2UzZTNlMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==');
      background-size: 100%;
      background-image: -webkit-gradient(
        linear,
        50% 0%,
        50% 100%,
        color-stop(0%, #f6f7fb),
        color-stop(100%, #e3e3e3)
      );
      background-image: -moz-linear-gradient(top, #f6f7fb 0%, #e3e3e3 100%);
      background-image: -webkit-linear-gradient(top, #f6f7fb 0%, #e3e3e3 100%);
      background-image: linear-gradient(to bottom, #f6f7fb 0%, #e3e3e3 100%);
    }
  `

  return (
    <Box style={wrapStyles}>
      {templates.map((item: any) => {
        const { property, style } = item
        const propertyItem = property.find((item: any) => {
          return item.PropertyName === 'name'
        })
        /* src={`${urlInfo.origin}/itop/resources/${urlInfo.params.componentCode}_${style.drawImage}`} */
        /* src={`http://10.1.28.64:1969/itop/resources/zonatest_${style.drawImage}`} */
        return (
          <StyledDivElement key={item.flag}>
            <img
              src={`${urlInfo.origin}/itop/resources/${urlInfo.params.componentCode}_${style.drawImage}`}
              width="32"
              height="32"
              draggable="true"
            ></img>
            <div
              style={{
                marginTop: '-5px'
              }}
            >
              {propertyItem.DefaultValue}
            </div>
          </StyledDivElement>
        )
      })}
    </Box>
  )
}

JGActivityPanel.defaultProps = {
  left: 0,
  top: 0,
  height: '60px',
  width: '299px',
  visible: true,
  disabled: false
}

export default JGActivityPanel
export { JGActivityPanel }
