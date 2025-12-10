// /// Methods of Js //
// //trim()
// //toUpperCase()
// //toLowerCase()
// //slice()

// // index of n u m a a n
// //           0 1 2 3 4 5

// let firstName = "Numaan";
// console.log(firstName.length); //length : to find the length of characters.
// console.log(firstName.trim()); //trim(); remove spaces rom character.
// console.log(firstName.toUpperCase()); //toUpperCase(): change character in uppercase.
// console.log(firstName.toLowerCase()); //toLowerCase(): change character in lowercase.
// console.log(firstName.slice(0, 2)); //slice(): start character index from 0 and end on 2. here we want to end on 2 and nd index is m but its end on u because it slice 1 letter earlier.

// -------------------obj methods adv-------------------------------

//methods
//function inside object :whenever we want to print msg using ` `${},in function inside object, use this.method()

//realastic ex:

// function personInfo() {
//   console.log(`hii im a ${this.username} My age is ${this.age}`);
// }
// const person = {
//   username: "numaan",
//   age: 22,
//   about: personInfo,
// };
// const person1 = {
//   username: "shruti",
//   age: 21,
//   about: personInfo,
// };
// const person2 = {
//   username: "karan",
//   age: 23,
//   about: personInfo,
// };
// person1.about();
// person.about();
// person2.about();

//call(): call is used to call anything from one OBJECT to another .in this code there is one funcition and 2 object we call function in objects using call function

// function personInfo(hobby, favMusician) {
//   console.log(this.username, this.age, hobby, favMusician);
// }
// const person = {
//   username: "numaan",
//   age: 22,
// };

// const person1 = {
//   username: "abu",
//   age: 26,
// };

// personInfo.call(person1, "guitar", "arijit");

//apply() : apply is same as call():,

//bind() : bind functions returns the function and whenever you call bind function it gives you output.

// function personInfo(hobby, favMusician) {
//   console.log(this.username, this.age, hobby, favMusician);
// }
// const person = {
//   username: "numaan",
//   age: 22,
// };

// const person1 = {
//   username: "abu",
//   age: 26,
// };

// const func = personInfo.bind(person1, "guitar", "arijit");
// func();

//dont do

// const person1 = {
//   username: "abu",
//   age: 26,
//   about: function () {
//     console.log(this.username, this.age);
//   },
// };

// const myFunc = person1.about;//here both codes are seperated, and we call here person1.about [but person is empty here]
// myFunc();

//do this

// const person1 = {
//   username: "abu",
//   age: 26,
//   about: function () {
//     console.log(this.username, this.age);
//   },
// };

// const myFunc = person1.about.bind(person1); //we call whole person1 object here.
// myFunc();

// **arrow functions in object

// const person1 = {
//   username: "abu",
//   age: 26,
//   about: () => {
//     console.log(person1.username, person1.age);
//   },
// };
// person1.about();

//simple method for functions in object.

// const person1 = {
//   username: "abu",
//   age: 26,
//   about() {
//     console.log(person1.username, person1.age); //directly making func here.
//   },
// };
// person1.about();

///create functions to create multiple objects :
//functions(functions that create object).
//add key value pair
//object ko return krega.

// function userInfo(firstname, lastname, age, address, email) {
//   const user = {};
//   user.firstname = firstname;
//   user.lastname = lastname;
//   user.age = age;
//   user.address = address;
//   user.email = email;
//   user.about = function () {
//     return `hii im ${this.firstname} im a ${this.age} years old`;
//   };
//   user.is18 = function () {
//     return this.age >= 18;
//   };
//   return user;
// }
// const ans = userInfo(
//   "numaaan",
//   "kazi",
//   22,
//   "nashik-422502",
//   "numankazi359@.com"
// );
// console.log(ans);
// const result = ans.about();
// console.log(result);
// const result1 = ans.is18();
// console.log(result1);

// //function seperated here and more arguements :

