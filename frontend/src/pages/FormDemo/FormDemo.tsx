import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

// 🧠 Validación con mensajes claros
const schema = Joi.object({
  firstName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "First name is required",
    "string.min": "Minimum 3 characters",
  }),
  lastName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Last name is required",
  }),
  email: Joi.string().email({ tlds: false }).required().messages({
    "string.email": "Invalid email",
    "string.empty": "Email is required",
  }),
});

export const FormDemo = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: joiResolver(schema),
    mode: "onSubmit",
  });

  // 🚀 Submit
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setSuccess("");

    try {
      // Simulación de API
      await new Promise((res) => setTimeout(res, 1000));

      console.log("Form data:", data);

      setSuccess("Form submitted successfully!");
      reset(); // 💥 limpia el formulario
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 bg-gray-900 shadow-md rounded space-y-4"
    >
      <h2 className="text-xl font-bold text-white text-center">
        Contact Form
      </h2>

      {/* First Name */}
      <div>
        <label className="block text-neutral-400 text-sm mb-1">
          First Name
        </label>
        <input
          type="text"
          {...register("firstName")}
          className="w-full px-3 py-2 border rounded bg-gray-800 text-white"
        />
        {errors.firstName && (
          <p className="text-red-500 text-xs mt-1">
            {errors.firstName.message}
          </p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-neutral-400 text-sm mb-1">
          Last Name
        </label>
        <input
          type="text"
          {...register("lastName")}
          className="w-full px-3 py-2 border rounded bg-gray-800 text-white"
        />
        {errors.lastName && (
          <p className="text-red-500 text-xs mt-1">
            {errors.lastName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-neutral-400 text-sm mb-1">
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          className="w-full px-3 py-2 border rounded bg-gray-800 text-white"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold disabled:opacity-50"
      >
        {loading ? "Sending..." : "Submit"}
      </button>

      {/* Mensaje éxito */}
      {success && (
        <p className="text-green-400 text-sm text-center">{success}</p>
      )}
    </form>
  );
};