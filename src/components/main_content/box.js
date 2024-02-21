import Button from "./button";
export default function Box({ isOpen, setIsOpen, children }) {
  return (
    <div className="box">
      <Button isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && children}
    </div>
  );
}
