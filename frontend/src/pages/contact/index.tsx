import ContactForm from "../../components/ContactForm";

const ContactPage = () => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-gray-800">
            Contact
          </h2>

      <p className="text-sm text-gray-500 mt-1">
          Feel free to contact us
          </p>
          
      {/* 📩 Formulario */}
      <div className="p-4 bg-white rounded-xl shadow">
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactPage;