import dogs from "./dogs.js";

const dogElements = dogs
  .map(
    (dog) => `
    <li class="card">
      <h2>${dog.name}</h2>
      <img src="${dog.image}" alt="" width="500" height="300" />
      <p>${dog.age} years old. Weighs ${dog.weight}kg</p>
    </li>
  `
  )
  .join("\n");

document.querySelector("#app").innerHTML = `
  <h1>All the dogs</h1>
  <ul>
    ${dogElements}
  </ul>
`;
