import toTree from 'array-to-tree'
import { Property } from 'csstype'
import Box from '@mui/material/Box'
import { Height, Width } from '@v-act/schema-types'
import { useContext, ContextProvider } from '@v-act/widget-context'
import { convert as bgconvert } from '@v-act/jgbuttongroup'
import { Tree } from 'antd'
// import 'antd/dist/antd.css'
import deepcopy from 'deepcopy'
import {
  toHeight,
  toWidth,
  getEntityDatas,
  getCompEvent
} from '@v-act/widget-utils'
import '../src/JGTreeView.css'
export interface JGTreeViewProps {
  left?: Property.Left
  top?: Property.Top
  position?: Property.Position
  height?: Height
  width?: Width
  readonly?: boolean
  disable?: boolean
  data?: any
  tablename?: string | null
  columnname?: string | null
  control?: any
  labelText?: any
  cascadeCheck?: boolean
  displayMode?: string | null
}

const JGTreeView = (props: JGTreeViewProps) => {
  const context = useContext()
  const {
    left,
    top,
    height,
    width,
    position,
    data,
    readonly,
    disable,
    tablename,
    control,
    labelText,
    cascadeCheck,
    displayMode,
    ...resprops
  } = props

  let showCheck = false
  if (displayMode && displayMode == '2') {
    showCheck = true
  }

  // console.log('---dataTemp---')
  let dataTemp: any = []
  if (tablename) {
    dataTemp = getEntityDatas(tablename, context)
    // console.log(dataTemp)
  }

  // dataTemp = [
  //   {
  //     id: '598fafc96d304aa5b3698237b05f879d',
  //     TreeColumnName: '文件夹-1',
  //     IsLeaf: false
  //   },
  //   {
  //     id: '19469ecb8b734f9b86b7020dd7880383',
  //     PID: '598fafc96d304aa5b3698237b05f879d',
  //     TreeColumnName: '文件1-1',
  //     IsLeaf: true
  //   },
  //   {
  //     id: '816d6a4d6b59410a9db2536cc8240fe2',
  //     PID: '598fafc96d304aa5b3698237b05f879d',
  //     TreeColumnName: '文件1-2',
  //     IsLeaf: true
  //   },
  //   {
  //     id: 'dc5be2a7b6fc437982e421db556012cc',
  //     TreeColumnName: '文件夹-2',
  //     IsLeaf: false
  //   },
  //   {
  //     id: '03a9ad59bc34443bbd11bbf46cf2b178',
  //     PID: 'dc5be2a7b6fc437982e421db556012cc',
  //     TreeColumnName: '文件2-1',
  //     IsLeaf: true
  //   },
  //   {
  //     id: '54927198944c4f8ab9c64186809e9285',
  //     PID: 'dc5be2a7b6fc437982e421db556012cc',
  //     TreeColumnName: '文件2-2',
  //     IsLeaf: true
  //   }
  // ]

  let dataTree = []

  if (dataTemp) {
    dataTree = toTree(dataTemp, {
      parentProperty: 'PID',
      customID: 'id'
    })
  }

  // console.log('dataTree')
  // console.log(dataTree)

  // console.log('labelText')
  // console.log(labelText)

  let isReadonly = false
  if (readonly || disable) {
    isReadonly = true
  }

  let clickProps = () => {}

  if (getCompEvent(control).hasOwnProperty('OnClick')) {
    clickProps = getCompEvent(control).OnClick
  }

  const onCheck = (checkedKeys: React.Key[], info: any) => {
    // console.log('onCheck', checkedKeys, info);
  }

  let headerDataLeft: any = deepcopy(control.headerControls)
  let headerDataRight: any = deepcopy(control.headerControls)

  if (control.headerControls.length > 0) {
    if (headerDataLeft.length > 0) {
      headerDataLeft[0].controls = []
      headerDataRight[0].controls = []
      control.headerControls[0].controls.some((item: any) => {
        console.log('item.properties.align')
        console.log(item.properties.align)
        if (item.properties.align) {
          // item.properties.height = 'auto'
          // item.properties.showBorder = false

          headerDataRight[0].controls.push(item)
          headerDataRight[0].properties.top = 0
          headerDataRight[0].properties.showBorder = 'false'
          headerDataRight[0].properties.size = 0
          headerDataRight[0].properties.align = 'end'
        } else {
          item.properties.size = 0
          headerDataLeft[0].controls.push(item)
          headerDataLeft[0].properties.top = 0
          headerDataLeft[0].properties.showBorder = 'false'
          headerDataLeft[0].properties.size = 0
        }
      })
    }
  }

  console.log('headerDataRight')

  console.log(headerDataRight)

  return (
    <Box
      sx={{
        left: left,
        top: top,
        width: toWidth(width, context, '235px'),
        height: toHeight(height, context, '26px'),
        position: context.position,
        pointerEvents: isReadonly ? 'none' : 'auto',
        border: '1px solid #eee',
        fontSize: '14px!important'
        // display: 'flex',
      }}
    >
      <Box
        sx={{
          display: 'flex'
          // justifyContent: 'space-between',
        }}
      >
        <Box sx={{ width: '50%', flexShrink: 1 }}>
          {headerDataLeft.length == 1
            ? ContextProvider({
                context: { position: 'relative' },
                children: bgconvert(headerDataLeft[0])
              })
            : ''}
        </Box>

        <Box
          sx={{
            width: '50%',
            display: 'flex',
            justifyContent: 'flex-end',
            flexShrink: 1
          }}
        >
          {headerDataRight.length == 1
            ? ContextProvider({
                context: { position: 'relative' },
                children: bgconvert(headerDataRight[0])
              })
            : ''}
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          height: '31px',
          background: '#F6F7FB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        {labelText}
      </Box>
      <Tree
        // onCheck={onCheck}
        checkStrictly={cascadeCheck}
        checkable={showCheck}
        onSelect={clickProps}
        treeData={dataTree}
        fieldNames={{
          title: 'TreeColumnName',
          key: 'id',
          children: 'children'
        }}
      />
    </Box>
  )
}

JGTreeView.defaultProps = {
  left: '20px',
  top: '50px',
  width: '200px',
  height: '200px',
  position: 'absolute',
  data: [
    { id: '1', name: 'item1' },
    { id: '111', name: 'item1_1', pid: '1' },
    { id: '2', name: 'item2' },
    { id: '3', name: 'item2_1', pid: '2' },
    { id: '11', name: 'item2_2', pid: '2' },
    { id: '22', name: 'item2_2_1', pid: '11' },
    { id: '33', name: 'item2_2_1_1', pid: '22' }
  ]
}

export default JGTreeView
