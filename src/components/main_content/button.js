export default function Button({ setIsOpen, isOpen }) {
    return (
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {isOpen ? "–" : "+"}
      </button>
    );
  }