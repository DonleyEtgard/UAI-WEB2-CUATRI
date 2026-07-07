import { TodoList } from '../../features/todos/TodoList'

const ReduxDemoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Redux Toolkit Demo
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Ejemplos prácticos de gestión de estado con Redux Toolkit
        </p>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white p-4 rounded-xl shadow">
            <TodoList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReduxDemoPage;