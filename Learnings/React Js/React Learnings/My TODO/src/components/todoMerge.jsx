import { useState } from "react";
import "../App.css";
import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";
import { DateTime } from "./DateTime";
import { getLocalStorage, setLocalStorage } from "./setLocalStorage";

export function TodoMerge() {
  const [task, setTask] = useState(() => getLocalStorage());
  //add todo data to localStorage.
  setLocalStorage(task);
  //For Submit Button functionality
  const handleFormSubmit = (input) => {
    const { id, content, checked } = input;
    if (!content) return;
    const ifTodoContentMatched = task.find(
      (curTask) => curTask.content === content
    );
    if (ifTodoContentMatched) return;
    setTask((prevTask) => [...prevTask, { id, content, checked }]);
  };

  //For Delete Button functionality
  const handleDeleteTodo = (pqr) => {
    const updateDelete = task.filter((abc) => abc.content !== pqr);
    setTask(updateDelete);
  };

  //For Checked Button functionality

  const handleCheckTodo = (content) => {
    const updatedTask = task.map((curTask) => {
      if (curTask.content === content) {
        return { ...curTask, checked: !curTask.checked };
      }
      return curTask;
    });
    setTask(updatedTask);
  };

  //For Cleared Button functionality

  const handleClearTodoData = () => {
    setTask([]);
  };

  //Jsx Code Here(UI)
  return (
    <div className="todo-container">
      <header>
        <h1 className="todo-title">Todo List </h1>
        <DateTime />
      </header>
      <TodoForm onAddTodo={handleFormSubmit} />
      <section className="myUnOrdList">
        <ul>
          {task.map((cur) => (
            <TodoList
              key={cur.id}
              data={cur.content}
              checked={cur.checked}
              handleDeleteTodo={handleDeleteTodo}
              handleCheckTodo={handleCheckTodo}
            />
          ))}
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
