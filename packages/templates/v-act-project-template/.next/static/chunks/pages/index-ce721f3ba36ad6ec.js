(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{3255:function(e,t,o){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return o(4796)}])},4796:function(e,t,o){"use strict";o.r(t);var r=o(2322),n=o(7729),i=o(2399),a=o(7209),c=o.n(a),s=o(2231),u=(0,s.createTheme)();t.default=function(){return console.log("*****************************************pages/index.tsx*****************************************"),(0,r.jsx)(s.ThemeProvider,{theme:u,children:(0,r.jsxs)("div",{className:c().container,children:[(0,r.jsxs)(n.default,{children:[(0,r.jsx)("title",{children:"VAct\u9879\u76ee\u6837\u4f8b"}),(0,r.jsx)("meta",{name:"description",content:"\u7531create-react-app\u521b\u5efa"}),(0,r.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,r.jsx)(i.default,{})]})})}},2399:function(e,t,o){"use strict";o.r(t),o.d(t,{default:function(){return s}});var r=o(2322),n={src:"/v-act-project-template/_next/static/media/logo.96c2f0ae.svg",height:256,width:256},i=o(6077),a=o.n(i),c=o(2231);var s=function(){console.log("**************************************pages/intro/index.tsx*********************************");var e=(0,c.useTheme)();return(0,r.jsx)("div",{className:a().demo,children:(0,r.jsxs)("div",{className:a().content,style:{color:e.vact.primaryColor},children:[(0,r.jsx)("img",{src:n,className:a().logo,alt:"logo"}),(0,r.jsx)("h1",{children:"\u6b22\u8fce\u8fdb\u884cVAct\u9879\u76ee\u5f00\u53d1"}),(0,r.jsx)("h6",{children:"\u8fd9\u662f\u4f60\u662f\u5929\u9a6c\u884c\u7a7a\u7684\u521b\u4f5c\u5929\u5730"}),(0,r.jsxs)("p",{children:["\u7f16\u8f91",(0,r.jsx)("code",{children:"pages/intro/Index.tsx"}),"\u6587\u4ef6\u8bd5\u8bd5\u5427\uff01"]}),(0,r.jsx)("a",{className:"link",href:"https://reactjs.org",target:"_blank",rel:"noopener noreferrer",children:"\u5f00\u59cb\u5b66\u4e60"})]})})}},6077:function(e){e.exports={demo:"intro_demo___mb83",logo:"intro_logo___Zgl4",header:"intro_header__ILXaD",content:"intro_content__MJc0D",link:"intro_link__lS6Oy"}},7209:function(e){e.exports={container:"Home_container__bCOhY",main:"Home_main__nLjiQ",footer:"Home_footer____T7K",title:"Home_title__T09hD",description:"Home_description__41Owk",code:"Home_code__suPER",grid:"Home_grid__GxQ85",card:"Home_card___LpL1",logo:"Home_logo__27_tb"}},7729:function(e,t,o){e.exports=o(5913)},7547:function(e,t,o){"use strict";var r=this&&this.__extends||function(){var e=function(t,o){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])})(t,o)};return function(t,o){if("function"!==typeof o&&null!==o)throw new TypeError("Class extends value "+String(o)+" is not a constructor or null");function r(){this.constructor=t}e(t,o),t.prototype=null===o?Object.create(o):(r.prototype=o.prototype,new r)}}(),n=this&&this.__assign||function(){return(n=Object.assign||function(e){for(var t,o=1,r=arguments.length;o<r;o++)for(var n in t=arguments[o])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e}).apply(this,arguments)},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.VactThemeProvider=void 0;var a=o(2322),c=i(o(2784)),s=o(7646),u=o(704),l=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.themeHandler=null,t.theme=null,t.state={theme:Object,_useStateTheme:!1},t}return r(t,e),t.prototype.componentDidMount=function(){var e=this,t=this.state.theme;this.themeHandler=function(t){e.setState({theme:t,_useStateTheme:!0})},u.EventManager.register(t,this.themeHandler)},t.prototype.componentWillReceiveProps=function(){this.setState({_useStateTheme:!1})},t.prototype.componentWillUnmount=function(){null!=this.themeHandler&&u.EventManager.unRegister(this.themeHandler)},t.prototype.render=function(){var e=this.state._useStateTheme?this.state.theme:this.props.theme;return(0,a.jsx)(s.ThemeProvider,n({theme:e},{children:this.props.children}),void 0)},t}(c.default.Component);t.VactThemeProvider=l},142:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0})},903:function(e,t,o){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var n=r(o(1089)),i=o(477),a=r(o(85)),c="Vact",s=n.default,u=new a.default(c,"Vact\u9ed8\u8ba4\u4e3b\u9898",s),l=[u],f=new(function(){function e(){}return e.prototype.getCode=function(){return c},e.prototype.getDefaultTheme=function(){return u},e.prototype.getThemes=function(){return l},e}());i.ThemePackageFactroy.register(f),t.default=f},2231:function(e,t,o){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,o,r){void 0===r&&(r=o),Object.defineProperty(e,r,{enumerable:!0,get:function(){return t[o]}})}:function(e,t,o,r){void 0===r&&(r=o),e[r]=t[o]}),n=this&&this.__exportStar||function(e,t){for(var o in e)"default"===o||Object.prototype.hasOwnProperty.call(t,o)||r(t,e,o)};Object.defineProperty(t,"__esModule",{value:!0}),o(142),n(o(8475),t)},477:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ThemePackageFactroy=void 0;var o=new(function(){function e(){this.packs={}}return e.prototype.register=function(e){this.packs[e.getCode()]=e},e.prototype.unRegister=function(e){delete this.packs[e.getCode()]},e.prototype.getPack=function(e){return this.packs[e]},e.prototype.getPacks=function(){return Object.values(this.packs)},e}());t.ThemePackageFactroy=o},704:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.EventManager=void 0;var o=new(function(){function e(){this.pool=[]}return e.prototype.register=function(e,t){this.pool.push(t)},e.prototype.unRegister=function(e){for(var t=this.pool,o=t.length-1;o>=t.length;o--){if(t[o]===e){t.splice(o,1);break}}},e.prototype.fire=function(e){for(var t=this.pool,o=0;o<t.length;o++){console.log("fire"),(0,t[o])(e)}},e}());t.EventManager=o},8475:function(e,t,o){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,o,r){void 0===r&&(r=o),Object.defineProperty(e,r,{enumerable:!0,get:function(){return t[o]}})}:function(e,t,o,r){void 0===r&&(r=o),e[r]=t[o]}),n=this&&this.__exportStar||function(e,t){for(var o in e)"default"===o||Object.prototype.hasOwnProperty.call(t,o)||r(t,e,o)},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.createTheme=t.ThemeInfo=t.setTheme=t.getThemes=t.ThemeFactory=t.ThemeProvider=void 0;var a=o(2741),c=o(7547);Object.defineProperty(t,"ThemeProvider",{enumerable:!0,get:function(){return c.VactThemeProvider}});var s=o(704),u=i(o(85));t.ThemeInfo=u.default;var l=o(477);Object.defineProperty(t,"ThemeFactory",{enumerable:!0,get:function(){return l.ThemePackageFactroy}});var f=i(o(903));n(o(952),t),t.getThemes=function(){return f.default.getThemes()},t.setTheme=function(e){var t=e.getCode(),o=f.default.getThemes().filter((function(e){return e.getCode()==t}));if(o.length>0){var r=o[0].toMap(),n=(0,a.createTheme)(r);s.EventManager.fire(n)}},t.createTheme=function(e){var t;if(null==e){var o=f.default.getDefaultTheme();if(o)t=o.toMap()}else t=e;return(0,a.createTheme)(t)}},85:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t,o){this.code="defaultTheme",this.name="\u9ed8\u8ba4\u4e3b\u9898",this.code=e,this.name=t,this.vact=o}return e.prototype.setCode=function(e){this.code=e},e.prototype.setName=function(e){this.name=e},e.prototype.setVact=function(e){this.vact=e},e.prototype.getCode=function(){return this.code},e.prototype.getName=function(){return this.name},e.prototype.getVact=function(){return this.vact},e.prototype.toMap=function(){return{code:this.code,name:this.name,vact:this.vact}},e}();t.default=o},1089:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={primaryColor:"#356bbc",infoColor:"#2db7f5",successColor:"#19be6b",warningColor:"#ff9900",errorColor:"#ed3f14",linkColor:"#0079fe",textTitleColor:"#2e3740",textBaseColor:"#556373",textSecondaryColor:"#919191",borderRadiusBase:"4px",borderRadiusSmall:"2px",borderBaseColor:"#dadde0",borderSplitColor:"#e1e4e8",backgroundBaseColor:"#f5f7fa",backgroundStripeColor:"#f5f7fa",disabledColor:"#b1b5ba",disabledBg:"#f5f7fa"}}},function(e){e.O(0,[872,774,888,179],(function(){return t=3255,e(e.s=t);var t}));var t=e.O();_N_E=t}]);