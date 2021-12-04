VAct组件模板
# 使用说明

## 初始化VAct组件

### 快速开始
使用以下命令快速开始初始化：
```sh
//npx
npx create-react-app my-vact --template=@v-act/component

//npm
npm init react-app my-vact --template=@v-act/component

//yarn
yarn create react-app my-vact --template=@v-act/component
```

### 全局安装脚手架
当然，还可以全局安装create-react-app，命令如下：
```sh
npm i -g create-react-app
```
使用create-react-app命令创建VAct组件，命令如下：
```sh
create-react-app my-vact --template=@v-act/component
```

## 启动开发环境
VAct组件初始化完成后，使用命令：
```sh
//npm
npm run vact:start

//yarn
yarn vact:start
```
启动开发环境。

# 开发VAct组件
在src/components目录下，添加自己组件定义，组件定义遵循React规范，具体请参考 [React官网](https://reactjs.org/)。

# 命令说明

## vact:start
启动VAct组件开发环境，支持热更新。
使用样例：
```sh
//npm
npm run vact:start

//yarn
yarn vact:start
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
//npm
npm run vact:publish
npm run vact:publish -u=test -p=*** -n=Task20211015048

//yarn
yarn vact:publish
yarn vact:publish -u=test -p=*** -n=Task20211015048
```
注意，如果当前构件存在vact:build命令，会自动执行该命令。

## vact:build
构建VAct组件，因VAct组件以 [Typescript](https://www.typescriptlang.org/)脚本编写，需要进行tsc编译；使用样例：
```sh
//npm
npm run vact:build

//yarn
yarn vact:build
```
注意：在执行vact:pack、vact:publish命令时，会自动执行该命令。

## vact:test
运行测试脚本，该命令会自动VAct组件中文件名以test.tsx结尾的所有文件并执行。
使用样例：
```sh
//npm
npm run vact:test

//yarn
yarn vact:test
```
详细信息请参考：[React Testing](https://create-react-app.dev/docs/running-tests)

## vact:doc
生成组件说明文档（暂未实现，敬请期待）；使用样例：
```sh
//npm
npm run vact:doc

//yarn
yarn run vact:doc
```

## vact:install
从VTeam中安装VAct组件，根据向导完成VAct组件安装。如未传递插件编号，则重新安装所有VAct组件。使用样例：
```sh
//npm
npm run vact:install
npm run vact:install D:\\test\\test.jar
npm run vact:install vactcomponentCode

//yarn
yarn vact:install
yarn vact:install D:\\test\\test.jar
yarn vact:install vactcomponentCode
```

## vact:clear
清除缓存信息，当执行vact:publish等命令时，会将用户账号、密码等信息缓存在本地，该命令将清除此缓存信息。使用样例：
```sh
//npm
npm run vact:clear

//yarn
yarn vact:clear
```

## vact:pack
将VAct打包成应用服务器构件，生成路径为当前VAct插件根目录，文件名为***.jar,使用样例：
```sh
//npm
npm run vact:pack

//yarn
yarn vact:pack
```
注意，如果当前构件存在vact:build命令，会自动执行该命令。