import { useState } from "react";

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await new Promise((res) => setTimeout(res, 1000));

      setSuccess("Mensaje enviado correctamente");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setError("Error al enviar el mensaje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      
      {/* Card */}
      <div className="form-container">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Contacto
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Envíanos un mensaje y te responderemos pronto
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Nombre */}
          <div className="relative">
            <label>Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="peer w-full border-b-2 border-gray-300 bg-transparent px-2 pt-4 pb-1 focus:outline-none focus:border-blue-600"
            />
            <label className="absolute left-2 top-1 text-gray-500 text-sm transition-all 
              peer-focus:text-blue-600 
              peer-focus:top-0 
              peer-focus:text-xs
              peer-valid:top-0 
              peer-valid:text-xs">
            </label>
          </div>

          {/* Email */}
          <div className="relative">
             <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="peer w-full border-b-2 border-gray-300 bg-transparent px-2 pt-4 pb-1 focus:outline-none focus:border-blue-600"
            />
            <label className="absolute left-2 top-1 text-gray-500 text-sm transition-all 
              peer-focus:text-blue-600 
              peer-focus:top-0 
              peer-focus:text-xs
              peer-valid:top-0 
              peer-valid:text-xs">
            </label>
          </div>

          {/* Mensaje */}
          <div className="relative">
            <label>Mensaje</label>
            <textarea
              value={form.message}
              onChange={handleChange}
              required
              rows={4}
              className="peer w-full border-b-2 border-gray-300 bg-transparent px-2 pt-4 pb-1 focus:outline-none focus:border-blue-600 resize-none"
            />
            <label className="absolute left-2 top-1 text-gray-500 text-sm transition-all 
              peer-focus:text-blue-600 
              peer-focus:top-0 
              peer-focus:text-xs
              peer-valid:top-0 
              peer-valid:text-xs">
            </label>
          </div>

          {/* Feedback */}
          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-600 text-center">
              {success}
            </p>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-medium 
              hover:bg-blue-700 transition 
              active:scale-[0.98]
              disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;