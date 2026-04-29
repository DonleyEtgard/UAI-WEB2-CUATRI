import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  addTodo,
  toggleTodo,
  deleteTodo,
  setFilter,
  clearCompleted,
  selectFilteredTodos,
  selectFilter,
  selectTodosStats,
} from './todosSlice'

export const TodoList = () => {
  const [inputValue, setInputValue] = useState('')

  const todos = useAppSelector(selectFilteredTodos)
  const filter = useAppSelector(selectFilter)
  const stats = useAppSelector(selectTodosStats)

  const dispatch = useAppDispatch()

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      dispatch(addTodo(inputValue.trim()))
      setInputValue('')
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        📝 Lista de Tareas con Redux
      </h2>

      <div className="mb-4 p-3 bg-gray-100 rounded-lg flex justify-around text-sm">
        <div>
          <span className="font-semibold">Total:</span> {stats.total}
        </div>
        <div>
          <span className="font-semibold text-green-600">Completadas:</span> {stats.completed}
        </div>
        <div>
          <span className="font-semibold text-orange-600">Activas:</span> {stats.active}
        </div>
      </div>

      <form onSubmit={handleAddTodo} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="¿Qué necesitas hacer?"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Agregar
          </button>
        </div>
      </form>

      <div className="mb-4 flex gap-2 justify-center">
        {(['all', 'active', 'completed'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => dispatch(setFilter(filterType))}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === filterType
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filterType === 'all' ? 'Todas' : filterType === 'active' ? 'Activas' : 'Completadas'}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {filter === 'all'
              ? 'No hay tareas. ¡Agrega una!'
              : filter === 'active'
              ? 'No hay tareas activas'
              : 'No hay tareas completadas'}
          </p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                todo.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => dispatch(toggleTodo(todo.id))}
                className="w-5 h-5 cursor-pointer"
              />

              <span
                className={`flex-1 ${
                  todo.completed
                    ? 'line-through text-gray-500'
                    : 'text-gray-800'
                }`}
              >
                {todo.text}
              </span>

              <button
                onClick={() => dispatch(deleteTodo(todo.id))}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>

      {stats.completed > 0 && (
        <button
          onClick={() => dispatch(clearCompleted())}
          className="mt-4 w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Limpiar completadas ({stats.completed})
        </button>
      )}
    </div>
  )
}