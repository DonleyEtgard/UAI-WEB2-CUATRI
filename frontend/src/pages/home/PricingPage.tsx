import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function PricingPage() {
  const { t } = useTranslation();

  const plans = [
    {
      name: t("pricing.plans.free.name"),
      price: t("pricing.plans.free.price"),
      desc: t("pricing.plans.free.desc"),
      features: [
        t("pricing.plans.free.features.0"),
        t("pricing.plans.free.features.1"),
      ],
      highlight: false,
    },
    {
      name: t("pricing.plans.basic.name"),
      price: t("pricing.plans.basic.price"),
      desc: t("pricing.plans.basic.desc"),
      features: [
        t("pricing.plans.basic.features.0"),
        t("pricing.plans.basic.features.1"),
        t("pricing.plans.basic.features.2"),
        t("pricing.plans.basic.features.3"),
      ],
      highlight: true,
    },
    {
      name: t("pricing.plans.pro.name"),
      price: t("pricing.plans.pro.price"),
      desc: t("pricing.plans.pro.desc"),
      features: [
        t("pricing.plans.pro.features.0"),
        t("pricing.plans.pro.features.1"),
        t("pricing.plans.pro.features.2"),
      ],
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white py-16 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">
        {t("pricing.title")}
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
              {t("pricing.choosePlan")}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}