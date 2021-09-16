<!--
 * @Author: busyzz
 * @Date: 2021-08-12 18:11:23
 * @Description:
-->

::: tip
本文主要介绍 TypeScript 基础知识，适用于对 TypeScript 有一段时间了解的开发者，主要包括类型、运算符、操作符、泛型、泛型工具、实践经历，在线的 typescript 练习 [typescript-playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAChBOBnA9gOygXigbwLACgopUBDAWwgC5Fh4BLVAcwG4CBfAggYzRqgCMArohAAvUZThI0mHASKkKlAORCR45eyA)
:::

## 一、类型

### unknown 与 any

unknown 指的是一个未知类型，与 any 不同的是，unknown 类型的变量不能获取变量上面的属性和方法

```ts
const name: unknown = "busyzz";
const len = name.length; // 静态编译出错

const name: any = "busyzz";
const len = name.length; // 编译通过
```

unknown 可以用于类型保护

```ts
function test(input: unknown) {
  if (Array.isArray(input)) {
    return input.length; // 编译通过
  }
  return input.length; // 编译出错
}
```

### void 与 undefined

在函数的返回类型中 void 和 undefined 功能类似，但是也存在一些区别， undefined 可以看做是 void 的子集，void 表示的是不关注返回值

```tsx
import React, { FC } from "react";
interface ChildProps {
  onClick: () => void;
}
const Child: FC<ChildProps> = ({ onClick }) => {
  return <div onClick={onClick}>Child</div>;
};
const Parent = () => {
  return <Child onClick={() => ({ name: "busyzz" })} />;
};
```

通过上面的列子可以看出来，当返回类型为 void 的时候，无论 onClick 函数返回什么类型的值都是被允许的，但是将返回值类型设置为 undefined 的时候，onClick 函数必须明确的返回 undefined，所以一般使用的是 void 类型而不是 undefined

### interfacce 与 type

interfacce 与 type 功能相似，大多情况下都可以实现相同的功能：

```ts
type Animal = {
  weight: number;
};

type Dog = Animal & {
  eat: () => void;
};

interface Dog extends Animal {
  eat: () => void;
}
```

不同的地方在于 type 可以使用 `|` , interface 是不可以的，这一点非常有用

```ts
type Name = "busyzz" | "qzz" | number;
```

interface 也有一个比较好用的特性，它可以重复声明，并且会自动合并

```ts
interface Person {
  name: string;
}
interface Person {
  age: number;
}
// Person 的类型为 { name: string, age: number };

// 通过该特性为 Window 添加新的类型
declare global {
  interface Window {
    AMap: any;
  }
}
// 此时去使用 window.AMap 就不会出现类型报错的情况了
```

### never

never 表示不存在的类型，列子：

```ts
type A = string | never;
// 实际 A 的类型就是 string
```

## 二、运算符

### 非空断言运算符 !

! 运算符用来告诉 typescript 对应的值是非 null | undefined 的 , 只能作用在 `编译阶段`

```ts
const name = "busyzz";
const len = name!.length;
```

经过编译后：

```js
var name = "busyzz";
var len = name.length;
```

可以看到编译后的代码并没有任何变化，如果想做 `运行时` 的非空判断需要用到 `?.`

### 可选运算符 ?.

相比于 ！作用于编译阶段，那么 ?. 就是更重要的运行时非空判断

有这样一个场景，我们获取到后端返回的一个对象，需要去取这个对象的 name 属性，但是这个对象可能为 null，所以需要做一个非空判断，不然会导致运行时报错，空指针异常

```ts
const obj;
obj?.name;
obj?.say?.();
```

### ?? 与 ||

?? 与 || 功能相似，但是 ?? 只有在 左侧的值为 `null` | `undefined` 才会返回右侧的值， || 只要左侧的值为 `false` `NaN` `0` 等 `假值` 都会执行右侧逻辑

### & 交叉类型

交叉类型是将多个类型合并成一个类型：

```ts
interface T1 {
  id: string;
}
interface T2 {
  name: string;
}
type T3 = T1 & T2; // T3 的类型为 { id:string, name:string }
```

需要注意的是当两个类型进行交叉合并的时候，如果有相同的属性但是类型却不相同，或者一个可选一个必选的情况：

```ts
interface T1 {
  name: number;
  id: string;
}

interface T2 {
  name: string;
  id?: string;
}
type T3 = T1 & T2; // T3 的类型为 { id:string; name:never }
// 当有相同属性 name 的时候，他们合并以后的类型为他们的交集, 因为 string 和 number 并没有交集,所以 name 的类型为 never
// 当 id 一个为可选，一个为必选时，合并以后的 id 为必选
```

现在的情况是 T1 和 T2 中的 name 为基础类型，所以是取交集，但是如果是非基础类型就会合并了

