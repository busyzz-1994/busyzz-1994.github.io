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
这个时候可以使用 `usePersistFn`，具体文档请查看 [usePersistFn](/react/hooks#usePersistFn)

综上所述，你会发现要阻止子组件重复渲染是一件比较麻烦的事，它会让我们的代码更加复杂，也许你并不需要用到 `React.memo` ，在 `Antd` 的源码中，他们的组件也并没有用到 `React.memo` 或者 `PureComponent`,个人建议是仅为开销大的组件使用
