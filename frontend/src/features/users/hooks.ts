import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  value: number
  step: number
}

const initialState: CounterState = {
  value: 0,
  step: 1,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      // Podemos "mutar" el estado de forma segura
      state.value += state.step
    },
    decrement: (state) => {
      state.value -= state.step
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
    reset: (state) => {
      state.value = initialState.value
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount, reset, setStep } = counterSlice.actions

// Selectores: funciones para extraer datos del estado
export const selectCount = (state: { counter: CounterState }) => state.counter.value
export const selectStep = (state: { counter: CounterState }) => state.counter.step

// Exportar el reducer para agregarlo al store
export default counterSlice.reducer