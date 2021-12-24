import { forwardRef } from 'react'

import { Property } from 'csstype'

import {
  Box,
  Step,
  StepLabel,
  Stepper,
  StepperProps,
  styled,
  Typography
} from '@mui/material'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

export interface JGStepsProps extends StepperProps {
  bottom?: Property.Bottom
  height?: Property.Height
  left?: Property.Left
  right?: Property.Right
  top?: Property.Top
  width?: Property.Width
}

const JGStepsRoot = styled(Stepper, {
  name: 'JGSteps',
  slot: 'Root'
})(({ theme }) => ({}))

const JGSteps = forwardRef<HTMLDivElement, JGStepsProps>((inProps, ref) => {
  const props: StepperProps = {
    activeStep: inProps.activeStep ?? 1,
    alternativeLabel: inProps.alternativeLabel ?? false
  }
  const defaultSteps = ['流程开始', '流程过程', '流程结束']

  const context = useContext()
  const sx = inProps.sx || {}
  return (
    <Box
      sx={{
        ...sx,
        height: toHeight(inProps.height, context, '40px'),
        width: toWidth(inProps.width, context, '330px'),
        position: context ? context.position : 'absolute',
        top: inProps.top,
        right: inProps.right,
        left: inProps.left,
        bottom: inProps.bottom
      }}
    >
      <JGStepsRoot {...props} ref={ref}>
        {inProps.children ??
          defaultSteps.map((label) => (
            <Step key={label}>
              <StepLabel
                optional={<Typography variant="caption">{label}</Typography>}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
      </JGStepsRoot>
    </Box>
  )
})

JGSteps.defaultProps = {
  height: '40px',
  width: '330px'
}

export default JGSteps
