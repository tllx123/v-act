import { JGBarcode } from '@v-act/jgbarcode'
import { JGComponent } from '@v-act/jgcomponent'
const qrcode = () => {
  return (
    <JGComponent>
      <JGBarcode />

      <JGBarcode
        displayValue={false}
        background="#66CCCC"
        lineColor="#CCCCFF"
        barcodwidth={2}
        barcodheight={50}
        left="50px"
        top="300px"
      />
    </JGComponent>
  )
}

export default qrcode
