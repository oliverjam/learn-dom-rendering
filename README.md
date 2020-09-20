# Learn DOM rendering

Learn three different ways to render elements in the browser: `createElement`, `innerHTML` and `<template>`.

## Setup

1. Clone this repo
1. Run `npm install`
1. Run `npm run dev` to start the development server

We'll be using three different methods to render the same dynamic UI to compare them. The UI will include a static single element (the title), plus a list of dynamic elements rendered from an array.

There is an array of dog objects in `workshop/dogs.js`. You need to import that data and render the following UI:

```html
<h1>All the dogs</h1>
<ul>
  <li class="card">
    <h2>Dog name</h2>
    <img src="dog image url" alt="" />
  </li>
</ul>
```

with a list item for each dog in the array.

The HTML document contains a single container to render all the UI into: `<div id="app"></div>`.

## `document.createElement`

The standard way to create new DOM elements in JavaScript is the `document.createElement` method. You pass in a string for the HTML element you want to create and it returns the new DOM node. You can then manipulate the node to add attributes and content.

### Appending nodes

Once you've created DOM nodes you have to append them to their parent (and eventually to a node that is actually on the page). The classic way to do this is `element.appendChild(newNode)`. This puts `newNode` inside the `element` node. If `element` is already on the page then `newNode` is rendered.

This has a big drawback: you can only append one thing at a time. This can lead to inefficient rendering. Each time you append a new element to the page the browser has to re-render everything. It's better to get all your DOM nodes ready then append them in one go.

There's a newer method with a nicer API: [`element.append`](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append). This is supported by all browsers but IE11. It can take as many elements to append as you like, and it even supports strings to set text content.

```js
container.append("Some text", newNode, anotherNode, "more text");
```

This is powerful when combined with the spread operator, as it means you can append an array of elements in one go:

```js
const elements = dogs.map((dog) => createListElementSomehow(dog));
container.append(...elements);
```

### Challenge 1

Use `document.createElement` and `append` to render the UI from the start. Remember we want a page title, a list, and a list item for every dog in the array.

<details>
<summary>Solution</summary>

```js
import dogs from "./dogs.js";

const dogElements = dogs.map((dog) => {
  const h2 = document.createElement("h2");
  h2.textContent = dog.name;

  const img = document.createElement("img");
  img.src = dog.image;
  img.alt = "";

  const li = document.createElement("li");
  li.append(h2, img);

  return li;
});

const title = document.createElement("h1");
title.textContent = "All the dogs";

const list = document.createElement("ul");
list.append(...dogElements);

document.querySelector("#app").append(title, list);
```

</details>

## Abstracting `createElement`

We can improve on the built-in `document.createElement` to make our code quite a lot more consise. Let's aim for an API like this:

```js
const p = h("p", { className: "test" }, "Some text content", childNode);
```

We'll call the function `h` (for "html"). It takes a tag name as the first argument, just like `createElement`. However it also takes an object of properties to add to the element (e.g. `className`, `src` etc). Finally any additional arguments should be appended as children.

Create a new file `create-element.js`. Write a function that takes three arguments: `tag`, `props` and `...children`. The `...` is the [rest operator]()—when used in function arguments like this it gathers all the additional arguments into an array. So any arguments after the properties object will go into a single array named `children`.

First create a new element using the `tag` argument:

```js
function h(tag, props, ...children) {
  const element = document.createElement(tag);
}
```

then we need to append all the properties in the `props` object. We _could_ loop through the object and add each one, but there's a nice trick to do it in one go:

```js
function h(tag, props, ...children) {
  const element = document.createElement(tag);
  const elementWithProps = Object.assign(element, props);
}
```

`Object.assign` copies all properties from the right object onto the left. So in this case it'll copy all the properties in the `props` object onto the `element` (DOM nodes are objects too 🤯).

Finally we need to append all the children to the new `element`. We already saw how `append` combines with the spread operator to add a whole array of children at once:

```js
function h(tag, props, ...children) {
  const element = document.createElement(tag);
  const elementWithProps = Object.assign(element, props);
  elementWithProps.append(...children);
  return elementWithProps;
}
```

Don't forget to return the new element! We now have a nice helper function that we can export to use in our other file.

### Challenge 2

Use your new `h` function to refactor your previous solution. Does it simplify the code?

<details>
<summary>Solution</summary>

