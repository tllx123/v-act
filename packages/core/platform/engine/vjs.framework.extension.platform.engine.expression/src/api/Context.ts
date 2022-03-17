import { WindowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'

class Context {
  getComponontVar(name: string) {
    return WindowParam.getInput({ code: name })
  }
  getWindowVar() {}

  getRecordValue() {}

  getWidgetProperty() {}

  executeFunction() {}

  getRuleBusinessResult() {}

  getRulesetEntityFieldInput() {}

  getRulesetEntityFieldOut() {}

  getRulesetEntityFieldVar() {}

  getRulesetInput() {}

  getRulesetVar() {}
}
