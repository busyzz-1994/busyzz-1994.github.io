:::tip
盘点一些常用的 npm 命令，以及配置
:::

## npm 常用命令

### npm install

在执行 `npm install react` 在将 react 包安装在 `node_modules` 中的同时也会安装 `react` 依赖的包，并且将写入到 `package.json` 中的 `dependencies`:

```json
{
  "dependencies": {
    "react": "^16.8.0"
  }
}
```

注意版本号默认是以 `^` 开头的，对于版本号的讲解请查看后面章节

- npm install react --save / -S 下载 react 并且将依赖写进 `package.json` 中的`dependencies`
- npm install react --save-dev / -D 下载 react 并且将依赖写进 `package.json` 中的`devDependencies`
- npm install react --save-exact 写入 `package.json` 时，将版本号固定 `"react": "16.8.0"`

- npm install react@16 安装的包 `>= 16.0.0 && < 17.0.0` 并且为最新的 `latest` 包, @16.8 安装的包 `>= 16.8.0 && < 17.0.0` , @16.8.0 安装的包为 `@16.8.0`

`npm uninstall react` 删除对应的包

在 `npm 5.x` 版本以后，会自动生成一个 `package.lock.json` 的文件，它的主要功能是锁定版本，保证每次 install 的版本都是一致的

## 将一个 React 组件发布到 NPM

这里是用 [tsdx](https://github.com/jaredpalmer/tsdx#customization) 作为一个开发测试打包的环境，`tsdx` 的好处是不用太多配置就可以完成一个 typescript 版本的 React 组件发布：

### 1.通过 `tsdx` 生成项目并启动

```sh
npx tsdx create mylib
cd mylib
yarn start
```

创建的时候有可能会失败，如果失败的话将 npm 源切换到淘宝镜像：

```sh
npm config set registry https://registry.npm.taobao.org/
```

在根目录执行 `npm start`,监听 `src` 目录下的代码修改，自动打包生成 `dist` 目录
另外启动一个终端，进入 `example` 目录,将 `example/package.json` 中的 `devDependencies` 做如下修改：

```diff
- "parcel": "^1.12.3"
+ "parcel": "1.12.3"
```

执行 `yarn install` 然后 `yarn start`,这个时候可以在 [http://localhost:1234 ](http://localhost:1234) 访问到你写的组件。

一切顺利的话，就可以在 `src` 目录下开始写你的组件了

### 2.使用 css

默认情况下无法解析 `css` 文件，所以需要做以下操作:

- 回到根目录，安装以下包

```sh
yarn add rollup-plugin-postcss autoprefixer cssnano node-sass --dev
```

- 在根目录下创建 `tsdx.config.js` 文件，并且写入以下配置：

```js
const postcss = require("rollup-plugin-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        plugins: [
          autoprefixer(),
          cssnano({
            preset: "default"
          })
        ],
        inject: true,
        extract: false,
        sass: true
        // 如果想使用less
        // less:true
      })
    );
    return config;
  }
};
```

这里将样式 `inject` 了,目的是为了用户使用的时候方便，不需要再去引入 css 文件, 如果想单独把 css 文件提取出来可以修改配置文件：

```js
{
  inject: false,
  extract: 'index.css',
}
```

如果想要使用 `less` , `yarn add less --dev`,并且修改 `tsdx.config.js` 文件 `less:true`

:::warning 注意
修改了配置文件以后，需要在 `example` 目录下面重新启动，执行 `npm start`
:::
