export function Button({onClick=()=>{},label}) {
  return (
    <>
      <button
        className="px-4 py-2 rounded text-white font-semibold bg-blue-500 hover:bg-blue-600"
    
        onClick={onClick}
      >
        {label}
      </button>
    </>
  );
}

