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
import { getEntityDatas, toHeight, toWidth } from '@v-act/widget-utils'

export interface JGStepsProps extends StepperProps {
  bottom?: Property.Bottom
  height?: Property.Height
  left?: Property.Left
  right?: Property.Right
  top?: Property.Top
  width?: Property.Width
  tableName?: string | null
  columnName?: string | null
  stepDownSource: {
    DataSourceSetting: {
      DataConfig: {
        DefaultSaveColumn: string
        DefaultShowColumn: string
        SourceType: string
        SourceID: string
        SourceName: string
        MapTable: string
        SaveColumn: string
        ShowColumn: string
        SortField: string
        SortType: string
        DescColumn: string
        StatusColumn: string
        MaxRecCount: number
        QueryField: string
        QueryMethod: string
        IsPickListFields: boolean
        ApiOutputVar: string
        ConstData: string
        SqlQueryConstData: string
        EntityConstData: string
        Condition: string
        QueryParam: string
        PickListFields: string
        InvokeApiParams: string
      }
      DataSourceType: string
    }
  }
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

  const context = useContext()
  const sx = inProps.sx || {}

  const datas = getEntityDatas(
    inProps.stepDownSource.DataSourceSetting.DataConfig.SourceID,
    context
  )

  const {
    DescColumn: descCol,
    SaveColumn: idCol,
    ShowColumn: labelCol
  } = inProps.stepDownSource.DataSourceSetting.DataConfig

  return (
    <Box
      sx={{
        ...sx,
        width: toWidth(inProps.width, context, '330px'),
        height: toHeight(inProps.height, context, '40px'),
        position: context ? context.position : 'absolute',
        top: inProps.top,
        right: inProps.right,
        left: inProps.left,
        bottom: inProps.bottom
      }}
    >
      <JGStepsRoot {...props} ref={ref}>
        {datas &&
          datas.map((step) => (
            <Step key={step[idCol] as string}>
              <StepLabel
                optional={
                  step[descCol] ?? (
                    <Typography variant="caption">
                      {step[descCol] as string}
                    </Typography>
                  )
                }
              >
                {step[labelCol] as string}
              </StepLabel>
            </Step>
          ))}
      </JGStepsRoot>
    </Box>
  )
})

JGSteps.defaultProps = {
  width: '330px',
  height: '40px'
}

export default JGSteps
