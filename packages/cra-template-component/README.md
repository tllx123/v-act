VAct组件模板
# 使用说明
## 安装脚手架
全局安装create-react-app，命令如下：
```sh
npm install -g create-react-app
```
## 初始化VAct组件
使用create-react-app命令创建VAct组件，命令如下：
```sh
create-react-app my-vact --template=@v-act/component
```
## 启动开发环境
VAct组件初始化完成后，使用命令：
```sh
npm run vact:start
```
启动开发环境。
# 开发VAct组件
在src/components目录下，添加自己组件定义，组件定义遵循React规范，具体请参考 [React官网](https://reactjs.org/)。

# 命令说明
## vact:start
启动VAct组件开发环境，支持热更新。
使用样例：
```sh
npm run vact:start
```
## vact:publish
将组件部署到VTeam项目中，根据向导完成部署。
参数列表：
|  参数名称  |  参数描述  |  是否必填 |
|    :---:   |     :---:   |    :---:   |
|  -u  |  vteam账号  | 否 |
|  -p  |  vteam密码  | 否 |
|  -n  |  vteam单号  | 否 |

如未传递账号、密码及单号信息，将以向导的方式输入。使用样例：
```sh
npm run vact:publish

npm run vact:publish -u=test -p=*** -n=Task20211015048
```
## vact:build
构建VAct组件，因VAct组件以 [Typescript](https://www.typescriptlang.org/)方式编写，需要进行tsc编译；使用样例：
```sh
npm run vact:build
```
## vact:test
运行测试脚本，该命令会自动搜索src目录下文件名以test.tsx结尾的所有文件并执行。
使用样例：
```sh
npm run vact:test
```
## vact:doc
生成组件说明文档（暂未实现，敬请期待）；使用样例：
```sh
npm run vact:doc
```
## vact:install
从VTeam中安装VAct组件，根据向导完成VAct组件安装。如未传递插件编号，则重新安装所有VAct组件。使用样例：
```sh
npm run vact:install
npm run vact:install D:\\test\\test.jar
npm run vact:install vactcomponentCode
```
## vact:clear
清除缓存信息，当执行vact:publish等命令时，会将用户账号、密码等信息缓存在本地，该命令将清除此缓存信息。使用样例：
```sh
npm run vact:clear
```
## vact:pack
将VAct打包成应用服务器构件，生成路径为当前VAct插件根目录，文件名为***.jar,使用样例：
```sh
npm run vact:pack
```
