// 父类实例
let _super: object

/**
 * 设置父类实例(内置方法)
 *
 * @param {Object}
 *            _super 父类实例
 */
let __setSuper__ = function (_super: object) {
  // @ts-ignore
  this._super = _super
}

/**
 * 继承
 *
 * @param {Object}
 *            exp 子类实例
 * @param {Object}
 *            _super 父类实例
 */
let extend = function (exp: any, _super: any) {
  if (_super) {
    let subs: [] = _super._suber || []
    // @ts-ignore
    subs.push(exp)
    _super._suber = subs
    // @ts-ignore
    exp._super = _super
    for (let attr in _super) {
      if (attr == 'initModule' || attr == '_suber' || attr == '_super') {
        continue
      }
      if (!exp.hasOwnProperty(attr)) {
        exp[attr] = _super[attr]
      }
      _iterateChildren(exp, attr, exp[attr])
    }
  }
}

let _iterateChildren = function (_super: any, attr: any, val: any) {
  let m = _super._suber
  if (m) {
    for (let i = 0, child; (child = m[i]); i++) {
      if (child && !child.hasOwnProperty(attr)) {
        child[attr] = val
        _iterateChildren(child, attr, val)
      }
    }
  }
}

let _isSuper = function (_super: any): any {
  // @ts-ignore
  if (this._super) {
    // @ts-ignore
    if (this._super == _super) {
      return true
    } else {
      // @ts-ignore
      return _isSuper.call(this._super, _super)
    }
  } else {
    return false
  }
}

export { extend, _super, __setSuper__ }
