import { IoMdCheckmarkCircle } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";

export function TodoList({ data, checked,handleDeleteTodo, handleCheckTodo }) {
  return (
    <li className="todo-item">
      <span className={ checked ? "checkList" :"notCheckList"}>{data}</span>
      <button className="check-btn" onClick={() => handleCheckTodo(data)}>
        <IoMdCheckmarkCircle />
      </button>
      <button className="delete-btn" onClick={() => handleDeleteTodo(data)}>
        <MdDeleteForever />
      </button>
    </li>
  );
}
