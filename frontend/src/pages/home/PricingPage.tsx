import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "Ideal para probar el sistema",
    features: ["Acceso limitado", "Clientes básicos"],
    highlight: false,
  },
  {
    name: "Basic",
    price: "$3000 / mes",
    desc: "Para negocios en crecimiento",
    features: [
      "Ventas ilimitadas",
      "Gestión de productos",
      "Clientes completos",
      "Reportes"
    ],
    highlight: true,
  },
  {
    name: "Pro",
    price: "$7000 / mes",
    desc: "Para empresas",
    features: [
      "Todo lo anterior",
      "Analytics avanzados",
      "Soporte prioritario"
    ],
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-16 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">
        Planes
      </h1>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-6 rounded-xl shadow ${
              plan.highlight
                ? "bg-blue-600 scale-105"
                : "bg-gray-900"
            }`}
          >
            <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
            <p className="text-2xl mb-4">{plan.price}</p>
            <p className="text-gray-300 mb-4">{plan.desc}</p>

            <ul className="mb-6 space-y-2 text-sm">
              {plan.features.map((f) => (
                <li key={f}>✔ {f}</li>
              ))}
            </ul>

            <Link
              to="/payment"
              className="block text-center bg-white text-black py-2 rounded-lg font-semibold"
            >
              Elegir plan
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}