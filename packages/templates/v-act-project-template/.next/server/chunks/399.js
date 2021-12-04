exports.id = 399;
exports.ids = [399];
exports.modules = {

/***/ 300:
/***/ ((module) => {

// Exports
module.exports = {
	"demo": "intro_demo___mb83",
	"logo": "intro_logo___Zgl4",
	"header": "intro_header__ILXaD",
	"content": "intro_content__MJc0D",
	"link": "intro_link__lS6Oy"
};


/***/ }),

/***/ 399:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Index)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
;// CONCATENATED MODULE: ./pages/intro/img/logo.svg
/* harmony default export */ const logo = ({"src":"/v-act-project-template/_next/static/media/logo.96c2f0ae.svg","height":256,"width":256});
// EXTERNAL MODULE: ./pages/intro/css/intro.module.css
var intro_module = __webpack_require__(300);
var intro_module_default = /*#__PURE__*/__webpack_require__.n(intro_module);
// EXTERNAL MODULE: ../v-act-styles/dist/index.js
var dist = __webpack_require__(231);
;// CONCATENATED MODULE: ./pages/intro/Index.tsx




function Intro() {
    console.log("**************************************pages/intro/index.tsx*********************************");
    debugger;
    const theme = (0,dist.useTheme)();
    return(/*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: (intro_module_default()).demo,
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
            className: (intro_module_default()).content,
            style: {
                color: theme.vact.primaryColor
            },
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx("img", {
                    src: logo,
                    className: (intro_module_default()).logo,
                    alt: "logo"
                }),
                /*#__PURE__*/ jsx_runtime_.jsx("h1", {
                    children: "欢迎进行VAct项目开发"
                }),
                /*#__PURE__*/ jsx_runtime_.jsx("h6", {
                    children: "这是你是天马行空的创作天地"
                }),
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("p", {
                    children: [
                        "编辑",
                        /*#__PURE__*/ jsx_runtime_.jsx("code", {
                            children: "pages/intro/Index.tsx"
                        }),
                        "文件试试吧！"
                    ]
                }),
                /*#__PURE__*/ jsx_runtime_.jsx("a", {
                    className: "link",
                    href: "https://reactjs.org",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: "开始学习"
                })
            ]
        })
    }));
}
/* harmony default export */ const Index = (Intro);


/***/ }),

/***/ 547:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VactThemeProvider = void 0;
var jsx_runtime_1 = __webpack_require__(997);
var react_1 = __importDefault(__webpack_require__(689));
var styles_1 = __webpack_require__(484);
var EventManager_1 = __webpack_require__(704);
/**
 * vact主题提供者
 */
var VactThemeProvider = /** @class */ (function (_super) {
    __extends(VactThemeProvider, _super);
    function VactThemeProvider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.themeHandler = null;
        _this.theme = null;
        _this.state = {
            theme: Object,
            _useStateTheme: false //判断是否使用state的theme
        };
        return _this;
    }
    VactThemeProvider.prototype.componentDidMount = function () {
        var _this = this;
        var theme = this.state.theme;
        this.themeHandler = function (newTheme) {
            _this.setState({
                theme: newTheme,
                _useStateTheme: true
            });
        };
        EventManager_1.EventManager.register(theme, this.themeHandler);
    };
    VactThemeProvider.prototype.componentWillReceiveProps = function () {
        this.setState({
            _useStateTheme: false
        });
    };
    VactThemeProvider.prototype.componentWillUnmount = function () {
        this.themeHandler != null && EventManager_1.EventManager.unRegister(this.themeHandler);
    };
    VactThemeProvider.prototype.render = function () {
        var theme = this.state._useStateTheme ? this.state.theme : this.props.theme;
        return ((0, jsx_runtime_1.jsx)(styles_1.ThemeProvider, __assign({ theme: theme }, { children: this.props.children }), void 0));
    };
    return VactThemeProvider;
}(react_1.default.Component));
exports.VactThemeProvider = VactThemeProvider;


/***/ }),

