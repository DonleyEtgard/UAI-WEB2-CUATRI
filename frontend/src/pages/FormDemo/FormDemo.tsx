import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

const schema = Joi.object({
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
});

export const FormDemo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: joiResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = (data: FormData) => {
    
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 bg-gray-900 shadow-md rounded"
    >
      <div className="mb-4">
        <label
          htmlFor="firstName"
          className="block text-neutral-400 text-sm font-bold mb-2"
        >
          First Name:
        </label>
        <input
          type="text"
          id="firstName"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral-400 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.firstName && (
          <p className="text-red-500 text-xs italic">
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="lastName"
          className="block text-neutral-400 text-sm font-bold mb-2"
        >
          Last Name:
        </label>
        <input
          type="text"
          id="lastName"
          {...register("lastName")}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral-400 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.lastName && (
          <p className="text-red-500 text-xs italic">
            {errors.lastName.message}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label
          htmlFor="email"
          className="block text-neutral-400 text-sm font-bold mb-2"
        >
          Email:
        </label>
        <input
          type="email"
          id="email"
          {...register("email")}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral-400 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.email && (
          <p className="text-red-500 text-xs italic">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
};