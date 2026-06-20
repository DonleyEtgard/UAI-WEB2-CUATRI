import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">

      {/* 404 */}
      <h1 className="text-6xl font-bold text-gray-800">404</h1>

      {/* message */}
      <p className="mt-4 text-lg text-gray-600">
        No se Encuentra la Página
      </p>

      <p className="text-gray-500 mt-2">
        The page you are looking for doesn’t exist or was moved.
      </p>

      {/* action */}
      <Link
        to="/"
        className="mt-6 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
       volver al inicio
      </Link>

    </div>
  );
};

export default NotFound;