import { JGQrcode } from '@v-act/jgqrcode'
import { JGComponent } from '@v-act/jgcomponent'
const qrcode = () => {
  return (
    <JGComponent>
      <JGQrcode />

      <JGQrcode
        istext
        text="前景色&背景色"
        backcolor="#66CCCC"
        ForeColor="#CCCCFF"
        top="350px"
      />

      <JGQrcode
        istext
        text="svg模式&纠错等级"
        left="350px"
        rendertype="svg"
        correctlevel="H"
      />

      <JGQrcode
        istext
        text="扫我C查看内容"
        left="350px"
        top="350px"
        qrcontent="http://www.yini.org/liuyan/rgbcolor.htm"
      />
    </JGComponent>
  )
}

export default qrcode
