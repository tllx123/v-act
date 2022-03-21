let instance

const putInstance = function (ins: any) {
  instance = ins
}

const addListener = function (callbacks: any) {
  instance.addListener(callbacks)
}

export { addListener }
