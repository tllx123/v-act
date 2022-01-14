import React, { CSSProperties, forwardRef, useState } from 'react'

import { Property } from 'csstype'

import InputUnstyled, { InputUnstyledProps } from '@mui/base/InputUnstyled'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { Button, IconButton, Popover } from '@mui/material'
import { styled } from '@mui/system'
import { JGInputLabel } from '@v-act/jginputlabel'
import { Height, Width } from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'
import { toHeight, toLabelWidth, toWidth } from '@v-act/widget-utils'

interface JGAttachmentProps extends InputUnstyledProps {
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
  /**
   * 标题
   */
  labelText?: string
  /**
   * 标题宽度
   */
  labelWidth?: number
  /**
   * 提醒文字
   */
  placeholder?: string
  /**
   * 必填
   */
  isMust?: boolean
  /**
   * 显示
   */
  visible?: boolean

  /**
   * 显示标题
   */
  labelVisible?: boolean

  /**
   * 显示宽度
   */
  width?: Property.Width

  /**
   * 显示高度
   */
  height?: Property.Height

  /**
   * 输入框显示类型
   */
  inputType?: string
  /**
   * 禁用
   */
  disabled?: boolean
  /**
   * 显示上传队列
   */
  showUploadList?: boolean
}

const StyledInputElement = styled('input')`
  border: 1px solid #dcdee2;
  color: #333;
  border-radius: 4px;
  padding: 0 4px;
  width: 100%;
  outline: none;
  height: 100%;
  &:hover {
    border-color: #356abb;
  }

  &:focus {
    border-color: #356abb;
    background: #fff;
    box-shadow: 0 0 0 2px rgba(53, 106, 187, 0.3);
  }
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  [disabled] {
    background: #f6f7fb;
  }
`

const CustomInput = forwardRef(function (
  props: JGAttachmentProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <InputUnstyled
      components={{ Input: StyledInputElement }}
      {...props}
      ref={ref}
    />
  )
})

const UploadInput = styled('input')({
  display: 'none'
})

const JGAttachment = function (props: JGAttachmentProps) {
  if (!props.visible) {
    return null
  }
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const popoverHandleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const popoverHandleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  const [files, setFiles] = useState<any[]>([])
  const context = useContext()
  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')
  const labelWidth = props.labelVisible
    ? toLabelWidth(props.labelWidth, context, 94)
    : 0
  let lineHeight = String(height).indexOf('px') !== -1 ? height : height + 'px'
  const [inputVal, setInputVal] = useState('')
  const wrapStyles: CSSProperties = {
    width: width,
    height: height,
    fontSize: '14px',
    position: context.position,
    left: props.left,
    display: 'flex',
    alignItems: 'center',
    top: props.top,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }

  const inputStyles = {
    width: '100%',
    height: height,
    flex: 1
  }

  const inputWrapStyles: CSSProperties = {
    width: '100%',
    height: height,
    flex: 1,
    position: 'relative'
  }

  const popoverItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 4px 10px 10px',
    fontSize: '14px'
  }

  const fileIconStyle: CSSProperties = {
    width: '20px',
    height: '20px'
  }

  const popoverWrapStyle: CSSProperties = {
    minWidth: '294px',
    padding: '8px',
    maxHeight: '200px'
  }

  const fileNameStyle: CSSProperties = {
    flex: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    marginLeft: '4px'
  }

  const isInteger = (e: unknown) => {
    if (props.inputType === 'integer') {
      let filterVal = e.target.value.replace(/[^(-?\d)]/gi, '')
      if (
        filterVal.lastIndexOf('-') !== -1 &&
        filterVal.lastIndexOf('-') !== 0
      ) {
        filterVal = '-' + filterVal.replace(/[^\d]/gi, '')
      }
      setInputVal(filterVal)
    }
  }
  const handleChange = (e: unknown) => {
    isInteger(e)
  }

  const handleFileDel = (fileIndex: number): void => {
    if (files.length === 1) setAnchorEl(null)
    setFiles(() => {
      let filesList = JSON.parse(JSON.stringify(files))
      filesList.splice(fileIndex, 1)
      return filesList
    })
  }

  const handleUpload = (e: any) => {
    let filesArr = Array.from(e.target.files).map((val: any) => {
      return { name: val.name }
    })
    let mergeArr = [...files, ...filesArr]
    setFiles(mergeArr)
  }
  return (
    <div style={wrapStyles}>
      <JGInputLabel
        width={labelWidth}
        height={height}
        visible={props.labelVisible}
        required={props.isMust}
      >
        {props.labelText}
      </JGInputLabel>
      <div style={inputWrapStyles}>
        {props.showUploadList && files.length > 0 && (
          <div>
            <IconButton
              aria-describedby={id}
              onClick={popoverHandleClick}
              sx={{
                padding: 0,
                margin: 0,
                minWidth: 'auto',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                position: 'absolute',
                right: '5px',
                top: '6px'
              }}
              component="span"
            >
              <InfoOutlined sx={{ color: '#356abb', fontSize: 20 }} />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={popoverHandleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
              sx={{
                marginTop: '12px'
              }}
            >
              <div style={popoverWrapStyle}>
                {files.map((val: any, index: number) => (
                  <div style={popoverItemStyle}>
                    <svg
                      viewBox="0 0 24 24"
                      style={fileIconStyle}
                      fill="#356abb"
                    >
                      <path d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z"></path>
                    </svg>
                    <div style={fileNameStyle}>{val.name}</div>
                    <Button
                      variant="text"
                      sx={{
                        padding: 0,
                        lineHeight: 1
                      }}
                      onClick={() => handleFileDel(index)}
                    >
                      删除
                    </Button>
                  </div>
                ))}
              </div>
            </Popover>
          </div>
        )}
        <CustomInput
          style={inputStyles}
          placeholder={props.placeholder}
          type={props.inputType === 'integer' ? 'text' : props.inputType}
          onChange={handleChange}
          value={inputVal}
          disabled={props.disabled}
          readOnly
        />
      </div>
      <label htmlFor="contained-button-file">
        <UploadInput
          accept="image/*"
          id="contained-button-file"
          multiple
          type="file"
          onChange={(e) => handleUpload(e)}
          onClick={(e: any) => {
            e.target.value = null
          }}
        />
        <Button
          variant="contained"
          component="span"
          sx={{
            'display': 'inline-block',
            'minWidth': '56px',
            'height': height,
            'lineHeight': lineHeight,
            'padding': 0,
            'marginLeft': '5px',
            'textAlign': 'center',
            '&:hover': {
              color: '#fff',
              background: '#558fe8'
            }
          }}
        >
          选择
        </Button>
      </label>
    </div>
  )
}

JGAttachment.defaultProps = {
  left: '0px',
  top: '0px',
  multiHeight: '26px',
  multiWidth: '294px',
  labelWidth: 94,
  labelText: '文本',
  placeholder: '',
  isMust: false,
  visible: true,
  labelVisible: true,
  inputType: 'text',
  disabled: false,
  showUploadList: true
}

export default JGAttachment
export { JGAttachment }
export type { JGAttachmentProps }
