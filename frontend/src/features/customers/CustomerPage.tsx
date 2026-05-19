import { useCustomers } from "./hooks";

const CustomerPage = () => {

  const { customers, loading, error } = useCustomers();

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Erreur: {error}</p>;

  return (
    <div>

      <h1>Client</h1>

      {customers.map((c) => (

        <div
          key={c.id}
          className="border p-3 rounded mb-3"
        >

          <p>
            <strong>Nombre:</strong>{" "}
            {c.personalInfo.firstName}
          </p>

          <p>
            <strong>Apellido:</strong>{" "}
            {c.personalInfo.lastName}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {c.contactInfo.email}
          </p>

          <p>
            <strong>Teléfono:</strong>{" "}
            {c.contactInfo.phone || "-"}
          </p>

          <p>
            <strong>Deuda:</strong>{" "}
            ${c.debt || 0}
          </p>

          <div className="mt-2">

            <strong>Pagos:</strong>

            {c.payments && c.payments.length > 0 ? (

              <ul className="list-disc ml-5">

              {c.payments?.map((payment: any, index: number) => (

                <li key={index}>
                  ${payment.amount} -{" "}
                 {new Date(payment.date).toLocaleDateString()}
                  </li>

               ))}
              </ul>
              
            ) : (
              <p>Sin pagos</p>
            )}

          </div>

        </div>
      ))}

    </div>
  );
};

export default CustomerPage;