// const userMethods = {
//   about: function () {
//     return `${this.firstName} is ${this.age} years old.`;
//   },
//   is18: function () {
//     return this.age >= 18;
//   },
// };
// function createUser(firstName, lastName, email, age, address) {
//   const user = {};
//   user.firstName = firstName;
//   user.lastName = lastName;
//   user.email = email;
//   user.age = age;
//   user.address = address;
//   user.about = userMethods.about;
//   user.is18 = userMethods.is18;
//   return user;
// }

// const user1 = createUser(
//   "harshit",
//   "vashsith",
//   "harshit@gmail.com",
//   9,
//   "my address"
// );
// const user2 = createUser(
//   "harsh",
//   "vashsith",
//   "harshit@gmail.com",
//   19,
//   "my address"
// );
// const user3 = createUser(
//   "mohit",
//   "vashsitha",
//   "harshit@gmail.com",
//   17,
//   "my address"
// );
// console.log(user1.about());
// console.log(user3.about());

//**** */ Object.create(): useful method

// mere pass 2 object hai 1 hai obj1 or ek hai obj2, obj1 ke andar mere pass 2 value hai aur obj2 ke pass 1 hai to mujhe obj2 me obj one value chahiye.

// const obj1 = {
//   key1: "value1",
//   key2: "value2",
// };

// const obj2 = Object.create(obj1);
// obj2.key3 = "value3";
// console.log(obj2.key1);

// // __proto__,  // offical ecmascript documentation, // [[prototype]]
// // __proto__ , [[prototype]] both are same 'prototype' is diff

// // console.log(obj2.__proto__);

// // student is a new object that inherits from person.
// // student can use greet() even though it's not defined in student — it's inherited from person

// const person = {
//   greet() {
//     console.log("Hello!");
//   }
// };

// const student = Object.create(person);
// student.name = "Alice";

// console.log(student.name);      // Alice
// student.greet();                // Hello!

// *************prototype***************** */
//prototype :
// function hello(){
//     console.log("hello world");
// }

// javascript function ===> function  + object
// console.log(hello.name);
// you can add your own properties
// hello.myOwnProperty = "very unique value";
// console.log(hello.myOwnProperty);
// name property ---> tells function name;
// function provides more usefull properties.
// console.log(hello.prototype); // {}
// only functions provide prototype property
// hello.prototype.abc = "abc";
// hello.prototype.xyz = "xyz";
// hello.prototype.sing = function(){
//     return "lalalla";
// };
// console.log(hello.prototype.sing());
//

// function createUser(firstName, lastName, email, age, address) {
//   const user = Object.create(createUser.prototype); // {}
//   user.firstName = firstName;
//   user.lastName = lastName;
//   user.email = email;
//   user.age = age;
//   user.address = address;
//   return user;
// }
// createUser.prototype.about = function () {
//   return `${this.firstName} is ${this.age} years old.`;
// };
// createUser.prototype.is18 = function () {
//   return this.age >= 18;
// };
// createUser.prototype.sing = function () {
//   return "la la la la ";
// };

// const user1 = createUser("numaan", "kazi", "nk14@gmail.com", 22, "my address");
// const user2 = createUser(
//   "harsh",
//   "vash",
//   "harshit@gmail.com",
//   19,
//   "my address"
// );
// const user3 = createUser("mohit", "vasha", "hars@gmail.com", 17, "my address");
// console.log(user1);
// console.log(user1.is18());

// *************************new  keyword********************************

// new keyword
// 1.) this = {}
// 2.) return {}
//

// __proto__
// // official ecmascript document
// [[prototype]]

// constructor function
// function CreateUser(firstName, lastName, email, age, address){
//     this.firstName = firstName;
//     this.lastName = lastName;
//     this.email = email;
//     this.age = age;
//     this.address = address;
// }
// CreateUser.prototype.about = function(){
//     return `${this.firstName} is ${this.age} years old.`;
// };
// CreateUser.prototype.is18 = function (){
//     return this.age >= 18;
// }
// CreateUser.prototype.sing = function (){
//     return "la la la la ";
// }

