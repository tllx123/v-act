import * as React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Checkbox from '@mui/material/Checkbox'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'

interface IPrototypeLoginProps {
  backgroundPic?: string
  logoPic?: string
  onlogin?: Function
}

function IPrototypeLogin(props: IPrototypeLoginProps) {
  const [value, setValue] = React.useState('account-login')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const onlogin = props.onlogin
  const handleLogin = () => {
    if (onlogin) {
      onlogin()
    }
  }
  const bgImage = props.backgroundPic
    ? props.backgroundPic
    : 'http://vstore-proto.yindangu.com/itop/common/extension/custom/widget/ie-vui-login/3DYtEXG.jpg'
  return (
    <Stack
      sx={{
        height: '100%'
      }}
    >
      <Box
        sx={{
          height: '76px',
          padding: '0px 20px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {props.logoPic ? (
          <CardMedia
            image={props.logoPic}
            sx={{
              height: '48px',
              width: '96px'
            }}
          ></CardMedia>
        ) : null}
      </Box>
      <Box
        sx={{
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          backgroundRepeat: 'round',
          backgroundImage: `url(${bgImage})`
        }}
      >
        <Card
          sx={{
            width: 430,
            height: 400,
            padding: '60px 60px'
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs onChange={handleChange} value={value} variant="fullWidth">
              <Tab
                value="account-login"
                sx={{ fontSize: '18px', color: '#57a3f3' }}
                label="账号登陆"
              ></Tab>
              <Tab
                value="mobile-login"
                sx={{ fontSize: '18px' }}
                label="短信登陆"
              ></Tab>
            </Tabs>
          </Box>
          <Box
            hidden={value !== 'account-login'}
            sx={{
              paddingTop: '40px'
            }}
          >
            <div
              style={{
                height: '40px'
              }}
            >
              <TextField
                placeholder="用户名"
                variant="outlined"
                fullWidth
                size="small"
                sx={{
                  legend: {
                    width: 'auto'
                  }
                }}
              />
            </div>
            <div
              style={{
                marginTop: '20px',
                height: '40px'
              }}
            >
              <TextField
                placeholder="密码"
                fullWidth
                size="small"
                variant="outlined"
                sx={{
                  legend: {
                    width: 'auto'
                  }
                }}
              />
            </div>
            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '12px'
                }}
              >
                <Checkbox size="small" />
                <span
                  style={{
                    marginLeft: '-8px'
                  }}
                >
                  记住我
                </span>
              </div>
              <Button
                variant="text"
                sx={{
                  fontSize: '12px'
                }}
              >
                忘记密码？
              </Button>
            </div>
            <Button
              fullWidth
              variant="contained"
              sx={{
                marginTop: '20px'
              }}
              onClick={handleLogin}
            >
              登陆
            </Button>
          </Box>
          <Box
            hidden={value !== 'mobile-login'}
            sx={{
              paddingTop: '40px'
            }}
          >
            <div
              style={{
                height: '40px'
              }}
            >
              <TextField
                placeholder="手机号码"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  legend: {
                    width: 'auto'
                  }
                }}
              />
            </div>
            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                height: '40px'
              }}
            >
              <TextField
                placeholder="短信验证码"
                variant="outlined"
                size="small"
                sx={{
                  legend: {
                    width: 'auto'
                  }
                }}
              />
              <Button
                disabled
                variant="contained"
                sx={{
                  marginLeft: '10px',
                  width: '95px',
                  fontSize: '12px'
                }}
              >
                获取验证码
              </Button>
            </div>
            <Button
              fullWidth
              variant="contained"
              sx={{
                marginTop: '78px'
              }}
              onClick={handleLogin}
            >
              登陆
            </Button>
          </Box>
        </Card>
      </Box>
      <Box
        sx={{
          height: '90px'
        }}
      ></Box>
    </Stack>
  )
}

export { IPrototypeLogin, type IPrototypeLoginProps }
