// //typeOf Operators : use to find datatype.

// let age = 22;
// let firstName = "numaan";
// console.log(typeof firstName);

// //Covert Number To string

// let date = 22;
// console.log(typeof date);

// //or

// // myStr = "Numaan";
// // myStr = String(myStr);
// // console.log(typeof myStr);

// //convert String To Number

// let myStr = "Numaan";
// myStr = String(myStr);
// console.log(typeof myStr);

// //string concatenation

// let str1 = "Numaaan";
// let str2 = "Kazi";
// let str3 = str1 + " " + str2;
// console.log(str3);

// // addition ,subs,multiplications.
// let strn1 = 10;
// let strn2 = 20;
// let strn3 = strn1 * strn2;
// strn3 = strn1 + strn2;
// console.log(strn3);

// //templete string//

// let age1 = 22;
// let user = "Numaan";
// //i need to print "My name is Numaan im 22 years Old" message and i have already variable so use ` `,{} and $ .

// let AboutMe = `My name is ${user} im ${age1} years Old`;
// console.log(AboutMe);

// //BigINT : bigint just add with bigint.

// let Mynumber = BigInt(123); //BigInt also bigINT.
// let safenumber = 12n; //-------- n means bigINT.
// let bothnumbers = Mynumber + safenumber;
// console.log(bothnumbers);

// //boolean

// let num1 = "2";
// let num2 = 2;
// console.log(num1 === num2);

// //== vs ===
// //1.== : double equals to just check value of variables.
// //2.== : triple equals to just check value and datatypes.
// //3.!=: not equals to just check value are change or equals .
// //3.!==: not double equals to just check value and datatypes .

// //if else statement

// let age2 = 19;
// if (age2 >= 20) {
//   console.log("You Can PLAY");
// } else {
//   console.log("You cannot play");
// }

// let num = 14;
// if (num % 2 === 0) {
//   console.log("Even Number");
// } else {
//   console.log("Odd Number");
// }

// //ternary operator : Shortcut of else .
// let age3 = 5;
// let drink = age3 >= 5 ? "milk" : "coffee";
// console.log(drink);

//& operator in if else statement:if both conditions are true then goes in if statement.
// let age4 = 45;
// let secondName = "Fardin";
// if (age4 > 43 && secondName[0] === "F") {
//   console.log("Your Name is Correct & age is old");
// } else {
//   console.log("Your Name is Notcorrect & age is too young");
// }

// OR operator in if else statement: if ANY ONE conditions is true then goes in if statement.
// let age5 = 45;
// let secondname = "Fardin";
// if (age4 > 43 || secondname[0] === "F") {
//   console.log("inside if");
// } else {
//   console.log("inside else");
// }

//Nested IF else : Nested if else means use if else inside if else.

// let winningNumber = 14;
// let userGuess = +prompt("Enter A Number 1 to 20");
// if (userGuess === winningNumber) {
//   console.log("Congratulations ");
// } else {
//   if (userGuess < winningNumber) console.log("Too Low");
//   else console.log("Too High");
// }

// let WinningAmount = 199;
// let User = +prompt("ENTER A NUMBER BETWEEN 190 TO 199");
// if (User === WinningAmount) {
//   console.log("Congratulations You're Winner");
// } else {
//   if (User > WinningAmount) {
//     console.log("Better Luck Next Time");
//   } else {
//     console.log("You're Too Close");
//   }
// }

// let tempIndegree = +prompt("How Many Degree temp in Your City?");
// if (tempIndegree < 0) {
//   console.log("Stay Alert");
// } else if (tempIndegree < 16) {
//   console.log("Extremy Cold Outside");
// } else if (tempIndegree < 20) {
//   console.log("Cold Outside");
// } else if (tempIndegree < 35) {
//   console.log("Lets Go To Swim");
// } else if (tempIndegree < 45) {
//   console.log("Too Hot Outside");
// } else {
//   console.log("Extremy hot Outside");
// }

// let WeekDays = +prompt("Enter Any WeekDays Number 0 to 6:");
// if (WeekDays === 0) {
//   console.log("Sunday");
// } else if (WeekDays === 1) {
//   console.log("Monday");
// } else if (WeekDays === 2) {
//   console.log("Tuesday");
// } else if (WeekDays === 3) {
//   console.log("Wednesday");
// } else if (WeekDays === 4) {
//   console.log("Thursday");
// } else if (WeekDays === 5) {
//   console.log("Friday");
// } else if (WeekDays === 6) {
//   console.log("Saturday");
// } else console.log("Invalid Day");

