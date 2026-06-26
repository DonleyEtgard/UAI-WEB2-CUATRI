import React, { useState, useEffect } from 'react';
import API from '../../services/api'; // Usamos tu cliente API existente

// Interfaz para los datos de un registro de auditoría
interface AuditLog {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  action: string;
  details: string;
  timestamp: string;
}

// Interfaz para la respuesta de la API
interface ApiResponse {
  data: AuditLog[];
}

const getActionBadge = (action: string) => {
  switch (action.split('_')[1]) {
    case 'CREATE':
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'UPDATE':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'DELETE':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-zinc-700/20 text-zinc-400 border-zinc-700/30';
  }
};

const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        // Asumimos que el endpoint para los logs es /audit-logs
        const response = await API.get<ApiResponse>('/audit-logs');
        if (response.data && Array.isArray(response.data.data)) {
          setLogs(response.data.data);
        } else {
          setError('La respuesta de la API no tiene el formato esperado.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar el registro de actividad.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-4 md:p-6 animate-in fade-in">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Registro de Actividad del Sistema</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Auditoría de las acciones realizadas por los usuarios en la plataforma.
          </p>
        </div>

        {/* ESTADOS DE CARGA Y ERROR */}
        {loading && <p className="text-center text-zinc-400 py-8">Cargando registros...</p>}
        {error && <p className="text-center text-red-400 py-8">{error}</p>}

        {/* TABLA DE REGISTROS */}
        {!loading && !error && (
        <div className="bg-[#1c1c21] border border-[#2b2d31] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#2b2d31]">
              <thead className="bg-zinc-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Usuario</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Acción</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Detalles</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2b2d31]">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-zinc-200">{log.user?.name || 'Usuario del Sistema'}</div>
                      <div className="text-xs text-zinc-500">{log.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400 max-w-sm truncate">{log.details}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {logs.length === 0 && (
              <p className="p-6 text-center text-zinc-500">
                No hay registros de actividad para mostrar.
              </p>
            )}
          </div>
        </div>
        )}

      </div>
    </div>
  );
};

export default AuditLogPage;