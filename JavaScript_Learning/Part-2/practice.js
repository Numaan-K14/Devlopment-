//-----------------------------------------hoisitng---------------------------------------------------

// ----------------------------------------------------------------------------------------------------
// | Type                | Hoisted?   | Can use before line?    | Notes                       |
// | ------------------- | --------   | ----------------------  | --------------------------- |
// | `var`               | ✅ Yes    | ⚠️ Yes (but undefined)  | Value comes later           |
// | `let/const`         | ✅ Yes    | ❌ No (Error)           | Not allowed before declared |
// | Function            | ✅ Yes    | ✅ Yes                  | Fully hoisted               |
// | Function Expression | ✅ Yes    | ❌ No (Error)           | Hoisted as `undefined`      |

// console.log(x);  // Output: undefined
// var x = 10;
// console.log(x);  // Output: 10

// var x;
// console.log(x);  // undefined
// x = 10;
// console.log(x);  // 10

// greet(); // ✅ Works
// function greet() {
//   console.log("Hello!");
// }

// console.log(this);
// console.log(window);
// console.log(firstname);
// var firstname = "harsheet";
// console.log(firstname);

function myFunc(power) {
  return function (number) {
    return number * power;
  };
}
const square = myFunc(4);
const ans = square(5);
console.log(ans);
