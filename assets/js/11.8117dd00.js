(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{436:function(s,t,a){"use strict";a.r(t);var n=a(30),e=Object(n.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("TIP")]),s._v(" "),a("p",[s._v("盘点一些常用的 npm 命令，以及配置")])]),s._v(" "),a("h2",{attrs:{id:"npm-常用命令"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#npm-常用命令"}},[s._v("#")]),s._v(" npm 常用命令")]),s._v(" "),a("h3",{attrs:{id:"npm-install"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#npm-install"}},[s._v("#")]),s._v(" npm install")]),s._v(" "),a("p",[s._v("在执行 "),a("code",[s._v("npm install react")]),s._v(" 在将 react 包安装在 "),a("code",[s._v("node_modules")]),s._v(" 中的同时也会安装 "),a("code",[s._v("react")]),s._v(" 依赖的包，并且将写入到 "),a("code",[s._v("package.json")]),s._v(" 中的 "),a("code",[s._v("dependencies")]),s._v(":")]),s._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"dependencies"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"react"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"^16.8.0"')]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),a("p",[s._v("注意版本号默认是以 "),a("code",[s._v("^")]),s._v(" 开头的，对于版本号的讲解请查看后面章节")]),s._v(" "),a("ul",[a("li",[a("p",[s._v("npm install react --save / -S 下载 react 并且将依赖写进 "),a("code",[s._v("package.json")]),s._v(" 中的"),a("code",[s._v("dependencies")])])]),s._v(" "),a("li",[a("p",[s._v("npm install react --save-dev / -D 下载 react 并且将依赖写进 "),a("code",[s._v("package.json")]),s._v(" 中的"),a("code",[s._v("devDependencies")])])]),s._v(" "),a("li",[a("p",[s._v("npm install react --save-exact 写入 "),a("code",[s._v("package.json")]),s._v(" 时，将版本号固定 "),a("code",[s._v('"react": "16.8.0"')])])]),s._v(" "),a("li",[a("p",[s._v("npm install react@16 安装的包 "),a("code",[s._v(">= 16.0.0 && < 17.0.0")]),s._v(" 并且为最新的 "),a("code",[s._v("latest")]),s._v(" 包, @16.8 安装的包 "),a("code",[s._v(">= 16.8.0 && < 17.0.0")]),s._v(" , @16.8.0 安装的包为 "),a("code",[s._v("@16.8.0")])])])]),s._v(" "),a("p",[a("code",[s._v("npm uninstall react")]),s._v(" 删除对应的包")]),s._v(" "),a("p",[s._v("在 "),a("code",[s._v("npm 5.x")]),s._v(" 版本以后，会自动生成一个 "),a("code",[s._v("package.lock.json")]),s._v(" 的文件，它的主要功能是锁定版本，保证每次 install 的版本都是一致的")]),s._v(" "),a("h2",{attrs:{id:"将一个-react-组件发布到-npm"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#将一个-react-组件发布到-npm"}},[s._v("#")]),s._v(" 将一个 React 组件发布到 NPM")]),s._v(" "),a("p",[s._v("这里是用 "),a("a",{attrs:{href:"https://github.com/jaredpalmer/tsdx#customization",target:"_blank",rel:"noopener noreferrer"}},[s._v("tsdx"),a("OutboundLink")],1),s._v(" 作为一个开发测试打包的环境，"),a("code",[s._v("tsdx")]),s._v(" 的好处是不用太多配置就可以完成一个 typescript 版本的 React 组件发布：")]),s._v(" "),a("h3",{attrs:{id:"_1-通过-tsdx-生成项目并启动"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-通过-tsdx-生成项目并启动"}},[s._v("#")]),s._v(" 1.通过 "),a("code",[s._v("tsdx")]),s._v(" 生成项目并启动")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[s._v("npx tsdx create mylib\n"),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" mylib\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("yarn")]),s._v(" start\n")])])]),a("p",[s._v("创建的时候有可能会失败，如果失败的话将 npm 源切换到淘宝镜像：")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("npm")]),s._v(" config "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("set")]),s._v(" registry https://registry.npm.taobao.org/\n")])])]),a("p",[s._v("在根目录执行 "),a("code",[s._v("npm start")]),s._v(",监听 "),a("code",[s._v("src")]),s._v(" 目录下的代码修改，自动打包生成 "),a("code",[s._v("dist")]),s._v(" 目录\n另外启动一个终端，进入 "),a("code",[s._v("example")]),s._v(" 目录,将 "),a("code",[s._v("example/package.json")]),s._v(" 中的 "),a("code",[s._v("devDependencies")]),s._v(" 做如下修改：")]),s._v(" "),a("div",{staticClass:"language-diff extra-class"},[a("pre",{pre:!0,attrs:{class:"language-diff"}},[a("code",[a("span",{pre:!0,attrs:{class:"token deleted-sign deleted"}},[a("span",{pre:!0,attrs:{class:"token prefix deleted"}},[s._v("-")]),a("span",{pre:!0,attrs:{class:"token line"}},[s._v(' "parcel": "^1.12.3"\n')])]),a("span",{pre:!0,attrs:{class:"token inserted-sign inserted"}},[a("span",{pre:!0,attrs:{class:"token prefix inserted"}},[s._v("+")]),a("span",{pre:!0,attrs:{class:"token line"}},[s._v(' "parcel": "1.12.3"\n')])])])])]),a("p",[s._v("执行 "),a("code",[s._v("yarn install")]),s._v(" 然后 "),a("code",[s._v("yarn start")]),s._v(",这个时候可以在 "),a("a",{attrs:{href:"http://localhost:1234",target:"_blank",rel:"noopener noreferrer"}},[s._v("http://localhost:1234 "),a("OutboundLink")],1),s._v(" 访问到你写的组件。")]),s._v(" "),a("p",[s._v("一切顺利的话，就可以在 "),a("code",[s._v("src")]),s._v(" 目录下开始写你的组件了")]),s._v(" "),a("h3",{attrs:{id:"_2-使用-css"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-使用-css"}},[s._v("#")]),s._v(" 2.使用 css")]),s._v(" "),a("p",[s._v("默认情况下无法解析 "),a("code",[s._v("css")]),s._v(" 文件，所以需要做以下操作:")]),s._v(" "),a("ul",[a("li",[s._v("回到根目录，安装以下包")])]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("yarn")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("add")]),s._v(" rollup-plugin-postcss autoprefixer cssnano node-sass --dev\n")])])]),a("ul",[a("li",[s._v("在根目录下创建 "),a("code",[s._v("tsdx.config.js")]),s._v(" 文件，并且写入以下配置：")])]),s._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" postcss "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"rollup-plugin-postcss"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" autoprefixer "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"autoprefixer"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" cssnano "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"cssnano"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\nmodule"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exports "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("rollup")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("config"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" options")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    config"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("plugins"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("push")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("\n      "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("postcss")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        plugins"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("\n          "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("autoprefixer")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n          "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("cssnano")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n            preset"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"default"')]),s._v("\n          "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n        inject"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("true")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n        extract"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("false")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n        sass"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("true")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 如果想使用less")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// less:true")]),s._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" config"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),a("p",[s._v("这里将样式 "),a("code",[s._v("inject")]),s._v(" 了,目的是为了用户使用的时候方便，不需要再去引入 css 文件, 如果想单独把 css 文件提取出来可以修改配置文件：")]),s._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  inject"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("false")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  extract"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'index.css'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),a("p",[s._v("如果想要使用 "),a("code",[s._v("less")]),s._v(" , "),a("code",[s._v("yarn add less --dev")]),s._v(",并且修改 "),a("code",[s._v("tsdx.config.js")]),s._v(" 文件 "),a("code",[s._v("less:true")])]),s._v(" "),a("div",{staticClass:"custom-block warning"},[a("p",{staticClass:"custom-block-title"},[s._v("注意")]),s._v(" "),a("p",[s._v("修改了配置文件以后，需要在 "),a("code",[s._v("example")]),s._v(" 目录下面重新启动，执行 "),a("code",[s._v("npm start")])])])])}),[],!1,null,null,null);t.default=e.exports}}]);