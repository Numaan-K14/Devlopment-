import { useState } from "react";

export function TodoForm({ onAddTodo }) {
  const [input, setInput] = useState({});


  const handleInputChange = (value) => {
    setInput({ id: value, content: value, checked: false });
}

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTodo(input);
    setInput({ id: "", content: "", checked: false });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input.content}
        onChange={(e) => handleInputChange(e.target.value)}
        autoFocus
      />
      <button type="submit">Add Task</button>
    </form>
  );
}
