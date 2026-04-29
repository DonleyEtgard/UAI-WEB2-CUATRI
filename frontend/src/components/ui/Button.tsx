interface ButtonProps {
  handleClick?: () => void;
  label: string;
}

export const Button = (props: ButtonProps) => {
  const { handleClick, label } = props;
  return <button className="mx-8 px-4 py-2 bg-blue-500 text-white rounded hover:cursor-pointer hover:bg-blue-300 hover:transition-colors" onClick={handleClick}>{label}</button>;
};