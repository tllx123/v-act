interface IRenderParam {
  scopeId: string
  less?: string
  templates?: any[]
}

interface ILessConfig {
  templates?: {}
  plugins: { install: (less: any, pluginManager: any) => any }[]
  javascriptEnabled?: boolean
}

interface IResult {
  css?: any
  templateId?: any
  template?: any
}

interface ILess {
  tree: {
    Element: (arg0: string, arg1: any, arg2: boolean) => any
    Attribute: new (arg0: any) => any
  }
}

interface IPluginManager {
  addVisitor: (arg0: {
    isPreEvalVisitor: boolean
    run: (root: any) => void
  }) => void
}

interface IParam {
  scopedId: string
  newVDeepSelector: string
}

interface rootRule {
  selectors: any
  rules: any
  features: any
}

interface IContext {
  currentSelector: any
  params: IParam
  $rootRules: rootRule[]
  currentRootRule: any
  rootRulesIndex?: number
  currentElements: any
  selectorIndex: number
}
