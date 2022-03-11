import * as formulaUtil from 'module'

import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

// 规则主入口(必须有)
import { RuleContext } from '@v-act/vjs.framework.extension.platform.interface.route'
const main = function (ruleContext: RuleContext) {
  // 获取规则上下文中的规则配置值
  let ruleConfig = ruleContext.getRuleCfg()
  let inParams = ruleConfig.inParams
  let rpts = jsonUtil.json2obj(inParams).refReport

  if (rpts.length < 1) {
    alert('未定义需要打印的报表')
    return
  }
  let widgetId = ''
  if (rpts.length == 1) {
    let datas = formulaUtil.evalExpression(
      'GenerateDrawReport("' + widgetId + '","' + rpts[0].reportID + '")'
    )
  } else {
    let scopeId = ScopeManager.getCurrentScopeId()
    let listGrid = isc.ListGrid.create({
      ID: 'reportList',
      Visible: true,
      width: 500,
      height: 224,
      alternateRecordStyles: true,
      fields: [
        {
          name: 'reportID',
          title: 'reportID',
          showIf: 'return false;',
          align: 'center'
        },
        { name: 'reportName', title: '报表名称', align: 'center' }
      ],
      data: rpts,
      recordClick: function (record:any) {
        let record1 = record.getSelection()
        let reportID = ''
        if (record1.length > 0) {
          reportID = record1[0]['reportID']
          window.closeClick()
        }

        let widgetId = ruleConfig['widgetId']
        if (!widgetId || widgetId == undefined || widgetId == 'undefined') {
          widgetId = ''
        }
        ScopeManager.openScope(scopeId)
        formulaUtil.evalExpression(
          'GenerateDrawReport("' + widgetId + '","' + reportID + '")'
        )
        ScopeManager.closeScope()
      }
    })

    let window = isc.Window.create({
      ID: 'window',
      name: 'reportWindow',
      title: '请选择需要打印的报表',
      autoDraw: true,
      width: 500,
      showBody: true,
      status: '1',
      height: 200,
      autoCenter: true,
      autoSize: true,
      autoFocus: true,
      showDragPlaceHolder: true,
      items: [listGrid],
      contents: ''
    })
    //增加window低层
    window.addChild(isc.Shim.create())
    /*
        var selectRpt = "<br>";
        for (var i = 0; i < rpts.length; i++) {
            selectRpt = selectRpt + "<p id='" + rpts[i].reportID
                    + "'>" + rpts[i].reportName + "</p><br>";
        }
        var getvalue = '<div id="getvalue" style="display:none;" >'
                + selectRpt + '</div>';

        $("#getvalue").remove();
        $(getvalue).appendTo('body');

        $("#getvalue").dialog({
                    modal : true,
                    title : "请选择需要打印的报表",
                    iconType : "",
                    buttons : {}
                });
        $('.dialog-content-text').hide();
        $("#getvalue").find('p').click(function() {// 双击表格tr
                    var text = $(this).attr("id");// 获取表格td的第一个的文本值
                    $("#getvalue").dialog('close');

                    var ruleCfgValue = ruleContext.getRuleCfg();
                    var widgetId = ruleConfig["widgetId"];
                    if(!widgetId || widgetId == undefined || widgetId == 'undefined'){
                        widgetId = '';
                    }
                    var datas = formulaUtil.evalExpression("GenerateDrawReport(\"" + widgetId + "\",\"" + text + "\")");
                });
*/
  }
}
export { main }
