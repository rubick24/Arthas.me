---
title: "global state with hooks"
date: "2019-07-11 18:54"
---
## backgrounds
Problems when manage global state with hooks and context api:

[Preventing rerenders with React.memo and useContext hook.](https://github.com/facebook/react/issues/15156#issuecomment-474590693)

## original idea
[State Management with React Hooks — No Redux or Context API](https://medium.com/javascript-in-plain-english/state-management-with-react-hooks-no-redux-or-context-api-8b3035ceecf8)

## clear implantation with TS
useGlobalState.ts
```ts
import { useState, useEffect, Dispatch, SetStateAction } from 'react'

export default function useGlobalState<T>(initialState: T) {
  let state = initialState
  let listeners: Array<Dispatch<SetStateAction<T>>> = []

  const setState = (newState: T) => {
    state = newState
    listeners.forEach(listener => {
      listener(state)
    })
  }

  const useCustom: () => [T, (state: T) => void] = () => {
    const newListener = useState(initialState)[1]    
    useEffect(() => {
      listeners.push(newListener)
      return () => {
        listeners = listeners.filter(listener => listener !== newListener)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return [state, setState]
  }
  return useCustom
}
```

## usage
store.ts
```ts
import useGlobalState from './useGlobalState'

export const useGlobalCount = useGlobalState(0)
```
A.tsx
```tsx
import React from 'react'
import { useGlobalCount } from '../store'
const A: React.FC = () => {
  const [count, setCount] = useGlobalCount()
  return (
    <div>
      <span>A {count}</span>
      <button onClick={() => setCount(count + 1)} > + </button>
    </div>
  );
}

export default A
```
B.tsx
```tsx
import React from 'react'
import { useGlobalCount } from '../store'
const B: React.FC = () => {
  const [count, setCount] = useGlobalCount()
  return (
    <div>
      <span>B {count}</span>
      <button onClick={() => setCount(count - 1)} > - </button>
    </div>
  );
}

export default B
```
And you can also pass a object to `useGlobalState` and wrap it with mutations and actions.