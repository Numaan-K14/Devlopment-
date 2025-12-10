// const body = document.body;

// const intervalId = setInterval(() => {
//   const red = Math.floor(Math.random() * 126);
//   const blue = Math.floor(Math.random() * 126);
//   const green = Math.floor(Math.random() * 126);
//   const randomColor = `rgb(${red},${green},${blue})`;
//   body.style.backgroundColor = randomColor;
// }, 100);
// const button = document.querySelector("button");
// button.addEventListener("click", () => {
//   button.textContent = body.style.backgroundColor;

//   console.log("You clicked me ");
//   clearInterval(intervalId);
// });

//**********this code from gpt (stop nd resume)***********
// const body = document.body;
// const button = document.querySelector("button");

// let intervalId = null; // to store setInterval ID
// let running = false; // to track if colors are changing

// function startColorChange() {
//   intervalId = setInterval(() => {
//     const red = Math.floor(Math.random() * 126);
//     const green = Math.floor(Math.random() * 126);
//     const blue = Math.floor(Math.random() * 126);
//     const randomColor = `rgb(${red},${green},${blue})`;
//     body.style.backgroundColor = randomColor;
//   }, 100);
//   running = true;
// }

// button.addEventListener("click", () => {
//   if (!running) {
//     startColorChange(); // resume
//   } else {
//     clearInterval(intervalId); // pause
//     running = false;
//   }
//   button.textContent = body.style.backgroundColor;
//   console.log("You clicked me");
// });

// // start immediately
// startColorChange();
// ---------------------------------------------------------------

//understand CallBack function in synchronous js programming(simple example) :

// function myfunc() {
//   console.log("You calling Function 1");
// }

// function myfunc2() {
//   console.log("You calling Function 2");
// }
// myfunc();

//apply callback :

// function myfunc(callback) {
//   console.log("You calling Function 1");
//   callback();
// }
// myfunc(() => {
//   console.log("You calling Function 2");
// });

// function getno(number1, number2, callback) {
//   console.log(number1, number2);
//   callback(number1, number2);
// }
// function addition(num1, num2) {
//   console.log(num1 + num2);
// }
// getno(3, 4, addition);

//callback (simple func)
// function getno(number1, number2, callback) {
//   if (typeof number1 === "number" && typeof number2 === "number") {
//     callback(number1, number2);
//   } else {
//     console.log("Wrong Data Types");
//   }
// }
// function addition(num1, num2) {
//   console.log(num1 + num2);
//getno(3, 4, addition);

// }

//Using arrow func
// function getno(number1, number2, callback) {
//   if (typeof number1 === "number" && typeof number2 === "number") {
//     callback(number1, number2);
//   } else {
//     console.log("Wrong Data Types");
//   }
// }
// getno(3, 4, (num1, num2) => {
//   console.log(num1 + num2);
// });
