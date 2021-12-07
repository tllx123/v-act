此目录主要存放v-act控件

# 开发说明
## 初始化环境
在v-act目录下执行以下命令：
```sh
yarn
```
## 控件开发
### 创建控件目录
在packages/widgets目录下创建控件目录，控件编码及nodejs插件编码参考：(V-Act控件清单)[https://docs.qq.com/sheet/DUEJLVUdKWmFoWEhH]
例：文本控件，在packages/widgets中新建JGTextBox目录，其package.json中name对应文档中包名：@v-act/jgtextbox
### 创建控件定义文件
建议从其他控件中拷贝全部文件过来修改
## 控件验证
### 控件开发环境
在v-act目录下执行以下命令：
```sh
yarn dev:widgets
```
此时，控件源码调整，会自动进行编译。
### 验证环境
新建一个终端，cd到packages/widgets/__dev__目录下，执行命令：
```sh
yarn dev
```
在__dev__/src/widgets目录下创建属于自己控件编号目录，编写测试代码。
调整__dev__/src/routes.tsx,添加控件测试页面路由，然后访问。
