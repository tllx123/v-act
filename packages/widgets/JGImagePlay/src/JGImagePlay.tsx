import React, { CSSProperties } from 'react'

import { Property } from 'csstype'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import MobileStepper from '@mui/material/MobileStepper'
import { Height, Width } from '@v-act/schema-types'
import { EntityRecord, useContext } from '@v-act/widget-context'
import {
  getComponentResPath,
  getEntityDatas,
  toHeight,
  toWidth
} from '@v-act/widget-utils'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)
interface JGImagePlayProps extends BoxProps {
  /** 其他 */
  /**
   * 控件名称
   */
  alias?: string

  /** 格式 */
  /**
   * 图片布局方式
   */
  imageLayout?: string
  /**
   * 上边距
   */
  top?: Property.Top
  /**
   * 左边距
   */
  left?: Property.Left
  /**
   * 高度
   */
  multiHeight?: Height
  /**
   * 宽度
   */
  multiWidth?: Width
  /**
   * 播放间隔(秒)
   */
  swiInterval?: number
  /**
   * 显示页码
   */
  paginationVisible?: boolean

  /** 数据 */
  /**
   * 图片标识字段
   */
  imageField?: string
  /**
   * 图片名称字段
   */
  imageNameField?: string
  /**
   * 实体
   */
  tableName?: string | null
  /**
   * 构件Code
   */
  componentCode?: string

  /**
   * 点击事件
   */
  click?: Function
}

const JGImagePlay = function (props: JGImagePlayProps) {
  const context = useContext()
  // console.log(context, 'JGImagePlay======context')
  //图片url生成
  let images: EntityRecord[] = []
  if (props.tableName) {
    images = getEntityDatas(props.tableName, context) || []
  }

  images.forEach(function (item) {
    ;(item.imgPath =
      item.ImageField && (props.componentCode ? props.componentCode : '')
        ? getComponentResPath(
            item.ImageField as string,
            props.componentCode ? props.componentCode : ''
          )
        : 'http://www.yindangu.com/itop/common/images/defaultImg.png'),
      (item.imgLabel = item.ImageDescField)
  })

  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')
  const [activeStep, setActiveStep] = React.useState(0)

  //是否显示页码
  const maxSteps = images.length

  //点击图片打开窗口
  const handleClick = function () {
    props.click && props.click()
  }

  //下一页
  const handleNext = (event: any) => {
    event.stopPropagation()
    if (activeStep !== maxSteps - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  //上一页
  const handleBack = (event: any) => {
    event.stopPropagation()
    if (activeStep !== 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }
  }

  const handleStepChange = (step: number) => {
    setActiveStep(step)
  }

  const wrapStyles: CSSProperties = {
    border: '1px solid #E8EAEC',
    width: width,
    height: height,
    alignItems: 'center',
    position: context.position,
    left: props.left,
    top: props.top
  }

  const labelStyle: CSSProperties = {
    width: '100%',
    height: '40px',
    backgroundColor: 'rgb(0,0,0,0.3)',
    position: 'absolute',
    bottom: '0px',
    display: 'flex',
    justifyContent: 'space-between',
    color: 'white',
    lineHeight: '40px'
  }

  const labelLeft: CSSProperties = {
    marginLeft: '10px'
  }

  const labelRight: CSSProperties = {
    marginRight: '10px',
    display: props.paginationVisible ? '' : 'none'
  }

  const buttonStyle: CSSProperties = {
    background: 'black',
    opacity: '0.5',
    color: 'white',
    minHeight: '60px',
    padding: 0,
    minWidth: '38px'
  }

  //轮播时间处理
  const times: number = (props.swiInterval ? props.swiInterval : 5) * 1000
  // console.log(props, 'sssssssssssssssssssss')

  return (
    <Box style={wrapStyles}>
      <div style={{ position: 'relative' }}>
        {/* 轮播图 */}
        <AutoPlaySwipeableViews
          index={activeStep}
          onChangeIndex={handleStepChange}
          interval={times}
          enableMouseEvents
        >
          {images.map((step, index) => (
            <div style={{ position: 'relative' }}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Box
                  component="img"
                  sx={{
                    height: '100%',
                    display: 'block',
                    maxWidth: width,
                    maxHeight: height,
                    overflow: 'hidden',
                    margin: '0 auto',
                    width: props.imageLayout == 'Stretch' ? '100%' : 'auto' //图片布局(拉伸 or 自适应)
                  }}
                  src={step.imgPath as string}
                />
              ) : null}
            </div>
          ))}
        </AutoPlaySwipeableViews>
        <div style={labelStyle}>
          <span style={labelLeft}>{images[activeStep]?.imgLabel}</span>
          <span style={labelRight}>
            {activeStep + 1}/{maxSteps}
          </span>
        </div>
        {/* 步进条 */}
        <MobileStepper
          onClick={handleClick}
          sx={{
            'width': '100%',
            'background': 'none',
            'position': 'absolute',
            'top': 0,
            'bottom': 0,
            'padding': 0,
            'opacity': 0,

            '&:hover': {
              opacity: 1
            }
          }}
          steps={0}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              style={buttonStyle}
              sx={{
                borderRadius: '4px 0 0 4px'
              }}
              size="small"
              onClick={handleNext}
            >
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              style={buttonStyle}
              sx={{
                borderRadius: '0 4px 4px 0'
              }}
              size="small"
              onClick={handleBack}
            >
              <KeyboardArrowLeft />
            </Button>
          }
        />
      </div>
    </Box>
  )
}

JGImagePlay.defaultProps = {
  left: '0px',
  top: '0px',
  multiHeight: '170px',
  multiWidth: '263px',
  swiInterval: 5,
  paginationVisible: true
}

export default JGImagePlay
export { JGImagePlay, type JGImagePlayProps }
