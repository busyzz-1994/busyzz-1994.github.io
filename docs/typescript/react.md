::: tip
本文主要介绍 TypeScript 与 React 常用的案例， 在线的练习 [typescript-react-playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAKjgQwM5wEoFNkGN4BmUEIcA5FDvmQNwCwAUKJLHAN5wCuqWAyjMhhYANFx4BRAgSz44AXzhES5Snhi1GjLAA8W8XBAB2qeAGEInQ0KjjtycABsscALxwAFAEpXAPnaM4OANjeABtA0sYUR4Yc0iAXVcxPgEhdwAGT3oGAOTJaXx3L19-BkDAgBMIXE4QLCsAOhhgGCckgAMATQsgh2BcAGssCrgAEjYIqwVmutR27MC5LM0yuEoYTihDD1zAgB4K4AA3H13yvbAfbs5e-qGRiYspuBmsVD2Aekuz-YAjThgMCMcCMpj6gxcbGKLj8MTiVnck3gAGo4ABGTxyU6rcrlMF3OB1H5wT7-QFGbG4z6HE65ZYMOSMIA) ，如果对 TypeScript 还不了解的，请先阅读 [ typescript 基础 ](/typescript/basic)
:::

## 安装 与 导入

### 安装

要在 react 中使用 typescript 需要先安装对应的类型文件

```sh
yarn add @types/react @types/react-dom
```

### 导入

```ts
import * as React from "react";
import * as ReactDOM from "react-dom";
```

如果将根目录下的 `tsconfig.json` 中的 `"compilerOptions":{ "allowSyntheticDefaultImports" : true }` 也可以这样导入

```ts
import React from "react";
import ReactDOM from "react-dom";
```

## 函数组件

### FC 类型

在声明一个函数组件的时候我们可以这样做：

```tsx
import { FC } from "react";

interface HeaderProps {
  height: number;
}

const Header: FC<HeaderProps> = props => {
  const { height, children } = props;
  return <div>header</div>;
};
```

这是一个最简单的例子， FC 接收一个泛型，该泛型就是组件的属性类型，但是 FC 会将 `children` 属性添加到 `props` 当中，所以我们不用再 `HeaderProps` 里面去声明 `children` 的类型了，FC 做了这些事 ：

- 自动设置 `props` 中的 `children` 类型 为 `ReactNode | undefined`
- 对 `Header` 组件的 `displayName` , `contextTypes` , `propTypes` , `defaultProps` 静态属性做了类型检查, 如 `{ defaultProps?: Partial<P> | undefined; }` 该地方的泛型 `P` 指的就是 `HeaderProps`
- 明确声明 `Header` 函数的返回值类型为 `ReactElement | null`

:::warning 注意
如果将 children 直接返回会报错，这是因为 children 默认类型为 `ReactNode` 而需要返回的类型为 `ReactElement` ， `ReactElement` 是 `ReactNode` 的子类型
:::

可以通过 `as any` 的方式解决

```tsx
const Header: FC<HeaderProps> = ({ children }) => {
  return children as any;
};
```

### `useState<T>`

一个最简单的例子：

```tsx
import { useState, User } from "react";
const [visible, setVisible] = React.useState<boolean>(false);
// useState 接收一个泛型，该泛型在这里指的就是 visible 的类型
// 但是一般这种简单的类型不需要去明确声明类型，useState 可以自己推导出来
const [visible, setVisible] = React.useState(false);

// 如果类型比较复杂 或者是外部引入的，建议明确声明类型
const [user] = useState<User>();
```

### `useRef<T>`

```tsx
import { useRef } from "react";
// 使用 ref 获取一个普通的 DOM 元素
const Header: FC<HeaderProps> = props => {
  // 这里的 HTMLDivElement 类型指的是 DOM 元素的类型
  const divRef = useRef<HTMLDivElement>();
  return <div ref={divRef}>test</div>;
};
// 使用 ref 获取一个组件的实例
const Header: FC<HeaderProps> = props => {
  const footerRef = useRef<Footer>();
  return <Footer ref={footerRef} />;
};
```

### useImperativeHandle 与 forwardRef

在函数组件中，如果我们需要在父组件中调用子组件的方法就需要用到这两个方法

```tsx
interface ChildProps {
  name: string;
}
interface ChildInstanceProps {
  say: () => void;
}
const Child = forwardRef<ChildInstanceProps, ChildProps>((props, ref) => {
  useImperativeHandle(ref, () => ({
    say: () => {
      alert("hello");
    }
  }));
  return <div>Child</div>;
});

interface ParentProps {
  height: number;
}

const Parent: FC<ParentProps> = () => {
  const childRef = useRef<ChildInstanceProps>();
  const onClick = () => {
    childRef.current?.say();
  };
  return (
    <div>
      <h1>Parent</h1>
      <Child ref={childRef} name="busyzz" />
      <button onClick={onClick}>say hello</button>
    </div>
  );
};
```

## Class 组件

```tsx
type MyProps = {
  message: string;
};
type MyState = {
  count: number;
};
class App extends React.Component<MyProps, MyState> {
  state: MyState = {
    count: 0
  };
  render() {
    return (
      <div>
        {this.props.message} {this.state.count}
      </div>
    );
  }
}
```

## 在 React.createContext 中使用

