interface ruleSet {
  ruleInstances: ruleInstancesSchema
  ruleRoute: {
    $: { code: string }
    //属性值
    _: string | any[]
  }
}

interface logicType {
  $: { type: string }
  ruleInstances: ruleInstancesSchema
  ruleSets: {
    ruleSet: ruleSet
  }
}

interface XMLElementObj {
  tagName: string
  attrs: { [key: string]: string | number | undefined }
  children: Array<string | number | boolean | undefined | XMLElementObj>
}

interface routeParamsSchema {
  handler: Function | null
  ruleInstances: {}
  transactionInfo: {}
}

interface ruleInstanceSchema {
  $: {
    instanceCode: string
    instanceName: string
    isEnabled: string
    isNeedLog: string
    ruleCode: string
    ruleName: string
    transactionType: string
  }
  condition?: string
  ruleConfig: string
}

interface ruleInstancesSchema {
  ruleInstance: ruleInstanceSchema | ruleInstanceSchema[]
}

export type {
  ruleSet,
  logicType,
  XMLElementObj,
  routeParamsSchema,
  ruleInstanceSchema,
  ruleInstancesSchema
}
