import { useState } from "react";
import "../App.css";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";

export function TodoComponent() {
  const [input, setInput] = useState("");
  const [task, setTask] = useState([]);
  const [timeDate, setTimeDate] = useState("");

  const handleChange = (value) => {
    setInput(value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!input) return;
    if (task.includes(input)) {
      setInput("");
      return;
    }
    setTask((prevTask) => [...prevTask, input]);
    setInput("");
  };

  setInterval(() => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const Time = now.toLocaleTimeString();
    setTimeDate(`${date} - ${Time}`);
  }, 1000);

  const handleDeleteTodo = (value) => {
    console.log(task);
    console.log(value);
    const updateDelete = task.filter((abc) => abc !== value);
    setTask(updateDelete);
  };

  const handleSubmittedTodo = (e) => {
    const list = e.target.closest("li");
    const listSpan = list.querySelector("span");
    listSpan.style.textDecoration = "line-through";
  };

  const handleClearTodoData = () => {
    setTask([]);
  };

  return (
    <div className="todo-container">
      <header>
        <h1 className="todo-title">Todo List </h1>
        <h2 className="date-time ">{timeDate}</h2>
      </header>
      <section className="form">
        <form onSubmit={handleFormSubmit}>
          <div>
            <input
              type="text"
              className=""
              autoComplete="off"
              value={input}
              onChange={(e) => handleChange(e.target.value)}
            ></input>
          </div>
          <div>
            <button>Add Task</button>
          </div>
        </form>
      </section>
      <section className="myUnOrdList">
        <ul>
          {task.map((cur, index) => {
            return (
              <li key={index} className="todo-item">
                <span>{cur}</span>
                <button
                  className="check-btn"
                  onClick={(e) => handleSubmittedTodo(e)}
                >
                  <IoMdCheckmarkCircle />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteTodo(cur)}
                >
                  <MdDeleteForever />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section>
        <button className="clear-btn" onClick={handleClearTodoData}>
          Clear All
        </button>
      </section>
    </div>
  );
}
