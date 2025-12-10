export function ButtonComp({ onClick = () => {}, label }) {
  return (
    <>
      <button
        className="text-white bg-blue-500 text-lg font-medium mx-2 px-4 py-3 cursor-pointer rounded-2xl hover:bg-blue-400 "
        onClick={onClick}
      >
        {label}
      </button>
    </>
  );
}
