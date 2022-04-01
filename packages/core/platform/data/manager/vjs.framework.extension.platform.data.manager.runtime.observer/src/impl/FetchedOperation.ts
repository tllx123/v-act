import AbstractOperation from './AbstractOperation'

class Operation extends AbstractOperation {
  operationType = 'Fetched'

  constructor(params: any) {
    super(params)
  }

  _combineFetch(operation: any, isBehind: boolean) {
    operation.markDestroy()
    this.markDestroy()
  }
}

export default Operation
