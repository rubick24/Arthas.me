import { useState, useEffect } from 'react'


export default function useGlobalState(initialState) {
  let state = initialState
  let listeners = []

  const setState = (newState) => {
    if (typeof newState === 'function') {
      state = newState(state)
    } else {
      state = newState
    }
    listeners.forEach(listener => {
      listener(state)
    })
  }

  const useCustom = () => {
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
