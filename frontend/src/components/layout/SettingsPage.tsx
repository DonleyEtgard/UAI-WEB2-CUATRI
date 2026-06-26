import React from 'react';

const SettingsPage: React.FC = () => {
  // Aquí iría la lógica para cargar y guardar las configuraciones

  return (
    <div className="p-4 md:p-6 animate-in fade-in">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Configuración del Sistema</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Gestiona los parámetros y preferencias generales de la aplicación.
          </p>
        </div>

        {/* SECCIONES DE CONFIGURACIÓN */}
        <div className="space-y-8">

          {/* Perfil de la Empresa */}
          <div className="bg-[#1c1c21] border border-[#2b2d31] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-1">Perfil de la Empresa</h2>
            <p className="text-xs text-zinc-400 mb-4">
              Edita la información pública y de contacto de tu negocio.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input para el nombre de la empresa */}
              <div>
                <label className="text-xs font-medium text-zinc-300">Nombre de la Empresa</label>
                <input
                  type="text"
                  placeholder="Mi Empresa S.A."
                  className="w-full mt-1 h-10 rounded-lg bg-zinc-900/50 border border-zinc-700 px-3 text-sm text-white outline-none focus:border-indigo-500/50"
                />
              </div>
              {/* Input para el email */}
              <div>
                <label className="text-xs font-medium text-zinc-300">Email de Contacto</label>
                <input
                  type="email"
                  placeholder="contacto@miempresa.com"
                  className="w-full mt-1 h-10 rounded-lg bg-zinc-900/50 border border-zinc-700 px-3 text-sm text-white outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>

          {/* Configuración Financiera */}
          <div className="bg-[#1c1c21] border border-[#2b2d31] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-1">Finanzas e Impuestos</h2>
            <p className="text-xs text-zinc-400 mb-4">
              Define la moneda por defecto y las tasas de impuestos.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Selector de Moneda */}
              <div>
                <label className="text-xs font-medium text-zinc-300">Moneda</label>
                <select className="w-full mt-1 h-10 rounded-lg bg-zinc-900/50 border border-zinc-700 px-3 text-sm text-white outline-none focus:border-indigo-500/50">
                  <option>USD - Dólar Americano</option>
                  <option>EUR - Euro</option>
                  <option>HTG - Gourde Haitiano</option>
                </select>
              </div>
              {/* Input para Impuestos */}
              <div>
                <label className="text-xs font-medium text-zinc-300">Impuesto General (%)</label>
                <input
                  type="number"
                  placeholder="18"
                  className="w-full mt-1 h-10 rounded-lg bg-zinc-900/50 border border-zinc-700 px-3 text-sm text-white outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;