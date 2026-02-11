//important array methods :

// const numbers = [3, 2, 3, 4, 5]; // array

// function mynumber(number, index) {
//   //function with parameter
//   console.log("1)index is", index); // calling index
//   console.log("2)number is", number); // calling index
//   console.log("3)", number * 2); //perform multiplications with 2
// }
// mynumber(numbers[0], 0); //calling functions with arguement.
// mynumber(numbers[1], 1);//calling functions with arguement.
// mynumber(numbers[2], 2);//calling functions with arguement.
// mynumber(numbers[3], 3);//calling functions with arguement.
// mynumber(numbers[4], 4);//calling functions with arguement.

// --------------------------code using loops ----------------------------

// const numbers = [3, 2, 3, 4, 5];

// function mynumber(number, index) {
//   console.log("1)index is", index);
//   console.log("2)number is", number);
//   console.log("3)", number * 2);
// }
// for (let i in numbers) { // for in
//   mynumber(numbers[i]);
// }

// * foreach function

// const numbers = [3, 2, 3, 4, 5];

// function mynumber(number, index) {
//   //   console.log("1)index is", index);
//   //   console.log("2)number is", number);
//   console.log(number * 2);
// }
// numbers.forEach(mynumber); // its replace loops
// --------------------------------------------------------------------------------

//exa2
// const users = [
//   { username: "doe", age: 21 },
//   { username: "george", age: 22 },
//   { username: "biile", age: 23 },
//   { username: "garima", age: 24 },
//   { username: "john", age: 25 },
// ];
// function names(user) {
//   console.log(user.username);
// }
// users.forEach(names); // foreach

// for (let user of users) { // for of loop
//   console.log(user.username);
// }

// Map methods in array (it is most imp in react also )*

// const numbers = [3, 2, 3, 4, 5];

// function find(number) {
//   return number * number; // use for new updated array
//   //   console.log(number * number);// just give you answer but array must be undefined
// }
// const square = numbers.map(find);
// console.log(square);
// find(numbers);

// find numbers :
// let array = [10,20,40,50,60,70,90];
// let sum = 0;
// for (let i = 0; i < array.length; i++) {
//   sum + array[i];
// }
// let totalSum = 330;
// let missingNumber = totalSum - sum;
// console.log(missingNumber);

// const users = [
//   { username: "doe", age: 21 },
//   { username: "george", age: 22 },
//   { username: "biile", age: 23 },
//   { username: "garima", age: 24 },
//   { username: "john", age: 25 },
// ];
// function names(user) {
//   console.log(user.username);
// }
// users.map(names);

// const users = [
//   { username: "doe", age: 21 },
//   { username: "george", age: 22 },
//   { username: "biile", age: 23 },
//   { username: "garima", age: 24 },
//   { username: "john", age: 25 },
// ];
// function names(user) {
//   console.log(user.username);
// }
// users.forEach(names);

// const users = [
//   { username: "doe", age: 21 },
//   { username: "george", age: 22 },
//   { username: "biile", age: 23 },
//   { username: "garima", age: 24 },
//   { username: "john", age: 25 },
// ];
// function names1(user) {
//   return user.username;
// }
// const ans = users.map(names1);
// console.log(ans);

///Filter is use for filtering need from array .filter() is an array method used to create a new array by including only the elements that pass a certain condition

// const numbers = [2, 7, 56, 4, 3, 2, 1, 46, 7, 4212, 4, 25.445, 245];
// function isEven(number) {
//   return number % 2 === 0;
// }
// const result = numbers.filter(isEven);
// console.log(result);

// filter method using array function:

// const nums = [2, 7, 56, 4, 3, 2, 1, 46, 7, 4212, 4, 25.445, 245];

// const evenNums = nums.filter((number) => {
//   return number % 2 === 0;
// });
// console.log(evenNums);

// * reduce method :

// const usercart = [
//   { productID: 1, productName: "mobile", price: 1000 },
//   { productID: 2, productName: "laptop", price: 2000 },
//   { productID: 1, productName: "tab", price: 1000 },
// ];
// const result = usercart.reduce((totalPrice, totalPrice) => {
//   return totalPrice + Product.price;
// }, 0);
// console.log(result);

// here we decared 0. because there 2 arguement in this reduce method first arguement totalprice after } we declared 0 means its declared with 1 args.
//and in return we use product.price because 1 args is 0 we already decalred.//

// how its actually works : how algorithm

// totalPrice       | totalPrice    | return
//   0 we decared   |   {}from      | 1000 from price 1
//                  | array choose  |
//                  |     .price    |
//   1000 from      |   {}from      | 3000 from price 1
//     return       |    2000       |
//                  |               |
//   3000 return    |   {}from      | 4000 from price 1
//                  |    1000       |

////* sorting method :

// const numbers = [8666, 3222, 434, 32, 1, 2, 3, 66, 45, 1414, 2910];
// numbers.sort();
// console.log(numbers);

