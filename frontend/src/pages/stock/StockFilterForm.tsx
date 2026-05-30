import { useState } from "react";

type Props = {
  onFilter: (productId?: string) => void;
};

export default function StockFilterForm({ onFilter }: Props) {
  const [productId, setProductId] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <input
        className="input w-full"
        placeholder="Filtrar por ID de Producto..."
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />

      <div className="flex gap-2">
        <button className="btn-primary flex-1" onClick={() => onFilter(productId || undefined)}>
          Filtrar
        </button>

        <button className="btn-secondary flex-1" onClick={() => { setProductId(""); onFilter(); }}>
          Reset
        </button>
      </div>
    </div>
  );
}