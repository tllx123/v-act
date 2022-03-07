let pool = {},
  objectUtils

export function initModule(sb) {
  objectUtils = sb.util.object
}

const injectCurrentChannel = function (ch, pros) {
  pool[pros] = ch
}

const getCurrentChannelService = function (pros) {
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

export { injectCurrentChannel, getCurrentChannelService }
