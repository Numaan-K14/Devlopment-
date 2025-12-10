// const MainHeading = document.getElementById("main-heading");
// console.log(MainHeading);
// const navItems = document.querySelector(".nav-items");
// const navItemsAll = document.querySelectorAll(".nav-items");
// console.log(navItems);
// console.log(navItemsAll);

//change text
// const HEADING = document.getElementById("main-heading");
// HEADING.textContent = "Update Your Task"; //replace
// console.log(HEADING);
// console.log(HEADING.textContent);

//change styles
// const Changes = document.querySelector("div.headline h2");
// Changes.style.color = "blue  ";
// Changes.style.backgroundColor = "yellow";

//get and set attribute
// const link = document.querySelector("a");
// console.log(link);
// console.log(link.getAttribute("href")); //get any value
// console.log(link.setAttribute("href", "https://app.practive.in/login")); //set any value

//get multiple elements by get elements by class name
// const NavItems = document.getElementsByClassName("nav-items");
// console.log(NavItems[0]);

//get multiple elements items using querySelectorAll
// const NavItems = document.querySelectorAll(".nav-items");
// console.log(NavItems);

//inner HTML (change anything from here also)
// const inner = document.querySelector(".headline");
// console.log(inner.innerHTML);
// inner.innerHTML = "<h1> What Do You Want ? </h1>";
// inner.innerHTML += "<button> Learn More </button>"; //+= means h1 + button

///Dom Traversal :

// const rootNode = document.getRootNode();
// const htmlElementNode = rootNode.childNodes[0];
// // console.log(htmlElementNode.childNodes); NodeList(3) [head, text, body]
// const headElementNode = htmlElementNode.childNodes[0];
// const textNode1 = htmlElementNode.childNodes[1];
// const bodyElementNode = htmlElementNode.childNodes[2];
// console.log(headElementNode.childNodes);
// sibling relation
// const h1 = document.querySelector("h1");
// const body = h1.parentNode.parentNode;
// body.style.color = "#efefef";
// body.style.backgroundColor = "#333"
// const body = document.body
// body.style.color = "#efefef";
// body.style.backgroundColor = "#333"
// const head = document.querySelector("head");
// // console.log(head);
// const title = head.querySelector("title");
// console.log(title.childNodes);
// const container = document.querySelector(".container");
// console.log(container.children);

// add, remove new class
// const ans = document.querySelector(".btn");
// console.log(ans.classList);
// ans.classList.add("new-class");// add class
// ans.classList.remove("new-class");//remove class

//ans.classList.toggle("new-class");// add class or suppose class is already exist then also remove

// const header = document.querySelector(".header");
// console.log(header.classList);
// header.style.color = "black";

//Document create elements document.createElement()

// const newTodoItem = document.createElement("li");
// newTodoItem.textContent = "TO-DO 1";
// const todo = document.querySelector(".section-todo");
// todo.append(newTodoItem);//after
// console.log(newTodoItem);

//prepend
// const newTodoItem = document.createElement("li");
// newTodoItem.textContent = "TO-DO 1";
// const todo = document.querySelector(".section-todo");
// todo.prepend(newTodoItem); //before
// console.log(newTodoItem);

//before is use before any parent tag (element)
// const newTodoItem = document.createElement("li");
// newTodoItem.textContent = "TO-DO 1";
// const todo = document.querySelector(".section-todo");
// todo.before(newTodoItem); //before
// console.log(newTodoItem);

////after is use after any parent tag (element)

// const newTodoItem = document.createElement("li");
// newTodoItem.textContent = "TO-DO 1";
// const todo = document.querySelector(".section-todo");
// todo.after(newTodoItem); //before
// console.log(newTodoItem);

//how to get dimension of elements

//height,width,top,bottom
// const container = document.querySelector(".header");
// const info = container.getBoundingClientRect().height;
// console.log(info);

//Onclick

//const btn = document.querySelector(".btn-headline");
//console.log(btn);
//btn.onclick = function () {
//  console.log("You Clicked Me");
//};

//alternative
// const btn = document.querySelector(".btn-headline");
// function clickMe() {
//   console.log("You clicked me ");
// }
// btn.addEventListener("click", clickMe);

//alternative
// const btn = document.querySelector(".btn-headline");
// btn.addEventListener("click", function clickMe() {
//   console.log("You clicked me ");
// });

//using arrow function

// const btn = document.querySelector(".btn-headline");
// btn.addEventListener("click", () => {
//   console.log("Arrow Function ");
// });

//keypress event : press anything its shows in console with the help of key
// const body = document.body;
// body.addEventListener("keypress", (e) => {
//   console.log(e.key);
// });

//press anything its shows in console with the help of character what you press,in single character
// const body = document.body;
// body.addEventListener("keypress", (e) => {
//   console.log(e.key);
// });

//mouse over and leave event
// const mouseOver = document.querySelector(".btn-headline");
// mouseOver.addEventListener("mouseover", () => {
//   console.log("mouse over event occurred");
// });
// mouseOver.addEventListener("mouseleave", () => {
//   console.log("mouse leave event occurred ");
// });

///addd or remove todo

const todoForm = document.querySelector(".form-todo");
const todoInput = document.querySelector(".form-todo input[type='text']");
const todoList = document.querySelector(".todo-list");

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTodoText = todoInput.value;
  const newLi = document.createElement("li");
  const newLiInnerHtml = `
        <span class="text">${newTodoText}</span>
        <div class="todo-buttons">
            <button class="todo-btn done">Done</button>
            <button class="todo-btn remove">Remove</button>
        </div>`;
  newLi.innerHTML = newLiInnerHtml;
  todoList.append(newLi);
  todoInput.value = "";
});

todoList.addEventListener("click", (e) => {
  // check if user clicked on done button
  if (e.target.classList.contains("remove")) {
    const targetedLi = e.target.parentNode.parentNode;
    targetedLi.remove();
  }
  if (e.target.classList.contains("done")) {
    const liSpan = e.target.parentNode.previousElementSibling;
    liSpan.style.textDecoration = "line-through";
  }
});
