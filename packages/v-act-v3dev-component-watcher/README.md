v平台开发系统构件监听
# 用途
开发系统中配置构件调整时，vact项目自动热更新，<font color='red'>注意：目前只支持按钮及文本控件</font>

# 使用方法
## 1、创建VAct项目
执行以下命令，创建VAct项目，如已存在VAct项目，请直接开始步骤2：
```sh
create-react-app --template=@vact/project
```
如提示create-react-app命令未定义，请全局安装create-react-app，如下：
```sh
npm install -g create-react-app
```
或
```sh
npx create-react-app --template=@vact/project
```
## 2、安装插件
安装 @v-act/v3dev-component-watcher 插件及组件
```sh
npm install @v-act/jgbutton @v-act/jgtextbox

npm install @v-act/v3dev-component-watcher --save-dev
```
## 3、获取开发系统业务构件目录
在开发系统中：右键业务构件-》在资源管理器中打开，得到构件目录。其目录结构应如下所示：
```sh
|-BizWindowInstance
|-Component
|-dev
|-Menu
|-Method
|-Query
|-Report
|-Resources
|-Table
|-V3ComponentData
|-VaruableConstant
|-Manifest.vmf
|-**.vcmp
```
## 4、调整package.json
### a、修改添加scripts命令
调整vact:start命令，由：
```js
//package.json
{
    "scripts":{
        "vact:watch": "vactWatch [开发系统业务构件目录]",
        ...
    }
}
```
例子：
```js
//package.json
{
    "scripts":{
        "vact:watch": "vactWatch D:\\demo\\component1",
        ...
    }
}
```
## 5、启动监听命令
执行以下命令，启动开发系统业务构件监听:
```sh
npm run vact:watch
```
## 6、启动VAct项目
执行以下命令，启动VAct项目:
```sh
npm run vact:start
```
## 7、开发系统中修改配置
在开发系统中新增窗体，调整窗体配置，保存后，浏览器自动刷新，更新页面。