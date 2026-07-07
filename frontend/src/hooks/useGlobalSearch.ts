import { useEffect, useMemo } from 'react';
import { useSearchContext } from '../context/GlobalSearchContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '@/features/products';
import { useCustomers } from '@/features/customers';
import { useSales } from '@/features/sales';
import type { SearchGroup } from '../types/search';

export const useGlobalSearch = () => {
  const { query, setResults, setIsOpen } = useSearchContext();
  const { user } = useAuth();

  // Consumimos los datos actuales reutilizando tus hooks
  const { products } = useProducts();
  const { customers } = useCustomers();
  const { sales } = useSales();

  const performSearch = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return [];

    const groups: SearchGroup[] = [];

    // 1. PRODUCTOS (Búsqueda por nombre)
    const filteredProducts = products.filter(p => 
      p.name?.toLowerCase().includes(q)
    ).slice(0, 5);

    if (filteredProducts.length > 0) {
      groups.push({
        category: 'products',
        label: '📦 Productos',
        items: filteredProducts.map(p => ({
          id: p._id || '',
          title: p.name,
          subtitle: `Stock: ${p.stock}`,
          category: 'products',
          url: `/app/products`,
          badge: (p.stock || 0) < 10 ? 'Stock Bajo' : undefined
        }))
      });
    }

    // 2. CLIENTES (Búsqueda por nombre, email, teléfono)
    const filteredCustomers = customers.filter(c => 
      c.name?.toLowerCase().includes(q) || 
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    ).slice(0, 5);

    if (filteredCustomers.length > 0) {
      groups.push({
        category: 'customers',
        label: '👥 Clientes',
        items: filteredCustomers.map(c => ({
          id: c._id || '',
          title: c.name,
          subtitle: c.email || c.phone || 'Sin contacto',
          category: 'customers',
          url: `/app/customers`
        }))
      });
    }

    // 3. VENTAS (Búsqueda por ID u estado) - Visible para todos los autenticados
    const filteredSales = sales.filter(s => 
      s._id?.toLowerCase().includes(q) || 
      s.status?.toLowerCase().includes(q)
    ).slice(0, 5);

    if (filteredSales.length > 0) {
      groups.push({
        category: 'sales',
        label: '🧾 Ventas',
        items: filteredSales.map(s => ({
          id: s._id || '',
          title: `Orden #${(s._id || '').slice(-6).toUpperCase()}`,
          subtitle: `Total: $${s.totalAmount} | ${s.status}`,
          category: 'sales',
          url: `/app/sales`,
          badge: s.status
        }))
      });
    }

    // 4. USUARIOS (Restricción por RBAC: solo Admin y SuperAdmin)
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      // Aquí podrías agregar la lógica de filtrado de usuarios si tienes un hook useUsers
    }

    return groups;
  }, [query, products, customers, sales, user]);

  useEffect(() => {
    setResults(performSearch);
    // Abrir automáticamente si hay resultados y hay texto
    if (query.length >= 2) {
      setIsOpen(performSearch.length > 0);
    }
  }, [performSearch, query.length, setResults, setIsOpen]);

  return { performSearch };
};