```js
import h from "./create-element.js";
import dogs from "./dogs.js";

const dogElements = dogs.map((dog) => {
  const h2 = h("h2", {}, dog.name);
  const img = h("img", { src: dog.image, alt: "", width: 500, height: 300 });
  return h("li", { className: "card" }, h2, img);
});

const title = h("h1", {}, "All the dogs");
const list = h("ul", {}, ...dogElements);

document.querySelector("#app").append(title, list);
```

</details>

## `innerHTML`

This method almost feels like cheating. Whatever you set the `innerHTML` property of an element to is interpreted as HTML by the browser and rendered. This makes it a quick way to render a chunk of DOM, especially combined with template literals:

```js
container.innerHTML = `<div>Hello ${name}</div>`;
```

There are a couple of downsides to this method. First `innerHTML` is considered a large security risk. If you ever interpolate user input into an HTML string (like above) you run the risk of XSS attacks (cross-site scripting). A user could insert `<script src="steal-credit-cards.js"></script>` as the `name` variable, and your code would render that to the page, causing it to immediately execute.

It can also potentially be slow, since every time you change a node's `innerHTML` property the browser must completely scrap and recreate its entire DOM tree. If you (for example) keep appending to `innerHTML` in a loop you'll cause a lot of unnecessary re-renders. Nowadays browsers are so fast this is less of a concern.

### Challenge 3

Use `innerHTML` and template literals to create the same UI as before.

<details>
<summary>Solution</summary>

```js
import dogs from "./dogs.js";

const dogElements = dogs
  .map(
    (dog) => `
    <li class="card">
      <h2>${dog.name}</h2>
      <img src="${dog.image}" alt="" />
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
```

</details>

## The `<template>` element

The template element is a special HTML element designed for rendering dynamic UI with JavaScript. The template (and all its contents) don't appear on the page. It's like a reusable stamp: you have to use JS to make a copy of the template, fill in the blanks, then append the copy to the page.

```html
<!-- index.html -->
<template id="homeTemplate">
  <h1 class="title"></h1>
</template>
```

```js
const template = document.querySelector("#homeTemplate");
const clone = template.content.cloneNode(true);
const title = clone.querySelector("h1");
title.textContent = "Hello world";
container.append(clone);
```

This is useful because we don't have to dynamically create elements: we can use the ones already created inside the template.

### Challenge 4

Use the template element to create the same UI. You'll need to edit the HTML file too.

<details>
<summary>Solution</summary>

```js
import dogs from "./dogs.js";

const cardTemplate = document.querySelector("#cardTemplate");

const dogElements = dogs.map((dog) => {
  const clone = cardTemplate.content.cloneNode(true);
  clone.querySelector("h2").append(dog.name);
  clone.querySelector("img").src = dog.image;
  return clone;
});

const pageTemplate = document.querySelector("#pageTemplate");
const clone = pageTemplate.content.cloneNode(true);
clone.querySelector("ul").append(...dogElements);

document.querySelector("#app").append(clone);
```

</details>

It's a little annoying that templates have to be defined in the HTML file. We're doing all our rendering within JavaScript, so it would be nice to keep all the templates there too. There's no good way to import HTML, so to use a template you'd have to manually add the required templates elements to the HTML file as well as importing the JS.

We can work around this by combining all three of our rendering methods. We can create a new template element within our JS, set its content using `innerHTML`, then clone that template whenever we need a copy. The template is never actually on the page, it just lives inside our JS.

```js
const template = document.createElement("template");
template.innerHTML = `<h1 class="title"></h1>`;
// clone the template same as before
```

This also avoid the problems with `innerHTML`, since we won't be passing user input into it. Our only use of `innerHTML` will be the initial static markup.

### Challenge 5

Remove your template elements from the HTML file and instead create them with JavaScript. Refactor your previous solution to use this technique.

<details>
<summary>Solution</summary>

```js
import dogs from "./dogs.js";

const cardTemplate = document.createElement("template");
cardTemplate.innerHTML = `
  <li class="card">
    <h2></h2>
    <img src="" alt="" width="500" height="300" />
  </li>
`;

const dogElements = dogs.map((dog) => {
  const clone = cardTemplate.content.cloneNode(true);
  clone.querySelector("h2").append(dog.name);
  clone.querySelector("img").src = dog.image;
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
```

</details>

## Conclusion

All of these techniques are valid, and all have their place. It's good to understand the platform you're working with, even if you end up using a framework like React that abstracts all this DOM manipulation away.