// const user1 = new CreateUser('harshit', 'vashsith', 'harshit@gmail.com', 18, "my address");
// const user2 = new CreateUser('harsh', 'vashsith', 'harshit@gmail.com', 19, "my address");
// const user3 = new CreateUser('mohit', 'vashsitha', 'harshit@gmail.com', 17, "my address");
// console.log(user1);
// console.log(user1.is18());

// ---------------------------------------------------------

// function CreateUser(firstName, lastName, email, age, address){
//     this.firstName = firstName;
//     this.lastName = lastName;
//     this.email = email;
//     this.age = age;
//     this.address = address;
// }
// CreateUser.prototype.about = function(){
//     return `${this.firstName} is ${this.age} years old.`;
// };
// CreateUser.prototype.is18 = function (){
//     return this.age >= 18;
// }
// CreateUser.prototype.sing = function (){
//     return "la la la la ";
// }

// const user1 = new CreateUser('harshit', 'vashsith', 'harshit@gmail.com', 18, "my address");
// const user2 = new CreateUser('harsh', 'vashsith', 'harshit@gmail.com', 19, "my address");
// const user3 = new CreateUser('mohit', 'vashsitha', 'harshit@gmail.com', 17, "my address");

// for(let key in user1){
//     // console.log(key);
//     if(user1.hasOwnProperty(key)){
//         console.log(key);
//     }

// }
// ----------------------------------------------------

//class keyword :

// 2015 / es6
// class keyword
// class are fake

// class CreateUser{
//     constructor(firstName, lastName, email, age, address){
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.email = email;
//         this.age = age;
//         this.address = address;
//     }

//     about(){
//         return `${this.firstName} is ${this.age} years old.`;
//     }
//     is18(){
//         return this.age >= 18;
//     }
//     sing(){
//         return "la la la la ";
//     }

// }

// const user1 = new CreateUser('harshit', 'vashsith', 'harshit@gmail.com', 18, "my address");
// const user2 = new CreateUser('harsh', 'vashsith', 'harshit@gmail.com', 19, "my address");
// const user3 = new CreateUser('mohit', 'vashsitha', 'harshit@gmail.com', 17, "my address");
// console.log(Object.getPrototypeOf(user1));

// ---------------------class Keyword----------------------

// class Animal {
//     constructor(name, age){
//         this.name = name;
//         this.age = age;
//     }

//     eat(){
//         return `${this.name} is eating`;
//     }

//     isSuperCute(){
//         return this.age <= 1;
//     }

//     isCute(){
//         return true;
//     }
// }

// class Dog extends Animal{

// }

// const tommy = new Dog("tommy", 3);
// console.log(tommy);
// console.log(tommy.isCute());

// ---------------------------------------------------------------

// class Animal {
//   constructor(name, age, weight) {
//     this.name = name;
//     this.age = age;
//     this.weight = weight;
//   }
//   isname() {
//     return `${this.name} is eating`;
//   }
//   isage() {
//     return this.age > 5;
//   }
//   isweight() {
//     return `Weight is ${this.weight}`;
//   }
// }
// const ani1 = new Animal("cat", 1, 10);
// const ani2 = new Animal("dog", 2, 50);
// const ani3 = new Animal("goat", 8, 60);

// class Newcls extends Animal {
//   constructor(name, age, weight, speed) {
//     super(name, age, weight); // here super means we takes Animals constructor as it is !
//     this.speed = speed;
//   }
//   isSpeed() {
//     return `${this.name}'s Speed is ${this.speed} Kmph`;
//   }
// }

// const ani = new Newcls("lion", 7, 5, 100);
// console.log(ani.isname());
// console.log(ani.isSpeed());

// ---------------------getter and setters---------------------

//** Get Method  */

// class Person {
//   constructor(firstName, lastName, age) {
//     this.firstName = firstName;
//     this.lastName = lastName;
//     this.age = age;
//   }
//   get fullName() {
//     // we use get, get making functions to normal method
//     return `${this.firstName} ${this.lastName}`;
//   }
// }
// const person1 = new Person("harshit", "sharma", 5);
// console.log(person1.fullName()); // before get method
// console.log(person1.fullName); // After get method .
