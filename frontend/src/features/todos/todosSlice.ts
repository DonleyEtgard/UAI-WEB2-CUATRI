import { createSlice, type PayloadAction, nanoid } from '@reduxjs/toolkit'

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

interface TodosState {
  items: Todo[]
  filter: 'all' | 'active' | 'completed'
}

const initialState: TodosState = {
  items: [
    {
      id: '1',
      text: 'Aprender Redux Toolkit',
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: '2',
      text: 'Crear un ejemplo práctico',
      completed: true,
      createdAt: Date.now(),
    },
  ],
  filter: 'all',
}

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.items.push(action.payload)
      },
      // prepare permite generar el payload antes de que llegue al reducer
      prepare: (text: string) => {
        return {
          payload: {
            id: nanoid(),
            text,
            completed: false,
            createdAt: Date.now(),
          },
        }
      },
    },

    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find((item) => item.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },

    deleteTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },

    editTodo: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const todo = state.items.find((item) => item.id === action.payload.id)
      if (todo) {
        todo.text = action.payload.text
      }
    },

    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.filter = action.payload
    },

    clearCompleted: (state) => {
      state.items = state.items.filter((item) => !item.completed)
    },
  },
})

// Exportar actions
export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  setFilter,
  clearCompleted,
} = todosSlice.actions

// Selectores
export const selectAllTodos = (state: { todos: TodosState }) => state.todos.items

export const selectFilteredTodos = (state: { todos: TodosState }) => {
  const { items, filter } = state.todos
  switch (filter) {
    case 'active':
      return items.filter((todo) => !todo.completed)
    case 'completed':
      return items.filter((todo) => todo.completed)
    default:
      return items
  }
}

export const selectFilter = (state: { todos: TodosState }) => state.todos.filter

export const selectTodosStats = (state: { todos: TodosState }) => {
  const items = state.todos.items
  return {
    total: items.length,
    completed: items.filter((todo) => todo.completed).length,
    active: items.filter((todo) => !todo.completed).length,
  }
}

// Exportar reducer
export default todosSlice.reducer