import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError() as any;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
      
      <h1 className="text-4xl font-bold text-red-500">
        Oops!
      </h1>

      <p className="text-gray-600 mt-2">
        Algo salió mal en la aplicación.
      </p>

      <pre className="mt-4 text-xs text-gray-500 bg-white p-3 rounded shadow max-w-md overflow-auto">
        {error?.message || "Error desconocido"}
      </pre>

      <button
        onClick={() => window.location.reload()}
        className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Recargar
      </button>
    </div>
  );
};

export default ErrorPage;