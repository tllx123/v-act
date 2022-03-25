import { forwardRef, useEffect, useState } from 'react'

import { Property } from 'csstype'

import Box, { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/styles'
import { ReactEnum } from '@v-act/schema-types'
import { Entities, useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

interface JGComponentProps {
  bottom?: Property.Bottom
  height?: Property.Height
  left?: Property.Left
  right?: Property.Right
  top?: Property.Top
  width?: Property.Width
  entities?: Entities
  padding?: Property.Padding
  children?: JSX.Element | JSX.Element[] | null
}

const JGComponentRoot = styled(Box, {
  name: 'JGComponent',
  slot: 'Root'
})(({ theme }) => ({
  position: 'relative'
}))

const JGComponent = forwardRef<HTMLDivElement, JGComponentProps>(
  (inProps, ref) => {
    const [propsChildren, setPropsChildren] = useState(
      Object.assign({}, inProps.children)
    )
    const context = useContext()
    context.entities = inProps.entities

    /**
     * 为全局暴露一个接口更改组件属性
     * @param String componentCode 组件code值
     * @param String properties 更改属性
     * */

    const changeComponentByProperties = (
      componentCode: string,
      properties: any
    ): any => {
      if (!inProps.children) {
        return new Error('页面未设置组件')
      }

      // 查找页面
      const iteratorComponent = (
        childrens: JSX.Element | JSX.Element[],
        targetCode: string
      ): any => {
        if (Array.isArray(childrens)) {
          for (let key in childrens) {
            let children = childrens[key]
            if (!('props' in children)) continue

            return children.props.componentCode
              ? children.props.control
              : iteratorComponent(children.props.children, targetCode)
          }
        } else {
          return childrens.props.componentCode
            ? childrens.props.control
            : iteratorComponent(childrens.props.children, targetCode)
        }
      }
      //
      // 查找组件
      const iteratorControls = (controls: any, componentCode: string): any => {
        if (!controls || controls == []) return false
        if (Array.isArray(controls)) {
          let target
          for (let key in controls) {
            if (controls[key].properties.code === componentCode) {
              target = controls[key]
            }
          }
          if (!target) {
            for (let key in controls) {
              let t = iteratorControls(controls[key].controls, componentCode)
              if (t) {
                return target
              }
            }
          }
          return target
        } else {
          return controls.properties.code === componentCode
            ? controls
            : iteratorControls(controls.controls, componentCode)
        }
      }

      if ('props' in inProps.children) {
        let targetPage = iteratorComponent(
          inProps.children.props.children,
          componentCode
        )

        targetPage = Object.assign({}, targetPage)

        let targetComponent = iteratorControls(
          targetPage.controls,
          componentCode
        )

        if (targetComponent) {
          if (properties.code) throw new Error('不允许更改code值')
          targetComponent.properties = Object.assign(
            targetComponent.properties,
            properties
          )
        }

        const newPropsChildren = Object.assign({}, inProps.children)

        // 设置props为空，解决组件不刷新问题
        setPropsChildren(null)
        setPropsChildren(newPropsChildren)
      }
    }

    window.changeComponentByProperties = changeComponentByProperties
    context.windowScope.set(
      'changeComponentByProperties',
      changeComponentByProperties
    )

    console.log('inProps: ', inProps)

    const props: BoxProps = {
      sx: {
        width: toWidth(inProps.width, context, ReactEnum.Space),
        top: inProps.top,
        right: inProps.right,
        left: inProps.left,
        padding:
          typeof inProps.padding !== 'undefined' ? inProps.padding : '16px', //窗体内间距
        height: toHeight(inProps.height, context, ReactEnum.Space),
        bottom: inProps.bottom
      }
    }
    return (
      <JGComponentRoot {...props} ref={ref}>
        {propsChildren}
      </JGComponentRoot>
    )
  }
)

JGComponent.defaultProps = {
  height: '450px',
  width: '960px'
}

export default JGComponent
export { JGComponent, type JGComponentProps }
