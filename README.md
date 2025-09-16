# JavaScript 

### 1) What is the difference between var, let, and const?
 1. **var** ---> Function scoped, can be redeclared, hoisted.  
 2. **let** ---> Block scoped, can be reassigned but not redeclared.  
 3. **const** ---> Block scoped, cannot be reassigned or redeclared.



### 2) What is the difference between map(), forEach(), and filter()?
1. **map()** ---> Returns a new array after applying a function to each element. 
2. **forEach()** --->  Does not return anything, just loops through the array.  
3. **filter()** ---> Returns a new array with elements that match a condition.


### 3) What are arrow functions in ES6?
- A shorter way to write functions.  
- Example:  
  ```js
  const add = (a, b) => a + b;

### 4) How does destructuring assignment work in ES6?

- It allows extracting values from arrays or objects into variables.

- Example:

```js

const [a, b] = [10, 20];
const {name, age} = {name: "Tamim", age: 22};


### 5) Explain template literals in ES6. How are they different from string concatenation?

- Template literals use backticks (`).

- You can embed variables with ${variable}.

- Unlike concatenation (+), template literals are easier to read.

- Example:

```js

const name = "Tamim";
console.log(`Hello, my name is ${name}`);