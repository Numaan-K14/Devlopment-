//this code for sum of all numbers from array

//const usercart = [
//   { productID: 1, productName: "mobile", price: 1000 },
//   { productID: 2, productName: "laptop", price: 2000 },
//   { productID: 1, productName: "tab", price: 1000 },
// ];
// let total = 0;
// for (let user of usercart) {
//   total = total + user.price;
// }
// console.log(total);

// codes for seperates all elements...

// const usercart = [
//   { productID: 1, productName: "mobile", price: 1000 },
//   { productID: 2, productName: "laptop", price: 2000 },
//   { productID: 1, productName: "tab", price: 1000 },
// ];

// const names = usercart.map((allnames) => {
//   return allnames.productName;
// });

// const id = usercart.map((allnames) => {
//   return allnames.productID;
// });

// const price = usercart.map((allnames) => {
//   return allnames.price;
// });

// console.log(names);
// console.log(id);
// console.log(price);

/// exercise : in this array make seperate array for prices and and sort this using sort() method.

// const products = [
//   { productId: 1, produceName: "p1", price: 300 }, // 2
//   { productId: 2, produceName: "p2", price: 3000 }, // 4
//   { productId: 3, produceName: "p3", price: 200 }, // 1
//   { productId: 4, produceName: "p4", price: 8000 }, // 5
//   { productId: 5, produceName: "p5", price: 500 }, // 3
// ];
// const result = products.sort((a, b) => {
//   return b.price - a.price; //high to low , a-b -> low to high
// });
// console.log(result);

// -------------------------------class keyword----------------

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
