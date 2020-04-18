import h from "./create-element.js";
import dogs from "./dogs.js";

// Using our custom h function
//
// ---
//
const dogElements = dogs.map((dog) => {
  const h2 = h("h2", {}, dog.name);
  const img = h("img", { src: dog.image, alt: "", width: 500, height: 300 });
  return h("li", { className: "card" }, h2, img);
});

const title = h("h1", {}, "All the dogs");
const list = h("ul", {}, ...dogElements);

document.querySelector("#app").append(title, list);

// Using raw document.createElement
//
// ---
//
// const dogElements = dogs.map((dog) => {
//   const li = document.createElement("li");
//   const h2 = document.createElement("h2");
//   h2.textContent = dog.name;
//   const img = document.createElement("img");
//   img.src = dog.image;
//   img.alt = "";
//   li.append(h2, img);
//   return li;
// });

// const title = document.createElement("h1");
// title.textContent = "All the dogs";
//
// const list = document.createElement("ul");
// list.append(...dogElements);
//
// document.querySelector("#app").append(title, list);
