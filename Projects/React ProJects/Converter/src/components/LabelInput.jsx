export const LabelInput = ({ name, id, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-md font-medium text-[#427776]">
        {name}
      </label>
      <input  
        type="text"
        id={id}
       
        value={value}
        onChange={onChange}
        className="bg-[#427776] text-[#d2f5f4] px-2 py-1 rounded outline-none"
      />
    </div>
  );
};
