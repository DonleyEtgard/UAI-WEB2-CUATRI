import { Counter } from '../../features/users/UsersPage.tsx'
import { TodoList } from '../../features/todos/TodoList'
import { PostsList } from '../../features/posts/PostList.tsx'   // ✅ CORRECTO

const ReduxDemoPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Redux Toolkit Demo
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Ejemplos prácticos de gestión de estado con Redux Toolkit
        </p>

        <div className="grid md:grid-cols-2 lg-grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div><Counter /></div>
          <div><TodoList /></div>
          <div><PostsList /></div>
        </div>
      </div>
    </div>
  )
}

export default ReduxDemoPage
