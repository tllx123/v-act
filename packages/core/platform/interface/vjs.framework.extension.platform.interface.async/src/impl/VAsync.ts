let AsyncBuilder = function () {}
AsyncBuilder.prototype = {
  Start: function (_this: any, task: any) {
    task.next(_this, function (type: any, value: any, target: any) {
      if (type == 'normal' || type == 'return') {
      } else if (type == 'throw') {
      } else {
        throw new Error('Unsupported type: ' + type)
      }
    })
  },
  Bind: function (task: any, generator: any) {
    return {
      next: function (_this: any, callback: any) {
        var onComplete = function () {
          // if (this.error) {
          //     callback("throw", this.error);
          // } else {
          var nextTask
          //try {
          nextTask = generator.apply(_this, arguments)
          /*} catch(ex) {
                        callback("throw", ex);
                        return;
                    }*/
          nextTask.next(_this, callback) // }
        }
        task.apply(this, [onComplete]) // if (task.status == "ready") {
        //     task.addEventListener("complete", onComplete);
        //     task.start();
        // } else if (task.status == "running") {
        //     task.addEventListener("complete", onComplete);
        // } else {
        //     onComplete.call(task);
        // }
      }
    }
  },
  Delay: function (generator: any) {
    return {
      next: function (_this: any, callback: any) {
        //try {
        var step = generator.call(_this)
        step.next(_this, callback)
        /*} catch(ex) {
                    callback("throw", ex);
                }*/
      }
    }
  },
  Combine: function (s1: any, s2: any) {
    return {
      next: function (_this: any, callback: any) {
        s1.next(_this, function (type: any, value: any, target: any) {
          if (type == 'normal') {
            //try {
            s2.next(_this, callback)
            /*} catch(ex) {
                            callback("throw", ex);
                        }*/
          } else {
            callback(type, value, target)
          }
        })
      }
    }
  },
  Return: function (result: any) {
    return {
      next: function (_this: any, callback: any) {
        callback('return', result)
      }
    }
  },
  Normal: function () {
    return {
      next: function (_this: any, callback: any) {
        callback('normal')
      }
    }
  },
  Break: function () {
    return {
      next: function (_this: any, callback: any) {
        callback('break')
      }
    }
  },
  Continue: function () {
    return {
      next: function (_this: any, callback: any) {
        callback('continue')
      }
    }
  },
  Throw: function (ex: any) {
    return {
      next: function (_this: any, callback: any) {
        callback('throw', ex)
      }
    }
  },
  For: function (condition: any, update: any, body: any) {
    return {
      next: function (_this: any, callback: any) {
        var loop = function (skipUpdate: any) {
          try {
            if (update && !skipUpdate) {
              update.call(_this)
            }

            if (!condition || condition.call(_this)) {
              body.next(_this, function (type: any, value: any, target: any) {
                if (type == 'normal' || type == 'continue') {
                  loop(false)
                } else if (type == 'throw' || type == 'return') {
                  callback(type, value)
                } else if (type == 'break') {
                  callback('normal')
                } else {
                  throw new Error('Invalid type for "Loop": ' + type)
                }
              })
            } else {
              callback('normal')
            }
          } catch (ex) {
            callback('throw', ex)
          }
        }

        loop(true)
      }
    }
  },
  Try: function (tryTask: any, catchGenerator: any, finallyStep: any) {
    return {
      next: function (_this: any, callback: any) {
        tryTask.next(_this, function (type: any, value: any, target: any) {
          if (type != 'throw' || !catchGenerator) {
            if (!finallyStep) {
              callback(type, value, target)
            } else {
              finallyStep.next(
                _this,
                function (
                  finallyType: any,
                  finallyValue: any,
                  finallyTarget: any
                ) {
                  if (finallyType == 'normal') {
                    callback(type, value, target)
                  } else {
                    callback(finallyType, finallyValue, finallyTarget)
                  }
                }
              )
            }
          } else {
            if (catchGenerator) {
              var catchTask
              try {
                catchTask = catchGenerator.call(_this, value)
              } catch (ex) {
                if (finallyStep) {
                  finallyStep.next(
                    _this,
                    function (
                      finallyType: any,
                      finallyValue: any,
                      finallyTarget: any
                    ) {
                      if (finallyType == 'normal') {
                        callback('throw', ex)
                      } else {
                        callback(finallyType, finallyValue, finallyTarget)
                      }
                    }
                  )
                } else {
                  callback('throw', ex)
                }
              }
              if (catchTask) {
                catchTask.next(
                  _this,
                  function (catchType: any, catchValue: any, catchTarget: any) {
                    if (catchType == 'throw') {
                      if (finallyStep) {
                        finallyStep.next(
                          _this,
                          function (
                            finallyType: any,
                            finallyValue: any,
                            finallyTarget: any
                          ) {
                            if (finallyType == 'normal') {
                              callback(catchType, catchValue, catchTarget)
                            } else {
                              callback(finallyType, finallyValue, finallyTarget)
                            }
                          }
                        )
                      } else {
                        callback(catchType, catchValue, catchTarget)
                      }
                    } else {
                      if (finallyStep) {
                        finallyStep.next(
                          _this,
                          function (
                            finallyType: any,
                            finallyValue: any,
                            finallyTarget: any
                          ) {
                            if (finallyType == 'normal') {
                              callback(catchType, catchValue, catchTarget)
                            } else {
                              callback(finallyType, finallyValue, finallyTarget)
                            }
                          }
                        )
                      } else {
                        callback(catchType, catchValue, catchTarget)
                      }
                    }
                  }
                )
              }
            } else {
              finallyStep.next(
                _this,
                function (
                  finallyType: any,
                  finallyValue: any,
                  finallyTarget: any
                ) {
                  if (finallyType == 'normal') {
                    callback(type, value, target)
                  } else {
                    callback(finallyType, finallyValue, finallyTarget)
                  }
                }
              )
            }
          }
        })
      }
    }
  }
}

let _cache = new AsyncBuilder()

let getInstance = function () {
  return _cache
}
export { getBuilder, getInstance }
