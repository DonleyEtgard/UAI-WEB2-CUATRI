import { useCustomers } from "./hooks";

const CustomerPage = () => {
  const { customers, loading, error } = useCustomers();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <div>
      <h1>Client</h1>

      {customers.map((c) => (
        <div key={c._id}>
          <p>{c.Nom}</p>
          <p>{c.Prenom}</p>
        </div>
      ))}
    </div>
  );
};

export default CustomerPage;