import React, { useState } from "react";
import { Search, Calendar, Filter, X } from "lucide-react";

interface FilterProps {
  onSearch: (filters: any) => void;
}

const UnifiedSearchFilter: React.FC<FilterProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ searchQuery, category, dateFrom, dateTo });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategory("all");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="card mb-8">
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Primera Fila: Búsqueda y Categoría */}
        <div className="form-grid-2" style={{ width: '100%', maxWidth: 'none' }}>
          <label htmlFor="searchQuery">
            <div className="flex items-center gap-2">
              <Search size={14} className="text-primary" />
              <span>¿Qué estás buscando?</span>
            </div>
            <input
              id="searchQuery"
              type="text"
              placeholder="Buscar por nombre, SKU, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: '100%' }}
            />
          </label>

          <label htmlFor="category">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-primary" />
              <span>Módulo</span>
            </div>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ maxWidth: '100%' }}
            >
              <option value="all">Todos los registros</option>
              <option value="clients">Clientes</option>
              <option value="products">Productos</option>
              <option value="sales">Ventas / Facturas</option>
              <option value="users">Usuarios del Sistema</option>
            </select>
          </label>
        </div>

        {/* Segunda Fila: Rango de Fechas */}
        <div className="form-grid-2" style={{ width: '100%', maxWidth: 'none' }}>
          <label htmlFor="dateFrom">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-secondary" />
              <span>Desde</span>
            </div>
            <input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{ maxWidth: '100%' }}
            />
          </label>

          <label htmlFor="dateTo">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-secondary" />
              <span>Hasta</span>
            </div>
            <input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{ maxWidth: '100%' }}
            />
          </label>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col md:flex-row gap-4 pt-2">
          <button type="submit" className="btn">
            <Search size={18} />
            Aplicar Filtros
          </button>
          <button 
            type="button" 
            onClick={clearFilters} 
            className="btn-secondary"
          >
            <X size={18} />
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UnifiedSearchFilter;