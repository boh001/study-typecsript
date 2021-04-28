# 4-2. 다형성

## 구체타입
기대하는 타입을 정확하게 알고 있고, 실제 이 타입이 전달돠었는지 확인할 때는 구체타입이 유용하다.
```typescript
- boolean
- string
- Date[]
- { a: number } | { b: string }
- (numbers: number[]) => number 
```
하지만 때로는 어떤 타입을 사용할지 미리 알 수 없는 상황이 있는데 이런 상황에서는 함수를 특정 타입으로 제한하기 어렵다.(모든 타입을 오버로드하면 가능하지만 재사용성이 떨어지고 코드가 지저분해진다.)
```typescript
type Filter = {
  (array: number[], f: (item: number) => boolean): number[]
  (array: string[], f: (item: string) => boolean): string[]
  (array: object[], f: (item: object) => boolean): object[]
}

let names = [
  { firstName: 'beth' },
  { firstName: 'caitlyn' },
  { firstName: 'xin' },
]

let result = filter(
  names,
  obj => obj.firstName.startsWith('b')
) // 에러: 'firstName' property는 'object' 타입에 존재하지 않음

result[0].firstName // 에러: 'firstName' property는 'object' 타입에 존재하지 않음
```
<br/>
<br/>

## 제너릭 타입 매개변수
꺽쇠 기호를 추가하는 위치에 따라 제네릭의 범위가 결정되며 타입스크립트는 지정된 영역에 속하는 모든 제네릭 타입 매개변수 인스턴스가 한 개의 구체 타입으로 한정되도록 보장한다.
```typescript
type Filter = {
  <T>(array: T[], f: (item: T) => boolean): T[]
}
let filter = Filter = (array, f) => // ...

// T는 number로 한정됨
filter([1,2,3], x => x > 2)

// T는 string으로 한정됨
filter(['a','b'], x => x != 'b')
```
필요하면 꺽쇠괄화 안에 제네릭타입 매개변수 여러 개를 콤마로 구분해 선언할 수 있다.
```typescript
type Filter = {
  <T, U>(array: T[], f: (item: T) => boolean): U[]
}
// 일반적으로 타입 이름은 대문자 T를 시작으로 U,V,W 순으로 필요한 만큼 사용한다.
```
타입 별칭, 클래스, 인터페이스에서도 제네릭 타입을 사용할 수 있다.

<br/>
<br/>

## 제네릭 타입 한정
제네릭 타입의 선언 위치에 타입의 범위뿐 아니라 타입스크립트가 제네릭 타입을 언제 구체 타입으로 한정하는지도 결정된다.
- T의 범위를 개별 시그니처로 한정한 호출 시그니처. T를 한 시그니처 범위로 한정했으므로 타입스크립트는 filter 타입의 함수를 호출할 때 이 시그니처의 T를 구체 타입으로 한정한다.
```typescript
type Filter = {
  <T>(array: T[], f: (item: T) => boolean): T[]
}
type Filter = <T>(array: T[], f: (item: T) => boolean): T[]
let filter: Filter = //...
filter([1,2,3], ...) // T는 number
```
- T의 범위를 모든 시그니처로 한정한 호출 시그니처. T를 Filter 타입의 일부로 선언했으므로 타입스크립트는 Filter 타입의 함수를 선언할 때 T를 한정한다.
```typescript
type Filter<T> = {
  (array: T[], f: (item: T) => boolean): T[]
}
type Filter<T> = (array: T[], f: (item: T) => boolean): T[]
let filter: Filter<string> = // ... T는 string
```
- T를 시그니처로 범위로 한정한, 이름을 갖는 함수 호출 시그니처. filter를 호출할 때 T를 타입으로 한정하므로 각 filter 호출은 자신만의 T 한정 값을 갖는다.
```typescript
function filter<T>(array: T[], f: (item: T) => boolean): T[] {
   // ...
}
```
<br/>
<br/>

## 제네릭 타입 추론

대부분의 상황에서 타입스크리브는 제네릭 타입 추론을 잘해준다.
```typescript
function map<T, U>(array: T[], f: (item: T) => U): U[] {
  let result = []
  for (let i = 0; i < array.length; i++) {
    result[i] = f(array[i])
  }
  return result
}

map(['a', 'b', 'c'], x => x === 'a')
// T 타입의 배열, U 타입을 반환하는 함수
```
 제네릭은 명식적으로 지정할 수 있다. 제네릭의 타입을 명시할 때는 모든 필요한 제네릭 타입을 명시하거나 반대로 아무것도 명시해서는 안된다.
 대부분의 상황에서 타입스크립트는 제네릭 타입 추론을 잘해준다.