```ts
interface T1 {
  person: {
    name: string;
  };
}
interface T2 {
  person: {
    age: number;
  };
}
type T3 = T1 & T2; // T3 的类型为 { person:{ name:string; age: number } }
```

### 数字分隔符 \_

为了更清楚的分割一个比较长的数字，编译以后不会有任何变化

```ts
const total = 1_234_567;
// 编译以后 var total = 1234567
```

## 三、操作符

### 获取键值 keyof

keyof 用于获取一个类型的所有键值，并返回这些键值组成的联合类型

```ts
interface Person {
  name: string;
  age: number;
  gender: "male" | "female";
}
type PersonKeys = keyof Person; // PersonKeys 的类型为 'name' | 'age' | 'gender'
```

### 获取对象的类型 typeof

typeof 可以获取一个对象的具体类型

```ts
const person = {
  name: "busyzz",
  age: 27
};
type Person = typeof person; // Person 的类型为 { name: string; age: number; }
```

### 遍历操作 in

in 用于遍历一组联合类型

```ts
type TypeNumber = {
  [key in "name" | "age"]: number;
};

const obj: TypeNumber = {
  name: 123,
  age: 123
};
```

### 类型保护 is

is 用于做类型保护时使用,当函数的参数可能有多个类型的时候就需要做类型保护，先来看一个简单的类型保护列子：

```ts
function test(x: number | string) {
  if (typeof x === "string") {
    x.substr(1); // 编译通过
  }
  x.substr(1); // 编译不通过 因为当 x 为 number 类型的时候不存在 substr 方法
}
```

当一个类型不能简单的使用 typeof 去判断的时候，就需要用到 is 了，它可以根据一些复杂的逻辑来判断参数是否是指定的类型

```ts
function isPlainObject(input: any): input is Record<any, any> {
  return Object.prototype.toString.call(input).slice(8, -1) === "Object";
}
// 如果是普通对象类型返回它的键值，否则返回自身
const test = (input: any) => {
  if (isPlainObject(input)) {
    return Object.keys(input);
  }
  return input;
};
```

## 四、泛型

### 基础使用

泛型指的是一个不确定的类型，在使用某个类型或者调用某个方法的时候动态的传入进去

```ts
// 类型
type Type<T> = T | ((param: T) => T);

const type: Type<string> = "busyzz";
const type2: Type<string> = (name: string) => {
  return name;
};
// 定义方法
const func = <T>(p: T) => p;
// 调用方法
func<string>("busyzz");
// 在这个列子中也可以不传入 <string> , ts 可以自动推导出泛型的具体类型 T 为 string
func("busyzz");
```

### 泛型约束

通过 `extends` 对传入的泛型进行约束

```ts
function test<T extends "x" | "y">(input: T): T {
  return input;
}
// 调用 test 函数的时候 泛型 T 只能传入 'x' | 'y' 的子类型
```

### 泛型条件

通过 `extends` 对类型做一个三元运算

```ts
type Test<T> = T extends "name" | "age" ? T : never;
// Test<'name'> 返回类型 'name'
// Test<number> 返回类型 never
```

需要特别注意的是，当 `extends` 左侧是一个具体的类型，或者左侧是一个泛型的时候，情况是不一样的：

```ts
// 具体的类型
type T1 = "x" | "y" extends "x" ? 1 : 2; // T1 的类型为 2
// 泛型
type Test<T> = T extends "x" ? 1 : 2;

type T2 = Test<"x" | "y">; // T2 的类型为 1 | 2
```

当 extends 左侧为泛型的时候 ，会将 泛型 T 中的类型逐个判断，最后返回他们的联合类型，如果不想被逐个判断可以这样做：

```ts
type Test<T> = [T] extends ["x"] ? 1 : 2;

type T2 = Test<"x" | "y">; // 此时 T2 的类型为 2
```

### 泛型推断 infer

infer 表示类型推断的意思，一般使用在 `泛型条件` 中和 extends 一起使用

```ts
type Foo<T> = T extends { name: infer P } ? P : never;
// type Foo<{name:string}> 返回的类型为 string;
// type Foo<{name:number}> 返回的类型为 number;
```

## 五、内置泛型

### `Partial<T>`

将泛型内的所有属性设置为可选的

```ts
// 具体实现
type Partial<T> = {
  [P in keyof T]?: T[P];
};
interface Person {
  name: string;
  age: number;
}
// 通过 Partial 包裹以后的类型为 { name?:string; age?: number };
const person: Partial<Person> = {
  name: "busyzz"
};
```

### `Record<K,T>`

将 K 中的属性全部设置为 T 类型，通常用它来申明一个普通 Object 对象

```ts
// 具体实现
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

interface Person {
  name: string;
  age: number;
}

const record: Record<"a" | "b", Person> = {
  a: {
    name: "busyzz",
    age: 23
  },
  b: {
    name: "zzb",
    age: 27
  }
};
```