/***/ 142:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 903:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var default_1 = __importDefault(__webpack_require__(89));
var IThemePackage_1 = __webpack_require__(477);
var ThemeInfo_1 = __importDefault(__webpack_require__(85));
var vactCode = "Vact";
var vactName = "Vact默认主题";
var vact = default_1.default;
var defaultTheme = new ThemeInfo_1.default(vactCode, vactName, vact);
var themes = [defaultTheme];
var VactImpl = /** @class */ (function () {
    function VactImpl() {
    }
    VactImpl.prototype.getCode = function () {
        return vactCode;
    };
    /**
     * 获取默认主题对象
     * @returns {ThemeInfo} 默认主题对象
     */
    VactImpl.prototype.getDefaultTheme = function () {
        return defaultTheme;
    };
    /**
     * 获取所有主题信息
     * @returns 所有主题信息
     */
    VactImpl.prototype.getThemes = function () {
        return themes;
    };
    return VactImpl;
}());
var instance = new VactImpl();
IThemePackage_1.ThemePackageFactroy.register(instance);
exports["default"] = instance;


/***/ }),

/***/ 231:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(142);
__exportStar(__webpack_require__(475), exports);


/***/ }),

/***/ 477:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ThemePackageFactroy = void 0;
/**
 * 主题包工厂
 */
var ThemePackageFactroy = /** @class */ (function () {
    function ThemePackageFactroy() {
        this.packs = {};
    }
    /**
     * 注册主题包
     * @param pack 主题包对象
     */
    ThemePackageFactroy.prototype.register = function (pack) {
        this.packs[pack.getCode()] = pack;
    };
    /**
     * 卸载主题包
     * @param packObj 主题包对象
     */
    ThemePackageFactroy.prototype.unRegister = function (packObj) {
        delete this.packs[packObj.getCode()];
    };
    /**
     * 获取主题包对象
     * @param code 主题包标志
     * @returns 主题包对象
     */
    ThemePackageFactroy.prototype.getPack = function (code) {
        return this.packs[code];
    };
    /**
     * 获取所有主题包
     * @returns 所有主题包
     */
    ThemePackageFactroy.prototype.getPacks = function () {
        return Object.values(this.packs);
    };
    return ThemePackageFactroy;
}());
var instance = new ThemePackageFactroy();
exports.ThemePackageFactroy = instance;


/***/ }),

/***/ 704:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventManager = void 0;
/**
 * 事件管理者
 */
var VactEventManager = /** @class */ (function () {
    function VactEventManager() {
        this.pool = [];
    }
    /**
     * 注册事件回调
     * @param theme 主题对象
     * @param callback 主题回调
     */
    VactEventManager.prototype.register = function (theme, callback) {
        this.pool.push(callback);
    };
    VactEventManager.prototype.unRegister = function (callback) {
        var handlers = this.pool;
        for (var index = handlers.length - 1; index >= handlers.length; index--) {
            var handler = handlers[index];
            if (handler === callback) {
                handlers.splice(index, 1);
                break;
            }
        }
    };
    /**
     * 触发主题回调
     * @param theme 主题对象
     */
    VactEventManager.prototype.fire = function (theme) {
        var handlers = this.pool;
        for (var index = 0; index < handlers.length; index++) {
            console.log("fire");
            var handler = handlers[index];
            handler(theme);
            // break;
        }
    };
    return VactEventManager;
}());
var instance = new VactEventManager();
exports.EventManager = instance;


/***/ }),

/***/ 475:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createTheme = exports.ThemeInfo = exports.setTheme = exports.getThemes = exports.ThemeFactory = exports.ThemeProvider = void 0;
var material_1 = __webpack_require__(692);
var VactThemeProvider_1 = __webpack_require__(547);
Object.defineProperty(exports, "ThemeProvider", ({ enumerable: true, get: function () { return VactThemeProvider_1.VactThemeProvider; } }));
var EventManager_1 = __webpack_require__(704);
var ThemeInfo_1 = __importDefault(__webpack_require__(85));
exports.ThemeInfo = ThemeInfo_1.default;
var IThemePackage_1 = __webpack_require__(477);
Object.defineProperty(exports, "ThemeFactory", ({ enumerable: true, get: function () { return IThemePackage_1.ThemePackageFactroy; } }));
var VactImpl_1 = __importDefault(__webpack_require__(903));
__exportStar(__webpack_require__(442), exports);
/**
 * 当前使用主题
 */
