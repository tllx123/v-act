interface Resource {
  code: string
  hashCode: string
}

interface ComponentResource {
  $: {
    type: string
    fullName: string
    fileCode: string
    isDeleted: string
    hashCode: string
  }
  content: string
}

interface ComponentSchema {
  $: {
    code: string
    name: string
    desc: string
    matchVersion: string
  }
  resources: {
    resource: ComponentResource | ComponentResource[]
  }
}

const COMPONENT_MEMERY_CAHCE: {
  [componentCode: string]: {
    resources: Resource[]
  }
} = {}

/**
 * 解析构件schema
 * @param component 构件schema
 */
const parse = function (component: ComponentSchema) {
  if (component) {
    const code = component.$.code
    if (!COMPONENT_MEMERY_CAHCE[code]) {
      if (component.resources && component.resources.resource) {
        let resources = component.resources.resource
        resources = Array.isArray(resources) ? resources : [resources]
        const resourceList: Resource[] = []
        resources.forEach((res) => {
          resourceList.push({
            code: res.$.fullName,
            hashCode: res.$.hashCode
          })
        })
        COMPONENT_MEMERY_CAHCE[code] = { resources: resourceList }
      }
    }
  }
}

/**
 * 获取资源hashCode
 * @param componentCode 构件编号
 * @param code 资源编号
 */
const getResHashCode = function (componentCode: string, code: string) {
  const component = COMPONENT_MEMERY_CAHCE[componentCode]
  if (component) {
    const resources = component.resources
    if (resources && resources.length > 0) {
      for (let i = 0; i < resources.length; i++) {
        const resource = resources[i]
        if (resource.code === code) {
          return resource.hashCode
        }
      }
    }
  }
  return null
}

export { getResHashCode, parse }
