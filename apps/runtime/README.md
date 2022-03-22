# V-Act 预览环境

## 环境准备

全局安装以下插件，如已安装，请进入下一个步骤：

```js
npm i lerna -g
npm i rimraf -g
npm i rollup -g
npm i yarn -g
npm i mkdirp -g
npm i cpy-cli -g
```

## 初始化基础环境

cd 到 apps/runtime 下，执行以下命令：

```js
yarn
```

初始化 nodejs 插件

## 初始化 V-Act 插件

cd 到 v-act 根目录，执行以下命令：

```js
npm run init:runtime
```

## 启动预览服务

cd 到 apps/runtime 目录下，执行以下命令：

```js
npm run v3:start
```

## 预览开发系统窗体

### 部署构件

打包一个最新本地开发系统，在开发系统中新建构件，配置普通窗体。右键构件部署到本地，目录选择 apps/runtime/v3dev,如果 v3dev 目录不存在，请新建目录。

### 预览窗体

在浏览器中输入地址：

```js
http://localhost:port/componentCode/windowCode
```

port：服务端口号，在服务启动后，控制台有输出端口号信息，也可在 apps/runtime/metadata.json 文件的 previewPort 属性中获取。
componentCode：构件编号
windowCode：窗体编号

## 调试 vjs

当预览后发现 vjs 构件问题，可以在 v-act 根目录下，执行以下命令：

```js
node scripts/index.js build -s **
```

其中\*\*为 vjs 插件名称，可在 vjs 目录下的 package.json 中的 name 属性中获取。

## 调试规则

与调试 vjs 一样，\*\*替换成规则插件名称。

## 调试函数

与调试 vjs 一样，\*\*替换成插件插件名称。