// let nowTheme;
/**
 * 获取主题列表
 * @returns {Array<ThemeInfo>}
 * {
 *  code    主题编码
 *  name    主题名称
 * }
 */
function getThemes() {
    return VactImpl_1.default.getThemes();
}
exports.getThemes = getThemes;
/**
 * 设置主题
 * @param {ThemeInfo} themeInfo 主题对象
 */
function setTheme(themeInfo) {
    var themeCode = themeInfo.getCode();
    var themes = VactImpl_1.default.getThemes();
    var newThemes = themes.filter(function (item) {
        return item.getCode() == themeCode;
    });
    if (newThemes.length > 0) {
        var themeOption = (newThemes[0].toMap());
        var newTheme = (0, material_1.createTheme)(themeOption);
        EventManager_1.EventManager.fire(newTheme);
    }
}
exports.setTheme = setTheme;
/**
 * 创建主题
 * @param props {Object|undefined} 主题属性
 * @returns
 */
function createVactTheme(props) {
    var themeOptions;
    if (null == props) {
        var defaultTheme = VactImpl_1.default.getDefaultTheme();
        if (defaultTheme) {
            var map = defaultTheme.toMap();
            themeOptions = map;
        }
    }
    else {
        themeOptions = props;
    }
    var theme = (0, material_1.createTheme)(themeOptions);
    return theme;
}
exports.createTheme = createVactTheme;


/***/ }),

/***/ 85:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * 第三方对接的主题对象
 */
var ThemeInfo = /** @class */ (function () {
    function ThemeInfo(code, name, vact) {
        //主题编码
        this.code = "defaultTheme";
        //主题名称
        this.name = "默认主题";
        this.code = code;
        this.name = name;
        this.vact = vact;
    }
    /**
     * 设置主题编码
     * @param code 主题编码
     */
    ThemeInfo.prototype.setCode = function (code) {
        this.code = code;
    };
    /**
     * 设置主题名称
     * @param name 主题名称
     */
    ThemeInfo.prototype.setName = function (name) {
        this.name = name;
    };
    /**
     * 设置主题变量
     * @param vact 主题变量
     */
    ThemeInfo.prototype.setVact = function (vact) {
        this.vact = vact;
    };
    /**
     * 获取主题编码
     * @returns 主题编码
     */
    ThemeInfo.prototype.getCode = function () {
        return this.code;
    };
    /**
     * 获取主题名称
     * @returns 主题名称
     */
    ThemeInfo.prototype.getName = function () {
        return this.name;
    };
    /**
     * 获取主题变量
     * @returns 主题变量
     */
    ThemeInfo.prototype.getVact = function () {
        return this.vact;
    };
    /**
     * 转成map对象
     */
    ThemeInfo.prototype.toMap = function () {
        return {
            code: this.code,
            name: this.name,
            vact: this.vact
        };
    };
    return ThemeInfo;
}());
exports["default"] = ThemeInfo;


/***/ }),

/***/ 89:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = {
    primaryColor: "#356bbc",
    infoColor: "#2db7f5",
    successColor: "#19be6b",
    warningColor: "#ff9900",
    errorColor: "#ed3f14",
    linkColor: "#0079fe",
    textTitleColor: "#2e3740",
    textBaseColor: "#556373",
    textSecondaryColor: "#919191",
    borderRadiusBase: "4px",
    borderRadiusSmall: "2px",
    borderBaseColor: "#dadde0",
    borderSplitColor: "#e1e4e8",
    backgroundBaseColor: "#f5f7fa",
    backgroundStripeColor: "#f5f7fa",
    disabledColor: "#b1b5ba",
    disabledBg: "#f5f7fa"
};


/***/ })

};
;