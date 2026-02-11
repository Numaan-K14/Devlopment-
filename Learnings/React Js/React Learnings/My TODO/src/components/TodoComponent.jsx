import { useState } from "react";
import "../App.css";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";

export function TodoComponent() {
  const [input, setInput] = useState(""); // set input variables.
  const [task, setTask] = useState([]); // adding mew variables.
  const [timeDate, setTimeDate] = useState(""); //for updating date &  time format.
  //Whenever user click this event is fired
  const handleChange = (value) => {
    setInput(value);
  };
  //to avoid refresh
  const handleFormSubmit = (e) => {
    e.preventDefault();

    //if its empty do not add data
    if (!input) return;
    //do not add repeated data .
    if (task.includes(input)) {
      setInput(""); //if already exist then empty i/p field.
      return;
    }
    //Store my old data as it is and add new data too.
    setTask((prevTask) => [...prevTask, input]);
    //Add Data and empty input filed
    setInput("");
  };
  //---------------------------------------------------//
  //now date and time
  setInterval(() => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const Time = now.toLocaleTimeString();
    setTimeDate(`${date} - ${Time}`);
  }, 1000);

  //-----For deleting single elements from todo
  const handleDeleteTodo = (value) => {
    console.log(task);
    console.log(value);
    const updateDelete = task.filter((abc) => abc !== value); // filter method returns element which is same .bcs we use ! .
    setTask(updateDelete);
  };
  //-----------------Tick Button-----------------//
  const handleSubmittedTodo = (e) => {
    const list = e.target.closest("li");
    const listSpan = list.querySelector("span");
    listSpan.style.textDecoration = "line-through";
  };
  //---------clear all button functionality-------//
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
