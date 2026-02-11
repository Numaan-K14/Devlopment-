// //XHR (XML HTTP Request) |p-3/2:45:09|

// // const url = "https://jsonplaceholder.typicode.com/posts";
// // const xhr = new XMLHttpRequest();
// // console.log(xhr)



// // xhr.open("GET", url)

// // xhr.onreadystatechange = (() => {
// //     if (xhr.readyState === 4) {
// //         const DATA = xhr.response;
// //     const object=JSON.parse(DATA);
// //     console.log(object)
// //     }
    
// // })
// // xhr.send()



// // const url = "https://jsonplaceholder.typicode.com/posts";
// // const xhr = new XMLHttpRequest();

// // xhr.open("GET", url)

// // xhr.onreadystatechange = (() => {
// //     if (xhr.readyState === 4) {
// //         const data = xhr.response;
// //     const object = JSON.parse(data);
// //     console.log(object)
// //     }
    
// // })


// //Alternative :
// // const url = "https://jsonplaceholder.typicode.com/posts";
// // const xhr = new XMLHttpRequest();
// // xhr.open("GET", url)
// // xhr.onload = (() => {

// //     const data = xhr.response;
// //     const object = JSON.parse(data);
// //     console.log(object)
   
   
// // })
// // xhr.send();



// //ERROR HANDLING :

// // const url = "https://jsonplaceholder.typicode.com/posts";
// // const xhr = new XMLHttpRequest();
// // xhr.open("GET", url)
// // xhr.onload = (() => {
// //     if (xhr.status >= 200 && xhr.status < 300) {
// //         const data = xhr.response;
// //     const object = JSON.parse(data);
// //     console.log(object)
// //     } else {
// //         console.log("Something Went Wrong")
// //     }
   
// // })

// //xhr.onerror=(){ //for network handling
// //  console.log("Network Error")
// //}
// // xhr.send();


// //Suppose we have API but find any single id from the api abject :

// // const URL = "https://jsonplaceholder.typicode.com/posts";
// // const xhr = new XMLHttpRequest();
// // xhr.open("GET", URL);
// // xhr.onload = () => {
// //     if(xhr.status >= 200 && xhr.status < 300) {
// //         const data = JSON.parse(xhr.response);
// //         console.log(data);
// //         const id = data[3].id;
// //         const xhr2 = new XMLHttpRequest();
// //         const URL2 = `${URL}/${id}`
// //         console.log(URL2);
// //         xhr2.open("GET", URL2);
// //         xhr2.onload = () => {
// //             const data2 = JSON.parse(xhr2.response);
// //             console.log(data2);
// //         }
// //         xhr2.send();
// //     }
// //    else{
// //        console.log("something went wrong");
// //    }
// // }

// // xhr.onerror = () => {
// //     console.log("network error");
// // }
// // xhr.send();



// //Suppose we have API but find any single id from the api abject and get link:

// // const URL = "https://jsonplaceholder.typicode.com/posts";
// // const xhr = new XMLHttpRequest();
// // xhr.open("GET", URL);
// // xhr.onload = () => {
// //     if(xhr.status >= 200 && xhr.status < 300) {
// //         const data = JSON.parse(xhr.response);
// //         console.log(data);
// //         const id = data[3].id;
// //         const xhr2 = new XMLHttpRequest();
// //         const URL2 = `${URL}/${id}`
// //         console.log(URL2);
// //         xhr2.open("GET", URL2);
// //         xhr2.onload = () => {
// //             const data2 = JSON.parse(xhr2.response);
// //             console.log(data2);
// //         }
// //         xhr2.send();
// //     }
// //    else{
// //        console.log("something went wrong");
// //    }
// // }

// // xhr.onerror = () => {
// //     console.log("network error");
// // }
// // xhr.send();


// //Suppose we have API but find any single id from the api abject :

// // const URL = "https://jsonplaceholder.typicode.com/posts";
// // const xhr = new XMLHttpRequest();
// // xhr.open("GET", URL);
// // xhr.onload = () => {
// //     if(xhr.status >= 200 && xhr.status < 300) {
// //         const data = JSON.parse(xhr.response);
// //         console.log(data)
// //         const id = data[3];
// //         console.log(id);

        
// //     }
// //    else{
// //        console.log("something went wrong");
// //    }
// // }

// // xhr.onerror = () => {
// //     console.log("network error");
// // }
// // xhr.send();


// //httpRequests using Promises

// // const URL = "https://jsonplaceholder.typicode.com/posts";
// // function SendRequests(method, url) {
// //     return new Promise((resolve, reject) => {
// //             const xhr = new XMLHttpRequest();
// //         xhr.open(method, url)
// //         xhr.onload = function () {
// //             if (xhr.status >= 200 && xhr.status < 300) {
// //             resolve(xhr.response);
// //         } else {
// //             reject("Something went wrong");
// //         }
        
// //     }
// //     xhr.send();
// //     })
// // }
// // SendRequests("GET", URL)
// //     .then((xyz) => {
// //         const data = JSON.parse(xyz)
// //         console.log(data[2])
// //     })
// //     .catch((zbc) => {
// //       console.log(zbc)
// // })


// // URL = "https://jsonplaceholder.typicode.com/posts";

// // function Sender(method, url) {
// //     return new Promise((resolve, reject) => {
// //         const xhr = new XMLHttpRequest();
// //         xhr.open(method, url)
// //         xhr.onload = function () {
// //             if (xhr.status >= 200 && xhr.status < 300) {
// //                 resolve(xhr.response);
// //             } else {
// //                 reject("Error")
// //             }
// //         }
// //         xhr.send();
// //     })
    
// // }
// // Sender("GET", URL)
// //     .then((ACCEPT) => {
// //         const data = JSON.parse(ACCEPT);
// //         console.log(data)
// //     })
// //     .catch((REJECT) => {
// //         console.log(REJECT)
// //     })



// //fetch API

// URL = "https://jsonplaceholder.typicode.com/posts";
// fetch(URL)
//   .then((abc) => {
//     return abc.json()
//   })
//   .then((pr) => {
//     console.log(pr)
//   })

// let x = 5;
// let y = 12;

// let difference = Math.abs(x - y);
// console.log(difference);
    

function plusMinus(arr) {
  let plus=0;
  let minus=0;
  let zero=0;
  
  for(let i=0;i<arr.length;i++){
    if(arr[i]>0){
        plus++;
    }else if(arr[i]<0){
        minus++;
    }else{
        zero++;
    }
  }
    let plusRatio = plus / arr.length;
    let minusRatio = minus / arr.length;
    let zeroRatio = zero / arr.length;

    
    console.log(plusRatio.toFixed(6));
    console.log(minusRatio.toFixed(6));
    console.log(zeroRatio.toFixed(6));

  
}
console.log(plusMinus([-4, 3, -9, 0, 4, 1]))

function main() {
    const n = parseInt(readLine().trim(), 10);

    const arr = readLine().replace(/\s+$/g, '').split(' ').map(arrTemp => parseInt(arrTemp, 10));

    plusMinus(arr);
}
  