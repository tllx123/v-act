import React, { CSSProperties } from 'react'

import { Property } from 'csstype'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'

import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import { Box, BoxProps, Button, MobileStepper } from '@mui/material'
import { Height, Width } from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)
interface JGImagePlayProps extends BoxProps {
  /**
   * 左边距
   */
  left?: Property.Left
  /**
   * 上边距
   */
  top?: Property.Top
  /**
   * 高度
   */
  multiHeight?: Height
  /**
   * 宽度
   */
  multiWidth?: Width
}

const images = [
  {
    imgPath:
      // 'http://www.yindangu.com/itop/common/images/defaultImg.png'
      'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60'
  },
  {
    imgPath:
      // 'http://www.yindangu.com/itop/common/images/defaultImg.png'
      'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60'
  },
  {
    imgPath:
      // 'http://www.yindangu.com/itop/common/images/defaultImg.png'
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80'
  },
  {
    imgPath:
      // 'http://www.yindangu.com/itop/common/images/defaultImg.png'
      'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60'
  }
]

const JGImagePlay = function (props: JGImagePlayProps) {
  const context = useContext()
  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')

  const [activeStep, setActiveStep] = React.useState(0)
  const maxSteps = images.length

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
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

  return (
    <Box style={wrapStyles}>
      <AutoPlaySwipeableViews
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {images.map((step, index) => (
          <div>
            {Math.abs(activeStep - index) <= 2 ? (
              <Box
                component="img"
                sx={{
                  height: '120px',
                  display: 'block',
                  maxWidth: 400,
                  overflow: 'hidden',
                  width: '100%'
                }}
                src={step.imgPath}
              />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            {/* {theme.direction === 'rtl' ? ( */}
            <KeyboardArrowLeft />
            {/* // ) : (
            //   <KeyboardArrowRight />
            // )} */}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {/* {theme.direction === 'rtl' ? ( */}
            <KeyboardArrowRight />
            {/* ) : (
              <KeyboardArrowLeft />
            )} */}
            Back
          </Button>
        }
      />
    </Box>
  )
}

JGImagePlay.defaultProps = {
  left: '0px',
  top: '0px',
  multiHeight: '170px',
  multiWidth: '263px'
}

export default JGImagePlay
export { JGImagePlay, type JGImagePlayProps }
