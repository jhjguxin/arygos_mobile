## Get Started

本项目基于 Uni-App 初始化

主要使用的插件

- compile-node-sass
- ThorUI组件库
- vuex

## 注意  

1. 项目需开启 `Sass/Scss`（HBuilderX v2.8.11 - 工具 - 插件安装 - Sass）     
2. 服务器数据请求地址更改：`./service/request/index.js` 下的 `config.baseUrl`   
3. `manifest.json`源码中`H5`已开启代理。

```json
"h5" : {
  "devServer" : {
    "https" : false,
    "port": 8000,
    "disableHostCheck": true,
    "proxy": {
      "/mock": {
        "target": "http://raw.githack.com/AmosHuKe/Watch-Test/master",
        "changeOrigin": true,
        "secure": false
      }
    }
  }
}
```


## 目录结构  
```
├── App.vue    //应用配置（配置App全局样式以及监听等）  
├── main.js    //Vue初始化入口文件  
├── manifest.json    //配置应用名称、appid、logo、版本等打包信息
├── pages.json   //配置页面路由、导航条、选项卡等页面类信息
├── mock    //模拟数据
├── common    //共用文件
├── components    //组件文件
├── pages    //页面文件夹  
│   └── index.vue    //主布局页
│   └── home    //首页
│   │   ├── children  //首页子
│   │   ├── home.vue   //首页
│   └── mine    //我的
│   │   ├── children  //我的页子
│   │   ├── mine.vue   //我的页
├── lib    //第三方库/框架  
│   └── colorui    //ColorUi
├── service    //服务请求相关
│   └── api    //api接口
│   └── request    //请求全局配置，请求拦截
├── style    //样式文件  
├── static    //静态文件  
├── unpackage    //打包后文件（dist）  
├── demo    //演示预览文件  
│   └── amos-login    //登录模板(http://ext.dcloud.net.cn/plugin?id=538)

```

## 已知问题

- uni-app 目前不支持[动态组件](https://github.com/dcloudio/uni-app/blob/d49de33c438fdd22295a05766a0428aeeaa4aa69/docs/use.md#vue-%E7%BB%84%E4%BB%B6)

## references

- [vue 中文文档](https://cn.vuejs.org/v2/guide/instance.html)
- [vue Api文档](https://vuejs.org/v2/api/)
- [uniapp 文档](https://uniapp.dcloud.io/api/)
- [Vue CLI](https://cli.vuejs.org/zh/guide/)
- [uformjs](https://uformjs.org/)
- [component-dynamic-async](https://v3.vuejs.org/guide/component-dynamic-async.html)
- [uniapp 组件](https://uniapp.dcloud.io/use?id=vue-%e7%bb%84%e4%bb%b6)