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

### useSetState

在 hooks 开发中经常会遇到 管理很多状态的情况,这里是一个 table 列表的例子：

```tsx
const [pageNumber, setPageNumber] = useState(0);
const [pageSize, setPageSize] = useState(10);
const [total, setTotal] = useState(0);
const [list, setList] = useState([]);
const [loading, setLoading] = useState(false);
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    const { list, pageNumber, pageSize, total } = await request();
    setPageNumber(pageNumber);
    setPageSize(pageSize);
    setTotal(total);
    setList(list);
    setLoading(false);
  };
  fetchData();
}, []);
```

上面是模拟的一个 `table` 数据请求的案例，可以发现在状态很多的时候代码变得难以阅读，如果有更多的状态那将变得非常难维护，我们用 `useSetState` 优化一下，使它能像 `class组件` 的 `this.setState` 一样可以合并状态，`useSetState` 具体实现：

```ts
import { useCallback, useState } from "react";

const useSetState = <T extends object>(
  initialState: T = {} as T
): [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void] => {
  const [state, set] = useState<T>(initialState);
  const setState = useCallback(patch => {
    set(prevState =>
      Object.assign(
        {},
        prevState,
        patch instanceof Function ? patch(prevState) : patch
      )
    );
  }, []);

  return [state, setState];
};

export default useSetState;
```

这个时候我们刚才的案列就变成这样：

```tsx
const [tableInfo, setTableInfo] = useSetState({
  pageNumber: 1,
  pageSize: 10,
  total: 0,
  loading: false,
  list: []
});

useEffect(() => {
  const fetchData = async () => {
    setTableInfo({ loading: true });
    const { list, pageNumber, pageSize, total } = await request();
    setTableInfo({ list, pageNumber, pageSize, total, loading: false });
  };
  fetchData();
}, []);
```

### useForceUpdate

如果想要实现 `class组件` 的 `this.forceUpdata` 的功能，可以这样做：

```ts
// 实现
import { useState, useCallback } from "react";

const useForceUpdate = () => {
  const [, setCount] = useState(0);
  const forceUpdate = useCallback(() => {
    setCount(prevState => prevState + 1);
  }, []);
  return forceUpdate;
};

// 使用
const forceUpdate = useForceUpdate();
```

### useDebounceFn 和 useThrottleFn

防抖、节流函数也是很常用的，主要使用 useRef 来存放传入的函数

- 防抖函数

```ts
import { useRef, useCallback } from "react";
type noop = (...args: any[]) => any;
export default <T extends noop>(fn: T, delay: number = 500) => {
  const fnRef = useRef<T>(fn);
  // 通过ref存储最新的待调用的函数
  fnRef.current = fn;
  const timerRef = useRef<any>();
  // 用useCallback返回同一个函数，将返回的函数传入子组件中才不会导致子组件re-render
  return useCallback(
    (...args) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        fnRef.current(...args);
      }, delay);
    },
    [delay]
  );
};
```

- 节流函数

```ts
import { useRef, useCallback } from "react";
type noop = (...args: any[]) => any;
export default <T extends noop>(fn: T, delay: number = 500) => {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const timeRef = useRef<any>();
  return useCallback(
    (...args) => {
      if (!timeRef.current) {
        timeRef.current = Date.now();
        return fnRef.current(...args);
      } else {
        let currentTime = Date.now();
        let diff = currentTime - timeRef.current;
        if (diff >= delay) {
          timeRef.current = currentTime;
          return fnRef.current(...args);
        }
      }
    },
    [delay]
  );
};
```

### useInterval

```ts
// 实现
import { useRef, useEffect } from "react";

const useInterval = (func: Function, delay = 1000) => {
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const funcRef = useRef<Function>();
  funcRef.current = func;
  useEffect(() => {
    if (delay) {
      timerRef.current = setInterval(() => {
        funcRef.current();
      }, delay);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      clearInterval(timerRef.current);
    };
  }, [delay]);
};

export default useInterval;

// 使用
useInterval(() => {
  setCount(count + 1);
});
// 通过一个变量来控制定时器的 暂停和启动
const [delay, setDelay] = useState(1000);
useInterval(() => {
  setCount(count + 1);
}, delay);

<button onClick={() => setDelay(0)}>暂停</button>;
<button onClick={() => setDelay(1000)}>开始</button>;
```

### useMount

如果你想使用类似 `class组件` 里面的 `ComponentDidMount` 的生命周期，你可以使用 `useMount`：

```ts
// 实现
import { useEffect, useRef } from "react";
type noop = (...args: any[]) => any;
const useMount = <T extends noop>(fn: T) => {
  const fnRef = useRef<T>();
  fnRef.current = fn;
  useEffect(() => {
    fnRef.current();
  }, []);
};

export default useMount;

// 使用
useMount(() => {
  console.log("DOM 渲染完成了");
});
```

