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
    const [propsChildren, setPropsChildren] = useState(inProps.children)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
      console.log('effect', propsChildren)
      refresh && setRefresh(false)
    }, [refresh])

    const context = useContext()
    context.entities = inProps.entities

    window.changeComponentByProperties = (
      pageCode: string,
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

            return children.props.componentCode &&
              children.props.componentCode === targetCode
              ? children.props.control
              : iteratorComponent(children.props.children, targetCode)
          }
        } else {
          return childrens.props.componentCode &&
            childrens.props.componentCode === targetCode
            ? childrens.props.control
            : iteratorComponent(childrens.props.children, targetCode)
        }
      }

      // 查找组件
      const iteratorControls = (controls: any, componentCode: string) => {
        if (Array.isArray(controls)) {
          for (let key in controls) {
            return controls[key].properties.code === componentCode
              ? controls[key]
              : iteratorComponent(controls[key].controls, componentCode)
          }
        } else {
          return controls.properties.code === componentCode
            ? controls
            : iteratorComponent(controls.controls, componentCode)
        }
      }

      if ('props' in inProps.children) {
        let targetPage = iteratorComponent(
          inProps.children.props.children,
          pageCode
        )
        let targetComponent = iteratorControls(
          targetPage.controls,
          componentCode
        )

        if (targetComponent) {
          targetComponent.properties = properties
        }

        const newPropsChildren = Object.assign({}, inProps.children)
        console.log('浅拷贝修改后', newPropsChildren)

        function deepClone<T>(obj: T): T {
          let objClone = Array.isArray(obj) ? [] : {}
          if (obj && typeof obj === 'object') {
            for (let key in obj) {
              if (obj[key] && typeof obj[key] === 'object') {
                objClone[key] = deepClone(obj[key])
              } else {
                objClone[key] = obj[key]
              }
            }
          }
          return objClone
        }

        setPropsChildren(deepClone(newPropsChildren))
        setRefresh(true)
      }
    }

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
