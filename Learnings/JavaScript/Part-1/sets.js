// Sets (it is iterable):
// 1. store data
// 2.sets also have its own methods
// 3. No index-based access
// 4. Order is not guaranteed
// 5.unique items only (no duplicates allowed)

// const Myarray = ["item1", "item2", "item2"]; //array naming Myarray
// const numbers = new Set(); //making new set here
// numbers.add(1, 3, 4, 5);
// numbers.add(2); //add those elements in set
// numbers.add(3); //add those elements in set
// numbers.add(4); //add those elements in set
// numbers.add(5); //add those elements in set
// numbers.add(6); //add those elements in set
// numbers.add(7); //add those elements in set
// numbers.add(Myarray); //unique items only (no duplicates allowed)
// if (numbers.has(1)) {
//   //check one is present in set
//   console.log("number is present");
// } else {
//   console.log("number is not present");
// }
// console.log(numbers); //run loop on numbers
// for (let number of numbers) {
//   console.log(number); // print  numbers
// }

// const numbers1 = [1, 2, 3, 4, 4, 4, 5, 2, 2, 1]; //array
// console.log(numbers1); //print array
// const UniqueElement = new Set(numbers1); //find unique elements from array
// console.log("Unique Elements from array", UniqueElement); //print UniqueElement

// let lengths = 0; //find length of UniqueElement
// for (let elements of UniqueElement) {
//   length++; //loop for length
// }
// console.log(length); //print length

// Maps:
// map is an iterable
// store data in ordered fashion
// store key value pair (like object)
// duplicate keys are not allowed like objects
// different between maps and objects
// objects can only have string or symbol
// as key
// in maps you can use anything as key
// like array, number, string
// object literal
// key -> string
// key -> symbol

// const person = new Map();
// person.set("username", "harshit");
// person.set("age", 22);
// person.set(1, "one");
// // for (let xyz of person.keys()) {//here just add keys of map object, but we want value also so,
// //
// //   console.log(xyz);
// // }
// for (let [keys, values] of person) {
//   //[keys,values]-> you use any string here 'xyz,abc'
//   //here we did array destruction we call both keys and values here.array destruction
//   console.log(keys, values);
// }

//realistic example based on map object:

// const person1 = {
//   name: "numaan",
//   id: 29,
// };
// const person2 = {
//   name: "Shruti",
//   id: 10,
// };
// // console.log(person1);
// // console.log(person2);
// const moreInfo = new Map();
// moreInfo.set(person1, { age: 22, adress: "pune" });
// moreInfo.set(person2, { age: 22, adress: "pune" });
// console.log(person1.id);
// console.log(moreInfo.get(person1).adress);

//clone using object assign

// const obj = {
//   username: "numaan",
//   age: 12,
// };

// const obj1 = { ...obj }; //obj1 is nothing but, obj in memory because both have same address in heap
// obj1.address = "nashik";// here we add new key-value pair in obj1 but we 'use ...spread' fuc here we its just put new key-value pair in obj1
// console.log(obj);
// console.log(obj1);

//**Optional chaining (?.) checks if a key or property exists in an object before trying to access it. If the property is missing, it stops the code from throwing an error and simply returns undefined.

//This is especially useful when you're working with data from a backend developer. If the backend structure changes — for example, a certain key is removed or renamed — using ?. helps your code continue working without crashing.

// const username = {
//   uname: "numaan",
//   city: { address: "nashik" },
// };
// console.log(username?.city?.address);
