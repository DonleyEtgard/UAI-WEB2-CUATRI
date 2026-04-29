import { selectCount } from "../../features/users/hooks";
import { useAppSelector } from "../../store/hooks";

const AboutPage = () => {
  // throw new Error("Not implemented yet");
  const count = useAppSelector(selectCount)

  console.log("Current count desde ABOUT:", count);
  return <div>About Us</div>;
};

export default AboutPage;
