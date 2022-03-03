import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'
import * as TimePoint from './TimePoint'

let storage,
  storage_data,
  token = 'V3_Platform_Event_Observer_Data_Manager'
let TimePointData = 'V3_Platform_Event_Observer_Data_Manager_Time_Point_Data'
let OriginalData = 'Time_Point_Original_Data'
let TreeData = 'Time_Point_Tree_Data'

let TimePoint_Root = 'Time_Point_Root_Data'
let TimePoint_Method = 'Time_Point_Method_Data'
let TimePoint_Rule = 'Time_Point_Rule_Data'
let TimePoint_WinComNet = 'Time_Point_WinComNet_Data'

exports.initModule = function (sb) {}

let _getStorage = function () {
  if (!storage) {
    storage = storageManager.get(storageManager.TYPES.MAP, token)
  }
  return storage
}

let _getDataStorage = function () {
  if (!storage_data) {
    storage_data = storageManager.get(storageManager.TYPES.MAP, TimePointData)
  }
  return storage_data
}

const add = function (timePoint) {
  let s = _getStorage()
  let datas,
    key = timePoint.getKey()
  if (!s.containsKey(key)) {
    datas = []
    s.put(key, datas)
  } else {
    datas = s.get(key)
  }
  datas.push(timePoint)
}

const remove = function (sourceKey) {
  let s = _getStorage()
  let datas,
    key = sourceKey
  if (!s.containsKey(sourceKey)) {
    //console.log("没有找到对应的key："+key);
    return false
  } else {
    datas = s.get(sourceKey)
  }
  for (let i = 0, l = datas.length; i < l; i++) {
    let data = datas[i]
    if (sourceKey == data.key) {
      datas.removeAt(i)
      if (datas.length == 0) {
        s.remove(sourceKey)
      }
      return true
    }
  }
  console.log('没有找到对应的开始时间：' + timePoint + '\ndatas:' + datas)
  return false
}

const clear = function () {
  let s = _getStorage()
  s.clear()
  let st = _getDataStorage()
  st.clear()
}

