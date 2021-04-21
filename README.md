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
let filter: Filter = // ...
```
- T의 범위를 모든 시그니처로 한정한 호출 시그니처. T를 Filter 타입의 일부로 선언했으므로 타입스크립트는 Filter 타입의 함수를 선언할 때 T를 한정한다.
```typescript
type Filter<T> = {
  (array: T[], f: (item: T) => boolean): T[]
}
type Filter<T> = (array: T[], f: (item: T) => boolean): T[]
let filter: Filter<string> = // ...
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
 대부분의 상황에서 타입스크리브는 제네릭 타입 추론을 잘해준다.
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