//callback func

// const callback = document.querySelectorAll(".my-buttons button");

// for (let button of callback) {
//   button.addEventListener("click", function () {
//     console.log(this.textContent);
//   });
// }

//arrow func
// const arrow = document.querySelectorAll(".my-buttons button");

// for (let button of arrow) {
//   button.addEventListener("click", (e) => {
//     console.log(e.target.textContent);
//   });
// }

//change color on click

const allButtons = document.querySelectorAll(".my-buttons");

allButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.target.style.backgroundColor = "yellow";
    e.target.style.color = "red";
  });
});