let _resetViewData = function () {
  let s = _getStorage()
  //var datas=[];
  //var allTimePoint = {};
  let ruleTimePoint = {} //保存规则时间点
  let methodTimePoint = {} //保存方法时间点
  let win_Net_ComTimePoint = {} //保存窗体、构件、网络的时间点
  s.iterate(function (key, times) {
    let dataArray = []
    for (let i = 0; i < times.length; i++) {
      let time = times[i]
      let type = time.getType()
      let hasFound = false
      for (let j = dataArray.length - 1; j >= 0; j--) {
        let data = dataArray[j]
        if (data.dataType + type == 0 && data['key'] == time.getKey()) {
          if (type > 0) {
            data.to = time.getTime()
          } else {
            data.from = time.getTime()
          }
          data.dt = time.getTipDom(data, time)
          hasFound = true
          break
        }
      }
      if (!hasFound) {
        dataArray.push({
          key: time.getKey(),
          dataType: time.getType(),
          parentKey: time.getParentKey(),
          funCode: time.getFunCode(),
          scopeId: time.getScopeId(),
          parentScopeId: time.getParentScopeId(),
          ruleCode: time.getRuleCode(),
          type: TimelineChart.TYPE.INTERVAL,
          customClass: time.getTypeCode(),
          series: time.getSeries(),
          from: type > 0 ? null : time.getTime(),
          to: type > 0 ? time.getTime() : null,
          children: []
        })
      }
    }
    //去掉没有开始点或者没有结束点的时间点。
    //var filterData = [];
    for (let i = 0, l = dataArray.length; i < l; i++) {
      let tmpData = dataArray[i]
      if (tmpData.from && tmpData.to) {
        //filterData.push(tmpData);
        switch (tmpData.series) {
          case 1:
            methodTimePoint[tmpData.key] = _copyTimePoint(tmpData)
            break
          case 2:
            ruleTimePoint[tmpData.key] = _copyTimePoint(tmpData)
            break
          case 3:
          case 4:
          case 5:
            win_Net_ComTimePoint[tmpData.key] = _copyTimePoint(tmpData)
            break
        }
        //allTimePoint[tmpData.key] = _copyTimePoint(tmpData);
      }
    }
    //datas = datas.concat(filterData);
  })

  //		//delete
  //		var rootList = [];//保存根节点。
  //		var ruleRouteSign = [];
  //		for(var _i = 0,l=datas.length;_i<l;_i++){
  //			var data = datas[_i];
  //			var parentKey = data.parentKey;
  //			var key = data.key;
  //			if(!parentKey){
  //				rootList.push(allTimePoint[key]);
  //			}else{
  //				var parentPoint = allTimePoint[parentKey];
  //				if(parentPoint){
  //					parentPoint.children.push(allTimePoint[key]);
  //				}else{
  //					rootList.push(allTimePoint[key]);
  //				}
  //			}
  //		}
  //
  let rootTimePoint = [] //保存根的时间点
  //处理方法的父子关系
  for (let method in methodTimePoint) {
    let data = methodTimePoint[method]
    let parentKey = data.parentKey
    if (!parentKey) {
      let methodScopeId = data.parentScopeId
      if (methodScopeId) {
        let isRootRoute = true
        for (let rule in ruleTimePoint) {
          let ruleObj = ruleTimePoint[rule]
          let ruleCode = ruleObj['ruleCode']
          if (
            ruleCode &&
            ruleCode == 'OpenComponentReturnData' &&
            ruleObj['scopeId'] == methodScopeId
          ) {
            isRootRoute = false
            ruleObj.children.push(data)
            break
          }
        }
        if (isRootRoute) {
          rootTimePoint.push(data)
        }
      } else {
        rootTimePoint.push(data)
      }
    } else {
      let parentPoint = ruleTimePoint[parentKey]
      if (parentPoint) {
        parentPoint.children.push(data)
      } else {
        rootTimePoint.push(data)
      }
    }
  }
  //处理规则的父子关系
  for (let rule in ruleTimePoint) {
    let data = ruleTimePoint[rule]
    let parentKey = data.parentKey
    if (!parentKey) {
      console.log('rule is root?')
      rootTimePoint.push(ruleTimePoint[rule])
    } else {
      let parentPoint = methodTimePoint[parentKey]
      if (parentPoint) {
        parentPoint.children.push(data)
      } else {
        console.log('rule is root?')
        rootTimePoint.push(data)
      }
    }
  }

  for (let key in win_Net_ComTimePoint) {
    rootTimePoint.push(win_Net_ComTimePoint[key])
  }

  let st = _getDataStorage()

  st.put(TimePoint_Root, rootTimePoint)
  st.put(TimePoint_Method, methodTimePoint)
  st.put(TimePoint_Rule, ruleTimePoint)
  st.put(TimePoint_WinComNet, win_Net_ComTimePoint)

  //st.put(OriginalData,allTimePoint);//delete
  //st.put(TreeData,rootList);//delete
}

const clearTreeData = function () {
  let s = _getDataStorage()
  s.clear()
}

