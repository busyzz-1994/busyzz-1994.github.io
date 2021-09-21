:::tip 注意
本文章适用于有一定 hooks 开发经验的开发者，基础知识不再赘述，还没有了解过 hooks 开发基础的请先阅读 [官方 hooks 文档](https://zh-hans.reactjs.org/docs/hooks-intro.html)
:::

## 前置知识

### useEffect、自定义函数、定时器内访问到的 state 和 props

在 `hooks` 函数组件中， `useEffect`, `函数`, `定时器` 内部访问到的 `state` 或者 `props`，均为当次 `hooks` 函数执行时候的值，并不是最新的值，来看下例子：

```tsx
// 在 class 组件中
class Test extends React.Component {
  state = {
    count: 0
  };
  getCount = () => {
    setTimeout(() => {
      console.log(this.state.count);
    }, 3000);
  };
  render() {
    return (
      <div>
        <h1>{this.state.count}</h1>
        <button onClick={this.getCount}>获取 state</button>
        <button
          onClick={() =>
            this.setState(prevState => ({
              ...prevState,
              count: prevState.count + 1
            }))
          }
        >
          count ++
        </button>
      </div>
    );
  }
}
// hooks 中
const Test = () => {
  const [count, setCount] = useState(0);
  const getCount = () => {
    setTimeout(() => {
      console.log(count);
    }, 3000);
  };
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={getCount}>获取 state</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>
        count ++
      </button>
    </div>
  );
};
```

进行下列同样的操作：

- 先点击 `获取 state 按钮`
- 快速点击三次 `count ++ 按钮`

`class` 类型的组件输出的是 `3` , 而 `hooks` 类型的组件输出的是依旧是 `0`

### useRef

通过 `useRef` 创建的值，会存在于当前组件的`整个生命周期`当中，只有当组件销毁时，ref 的值才会被清除，所以我们可以用它来存放一些需要持久化的内容，如 `定时器`、`DOM` 元素等

## 常用的自定义 hooks

### usePrevious

如果我们需要上一次的 state 值，可以使用 usePrevious

```ts
// 实现
import { useEffect, useRef } from "react";

const usePrevious = <T = any>(state: T) => {
  const stateRef = useRef<T>(null);
  useEffect(() => {
    stateRef.current = state;
  });
  return stateRef.current;
};

const [count, setCount] = useState(0);
const prevCount = usePrevious(count);
```

## 其他

### useEffect 和 useLayoutEffect

`useEffect` 和 `useLayoutEffect` 的区别例子：

```tsx
const [count, setCount] = useState(0);
useEffect(() => {
  let i = 0;
  while (i < 500000000) {
    i++;
  }
  if (count === 0) {
    setCount(10 + Math.random() * 200);
  }
}, [count]);
useLayoutEffect(() => {
  let i = 0;
  while (i < 500000000) {
    i++;
  }
  if (count === 0) {
    setCount(10 + Math.random() * 200);
  }
}, [count]);
return <h1 onClick={() => setCount(0)}>{count}</h1>;
```

当我们使用 `useEffect` 的时候，点击以后会发现页面会闪烁一下，count 的值从 0 变为了一个随机数，而使用 `useLayoutEffect` 并不会出现闪烁的问题，但是会有一小段时间的停顿，这是由于他们的执行时机不同导致的，`useEffect` 会在 DOM 渲染完毕以后再执行，它是一个异步的操作，而 `useLayoutEffect` 会在 DOM 渲染前执行，它是一个同步的操作，它会阻塞浏览器的渲染，当发现页面有闪烁的情况时，可以用 `useLayoutEffect` 优化，但是大多情况下还是使用 `useEffect`
