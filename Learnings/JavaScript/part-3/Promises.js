// ---------13 - 8 - 2025 ------------(p3/promise/1:30:+)



//promises

// const bucket = ['coffee', 'vegetables', 'salt', 'sauce'];
// const FriedRice = new Promise((resolve,reject) => {
//   if (bucket.includes("vegetables") && bucket.includes("salt") && bucket.includes("rice") && bucket.includes("sauce")) {
//     resolve("Ready To Eat.....");
//   } else {
//     reject("Something is missing here")
//   }
// })

// FriedRice.then((xyz) => {
//   console.log(xyz);
// },
//   (error) => {
//     console.log(error)
//   });



// const bucket = ['coffee', 'vegetables', 'salt', 'rice','sauce'];
// function myfunc() {
//   if (bucket.includes("vegetables") && bucket.includes("salt") && bucket.includes("rice") && bucket.includes("sauce")) {
//     return "Ready to Eat";
//   } else {
//     console.log("Not ready yet");
//    }
// }
// const ans = myfunc();
// console.log(ans)

//function returning promise

// function Rice() {
//   const bucket = ['coffee', 'vegetables', 'salt', 'rice','sauce'];

//   return new Promise((resolve,reject) => {
//   if (bucket.includes("vegetables") && bucket.includes("salt") && bucket.includes("rice") && bucket.includes("sauce")) {
//     resolve("Ready To Eat.....");
//   } else {
//     reject("Something is missing here")
//   }
// })
// }

// Rice().then((xyz) => {
//   console.log(xyz);
// },
//   (error) => {
//     console.log(error)
//   });
//

//************Code For Practice */
// console.log("start")

// const bucket = ['rice', 'vegetables','sauce', 'salt']
// const Dish = new Promise((resolve, reject) => {
//   if (bucket.includes("rice") && bucket.includes("vegetables") && bucket.includes("sauce") && bucket.includes("salt")) {
//     resolve("Ready To Eat")
//   } else {
//     reject("something is missing here !")
//   }
// });

// Dish.then((Solve) => {
//   console.log("Fried rice is" ,Solve)
// },
//   (error) => {
//       console.log(error)
//   })


// for (let i = 0; i < bucket.length; i++){
//   console.log(bucket[i].length)
// }
//   console.log("stop")

//*********-promise and setTimeout()-******* */
//i want to resolve /reject promises after 2 second .
// --using variable

// function myPromise(){
//     return new Promise((resolve,reject) => {
//         const value = false;
//          setTimeout(() => {
//             if (value) {
//                 resolve();
//             } else {
//                 reject();
//             }
//         },2000)
//     })
// }
// myPromise()
//     .then(() => {console.log("resolved") })
//     .catch(() => { console.log("rejected") })
// //   --------------------------


// // using array
// function myArr() {
//     return new Promise((resolve, reject) => {
//        const bucket = ['rice', 'vegetables','salt','sauce']
//         setTimeout(() => {
//             if (bucket.includes("rice") && bucket.includes("vegetables") && bucket.includes("sauce") && bucket.includes("salt")) {
//                 resolve();
//             } else {
//                 reject();
//             }
//         },2000)
//     })
// }
// myArr()
// .then(()=>{console.log("Ready To Eat")})
// .catch(()=>{console.log("Something is Missing")})

// const abc =  Promise.resolve(5);
// Promise.resolve(5).then(value => {
//     console.log(value)
// })

//then():- then method hamesha promise return karta hain !!

// function myPromise(){
//     return new Promise((resolve, reject) => {
//         resolve("Foo")
//     })
// }
// myPromise()
//     .then((value) => {
//         console.log(value)
//         value += "ter";
//         return value
//     })
//     .then((value) => {
//         console.log(value)
//         value += " creating";
//         return value
//     })
 
//     .then((value) => {
//         console.log(value)
//     })
 

//
// const heading1 = document.querySelector(".heading1");
// const heading2 = document.querySelector(".heading2");
// const heading3 = document.querySelector(".heading3");
// const heading4 = document.querySelector(".heading4");
// const heading5 = document.querySelector(".heading5");
// const heading6 = document.querySelector(".heading6");
// const heading7 = document.querySelector(".heading7");

// function changeText(element, text, color, time, onSuccessCallback, onFailureCallback) {
//     return new Promise((resolve,reject) => {
//          setTimeout(()=>{
//     if(element){
//       element.textContent = text;
//       element.style.color = color;
//         resolve()
//     }else{
//       reject()
//     }
//   },time)
//      })
// }
  
// changeText(heading1, "H-1", "green", 1000)
//     .then(() => {
//      return changeText(heading2, "H-2", "yellow", 1000)
// })
//     .then(() => {
//      return changeText(heading3, "H-3", "blue", 1000)
// })
//     .then(() => {
//      return changeText(heading4, "H-4", "cyan", 1000)
// })
//     .then(() => {
//      return changeText(heading5, "H-5", "brown", 1000)
// })
//     .then(() => {
//      return changeText(heading6, "H-6", "orange", 1000)
// })
//     .then(() => {
//      return changeText(heading7, "H-7", "pink", 1000)
// })