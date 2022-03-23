import { VPlatformContract } from '@v-act/vjs.framework.extension.system.rpc.contract.vplatform'
import { MultiVPlatformContract } from '@v-act/vjs.framework.extension.system.rpc.contract.vplatform'
import { ExtensionVPlatformContract } from '@v-act/vjs.framework.extension.system.rpc.contract.vplatform'
import { Contract } from '@v-act/vjs.framework.extension.system.rpc.contract.vplatform'

let pool: { [code: string]: any } = {},
  objectUtils: any

const injectCurrentContract = function (py: any, pros: any) {
  pool[pros] = py
}

const getCurrentContractService = function (pros: any) {
  let type = typeof pros
  if (type == 'string' || pros === null) {
    return pool[pros]
  } else if (type == 'object') {
    for (let p in pool) {
      if (objectUtils.isEqual(p, pros)) {
        return pool[p]
      }
    }
  }
  return null
}

injectCurrentContract(VPlatformContract, 'vPlatform')
injectCurrentContract(MultiVPlatformContract, 'multiVPlatform')
injectCurrentContract(ExtensionVPlatformContract, 'extensionVPlatform')
injectCurrentContract(Contract, null)

export { injectCurrentContract, getCurrentContractService }
