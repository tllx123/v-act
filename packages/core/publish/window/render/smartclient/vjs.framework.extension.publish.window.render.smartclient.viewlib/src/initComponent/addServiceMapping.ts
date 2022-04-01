import { IManifest, IExtension } from '../interfase/initComponentInterface'
import { Mediator } from '@v-act/vjs.framework.extension.system.mediator'

const parseExtension = (extension: IExtension) => {
  let {
    $: { componentCode },
    metaReference: {
      $: { windowCode, metaCode, metaType }
    }
  } = extension
  return { componentCode, windowCode, metaCode, metaType }
}

export default (manifest: IManifest) => {
  if (!manifest || !manifest.serviceRegistration) return
  let { extensionPoint, extensions } =
    manifest.serviceRegistration.serviceMapping
  if (!extensions && !extensionPoint) return

  let impls = []
  if (Array.isArray(extensions)) {
    for (let item of extensions) {
      impls.push(parseExtension(item))
    }
  } else {
    impls.push(parseExtension(extensions.extension))
  }

  let serviceMappings = {
    'spi__ep_client-ruleSet': Object.assign(parseExtension(extensionPoint), {
      impls: impls
    })
  }
  Mediator.addServiceMapping(serviceMappings)
}