可以看到和 `useEffect(() => {}, [])` 大致一样，只是 `useMount` 不用添加依赖也可以访问到最新的 `state`，还有就是使用起来稍微简洁和语义化一点

### usePersistFn

持久化 function 的 Hook。

> 在某些场景中，你可能会需要用 useCallback 记住一个回调，但由于内部函数必须经常重新创建，记忆效果不是很好，导致子组件重复 render。对于超级复杂的子组件，重新渲染会对性能造成影响。通过 usePersistFn，可以保证函数地址永远不会变化。

有过 react 开发经验的都知道，默认情况下父组件的状态更新了子组件也会重新渲染，这里我们叫它 `re-render` ，为了避免这种情况的发生我们会考虑使用 `PureComponent` 或者 `React.memo`,但是传入一个 `函数` 到子组件时：

```tsx
interface ChildProps {
  onChange: () => void;
}
const Child = React.memo(({ onChange }) => {
  return <button onClick={onChange}>click</button>;
});

const Parent = () => {
  const [count, setCount] = useState(0);
  const onChange = () => {
    console.log(count, "count");
  };
  return (
    <div>
      <Child onChange={onChange} />
      <button onClick={() => setCount(prevCount => prevCount + 1)}>
        count++
      </button>
    </div>
  );
};
```

由于每一次的 `count` 修改会导致 `onChange函数` 重新被实例化，所以传入到子组件的 `onChange` 永远都是新的，也就是说会导致子组件 `re-render`，那么你可能会想到使用 `useCallback` 包一下：

```tsx
// 不添加依赖
const onChange = useCallback(() => {
  console.log(count, "count");
}, []);
// 添加 count 依赖
const onChange = useCallback(() => {
  console.log(count, "count");
}, [count]);
```

如上两种方法都会有问题，`不添加依赖` 会导致 count 的值永远都是 0 ，添加依赖会导致重新实例化 `onChange` 函数，从而会导致子组件 `re-render`，那么这个时候就可以用到 `usePersistFn` 了：

```ts
// 实现
import { useCallback, useRef } from "react";
type noop = (...args: any[]) => any;
const usePersistFn = <T extends noop>(fn: T) => {
  const ref = useRef<T>();
  ref.current = fn;
  const persistFn = useCallback((...args) => ref.current(...args), []);
  return persistFn;
};
export default usePersistFn;

// 使用
// 这里的 onChange 函数只会被实例化一次
const onChange = usePersistFn(() => {
  console.log(count, "count"); // 这个 count 为最新的 count
});
```

`usePersistFn` 返回一个由 `useCallback` 包裹的函数，保证了函数不会被重新实例化，通过 `ref` 保存传入的函数，保证了在每一次调用`persistFn` 时访问到的是最新的函数

### useInViewport

判断一个元素是否出现在视口当中

```ts
import { MutableRefObject, useRef, useState, useLayoutEffect } from "react";
export default <T extends HTMLElement = HTMLElement>(): [
  boolean,
  MutableRefObject<T>
] => {
  const [state, setState] = useState<boolean>(false);
  const element = useRef<T>();
  useLayoutEffect(() => {
    if (!element.current) return;
    const computedPosition = () => {
      let {
        top,
        left,
        bottom,
        right
      } = element.current.getBoundingClientRect();
      let clientWidth = window.innerWidth,
        clientHeight = window.innerHeight;
      //满足该条件说明在视口中
      let isInViewport =
        top < clientHeight && bottom > 0 && left < clientWidth && right > 0;
      setState(isInViewport);
    };
    computedPosition();
    window.addEventListener("scroll", computedPosition);
    window.addEventListener("resize", computedPosition);
    return () => {
      window.removeEventListener("scroll", computedPosition);
      window.removeEventListener("resize", computedPosition);
    };
  }, []);
  return [state, element];
};
```

通过返回一个 `ref` 的方式去获取外部的 `DOM` 元素

### useMouse

获取鼠标的位置

```ts
import { useState, useEffect } from "react";
type IState = {
  screenX?: number;
  screenY?: number;
  clientX?: number;
  clientY?: number;
  pageX?: number;
  pageY?: number;
};
export default () => {
  let [state, setState] = useState<IState>({});
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      let { screenX, screenY, clientX, clientY, pageX, pageY } = e;
      setState({ screenX, screenY, clientX, clientY, pageX, pageY });
    };
    document.body.addEventListener("mousemove", onMouseMove);
    return () => {
      document.body.removeEventListener("mousemove", onMouseMove);
    };
  }, []);
  return state;
};
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
