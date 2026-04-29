import ContactForm from "../../components/ContactForm";
import { selectCount } from "../../features/users/hooks";
import { useAppSelector } from "../../store/hooks";

const ContactPage = () => {
    const count = useAppSelector(selectCount)

    console.log("Current count desde CONTACT:", count);
  return (<>
    <div>Contact Page</div>
    <div><ContactForm /></div>
  </>);
};

export default ContactPage;