const genViewTimePoint = function (ruleKey) {
  let s = _getDataStorage()
  //如果结果是空，则重新生成数据
  if (!s.containsKey(TimePoint_Root)) {
    _resetViewData()
  }
  //var allTimePoint = s.get(OriginalData);
  //var rootList = s.get(TreeData);

  let rootTimePoint = s.get(TimePoint_Root)
  let methodTimePoint = s.get(TimePoint_Method)
  let ruleTimePoint = s.get(TimePoint_Rule)
  let win_Net_ComTimePoint = s.get(TimePoint_WinComNet)

  let resultMap = []
  if (!ruleKey) {
    //根节点
    for (let i = 0, l = rootTimePoint.length; i < l; i++) {
      let data = rootTimePoint[i]
      resultMap.push(data)
      if (data.customClass == 'type-method') {
        let children = data.children
        for (let j = 0, m = children.length; j < m; j++) {
          let child = children[j]
          if (child.customClass == 'type-rule') {
            resultMap.push(child)
          }
        }
      }
    }
  } else {
    //执行方法 / 打开窗体 进入
    let rulePoint = ruleTimePoint[ruleKey]
    let children = rulePoint.children
    let startTime = 0
    let endTime = 0
    for (let i = 0, l = children.length; i < l; i++) {
      let child = children[i]
      resultMap.push(child)
      if (startTime == 0 || child.from - startTime < 0) {
        startTime = child.from
      }
      if (endTime == 0 || child.to - endTime > 0) {
        endTime = child.to
      }
      if (child.children.length > 0) {
        let childs = child.children
        for (let j = 0, m = childs.length; j < m; j++) {
          resultMap.push(childs[j])
        }
      }
    }
    for (let i = 0, l = rootTimePoint.length; i < l; i++) {
      let time = rootTimePoint[i]
      if (
        (time.customClass == 'type-widget' ||
          time.customClass == 'type-win' ||
          time.customClass == 'type-net') &&
        ((time.from > startTime && time.from < endTime) ||
          (time.to > startTime && time.to < endTime))
      ) {
        resultMap.push(time)
      }
    }
  }
  return _getRenderData(resultMap)
}

//	exports.genViewData = function(){
////		var datas=[];
////		var allTimePoint = {};
////		s.iterate(function(key,times){
////			var dataArray = [];
////			for(var i=0;i<times.length;i++){
////				var time = times[i];
////				var type = time.getType();
////				var hasFound = false;
////				for(var j=(dataArray.length-1);j>=0;j--){
////					var data = dataArray[j];
////					if(data.dataType+type==0 && data["key"] == time.getKey()){
////						if(type>0){
////							data.to = time.getTime();
////						}else{
////							data.from = time.getTime();
////						}
////						data.dt = time.getTipDom(data,time);
////						hasFound = true;
////						break;
////					}
////				}
////				if(!hasFound){
////					dataArray.push({
////						key:time.getKey(),
////						dataType:time.getType(),
////						parentKey:time.getParentKey(),
////						type: TimelineChart.TYPE.INTERVAL,
////						customClass:time.getTypeCode(),
////						series:time.getSeries(),
////						from:type>0 ? null:time.getTime(),
////						to : type>0 ? time.getTime():null,
////						children:[]
////					});
////				}
////			}
////			//去掉没有开始点或者没有结束点的时间点。
////			var filterData = [];
////			for(var i = 0,l=dataArray.length;i<l;i++){
////				var tmpData = dataArray[i];
////				if(tmpData.from && tmpData.to){
////					filterData.push(tmpData);
////					allTimePoint[tmpData.key] = _copyTimePoint(tmpData);
////				}
////			}
////			datas = datas.concat(filterData);
////		});
////		var rootMap = [];//保存根节点。
////		var ruleRouteSign = [];
////		for(var _i = 0,l=datas.length;_i<l;_i++){
////			var data = datas[_i];
////			var parentKey = data.parentKey;
////			var key = data.key;
////			if(!parentKey){
////				rootMap.push(allTimePoint[key]);
////			}else{
////				var parentPoint = allTimePoint[parentKey];
////				if(parentPoint){
////					parentPoint.children.push(allTimePoint[key]);
////				}else{
////					rootMap.push(allTimePoint[key]);
////				}
////			}
////		}
//		var s = _getDataStorage();
//		//如果结果是空，则重新生成数据
//		if(!s.containsKey(TreeData)){
//			_resetViewData();
//		}
//		var allTimePoint = s.get(OriginalData);
//		var rootList = s.get(TreeData);
//		debugger
//		var resultMap = [];
//		for(var i = 0,l=rootList.length;i<l;i++){
//			var data = rootList[i];
//			resultMap.push(data);
//			if(data.customClass == "type-method"){
//				var children = data.children;
//				for(var j = 0,m=children.length;j<m;j++){
//					var child = children[j];
//					if(child.customClass == "type-rule"){
//						resultMap.push(child);
//					}
//				}
//			}
//		}
//		return _getRenderData(resultMap);
////		var RouteDatas = [];
////		var RuleDatas = [];
////		var WindowDatas = [];
////		var ComponentDatas = [];
////		var NetworkDatas = [];
////		for(var i=0,l=resultMap.length;i<l;i++){
////			var data = resultMap[i];
////			var series = data.series;
////			if(series==TimePoint.Series.Route){
////				RouteDatas.push(data);
////			}else if(series==TimePoint.Series.Rule){
////				RuleDatas.push(data);
////			}else if(series==TimePoint.Series.Window){
////				WindowDatas.push(data);
////			}else if(series==TimePoint.Series.Component){
////				ComponentDatas.push(data);
////			}else{
////				NetworkDatas.push(data);
////			}
////		}
////		return [{label:"方法",data:RouteDatas},{label:"规则",data:RuleDatas},{label:"窗体",data:WindowDatas},{label:"构件",data:ComponentDatas},{label:"网络",data:NetworkDatas}];
//	}
/**
 * 获取渲染数据
 * */
let _getRenderData = function (params) {
  let resultMap = params
  let RouteDatas = []
  let RuleDatas = []
  let WindowDatas = []
  let ComponentDatas = []
  let NetworkDatas = []
  for (let i = 0, l = resultMap.length; i < l; i++) {
    let data = resultMap[i]
    let series = data.series
    if (series == TimePoint.Series.Route) {
      RouteDatas.push(data)
    } else if (series == TimePoint.Series.Rule) {
      RuleDatas.push(data)
    } else if (series == TimePoint.Series.Window) {
      WindowDatas.push(data)
    } else if (series == TimePoint.Series.Component) {
      ComponentDatas.push(data)
    } else {
      NetworkDatas.push(data)
    }
  }
  return [
    { label: '方法', data: RouteDatas },
    { label: '规则', data: RuleDatas },
    { label: '窗体', data: WindowDatas },
    { label: '构件', data: ComponentDatas },
    { label: '网络', data: NetworkDatas }
  ]
}

/**
 * 获取预览数据
 * @param String ruleKey 规则key
 * */
//	exports.getViewTimeData = function(ruleKey){
//		var s = _getDataStorage();
//		if(!s.containsKey(TreeData)){
//			_resetViewData();
//		}
//		var allTimePoint = s.get(OriginalData);
//		var rulePoint = allTimePoint[ruleKey];
//		var children = rulePoint.children;
//		var showData = [];
//		var startTime = 0;
//		var endTime = 0;
//		for(var i = 0,l = children.length;i<l;i++){
//			var child = children[i];
//			showData.push(child);
//			if(startTime == 0 || (child.from - startTime < 0)){
//				startTime = child.from;
//			}
//			if(endTime == 0 || (child.to - endTime > 0)){
//				endTime = child.to;
//			}
//			if(child.children.length > 0){
//				var childs = child.children;
//				for(var j = 0,m=childs.length;j<m;j++){
//					showData.push(childs[j]);
//				}
//			}
//		}
//		var rootList = s.get(TreeData);
//		for(var i = 0,l = rootList.length;i<l;i++){
//			var time = rootList[i];
//			if((time.customClass == "type-widget" || time.customClass == "type-win" || time.customClass == "type-net") && (((time.from > startTime)&&(time.from < endTime)) || ((time.to > startTime)&&(time.to < endTime)))){
//				showData.push(time);
//			}
//		}
//		return _getRenderData(showData);
//	}

/**
 * 复制时间点
 * */
let _copyTimePoint = function (timePoint) {
  let time = {}
  for (let key in timePoint) {
    if (timePoint.hasOwnProperty(key)) {
      time[key] = timePoint[key]
    }
  }
  return time
}
export { add, remove, clear, clearTreeData, genViewTimePoint }
