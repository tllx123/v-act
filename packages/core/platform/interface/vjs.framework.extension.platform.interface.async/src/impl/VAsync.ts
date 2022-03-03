let AsyncBuilder = function () {}
AsyncBuilder.prototype = {
  Start: function (_this, task) {
    task.next(_this, function (type, value, target) {
      if (type == 'normal' || type == 'return') {
      } else if (type == 'throw') {
      } else {
        throw new Error('Unsupported type: ' + type)
      }
    })
  },
  Bind: function (task, generator) {
    return {
      next: function (_this, callback) {
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
  Delay: function (generator) {
    return {
      next: function (_this, callback) {
        //try {
        var step = generator.call(_this)
        step.next(_this, callback)
        /*} catch(ex) {
                    callback("throw", ex);
                }*/
      }
    }
  },
  Combine: function (s1, s2) {
    return {
      next: function (_this, callback) {
        s1.next(_this, function (type, value, target) {
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
  Return: function (result) {
    return {
      next: function (_this, callback) {
        callback('return', result)
      }
    }
  },
  Normal: function () {
    return {
      next: function (_this, callback) {
        callback('normal')
      }
    }
  },
  Break: function () {
    return {
      next: function (_this, callback) {
        callback('break')
      }
    }
  },
  Continue: function () {
    return {
      next: function (_this, callback) {
        callback('continue')
      }
    }
  },
  Throw: function (ex) {
    return {
      next: function (_this, callback) {
        callback('throw', ex)
      }
    }
  },
  For: function (condition, update, body) {
    return {
      next: function (_this, callback) {
        var loop = function (skipUpdate) {
          try {
            if (update && !skipUpdate) {
              update.call(_this)
            }

            if (!condition || condition.call(_this)) {
              body.next(_this, function (type, value, target) {
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
  Try: function (tryTask, catchGenerator, finallyStep) {
    return {
      next: function (_this, callback) {
        tryTask.next(_this, function (type, value, target) {
          if (type != 'throw' || !catchGenerator) {
            if (!finallyStep) {
              callback(type, value, target)
            } else {
              finallyStep.next(
                _this,
                function (finallyType, finallyValue, finallyTarget) {
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
                    function (finallyType, finallyValue, finallyTarget) {
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
                  function (catchType, catchValue, catchTarget) {
                    if (catchType == 'throw') {
                      if (finallyStep) {
                        finallyStep.next(
                          _this,
                          function (finallyType, finallyValue, finallyTarget) {
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
                          function (finallyType, finallyValue, finallyTarget) {
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
                function (finallyType, finallyValue, finallyTarget) {
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
