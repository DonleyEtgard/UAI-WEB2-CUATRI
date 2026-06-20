import React from "react";

type EmptyStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Sin datos",
  description = "No hay información para mostrar",
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-xl shadow">
      
      {/* Icon */}
      <div className="text-5xl mb-3">📭</div>

      <h2 className="text-lg font-semibold text-gray-700">
        {title}
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;