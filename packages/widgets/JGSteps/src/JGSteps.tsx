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

interface JGStepsProps extends StepperProps {
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

  return (
    <Box
      sx={{
        position: 'relative',
        width: inProps.width,
        top: inProps.top,
        right: inProps.right,
        left: inProps.left,
        height: inProps.height,
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

export default JGSteps
