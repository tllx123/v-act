import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

import { File } from '@v-act/utils'

type OrginalSerializeType = string | number | boolean

type SerializeValue =
  | OrginalSerializeType
  | { [prop: string]: OrginalSerializeType }
  | Array<OrginalSerializeType>
class Cache {
  savePath: string

  data: { [prop: string]: SerializeValue }

  constructor(savePath: string) {
    this.data = {}
    this.savePath = savePath || path.resolve(__dirname, 'cache.json')
    this.load()
  }

  load() {
    try {
      let data = readFileSync(this.savePath)
      const content = data ? data.toString() : undefined
      if (content) {
        const datas = JSON.parse(content)
        for (const key in datas) {
          if (Object.prototype.hasOwnProperty.call(datas, key)) {
            const val = datas[key]
            this.data[key] = val
          }
        }
      }
    } catch (e) {
      this.clear()
    }
  }

  put(key: string, val: SerializeValue): void {
    this.data[key] = val
  }

  get(key: string): SerializeValue | undefined {
    return Object.prototype.hasOwnProperty.call(this.data, key)
      ? this.data[key]
      : undefined
  }

  save(): void {
    File.mkDir(path.resolve(this.savePath, '..'))
    writeFileSync(this.savePath, JSON.stringify(this.data, null, '\t'))
  }

  remove(key: string): void {
    delete this.data[key]
  }

  clear(): void {
    var self = this.data
    for (var key in self) delete self[key]
  }
}

export default Cache
