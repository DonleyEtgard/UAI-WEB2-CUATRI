import React from "react";

type LoaderProps = {
  text?: string;
  fullScreen?: boolean;
};

const Loader: React.FC<LoaderProps> = ({
  text = "Cargando...",
  fullScreen = false,
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-3
        ${fullScreen ? "h-screen" : "h-40"}
      `}
    >
      {/* Spinner */}
      <div className="w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />

      <span className="text-sm text-gray-500">{text}</span>
    </div>
  );
};

export default Loader;