```typescript
map<string, boolean>( ['a','b','c'], x => x === 'a')

map<string>( ['a','b','c'], x => x === 'a') // number 타입은 할당 불가

map<string>( ['a','b','c'], x => x === 'a') // 에러 두개의 타입 인수가 필요함
```
타입스크립트는 제네릭 함수로 전달한 인수의 정보를 이용해 제네릭의 구체타입을 추론한다.
```typescript
let promise = new Promise(resolve => resolve(45))

promise.then(result => result * 4) 
// {}로 추론함
// 에러 수학 연산자의 왼족은 any, number, bigint, enum 타입 중 하나여야함

let promise = new Promise<number>(resolve => resolve(45))

// PromiseConstructor
new <T>(executor: (resolve: (value: T) => void, reject: (reason?: any) => void) => void) => Promise<T>
```
<br/>
<br/>

## 제네릭 타입 별칭
타입 별칭에도 마찬가지로 제네릭 타입을 적용할 수 있다. 타입 별칭에 사용하는 제네릭 타입은 자동으로 추론되지 않으므로 타입 매개변수를 명시적으로 한정해야한다.
```typescript
type MyEvent<T> = {
  target: T
  type: string
}

let myEvent: Event<HTMLButtonElement | null> = {
  target: document.querySelector('#myButton'),
  type: 'click'
}
```
제네릭을 사용한 타입 별칭으로 다른 타입을 만들수도 있고 함수 시그니처에도 사용할 수 있다.
```typescript
type TimedEvent<T> = {
  event: MyEvent<T>
  from: Date
  to: Date
}

function triggerEvent<T>(event: MyEvent<T>): void {
  // ...
}
```
<br/>
<br/>

## 한정된 다형성
적어도 특정 타입을 포함하는 타입을 만들고 싶을 때는 & 기호를 이용해서 만들 수 있다.
U 타입은 적어도 T 타입을 포함하는 관계를 U가 T의 <strong>상한한계</strong>라고 설명한다.
```typescript
type TreeNode = {
  value: string
}
let a: TreeNode = { value: 'a' }

type LeafNode = TreeNode & {
  isLeaf: true
}
let b: LeafNode = { value: 'b', isLeaf: true }

type InnerNode = TreeNoe & {
  children: [TreeNode] | [TreeNode, TreeNode]
}
let c: InnerNode = { value: 'c', children: [b] }
```
예시
- T는 TreeNode이거나 아니면 TreeNode의 서브타입이다.
- T 타입은 extends TreeNode라고 했으므로 TreeNode가 아닌 다른 것을 전달하면 오류가 나타난다. node는 TreeNode이거나 TreeNode의 서브타입이어야 한다.
- extends TreeNode를 생략하고 T 타입만을 선언하면 node.value를 읽는 행위가 안전하지 않아서 컴파일 타입 에러를 던진다.
```typescript
function mapNode<T extends TreeNode> (
  node: T,
  f: (value: string) => string
): T {
  return {
    ...node,
    value: f(node.value)
  }
}
```
타입 제한을 여러개 추가하려면 인터섹션을 여러개 사용하면 된다.
```typescript
type HasSides = { numberOfSides: number }
type SidesHaveLength = { sideLength: number }

function logPerimeter<
  Shape extends HasSides & SidesHaveLength
>(s: Shape): Shape {
  return s.numberOfSides * s.sideLength
}
```
가변 인수 함수에서도 한정된 다형성을 사용할 수 있다.
- call은 가변 인수 함수로 T와 R 타입 매개변수를 받는다. T는 unknown[]의 서브타입으로 어떤 타입의 배열 혹은 튜플이다.
- f 또한 가변 인수 함수로 args와 같은 타입의 인수를 받는다. args 타입이 무엇이든지 f도 똑같은 타입의 args를 받는다.
- args 타입은 T이며 T는 배열 타입이고 타입스크립트는 args 용으로 전달한 인수를 보고 T에 알맞은 튜플타입을 추론한다.
```typescript
function call<T extends unknown[], R>(f: (...args: T) => R, ...args: T): R {
  return f(...args)
}
function fill(length: number , value: string): string[] {
  return Array.from({length}, () => value)
}
let a = call(fill, 10 ,'a') // T는 [number, string]
let b = call(fill, 10) // 에러 2개의 인수가 필요함
```
<br/>
<br/>

## 제네릭 타입 기본값
함수 매개변수에 기본값을 설정하듯이 제네릭타입 매개변수에도 기본값을 넣을 수 있다.
```typescript
type MyEvent<T = HTMLElement> = {
  target: T
  type: string
}

type MyEventM<T extends HTMLElement = HTMLElement> = {
  target: T
  type: string
}
let myEvent: MyEvent = {
  target: myElement,
  type: string
}
```
함수의 선태적 매개변수처럼 기본 타입을 갖는 제네릭은 반드시 기본 타입을 갖지 않는 제네릭 뒤에 위치해야한다.
```typescript
type MyEvent2<
  Type extends string,
  Target extends HTMLElement = HTMLElement,
> = {
  target: Target
  type: Type
}
```