//Swith Statement :
// let day = +prompt("Enter Any Number Between 0 to 6 :");
// switch (day) {
//   case 0:
//     console.log("Sunday");
//     break;
//   case 1:
//     console.log("Monday");
//     break;
//   case 2:
//     console.log("Tuesday");
//   case 3:
//     console.log("Wednesday");
//     break;
//   case 4:
//     console.log("Thursday");
//     break;
//   case 5:
//     console.log("Friday");
//     break;
//   case 6:
//     console.log("Saturday");
//     break;

//   default:
//     console.log("Invalid Day");
// }

//WHILE LOOP

// let i = 0;
// while (i <= 9) {
//   console.log(i);
//   i++;
// }
// console.log("hello");

//for Loop : here we declared let keyword, let key word dont move outside
//here we declared var , can move outside .

// for (let i = 0; i <= 9; i++) {
//   console.log(i);
// }
//break keyword in for loop

// for (j = 0; j <= 10; j++) {
//   if (j == 6) {
//     break;
//   }
//   console.log(j);
// }
// console.log("hello");

// for (j = 0; j <= 10; j++) {
//   if (j == 6) {
//     continue; //continue keyword work contineuisly
//   }
//   console.log(j);
// }

//do while loop
// let i = 10;
// do {
//   console.log(i);
//   i++;
// } while (i <= 9);
//
// //do while is always run after running it checks condition.

// * Introduction to array :
// array is nothing but collection of elements.Array is mutable

// indexing value  0       1         2

// let fruits = ["Mango", "Apple", "Guava"];
// console.log(fruits[2]);
// fruits[2] = "Banana"; // change any value.
// console.log(fruits);

// indexing    0  1  2  3  4

// let numbers = [1, 2, 3, 4, 5];
// console.log(numbers);
// console.log(numbers[0]);

//Push Method add strings,numbers in last(elements).

// let fruits = ["Mango", "Apple", "Guava"];
// fruits.push("Banana");
// console.log(fruits);

//Pop Method remove strings,numbers from last(elements).

//let fruits = ["Mango", "Apple", "Guava"];
// fruits.pop();
// console.log(fruits);

//unshift: add elemets in starting examples.

// let fruits1 = ["Mango", "Apple", "Guava"];
// fruits1.unshift("Banana");
// console.log(fruits1);
// let added = fruits1.unshift();
// console.log("added elements is ", fruits1);

//shift: remove elemets in starting examples.

// let fruits = ["Mango", "Apple", "Guava"];
// fruits.shift();
// console.log("removed elements is ", fruits);

//Push and pop more faster then shift and unshift

//preemptive vs reference data types.

// 1)preemptive datatypes :
// let num1 = 6;
// let num2 = num1;
// console.log("num1", num1);
// console.log("num1", num2);
// num1++;
// console.log("Speration");
// console.log("num1", num1);
// console.log("num2", num2);

// here in this code just num1 can increament. because it is store in stack with sperate stack values.

// Reference types array: reference type can change boths value because 1st it is store in heap and give address to pointer and stack pointer saves same address of both of them.

// let array1 = ["item1", "item2"];
// let array2 = array1;
// console.log("array1", array1);
// console.log("array2", array2);
// array1.push("item3");
// console.log("array1", array1);
// console.log("array2", array2);

///array clone

// let array1 = ["item1", "item2", "item3"];
// // let array2 = array1.push("item4", "item5"); //here is array 1 is cloned add some new elements too.
// let array2 = array1.slice(0).concat(["item4"]); //one more mothod to make clone
// console.log("array1", array1);
// console.log("array2", array2);

//For loop in array
// let array1 = ["mango", "apple", "banana", "grapes"];
// for (let i = 0; i < array1.length; i++) {
//   console.log(array1[i]);
// }
// let array2 = array1.push();
// console.log(array2);

//while loops in array

// let fruits = ["mango", "apple", "banana", "grapes"];
// let i = 0;
// while (i < fruits.length) {
//   console.log(fruits[i].toLowerCase());
//   i++;
// }

//for of loops

// let fruits = ["mango", "apple", "banana", "grapes"];
// for (let fruit of fruits) {
//   console.log(fruit);
// }   //vertically 0/p

// let fruit = ["mango", "apple", "banana", "grapes"];
// let fruit2 = [];
// for (let fruits of fruit) {
//   fruit2.push(fruits);
// }
// console.log(fruit2);  //vertically o/p

//for in loops