这里的 `keyof any` 对应的类型为 `string | number | symbol`

### `Pick<T,K>`

选择一个类型中的一个或多个属性

```ts
// 实现
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
interface Person {
  name: string;
  age: number;
}
const person: Pick<Person, "name"> = {
  name: "busyzz"
};
const person: Pick<Person, "name" | "age"> = {
  name: "busyzz",
  age: 27
};
```

### `Exclude<T,U>`

从 T 联合类型中去除 T 和 U 的交集

```ts
// 实现
type Exclude<T, U> = T extends U ? never : T;

type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // 'c'
```

### `Extract<T,U>`

从 T 联合类型中提取 T 和 U 的交集

```ts
// 实现
type Extract<T, U> = T extends U ? T : never;

type T1 = Extract<"a" | "b" | "c", "a" | "b">; // 'a' | 'b'
```

### `Omit<T,U>`

从一个类型中删除一个或多个属性

```ts
// 具体实现
type Omit<T, U extends keyof T> = Pick<T, Exclude<keyof T, U>>;

interface Person {
  name: string;
  age: number;
  gender: "male" | "female";
}

type T1 = Omit<Person, "name" | "gender">; // T1 的类型为 { age: number }
```

### `ReturnType<T>`

传入一个函数类型，获取该函数类型的返回值类型

```ts
// 具体实现
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type T1 = ReturnType<() => { name: string; age: number }>; // T1 的类型为 { name: string; age: number }

// 获取一个函数实例的返回值
function test(a: number, b: number) {
  return a + b;
}

type T2 = ReturnType<typeof test>; // T2 的类型为 number
```

在使用 `redux` 的时候可以将 `reducer` 函数传入 `ReturnType<typeof reducer>` 获取到 `state` 的类型

### `Required<T>`

将 T 中的所有属性设置为必选

```ts
// 实现
type IRequired<T> = {
  [P in keyof T]-?: T[P];
};

interface Person {
  name?: string;
  age?: number;
}

type T = IRequired<Person>; // T 的类型为 { name: string; age:number  }
```

`-?:` 可以看做是删除掉可选项，然后属性就变成必选了

### `Promise<T>`

Promise 中的 T 代表的是 调用 resolve 方法时传入的值的类型

```ts
function request<T>(): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => {
      const data = ({
        name: "busyzz",
        age: 26
      } as unknown) as T;
      resolve(data);
    }, 1000);
  });
}
```

## 六、自定义的一些常用类型

### `WithOptional<T,K>`

将部分属性设置为可选

```ts
// 具体实现
type WithOptional<T, K extends keyof T> = Omit<T, K> &
  {
    [P in K]?: T[P];
  };

interface Person {
  name: string;
  age: number;
}

type T = WithOptional<Person, "age">; // T 的类型为 { name:string , age?:number }
```

### `Weaken<T,K>`

有些时候我们可能需要重写一个库提供的 interface 的某个属性，但是重写的时候可能会导致冲突：

```ts
interface Test {
  name: string;
}

interface Test2 extends Test {
  name: string | number; // 编译失败
}

// 这个时候 ts 会报错，提示 不能将 string | number 类型分配给 string 类型

// 使用 Weaken 来解决
type Weaken<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? any : T[P];
};

interface Test2 extends Weaken<Test, "name"> {
  name: string | number;
} // 编辑通过
```

### `Combine<T,U,M...>`

用于合并多个类型，当你要合并多个类型的时候需要 A & B & C & D ,可以使用 Combine 来简化

```ts
type Combine<T = never, U = never, M = never, K = never, E = never> = T &
  U &
  M &
  K &
  E;
type Test = Combine<T1, T2, T3>;
```

## 七、其他

### 文件 `.d.ts`

以 `.d.ts` 结尾的，我通常是用来声明一些全局的类型，如 window 上的扩展类型，服务端返回的数据类型，一般会在根目录下面创建一个 `typings` 文件夹，目录结构：

```ts
|-- typings
    |-- global.d.ts // 全局的类型声明
    |-- api.d.ts // 服务端返回的类型
```

`global.d.ts` :

```ts
interface Window {
  AMap: any;
}
```

`api.d.ts` :

```ts
namespace Api {
  interface Goods {
    price: number;
    size: "m" | "l" | "xl";
    url: string;
  }
  interface User {
    phone: number;
    email: string;
    name: string;
    age: number;
  }
}
// 在需要的地方直接使用,不需要再通过 import 引入了
const fetch = async () => {
  const res = await request<Api.Goods>();
};
```

### JSON to TS

有些时候我们需要将一个 json 数据转换为对应的 typescript 类型文件，可以使用这个在线转换的网站：

[json2Typescript](https://apihelper.jccore.cn/jsontool)

<Vssue />