//o/p : [1, 1414, 2, 2910, 3, 32, 3222, 434, 45, 66, 8666]
//because sort always check ascii value of numbers suppose array
//[8666, 3222, 434, 32, 1, 2, 3, 66, 45, 1414, 2910
// 8     3     4    3   1  2  3   6   4   1     2  -> just check 1st no.

// same as string CAPITAL h letters aving high priority. high priority check 1st

// const names = ["numaan", "Numaaan", "NUMAAN", "nuMaan"];
// names.sort();
// console.log(names);
//o/p : ['NUMAAN', 'Numaaan', 'nuMaan', 'numaan']
//       captital   Capital    capiTal   small // captial letter high priority.

//code for ascending order /descending order (a-b),(b-a)

// const numbers = [8666, 3222, 434, 32, 1, 2, 3, 66, 45, 1414, 2910];
// numbers.sort((a, b) => {
//   return a - b;
// });
// console.log(numbers);

//solve this LowToHigh

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

//**find()   method.

// const users = [
//   { userId: 1, username: "numaan" },
//   { userId: 2, username: "abu" },
//   { userId: 3, username: "shadab" },
//   { userId: 4, username: "bhai" },
//   { userId: 5, username: "sister" },
//   { userId: 6, username: "brother" },
// ];
// const findUser = users.find((user) => {
//   return user.userId === 5;
// });
// console.log(findUser);

// **every method() : check every element is even or odd as per condition any just one is false o/p is false .

// const numbers = [2, 4, 6, 8, 10, , 12];
// function isEven(number) {
//   return number % 2 == 0;
// }
// const ans = numbers.every(isEven);
// console.log(ans);

//realistic example: check all elemets having price more than 10000  if yes //true if no//false

// const products = [
//   { productId: 1, produceName: "p1", price: 300 },
//   { productId: 2, produceName: "p2", price: 3000 },
//   { productId: 3, produceName: "p3", price: 200 },
//   { productId: 4, produceName: "p4", price: 8000 },
//   { productId: 5, produceName: "p5", price: 500 },
// ];
// const priceTag = products.every((product) => {
//   return product.price < 10000;
// });
// console.log(priceTag);

//some() method : check any single element is even or odd if condition is true . ans is true (inshort this meth
// od Just check any single element).

// const number = [1, 3, 5, 7, 2];
// const ans = number.some((even) => {
//   return even % 2 == 0;
// });
// console.log(ans);
// const products = [
//   { productId: 1, produceName: "p1", price: 300 },
//   { productId: 2, produceName: "p2", price: 3000 },
//   { productId: 3, produceName: "p3", price: 200 },
//   { productId: 4, produceName: "p4", price: 81000 },
//   { productId: 5, produceName: "p5", price: 500 },
// ];
// const priceTag = products.some((product) => {
//   return product.price < 1000;
// });
// console.log(priceTag);

//**fill method:

// const array = new Array(10).fill(-1);
// console.log(array); // in this we make new array which has length of 10 and i want in this array -1,  10 times.

//suppose i have one array which already have some nums data and i want to change the data

// const numbers = [8, 4, 3, 2, 7, 8, 94];
// numbers.fill(2, 2, 5);
// console.log(numbers);

// ---------------for understanding-------------
// numbers.fill(2, 2, 5);
// 1.1st 2 means i want 2 .
// 2.2nd means 2th index to 5th index .

// **splice method : is use to delete and insert elements from array .

//delete
// const numbers = [8, 4, 3, 2, 7, 8, 94];
// const deleted=numbers.splice(1, 4);
// console.log("deleted item",deleted);

// explainantion: splice(start, deleteCount):
// start = 1 → Start at index 1 (value 4)
// deleteCount = 4 → Remove 4 elements starting from that index

//insertion and delete
// const numbers = [8, 4, 3, 2, 7, 8, 94];
// numbers.splice(1, 1, "inserted item"); //
// console.log(numbers);

//explaination:start = 1 → Start at index 1 (value 4)
// deleteCount = 1 → Remove 1 item (just 4)
// "inserted item" → Insert this in place of the removed item

//iterable : we can use for of loop on iterables.
// so array and strings are iterable
// object not iterable

// const character = "numaan";
// for (let char of character) {
//   console.log(char);
// }

// const numbers = [1, 2, 3, 4, 5, 6];
// for (let num of numbers) {
//   console.log(num);
// }

// const products = ["item1", "item2", "item"];
// for (let num of products) {
//   console.log(num);
// }

//object : hence object cant be iterable.
// const users = { key1: "value1", key2: "value2" };
// for (let num of users) {
//   console.log(num);
// }

//array like objects : array like has length properties and accessable by index.

// const fname = "numaan";
// console.log(fname.length);
// console.log(fname[0]);



//
function birthdayCakeCandles(candles) {
    // Step 1: sabse bada number find karo using Math.max
    let max = Math.max(...candles); // Spread operator se array ke elements Math.max ko diye

    // Step 2: count karo ki kitni baar max aya hai
    let count = 0;
    for (let i = 0; i < candles.length; i++) {
        if (candles[i] === max) {
            count++;
        }
    }

    return count;
}

