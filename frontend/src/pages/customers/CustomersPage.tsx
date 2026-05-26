import { useEffect, useMemo, useState, useRef } from "react";
import API from "../../services/api";
import UnifiedSearchFilter from "../../components/dashboard/UnifiedSearchFilter";
import { Users, UserPlus, Mail, Phone, MoreVertical } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

type Customer = {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
};

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchQuery: "",
    category: "all",
    dateFrom: "",
    dateTo: "",
  });
  const pageRef = useRef<HTMLDivElement>(null);

  // ==========================
  // 📦 LOAD CUSTOMERS
  // ==========================
  const loadCustomers = async () => {
    setLoading(true);
    try {
      // Asumiendo que el endpoint es /customers según tu estructura
      const res = await API.get<Customer[]>("/customers");
      setCustomers(res.data ?? []);
    } catch (err) {
      console.error("Error loading customers:", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
    // Trigger animation
    const timer = setTimeout(() => {
      pageRef.current?.classList.add("visible");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // ==========================
  // 🔍 FILTER LOGIC
  // ==========================
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const fullName = `${customer.name} ${customer.lastName}`.toLowerCase();
      const email = customer.email.toLowerCase();
      const query = filters.searchQuery.toLowerCase();
      const registrationDate = new Date(customer.createdAt);

      const matchesSearch = 
        fullName.includes(query) || 
        email.includes(query) ||
        customer._id.toLowerCase().includes(query);

      let matchesDate = true;
      if (filters.dateFrom) {
        matchesDate = matchesDate && registrationDate >= new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        const endDate = new Date(new Date(filters.dateTo).setHours(23, 59, 59, 999));
        matchesDate = matchesDate && registrationDate <= endDate;
      }

      return matchesSearch && matchesDate;
    });
  }, [customers, filters]);

  // ==========================
  // 📊 KPI
  // ==========================
  const totalCustomers = filteredCustomers.length;
  const newThisMonth = filteredCustomers.filter(c => {
    const date = new Date(c.createdAt);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div ref={pageRef} className="container py-8 fade-in-up">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
          <h1 className="page-title title-gradient">Directorio de Clientes</h1>
          <p className="page-subtitle">Gestiona la relación con tus compradores</p>
        </div>

        <button className="btn" style={{ width: 'auto', padding: '10px 24px' }}>
          <UserPlus size={18} />
          Nuevo Cliente
        </button>
      </div>

      {/* FILTROS AVANZADOS */}
      <UnifiedSearchFilter onSearch={setFilters} />

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="summary-card">
          <div className="flex items-center justify-between mb-4">
            <div className="brand-icon" style={{ width: '48px', height: '48px' }}>
              <Users size={20} />
            </div>
          </div>
          <p className="text-muted-xs uppercase tracking-widest font-black">Total Clientes</p>
          <h2 className="title-md mt-1 font-bold">{totalCustomers}</h2>
        </div>

        <div className="summary-card">
          <div className="flex items-center justify-between mb-4">
            <div className="brand-icon" style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.25))' }}>
              <UserPlus size={20} className="text-success" />
            </div>
          </div>
          <p className="text-muted-xs uppercase tracking-widest font-black">Nuevos (Mes)</p>
          <h2 className="title-md mt-1 font-bold">{newThisMonth}</h2>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="card">
        <div className="table-container">
          {loading ? (
            <div className="p-10 text-center text-muted">Cargando clientes...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Fecha Registro</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-8 text-muted">No se encontraron clientes</td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-white/[0.02] transition-colors">
                      <td>
                        <div className="font-bold text-primary">{customer.name} {customer.lastName}</div>
                        <div className="text-muted-xs font-medium">ID: #{customer._id.slice(-6)}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 text-sm"><Mail size={14} className="text-muted" /> {customer.email}</div>
                        {customer.phone && <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-muted" /> {customer.phone}</div>}
                      </td>
                      <td className="text-muted-sm italic">{new Date(customer.createdAt).toLocaleDateString()}</td>
                      <td className="text-right">
                        <button className="text-muted hover:text-white" style={{ background: 'none', boxShadow: 'none', width: 'auto', display: 'inline', padding: 0 }}>
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;