// let fruits = ["mango", "apple", "banana", "grapes"];
// for (let fruit in fruits) {
//   console.log(fruits[fruit]);
// } //vertically 0/p

// let fruit = ["mango", "apple", "banana", "grapes"];
// let fruit2 = [];
// for (let fruits in fruit) {
//   fruit2.push(fruit[fruits]);
// }
// console.log(fruit2); //horizintally o/p

//Objectt in js

// const person = {
//   name: "numaan",
//   age: 22,
//   hobbies: ["Cricket", "Reading"],
// };
// console.log(person);

// person.gender = "male"; //add anything here you want

//deff between dot and  bracket notation
//-- dot
// const person1 = {
//   name: "numaan",
//   age: 22,
//   hobbies: ["Cricket", "Reading"],
//   gender: "male",
// };
// console.log(person1);
// console.log(person1.hobbies); //suppose here i want to print just single key in between them,

//--bracket

// const key = "email"; // here is another key we want to add it inside the  obj person .

// const person2 = {
//   name: "numaan",
//   age: 22,
//   // person hobbies: ["Cricket", "Reading"],// error bcz js dont accept spaces in between var
//   "person hobbies": ["Cricket", "Reading"],
//   gender: "male",
// };
// console.log(person2);
// console.log(person2["person hobbies"]); //here 2 variable , we use bracket notation.
// person2[key] = "numaanakazi359@gmail.com"; // key is email bcz email print here suppose im written this inside "" it decide as a variable .
// console.log(person2);

// How to iterate object

//"iterate" means to repeat a process—usually going through each item in a collection, such as an array, list, or object.

// const person1 = {
//   name: "numaan",
//   age: 22,
//   hobbies: ["Cricket", "Reading"],
//   gender: "male",
// };
// for (let key in person1) {
//   console.log(key, " : ", person1[key]);
// }

//oject.keys in this code |

// const person1 = {
//   name: "numaan",
//   age: 22,
//   hobbies: ["Cricket", "Reading"],
//   gender: "male",
// };
// for (let key in person1) {
//   console.log(key, " : ", person1[key]);
// }

// console.log(Object.keys(person1)); // function gives us keys like name ,age and all.

// computed properties:

// const key1 = "objkey1";
// const key2 = "objkey2";

// const value1 = "myvalue1";
// const value2 = "myvalue2";

// const obj = {
//   [key1]: value1,
//   [key2]: value2,
// };
// console.log(obj);

// const person = {
//   name: "Numaan",
//   age: 22,
//   email: "numankazi@123",
//   city: "pune",
// };

// for (let key in person) {
//   console.log(key, " :", person[key]);
// }

// const array1 = [1, 2, 3, 4, 5];

// const array2 = array1.slice(0); //clone
// for (let i in array1) {
//   console.log(array1[i]);
// }
// console.log(array2);

////Spread Function : use to clone both arrays in one new array aso use o find index of any numbers. also use to clone multiple operators in one new array.

//1)
// const array1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// const array2 = ["item1", "item2", "item3"];

// const newarray = [...array1, ...array2];
// console.log(newarray);

// //2) suppose we need to find index of a to z.

// const alphabets = { ..."abcdefghijklmnopqrstuvwxyz" };
// console.log(alphabets);

// ////object destructuring.

// const band = {
//   song: "Perfect",
//   author: "ed-sheeren",
// };
// const songname = band.song;
// const auname = band.author;
// console.log(songname, auname);

// // shortcut:

// let = { song, author } = band;
// console.log(band);

//objects inside array : it is use to print one value from all the object.

// const data = [
//   { userId: 1, firstname: "HFGDH", gender: "male" },
//   { userId: 2, firstname: "gdgdf", gender: "male" },
//   { userId: 3, firstname: "gdfd", gender: "male" },
// ];
// for (let users of data) {
//   console.log(users.userId);
// }

//nested destructuring : this is how its actually works ,suppose in this code there is 3 obj.
// { userId: 1, firstname: "HFGDH", gender: "male" },
// { userId: 2, firstname: "gdgdf", gender: "male" },
// { userId: 3, firstname: "gdfd", gender: "male" },
// suppose i want to print user1 first name and user3 age so we use {}. in array [].
// in this case we use nested destructuring.

// const data = [
//   { userId: 1, firstname: "HFGDH", gender: "male" },
//   { userId: 2, firstname: "gdgdf", gender: "male" },
//   { userId: 3, firstname: "gdfd", gender: "male" },
// ];

// const [{ userId }, , { gender }] = data;
// console.log(var1);
// console.log(gender);
