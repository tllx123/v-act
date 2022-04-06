import { main as prdgetbizframecurrentrecord } from '@v-act/webfunc_prdgetbizframecurrentrecord'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
const vds = { expression }

// 主入口(必须有)
let main = function () {
  //实体名
  let entityName = 'TEMP_PROCESS_TASK'
  //实体字段名
  let entityFieldName = 'FromTaskOwnerName'
  vds.expression.execute(
    prdgetbizframecurrentrecord(entityName, entityFieldName)
  )
}
export { main }
