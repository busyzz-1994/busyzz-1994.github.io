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

在 `npm 5.x` 版本以后，会自动生成一个 `package-lock.json` 的文件，它的主要功能是锁定版本，保证每次 install 的版本都是一致的，在这里讲解 `npm >= 5.4` 的版本 `package-lock.json` 和 `package.json` 的关系：
通过 `npm install react` 以后会在 `package.json` 写入：

```json
{
  "dependencies": {
    "react": "^16.8.0"
  }
}
```

在 `package-lock.json` 中写入：

```json
{
  "dependencies": {
    "react": {
      "version": "16.8.0"
    }
  }
}
```

当远程的 `registry` 发布新的包时，如发布了 `16.9.0` 的版本，我们通过 `npm install` 下载的依旧是 `16.8.0` 的版本，如果我们手动的把 `package.json` 里面的版本改为 `^16.9.0` 再重新下载，这个时候会下载 `16.9.0` 的版本，并且更新 `package-lock.json` 的里面的版本为 `16.9.0`，总结如下：

- 如果 `package-lock.json` 里面的版本兼容 `package.json` 中的规则，那么下载 `package-lock.json` 中的版本
- 如果不兼容，那么下载 `package.json` 中的版本，并且更新 `package-lock.json`

`npm install` 下载的规则：

1. 先检查本地是否存在缓存，如果没有缓存直接到远程的 `registry` 中下载， 在 `Mac OS` 中，缓存内容在 `~/.npm/_cacache` 中, 可以通过 `npm config get cache` 查看存放的路径
2. 如果存在缓存，还要检测缓存是否过期，如果过期就去 `registry` 中下载，否则直接使用本地缓存

### npm version

我们修改了代码以后，需要修改包的版本才能发布到 `npm` 上，假设当前的包版本为 `16.8.0`

```sh
npm version major -> 大版本 +1 `17.0.0`
npm version minor -> 次版本 +1 `16.9.0`
npm version patch -> 修订号 +1 `16.8.1`
npm version 16.8.5 -> 将版本改为 `16.8.5`
```

### npm config

- **npm config get registry** 获取 npm 源
- **npm config set registry https://registry.npm.taobao.org/** 将 npm 下载源设置为淘宝镜像
- **npm config get userconfig** 获取你自己 npm 配置的绝对路径，在 `Mac OS` 中对应的文件 `~/.npmrc`
- **npm config get prefix** 获取通过 `npm install -g` 安装的全局可执行命令存放的路径
- **npm config get cache** 获取 npm 包缓存的存放路径
- **npm config set save-prefix="~"** 默认情况下安装的包都是以 `^` 开头的，将 `save-prefix`设置为 `~`
- **npm config set save-exact true** 将下载的包的版本设置为精确的版本

在这里 `config` 均可以省略掉

### npm cache

`npm cache clean -f` 强制清除本地的 npm 缓存，如果发现安装依赖时报错，可以尝试使用这种方法

### npm login

登陆 npm 账号，注意需要将 `registry` 设置为 npm 的源 , `npm set registry http://registry.npmjs.org`

### npm whoami

查看是否已经登陆，如果登陆则会输出用户名称

### npm publish

将包发布到 npm 上，需要注意的是：如果你发的是一个作用域包，需要使用 `npm publish --access=public`,因为默认情况下作用域包是私有的

### npm info

npm info <packageName> versions // 查看一个包的所有历史版本信息

### npm link

创建一个软连接，我们在开发一个 npm 包的时候需要做本地测试：

```sh
# 假设文件夹 A 是我们开发的 npm 包，文件夹 B 是我们的测试环境
# 在文件夹 A 中 执行：
npm link
# 在文件夹 B 中执行
npm link A
```

通过上面的操作以后我们可以在 B 中直接引入 A

```js
const A = require("A");
```

> `npm link` 主要做了两件事：
>
> 1. 为当前的 npm 模块创建一个软连接，并且连接到全局的 `node_modules`中，在 `Mac OS` 中的路径是 `/usr/local/lib/node_modules/`
> 2. 为当前的 npm 模块下的可执行 `bin` 文件，默认情况下的 `node_modules/.bin` 连接到全局，在 `Mac OS` 中的路径为 `/usr/local/bin/`

测试完毕以后记得执行 `unlink`

```sh
# A 中
npm unlink
# B 中
npm unlink A
```

## 依赖包

这里讲解常用的依赖包：

- dependencies 生产依赖
- devDependencies 开发依赖
- peerDependencies 同级依赖

`dependencies` 和 `devDependencies` 没有太大的本质区别，通过 `npm install` 都会安装对应的包，更多的只是语义化的区别，还有就是在 `npm install --production` 中只会安装 `dependencies` 中的依赖包。
`peerDependencies` 主要用在开发一些三方库的时候使用，如：

```json
"peerDependencies":{
  "react":"^16.8.0"
}
```

告诉下载你包的用户，当前库是依赖 `"react":"^16.8.0"`，但是并不会主动下载，只是在终端给用户提示

## 版本号

在 `npm` 中使用 `semver` 规范，一个 `npm` 依赖包的版本格式一般为 `x.y.z`, 每个号的含义是:

- `x` 为主版本 ( `major version` )，一般一个库有很大的改动才会修改
- `y` 为次版本 ( `minor version` )，一般在新增一些 `feature` 时会修改，并且需要兼容以前的 `api`
- `z` 为修订号 ( 也叫补丁, `patch version` )，一般在修改一些细微的 bug 时需要修改

来看一下常见的版本号都对应什么意思

- **16.8.0**

表示的是 16.8.0 这个精准的版本

- **~16.8.0**

表示的是 `>= 16.8.0 && < 16.9.0`, 需要注意的是：如果以 `0` 作为主版本号会有些不同 , `~0.5.0` 跟 `0.5.0` 是一个意思

- **^16.8.0**

表示的是 `>= 16.8.0 && < 17.0.0`, 需要注意的是：如果以 `0` 作为主版本号会有些不同 , `^0.5.0` 表示 `>= 0.5.0 && < 0.6.0`

默认情况下安装包时使用的 `^`

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
