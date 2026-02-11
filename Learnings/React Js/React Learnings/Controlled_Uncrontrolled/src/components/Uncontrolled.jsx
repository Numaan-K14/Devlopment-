export function Uncontrolled() {
  const submitHandle = (e) => {
    e.preventDefault();
    const submit = document.querySelector("#InputName").value;
    console.log(submit);
  };
  return (
    <>
      <section
        className="max-w-[500px] mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl"
        onSubmit={submitHandle}
      >
        <h1 className="text-2xl font-semibold text-center mb-6">Uncontrolled</h1>
        <form className="flex flex-col gap-4">
          <label className="flex flex-col text-gray-700 font-medium">
            Name:
            <input
              type="text"
              id="InputName"
              name="name"
              className="mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </section>
    </>
  );
}

// An uncontrolled component is a form input where the value is handled by the DOM itself, not React state.Instead of useState, you usually use a ref (useRef) to directly access the input’s value when needed.

//Controlled → Input value comes from React state (useState).
