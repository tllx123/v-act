// 父类实例
let _super = null

/**
 * 设置父类实例(内置方法)
 *
 * @param {Object}
 *            _super 父类实例
 */
let __setSuper__ = function (_super) {
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
let extend = function (exp, _super) {
  if (_super) {
    let subs = _super._suber || []
    subs.push(exp)
    _super._suber = subs
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

let _iterateChildren = function (_super, attr, val) {
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

let _isSuper = function (_super) {
  if (this._super) {
    if (this._super == _super) {
      return true
    } else {
      return _isSuper.call(this._super, _super)
    }
  } else {
    return false
  }
}

export { extend, _super, __setSuper__ }