//functions in javascript(more imp topic)

//function declaration

// function happybirthday() {
//   console.log("Happy birthday...");
// }
// happybirthday();
// happybirthday();
// happybirthday();
// happybirthday();
// happybirthday();
// happybirthday();
// happybirthday();

//in this code we make one function which has variable happybirthday() . in variable we print happy birthday message.after printing ALL just call funtion whenever i want happy birthday message

// function sum(number1, number2) {
//   //number1,number2 are parameter
//   return number1 + number2;
// }
// const returnedValue = sum(2, 4); //arguement
// console.log(returnedValue);

////

//

// function firstchar(anyThing) {
//   return anyThing[3];
// }
// const newValue = firstchar("Fardin");
// console.log(newValue);

//

// function isevenprompt(Enter){
//   if( iseven %2===0)
//     return true;
// }

//find target

// function findTarget(array, target) {
//   for (i = 0; i < array.length; i++) {
//     if (array[i] === target) {
//       return i; // postion write whwre is i .
//     }
//   }
//   return -1;
// }
// const myarray = [1, 2, 3, 4, 55];
// const answer = findTarget(myarray, 55);
// console.log(answer);

//function expression : first we declared const and then function.

// const happybirthday = function () {
//   console.log("Happy birthday...");
// };
// happybirthday();

// //
// const iseven = function (num) {
//   if (num % 2 === 0) {
//     return true;
//   }
//   return false;
// };
// console.log(iseven(8));

// Arrow Function : here just after paranthesis add arrow '= + >' .in this arrow function whenever we decalred just single parameter we can skip paranthesis but not when we pass 2 or more and no parameter.

// const happybirthday = () => {
//   console.log("Happy birthday...");
// };
// happybirthday() * 2;
// //
// const iseven = (num) => { //here is single parameter we can even remove ()
//   if (num % 2 === 0) {
//     return true;
//   }
//   return false;
// };
// console.log(iseven(8));

//// we can also use short method using => function.
// const isEven = (num) => num % 2 === 0;
// console.log(isEven(2));

//Hoisting : in Hoisting method we can also call hello in starting ,
// but just in function declaration.

// function hello() {
//   console.log("hello world");
// }
// hello();

// fuction inside functions

// const app = () => {
//   const hello = () => {
//     console.log("Hello World");
//   };
//   const add2 = (num1, num2) => {
//     return num1 + num2;
//   };
//   console.log(add2(2, 5));
//   hello();
//   add2();

//   console.log("inside app");
// };
// app();

//Block Scope vs Function scope

//Block Scope : Let and const are block scope,Block scope means its not access outside of curly blocks { }example. let and const are just access in their blocks onlyy.

// block start
// const name = "numaan";
// console.log(name);
// } // block end
// this is how block scope works .

//Function scope : var is a function scope. its access wherever you want using var. var function is accesable anywhere in function.
// {
//   var name2 = "numaan";
// }
// console.log(name2); // this is outside block. but still working, because we use var.

//default parameter : here is additions code.in this code there are two parameters just i've put only one arguement ,then code gives undefined value .
// but we have default parameter so we can declared one value as default

// function add(a, b = 0) {
//   return a + b; // here we declared b is 0 so whenever user just take one argument b always be 0.
// }
// const addition = add(1, 44);
// console.log(addition);

//Rest parameter : rest parameter is nothing but it is use for adding sets of numbers. large amount of numbers.

// code for  all numbers addition

// function add(...numbers) {
//   let total = 0;
//   for (let addall of numbers) {
//     total = total + addall;
//   }
//   return total;
// }
// const ans = add(2, 5, 4, 3, 2, 4);
// console.log(ans);

//parameter destructuring :

// const person = {
//   firstname: "numaan",
//   gender: "male",
// };
// function personDetails(obj) {
//   console.log(obj, "..............");
//   console.log(obj.firstname);
//   console.log(obj.gender);
// }
// personDetails(person);

// function personDetails(obj) {
//   console.log(person.firstname);
//   console.log(person.gender);
// }
// personDetails();

// function personDetails({ gender, firstname }) {  // mostly used in react
//   console.log(gender);
//   console.log(firstname);
// }
// personDetails(person);

//callback function

// function myfunc(a) {
//   console.log("hello world");
//   a();
// }
// function myfunc2() {
//   console.log("hii im function 2");
// }

// myfunc(myfunc2);

//Function returning fuction...

// function myfunc() {
//   function hello() {
//     console.log("Hello world");
//   }
//   hello();
// }
// myfunc();