```tsx
import * as React from "react";

interface AppContextInterface {
  name: string;
  author: string;
  url: string;
}

const AppCtx = React.createContext<AppContextInterface | null>(null);

const sampleAppContext: AppContextInterface = {
  name: "busyzz",
  author: "zzb",
  url: "http://www.example.com"
};

export const App = () => (
  <AppCtx.Provider value={sampleAppContext}>...</AppCtx.Provider>
);
// 在组件中使用
export const PostInfo = () => {
  const appContext = React.useContext(AppCtx);
  return (
    <div>
      Name: {appContext.name}, Author: {appContext.author}, Url:{" "}
      {appContext.url}
    </div>
  );
};
```

## 在 hoc 高阶组件中使用

假设需要创建一个高阶组件，用于给组件注入一组 theme 相关的属性，具体如下：

```tsx
// parent.tsx 文件
import React, { FC } from "react";
import Child from "./child";
const Parent: FC = () => {
  return <Child name="busyzz" age={26} />;
};
// child.tsx 文件
import React from "react";
import withThemeHoc, { WithThemeProps } from "./themeHoc";

interface ChildProps extends WithThemeProps {
  name: string;
  age: number;
}
class Child extends React.Component<ChildProps> {
  render() {
    const { primaryColor, name } = this.props;
    return <div style={{ color: primaryColor }}>{name}</div>;
  }
}

export default withThemeHoc(Child);

// themeHoc.tsx 文件

import React, { forwardRef } from "react";
import hoistNonReactStatic from "hoist-non-react-statics";
// 需要注入的属性
export interface WithThemeProps {
  primaryColor: string;
}
const withThemeHoc = <T extends WithThemeProps = WithThemeProps>(
  WrappedComponent: React.ComponentType<T>
) => {
  const ComponentWithTheme = forwardRef(
    (props: Omit<T, keyof WithThemeProps>, ref) => {
      const theme: WithThemeProps = {
        primaryColor: "#f00"
      };
      return <WrappedComponent {...theme} ref={ref} {...(props as T)} />;
    }
  );
  // 提升组件的静态方法
  hoistNonReactStatic(ComponentWithTheme, WrappedComponent);
  return ComponentWithTheme;
};

export default withThemeHoc;
```

## 事件对象 Event

```tsx
import React, { FC, MouseEvent, ChangeEvent } from "react";
const Parent: FC = () => {
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    console.log(e.target);
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  return (
    <div>
      <button onClick={onClick}>click</button>
      <input onChange={onChange} type="text" />
    </div>
  );
};

export default Parent;
```

常用的 Event 事件对象类型

- ClipboardEvent<T = Element> 剪切板事件对象

- DragEvent<T = Element> 拖拽事件对象

- ChangeEvent<T = Element> Change 事件对象

- KeyboardEvent<T = Element> 键盘事件对象

- MouseEvent<T = Element> 鼠标事件对象

- TouchEvent<T = Element> 触摸事件对象

- WheelEvent<T = Element> 滚轮时间对象

- AnimationEvent<T = Element> 动画事件对象

- TransitionEvent<T = Element> 过渡事件对象

## 事件处理函数

可以使用事件处理函数类型来声明一个函数，它会自动推到 event 的类型

```tsx
import React, { FC, MouseEventHandler, ChangeEventHandler } from "react";

const Parent: FC = () => {
  const onClick: MouseEventHandler<HTMLButtonElement> = e => {
    console.log(e.target);
  };
  const onChange: ChangeEventHandler<HTMLInputElement> = e => {
    console.log(e.target.value);
  };
  return (
    <div>
      <button onClick={onClick}>click</button>
      <input onChange={onChange} type="text" />
    </div>
  );
};

export default Parent;
```

## style 的类型

如果需要给组件传入一个 style 可以使用：

```tsx
interface Props {
  style: React.CSSProperties;
}
// 现在 style 就只能传入 css 相关的属性了 { color: '#f00', height: 100 }
```

## 常用的基础类型

```ts
type AppProps = {
  message: string;

  count: number;

  disabled: boolean;

  /** array of a type! */

  names: string[];

  /** string literals to specify exact string values, with a union type to join them together */

  status: "waiting" | "success";

  /** 任意需要使用其属性的对象（不推荐使用，但是作为占位很有用） */

  obj: object;

  /** 作用和`object`几乎一样，和 `Object`完全一样 */

  obj2: {};

  /** 列出对象全部数量的属性 （推荐使用） */

  obj3: {
    id: string;

    title: string;
  };

  /** array of objects! (common) */

  objArr: {
    id: string;

    title: string;
  }[];

  /** 任意数量属性的字典，具有相同类型*/

  dict1: {
    [key: string]: MyTypeHere;
  };

  /** 作用和dict1完全相同 */

  dict2: Record<string, MyTypeHere>;

  /** 任意完全不会调用的函数 */

  onSomething: Function;

  /** 没有参数&返回值的函数 */

  onClick: () => void;

  /** 携带参数的函数 */

  onChange: (id: number) => void;

  /** 携带点击事件的函数 */

  onClick(event: React.MouseEvent<HTMLButtonElement>): void;

  /** 可选的属性 */
  optional?: OptionalType;

  /** css类型 */

  style: React.CSSProperties;

  /** children类型 */

  children: React.ReacatNode; // 没有特别要求推荐使用这个，可以满足 children 是 null string boolean 等类型
};
```

## 其他

### 获取组件的属性类型

有些时候在引入三方库的组件的时候，第三方库可能没有导出组件类型，这个时候可以这样获取：

```tsx
import { Button } from "library";
type ButtonProps = React.ComponentProps<typeof Button>;
```
