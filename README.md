# app_ui 功能介绍：
    桌面端跨平台的更新 BMC/BIOS 的 GUI 工具
    1. 选择配置文件，进行批量/单点 的更新 BIOS/BMC Rom
    2. 可以编辑、删除机器配置信息
    3. 可以导出当前配置

# 主要技术
1. 后端
   - Electron          负责构建跨平台的桌面应用程序
   - Electron-builder  负责程序的编译
   - nodejs            负责开发编译的宿主执行环境 
   - ES6、CommonJs     后端 JS 代码的组织方式及其语法规范，通过 Babel 转义 ES6                 

2. 前端
   - Vue              前端响应式 MVVM 框架
   - Vuex             负责组件间数据共享
   - VueRouter        前端路由、视图控制
   - ElementUI        提供前端页面 UI 组件
   - Axios            与 Web 后端数据交互，比如请求 API 或者上传、下载文件
   - Lodash           一个保持js环境统一、高性能的函数库

## 项目安装，期间可能遇到安装包下载不下来的问题，具体解决方法参考 开发记录.md
```
cd app_ui
npm install
```

### 开发环境下编译和热加载
```
npm run es
```

### 生产环境下编译打包
```
npm run eb
```

### 检查和修正文件语法错误
```
npm run lint
```

### 定制化修改可以参考
See [Configuration Reference](https://cli.vuejs.org/config/).


# 代码架构
## 1. electron 后端代码解耦重构，分成如下部分
    1. background.js 默认程序入口，  为了保持 electron-builder 打包配置和流程不变，请不要移动位置和更改文件名
    2. 新建 ipcMain 文件目录, 程序后端代码， 主要结构如下
        - core (核心代码，负责主进程启动和界面渲染)
            - ApplicationManager.js   负责 APP 初始化
            - Logger.js               日志记录
            - ProtocolManager.js      负责协议管理，目前代码没有用到，需要时统一在此处修改添加
        - ui  创建程序界面使用，负责初始化界面大小，模式
    3. package.json     项目配置

## 2. 前端目录划分
    1. main.js  前端界面入口
    2. App.vue  定义视图布局
    3. router   定义路由配置
    4. pages    定义具体页面
    5. components 定义页面相关组件
    6. assets     定义前端资源（图片、字体...）
    7. store      定义持久化数据及其相关操作
    8. style      定义前端CSS公用样式
    9. .eslintrc.js   定义 eslint 规则
    10. babel.config.js  定义 Babel 转码规则
    11. vue.config.js    定义 Vue 项目配置