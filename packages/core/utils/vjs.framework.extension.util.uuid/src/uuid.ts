const generate = (): string => {
  let S4 = (): string =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()
}

export { generate }
