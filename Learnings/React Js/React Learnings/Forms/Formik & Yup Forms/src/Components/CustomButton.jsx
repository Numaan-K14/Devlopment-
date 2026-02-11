import React from 'react'

export function CustomButton({ isValid, label }) {
  return (
    <>
      <button
        disabled={!isValid}
        type="submit"
        className="disabled:opacity-80 disabled:cursor-not-allowed rounded-md bg-black px-10 py-2 text-white hover:opacity-90 w-full"
      >
        {label}
      </button>
    </>
  );
}

