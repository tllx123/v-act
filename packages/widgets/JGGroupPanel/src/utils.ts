import { JGSpacer } from '@v-act/jgspacer'
import { ReactEnum } from '@v-act/schema-types'
import { WidgetContextProps } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

import { JGGroupPanelProps } from './JGGroupPanel'

const getGroupPanelProps = function (
  props: JGGroupPanelProps,
  context: WidgetContextProps
) {
  return {
    left: props.left,
    top: props.top,
    width: toWidth(props.multiWidth, context, ReactEnum.Space),
    height: toHeight(props.multiHeight, context, ReactEnum.Space),
    position: context.position
  }
}

const isSpacer = function (child: JSX.Element) {
  return child.type === JGSpacer
}

export { getGroupPanelProps, isSpacer }
