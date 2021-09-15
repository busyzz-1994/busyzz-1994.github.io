<!--
 * @Author: busyzz
 * @Date: 2021-08-12 18:11:23
 * @Description:
-->

::: tip
本文主要介绍 TypeScript 基础知识，适用于对 TypeScript 有一段时间了解的开发者，主要包括类型、运算符、操作符、泛型、泛型工具、实践经历
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

在函数的返回类型中 void 和 undefined 功能类型，但是也存在一些区别， undefined 可以看做是 void 的子集，void 表示的是不关注返回值

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
const len = name.length;
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

### 数字分隔符 \_

为了更清楚的分割一个比较长的数字，编译以后不会有任何变化

```ts
const total = 1_234_567;
// 编译以后 var total = 1234567
```

## 操作符

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
func<string>();
```

### 泛型约束

通过 `extends` 对传入的泛型进行约束

```ts
function sum<T extends number = number>(...args: Array<T>): number {
  let total = 0;
  args.forEach(v => (total += v));
  return total;
}
// 调用 sum 函数的时候 泛型 T 只能传入 number 的子类型
```

### 泛型条件

通过 `extends` 对类型做一个三元运算

```ts
type Test<T> = T extends "name" | "age" ? T : never;
// Test<'name'> 返回类型 'name'
// Test<number> 返回类型 never
```

### 泛型推断 infer

infer 表示类型推断的意思，一般使用在 `泛型条件中` 和 extends 一起使用

```ts
type Foo<T> = T extends { name: infer P } ? P : never;
// type Foo<{name:string}> 返回的类型为 string;
// type Foo<{name:number}> 返回的类型为 number;
```

## 内置泛型

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
// 通过 Partial 包裹以后变为可选的
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

type T1 = Omit<Person, "name" | "gender">;
```
