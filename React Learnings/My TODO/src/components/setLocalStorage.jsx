
const todoKey = "abcTodo";//abcTodo : random Name or variable for local storage.


export const getLocalStorage = () => {
  const RawTodoKey = localStorage.getItem(todoKey);
  if (!RawTodoKey) return []; // if there is no data then convert into empty [] .
  return JSON.parse(RawTodoKey); // if data is present so parse the data again ,means convert in array again using parse.
};


export const setLocalStorage = (task) => {
  return localStorage.setItem(todoKey, JSON.stringify(task)); //JSON.Stringify used for array to string. bcs setItems Syntax takes always String.bcs we cnvrt array to string.
};

