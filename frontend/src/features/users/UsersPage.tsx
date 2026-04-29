import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  increment,
  decrement,
  incrementByAmount,
  reset,
  setStep,
  selectCount,
  selectStep,
} from './hooks'

export const Counter = () => {
  const count = useAppSelector(selectCount)
  const step = useAppSelector(selectStep)

  const dispatch = useAppDispatch()

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Contador Redux Toolkit
      </h2>

      <div className="text-center">
        <p className="text-6xl font-bold text-blue-600">{count}</p>
        <p className="text-sm text-gray-500 mt-2">Step actual: {step}</p>
      </div>

      <div className="flex gap-2 justify-center">
        <button
          onClick={() => dispatch(decrement())}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          - {step}
        </button>
        <button
          onClick={() => dispatch(reset())}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={() => dispatch(increment())}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          + {step}
        </button>
      </div>

      <div className="flex gap-2 justify-center">
        <button
          onClick={() => dispatch(incrementByAmount(5))}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
        >
          +5
        </button>
        <button
          onClick={() => dispatch(incrementByAmount(10))}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
        >
          +10
        </button>
        <button
          onClick={() => dispatch(incrementByAmount(-5))}
          className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
        >
          -5
        </button>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cambiar step de incremento:
        </label>
        <div className="flex gap-2">
          {[1, 2, 5, 10].map((stepValue) => (
            <button
              key={stepValue}
              onClick={() => dispatch(setStep(stepValue))}
              className={`px-3 py-1 rounded transition-colors ${
                step === stepValue
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {stepValue}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}