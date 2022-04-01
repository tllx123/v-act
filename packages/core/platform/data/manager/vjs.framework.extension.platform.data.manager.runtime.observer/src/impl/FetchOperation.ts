import AbstractOperation from './AbstractOperation'

class Operation extends AbstractOperation {
  operationType = 'Fetch'

  constructor(params: any) {
    super(params)
  }
  _combineFetched(operation: any, isBehind: boolean) {
    this.markDestroy()
    operation.markDestroy()
  }
}

export default Operation
