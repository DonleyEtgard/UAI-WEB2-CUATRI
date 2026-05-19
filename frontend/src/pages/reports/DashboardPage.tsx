import { useEffect, useState } from "react";
import API from "../../services/api";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Sale = {
  total: number;
  createdAt: string;
};

type Product = {
  name: string;
  sold: number;
};

type User = {
  createdAt: string;
  role: string;
};

const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444"];

const DashboardPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    API.get("/sales").then((r) => setSales(r.data || []));
    API.get("/products/top-selling").then((r) => setProducts(r.data || []));
    API.get("/users").then((r) => setUsers(r.data || []));
  }, []);

  // ==========================
  // 📊 KPI CALC
  // ==========================

  const totalSales = sales.length;

  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);

  const avgTicket = totalSales ? totalRevenue / totalSales : 0;

  // ==========================
  // 📅 SALES BY DAY
  // ==========================
  const salesByDay = sales.reduce((acc: any, s) => {
    const day = new Date(s.createdAt).toLocaleDateString();
    acc[day] = (acc[day] || 0) + s.total;
    return acc;
  }, {});

  const dailyData = Object.keys(salesByDay).map((day) => ({
    day,
    total: salesByDay[day],
  }));

  // ==========================
  // 📅 SALES BY MONTH
  // ==========================
  const salesByMonth = sales.reduce((acc: any, s) => {
    const month = new Date(s.createdAt).toLocaleString("default", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + s.total;
    return acc;
  }, {});

  const monthlyData = Object.keys(salesByMonth).map((m) => ({
    month: m,
    total: salesByMonth[m],
  }));

  // ==========================
  // 👥 USERS BY ROLE
  // ==========================
  const usersByRole = users.reduce((acc: any, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  const userData = Object.keys(usersByRole).map((r) => ({
    name: r,
    value: usersByRole[r],
  }));

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">ERP Dashboard</h1>
        <p className="text-gray-500">Odoo-style analytics overview</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Sales</p>
          <p className="text-2xl font-bold">{totalSales}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Revenue</p>
          <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Avg Ticket</p>
          <p className="text-2xl font-bold">${avgTicket.toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Users</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>

      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 📊 DAILY SALES */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Daily Sales</h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 📊 MONTHLY SALES */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Monthly Sales</h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 📦 TOP PRODUCTS */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Top Products</h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={products}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sold" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 👥 USERS BY ROLE */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Users by Role</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={userData} dataKey="value" nameKey="name" outerRadius={90}>
                {userData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;