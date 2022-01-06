import { JGCalendar } from '@v-act/jgcalendar'
import { JGComponent } from '@v-act/jgcomponent'

const Calendar = () => {
  return (
    <JGComponent>
      <JGCalendar
        top="4px"
        left="32px"
        multiHeight="518px"
        multiWidth="836px"
      ></JGCalendar>
    </JGComponent>
  )
}

export default Calendar
