const Button = document.querySelector("button");
const body = document.body;
const currentColor = document.querySelector(".current-color");

function randomColorGenerator() {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  const random = `rgb(${red}, ${green}, ${blue})`;
  return random;
}

Button.addEventListener("click", () => {
  const random = randomColorGenerator();
  body.style.backgroundColor = random;
  currentColor.textContent = random;
});
