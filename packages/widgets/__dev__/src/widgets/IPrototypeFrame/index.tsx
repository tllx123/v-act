import { IPrototypeFrame } from '@v-act/iprototypeframe'
import { JGComponent } from '@v-act/jgcomponent'

const activityPanel = () => {
  const headerMenu = [
    {
      code: 'hao123',
      type: 'url',
      data: 'http://www.hao123.com',
      title: 'hao123'
    }
  ]
  const sideMenu = [
    { code: 1, title: '统计分析', data: 'http://www.hao123.com' },
    { code: 2, title: '劳务人员信息' },
    {
      code: 3,
      title: '班前安全活动',
      children: [
        {
          code: 5,
          title: '班组班前安全活动记录'
        },
        {
          code: 6,
          title: '班前活动预警'
        }
      ]
    },
    {
      code: 4,
      title: '劳务费用',
      children: [
        {
          code: 7,
          title: '劳务工资发放'
        },
        {
          code: 8,
          title: '劳务费用统计'
        }
      ]
    },
    {
      code: 100,
      title: '基础设置',
      children: [
        {
          code: 9,
          title: '字典库-劳务实名制'
        },
        {
          code: 10,
          title: '签到位置设置'
        },
        {
          code: 11,
          title: '班前活动自动签到设置'
        },
        {
          code: 12,
          title: '第三方人员设置',
          children: [
            {
              code: 13,
              title: '微信账号'
            }
          ]
        }
      ]
    }
  ]
  return (
    <JGComponent height="100%" width="100%">
      <IPrototypeFrame
        headMenu={headerMenu}
        sideMenu={sideMenu}
      ></IPrototypeFrame>
    </JGComponent>
  )
}

export default activityPanel
