import dogs from "./dogs.js";

const cardTemplate = document.createElement("template");
cardTemplate.innerHTML = `
  <li class="card">
    <h2></h2>
    <img src="" alt="" width="500" height="300" />
    <p></p>
  </li>
`;

const dogElements = dogs.map((dog) => {
  const clone = cardTemplate.content.cloneNode(true);
  clone.querySelector("h2").append(dog.name);
  clone.querySelector("img").src = dog.image;
  clone
    .querySelector("p")
    .append(`${dog.age} years old. Weighs ${dog.weight}kg`);
  return clone;
});

const pageTemplate = document.createElement("template");
pageTemplate.innerHTML = `
  <h1>All the dogs</h1>
  <ul></ul>
`;
const clone = pageTemplate.content.cloneNode(true);
clone.querySelector("ul").append(...dogElements);

document.querySelector("#app").append(clone);
