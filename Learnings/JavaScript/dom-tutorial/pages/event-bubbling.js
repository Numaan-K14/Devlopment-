console.log("Hello World");

const grandparent = document.querySelector(".grandparent");
const parent = document.querySelector(".parent");
const child = document.querySelector(".child");

//capturing

grandparent.addEventListener(
  "click",
  () => {
    console.log("Capturing !!! Grandparent");
  },
  true
);
parent.addEventListener(
  "click",
  () => {
    console.log("Capturing !!! parent");
  },
  true
);
child.addEventListener(
  "click",
  () => {
    console.log("Capturing !!! child");
  },
  true
);

//bubbling :

grandparent.addEventListener("click", () => {
  console.log("Bubbling on Grandparent");
});
parent.addEventListener("click", () => {
  console.log("Bubbling on parent");
});
child.addEventListener("click", () => {
  console.log("Bubbling on child");
});
