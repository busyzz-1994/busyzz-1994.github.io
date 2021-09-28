:::tip 注意
本文主要从 `代码易读性`、`渲染`、`build构建` 、`部署` 方面讲解一个 React 项目比较重要的优化项，包括一些最佳实现，[admin-react-template](https://github.com/busyzz-1994/admin-react-template) 这是一个完整的项目，可以用于学习和二次开发
:::

## 代码相关优化

### PureComponent、React.memo 避免不必要的渲染

`PureComponent` 在 class 类型的组件中使用，`React.memo` 在函数类型的组件中使用，他们的作用是一样的

在默认情况下，父组件的状态更新导致的 `re-render` 会导致子组件也重新渲染，即便子组件依赖的 `props` 并没有任何改变：

```tsx
const Child = ({ count }) => {
  console.log("re-render");
  return <h1>{count}</h1>;
};
const Parent = () => {
  const [count, setCount] = useState(0);
  const [height, setHeight] = useState(0);

  return (
    <>
      <Child count={count} />
      <button onClick={() => setHeight(prev => ++prev)}>height++</button>
    </>
  );
};
```

在点击 `height++` 按钮时，`Child` 组件依赖的 `count` 属性并没有发生改变，但是 `Child` 组件依旧会从新渲染，这个是不必要的。

可以使用 `React.memo` 包裹一下：

```tsx
const Child = React.memo(({ count }) => {
  console.log("re-render");
  return <h1>{count}</h1>;
});
```

这个时候就可以避免 `Child` 组件重复渲染的问题了，`React.memo` 对传入到组件内部的 `props` 通过 `Object.is` 方法做了一层浅比较，如果发现 `props` 并没有发生改变就会阻止重复渲染,但是实际情况可能并没有那么简单：

```tsx
const Child = React.memo(({ person }) => {
  console.log("re-render");
  return <h1>{person.name}</h1>;
});
const Parent = () => {
  const [data, setData] = useState({
    height: 0,
    person: {
      name: "busyzz",
      age: 27
    }
  });

  return (
    <>
      <Child person={data.person} />
      <button
        onClick={() =>
          setData(prevData => ({
            ...prevData,
            height: prevData.height + 1
          }))
        }
      >
        height++
      </button>
    </>
  );
};
```

通过上面的列子可以看出，当我们去修改 height 的时候会创建一个 `新的` data，`data.person` 的 `引用地址` 也发生了改变，这回让 `React.memo` 认为传入的值发生了改变，所以会导致重新渲染，但是我们期望的是不让 `Child` 组件重新渲染，这个时候我们可以用一个三方的库 `Immer`，它能带来这些好处：

- 不用担心 immer 的体积，它是一个很小的库 只有 `3KB`
- 它可以避免我们使用 `...` 操作符去操作一个层级很深的对象，使用过 `redux` 应该知道，当我们要去修改 state 中一个很深的值的时候，会大量用到 `...`，这让代码变得非常难阅读
- 在修改一个数据的 A 节点时，其他节点会保持不变，如上述的例子，在修改 `height` 的时候 `person` 的引用是不会发生改变的

更多的功能请查看 [immer 官方文档](https://immerjs.github.io/immer/)

使用 `immer`

```tsx
import { useImmer } from "use-immer";
const Child = React.memo(({ person }) => {
  console.log("re-render");
  return <h1>{person.name}</h1>;
});
const Parent = () => {
  const [data, setData] = useImmer({
    height: 0,
    person: {
      name: "busyzz",
      age: 27
    }
  });

  return (
    <>
      <Child person={data.person} />
      <h1>{data.height}</h1>
      <button
        onClick={() =>
          setData(draft => {
            draft.height += 1;
          })
        }
      >
        height++
      </button>
    </>
  );
};
```

这个时候再去修改 `height` 就不会导致 `Child` 组件 `re-render`了，并且代码也变得更加易读了，不再使用 `...` 操作符了，可能你会觉得并没有太多代码上的优化，但是如果 `data` 是一个比较复杂的且层级很深的对象，你就能发现有很大程度的优化了

还存在一个问题，如果将一个函数传入到 `Child` 组件会发生什么呢？
这个时候可以使用 `usePersistFn`，具体文档请查看 [usePersistFn](/react/hooks.html#usepersistfn)

综上所述，你会发现要阻止子组件重复渲染是一件比较麻烦的事，它会让我们的代码更加复杂，也许你并不需要用到 `React.memo` ，在 `Antd` 的源码中，他们的组件也并没有用到 `React.memo` 或者 `PureComponent`,个人建议是仅为开销大的组件使用

### useMemo

在需要大量计算的方法时，使用：

```tsx
function expensiveFunc() {}
const result = useMemo(expensiveFunc, []);
```

可以避免 expensiveFunc 重复执行

### key

在渲染列表的时候使用`稳定且唯一`的 key

```tsx
const [list, setList] = setState([
  { name: "busyzz", id: "1" },
  { name: "zzb", id: "2" }
]);
{
  list.map(item => <div key={item.id}>{item.name}</div>);
}
```

这取决于 `dom-diff` 算法，在没有`稳定且唯一`的 key 时，可以使用 index,更多的 `dom-diff` 算法相关知识请查看 [精读《DOM diff 原理》](https://zhuanlan.zhihu.com/p/362539108)

### React.Fragment

使用 React.Fragment 避免添加额外的 DOM

```tsx
<div>
  <h1>Hello world!</h1>
  <h1>Hello there!</h1>
  <h1>Hello there again!</h1>
</div>
<>
  <h1>Hello world!</h1>
  <h1>Hello there!</h1>
  <h1>Hello there again!</h1>
</>
```

### 虚拟化长列表

> 如果你的应用渲染了长列表（上百甚至上千的数据），我们推荐使用“虚拟滚动”技术。这项技术会在有限的时间内仅渲染有限的内容，并奇迹般地降低重新渲染组件消耗的时间，以及创建 DOM 节点的数量。
> [react-window](https://github.com/bvaughn/react-window) 和 [react-virtualized](https://github.com/bvaughn/react-virtualized) 是热门的虚拟滚动库。 它们提供了多种可复用的组件，用于展示列表、网格和表格数据。 如果你想要一些针对你的应用做定制优化，你也可以创建你自己的虚拟滚动组件，就像 Twitter 所做的。

### 图片的懒加载

使用 [react-lazyload](https://github.com/twobin/react-lazyload) 做图片的懒加载，即当图片出现在视口当中才去加载图片

```tsx
import LazyLoad from "react-lazyload";
<LazyLoad placeholder={<img width="100%" height="100%" src={placeholder} />}>
  <img src={picUrl} />
</LazyLoad>;
```

需要注意的是，当容器滚动的时候需要调用 `forceCheck` 方法

```tsx
import { forceCheck } from "react-lazyload";
<div onScroll={useThrottleFn(forceCheck)}>这是一个列表容器</div>;
```

### 懒加载路由

懒加载路由可以很大程度上减小 build 以后的主 `bundle` 文件大小，减少首屏渲染消耗的时间,主要使用了 `React.Suspense` 和 `React.lazy` 两个方法,这是一个路由的文件 `route.tsx`

```tsx
import React, { Suspense, lazy, ComponentType } from "react";
import { RouteConfig } from "react-router-config";
import { Redirect } from "react-router-dom";
import routesPath from "./routesPath";
import HomeLayout from "layout/homeLayout";
const SuspenseComponent = (Component: ComponentType) => (props: any) => {
  return (
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  );
};
/** Home */
const UserInfo = lazy(() => import("pages/userInfo"));
const Setting = lazy(() => import("pages/setting"));
const ComponentPage = lazy(() => import("pages/component"));
/** Login */
const Login = lazy(() => import("pages/login"));
/** Test */
const Test = lazy(() => import("pages/test"));
const routes: Array<RouteConfig> = [
  {
    path: "/",
    exact: true,
    render: () => <Redirect to={routesPath.login} />
  },
  {
    path: routesPath.login,
    component: SuspenseComponent(Login)
  },
  {
    path: routesPath.test,
    component: SuspenseComponent(Test)
  },
  {
    path: routesPath.home.root,
    component: HomeLayout,
    routes: [
      {
        path: routesPath.home.root,
        exact: true,
        render: () => <Redirect to={routesPath.home.setting} />
      },
      {
        path: routesPath.home.userInfo,
        component: SuspenseComponent(UserInfo)
      },
      {
        path: routesPath.home.setting,
        component: SuspenseComponent(Setting)
      },
      {
        path: routesPath.home.component,
        component: SuspenseComponent(ComponentPage)
      }
    ]
  }
];

export default routes;
```

## build 相关优化

以下内容均以 [create-react-app](https://create-react-app.dev/) 作为基础的脚手架

由于 `create-react-app` 已经做了足够多的优化，我们开发者不用去关心他的实现，所以这里只会写一些 `create-react-app` 没有做的， 后面可能会写一篇关于 `create-react-app` 源码解析的文章。

### splitChunks

通过 splitChunk 我们可以将一些较大的三方库单独打包，这样可以减少主 `bundle` 文件大小，并且可以缓存在客户端

这里分两种情况配置 splitChunks

一、已经通过 `npm run eject`

通过 `npm run eject` 后会在根目录下生成一个 `config/webpack.config.js`, 找到 `splitChunks`选项：

```js
// vendors regexes
const reactVendorsRegex =
  /[\\/]node_modules[\\/](react|react-dom|react-router-dom|react-router|history)[\\/]/;
const utilVendorsRegex =
  /[\\/]node_modules[\\/](lodash|moment|moment-timezone|dayjs)[\\/]/;
const echartsRegex = /[\\/]node_modules[\\/](echarts|zrender)[\\/]/;
// splitChunks 配置
 splitChunks: {
        // chunks: 'all',
        // name: isEnvDevelopment,
        chunks: 'all',
        name: isEnvDevelopment,
        minChunks: 1,
        cacheGroups: {
          reactVendor: {
            test: reactVendorsRegex,
            name: 'reactVendor',
          },
          utilityVendor: {
            test: utilVendorsRegex,
            name: 'utilityVendor',
          },
          echartsVendor: {
            test: echartsRegex,
            name: 'echartsVendor',
          },
        },
      },
```

在这里我们将 `react` 、`echarts` 、 `utils` 相关的三方库单独打包

二、没有使用 `npm run eject`

- 安装 `customize-cra` 和 `react-app-rewired`
- 修改 `package.json` 文件
- 在根目录下创建一个 `config-overrides.js` 文件

修改 `package.json` 文件中的 `scripts`

```diff
+ "start": "react-app-rewired start"
- "start": "react-scripts start"
+ "build": "react-app-rewired build"
- "build": "react-scripts build"
```

`config-overrides.js`文件：

```js
const vConsolePlugin = require("vconsole-webpack-plugin");
const {
  override,
  fixBabelImports,
  addPostcssPlugins,
  setWebpackOptimizationSplitChunks,
  addWebpackModuleRule,
  addWebpackPlugin
} = require("customize-cra");
const isDevENV = process.env.NODE_ENV === "development";
// vendors regexes
const reactVendorsRegex = /[\\/]node_modules[\\/](react|react-dom|react-router-dom|react-router|history)[\\/]/;
module.exports = override(
  // 按需引入 antd-mobile 以及样式文件
  fixBabelImports("import", {
    libraryName: "antd-mobile",
    style: true
  }),
  // 兼容 less 文件，可修改主题
  addWebpackModuleRule({
    test: /\.less$/,
    use: [
      require.resolve("style-loader"),
      require.resolve("css-loader"),
      {
        loader: require.resolve("less-loader"),
        options: {
          lessOptions: {
            modifyVars: {
              "@brand-primary": "#1DA57A",
              "@brand-wait": "#1DA57A",
              "@brand-primary-tap": "#55993a"
            }
          }
        }
      }
    ]
  }),
  // 添加调试工具 只在开发环境生效
  addWebpackPlugin(
    new vConsolePlugin({
      enable: isDevENV
    })
  ),
  // 将样式文件中的 px 单位转换为 vw
  addPostcssPlugins([
    require("postcss-px-to-viewport")({
      unitToConvert: "px", // 需要转换的单位，默认为"px"；
      viewportWidth: 750, // 设计稿的视口宽度
      unitPrecision: 5, // 单位转换后保留的小数位数
      propList: ["*"], // 要进行转换的属性列表,*表示匹配所有,!表示不转换
      viewportUnit: "vw", // 转换后的视口单位
      fontViewportUnit: "vw", // 转换后字体使用的视口单位
      selectorBlackList: [], // 不进行转换的css选择器，继续使用原有单位
      minPixelValue: 1, // 设置最小的转换数值
      mediaQuery: false, // 设置媒体查询里的单位是否需要转换单位
      replace: true, // 是否直接更换属性值，而不添加备用属性
      exclude: [/node_modules/]
    })
  ]),
  // 分包 减小主 bundle 文件大小，加快首屏渲染速度
  setWebpackOptimizationSplitChunks({
    chunks: "all",
    name: false,
    minChunks: 1,
    cacheGroups: {
      reactVendor: {
        test: reactVendorsRegex,
        name: "reactVendor"
      }
    }
  })
);
```

可以看到 `customize-cra` 提供了一系列修改 `webpack` 配置的接口，所以没有特殊需求最好还是不要 `eject` 出来

## 部署

### gzip

`gzip` 压缩可以将静态文件压缩到原来的 `1/4`左右，是非常有效的优化手段，一般我们会用到 `Nginx` 作为静态服务器，在 nginx 中可以这样开启 `gzip` 压缩：

```nginx{11,12}
server {
    listen       80;
    server_name  localhost;
    charset UTF-8;
    root   /usr/share/nginx/html;

    #location ^~ /admin/ {
    #    rewrite ^/admin(/.*)$ $1 last;
    #}
    location / {
        gzip  on;
        gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/javascript image/svg+xml;
        try_files $uri $uri/ @index;
    }
    location = / {
        add_header Cache-Control no-cache;
        try_files /index.html =404;
    }
    location @index {
        add_header Cache-Control no-cache;
        try_files /index.html =404;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

### CDN

CDN 可以加快用户的访问速度，某些云服务商会设置下载限速，导致用户访问速度变慢，如在 `阿里云` 上的一个 1 核 1G 1MB 的 ECS 上面，下载一个 400KB 的文件需要将近 10 秒，使用 CDN 加速以后 1 秒左右就能下载

`jsdelivr`:

如果是个人项目可以使用 [jsdelivr](https://www.jsdelivr.com/?docs=gh) 配合 `github` 部署，这个是完全免费的

`阿里云 OSS 或者 腾讯云 COS`：

将静态文件上传至 oss 或者 cos，可以使用他们的 CDN 服务，不过是收费的，一般在企业级部署中会用到
