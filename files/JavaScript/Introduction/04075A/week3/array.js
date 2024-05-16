//arrays

let fruits = ["apple", "banana", "pear"];
let temperatures = [98.5, 75.2, 50];

//push
fruits.push("dragonfruit");

//console.log(fruits);

//pop
let pop = fruits.pop();

//console.log(fruits);
//console.log(pop);

//accessing data
//console.log(fruits[0]);

//indexOf
// console.log(fruits.indexOf("apple"));

// interating over arrays
// for (let i = 0; i < fruits.length; i++) {
//     console.log(fruits[i]);
// }

// fruits.forEach(function (item) {
//     console.log(item);
// });

// fruits.forEach((item) => {
//     console.log(item);
// });

//advanced methods

//maps
let temp = fruits.map((item) => item.length);
console.log(fruits);
console.log(temp);

//filter
let longFruits = fruits.filter((fruit) => fruit.includes("p"));
console.log(longFruits);

//reduce
let totalTempertures = temperatures.reduce((sum, temp) => sum + temp);
console.log(totalTempertures / temperatures.length);

//example
let ages = [12, 12, 21, 23, 24, 26, 26, 30, 30, 31, 32];
let addOne = ages.map((age) => age + 1);
let removeThirty = addOne.filter((age) => age < 30);
let averageAge =
    removeThirty.reduce((sum, age) => sum + age) / removeThirty.length;

console.log(averageAge);

let oneLine = ages
    .map((age) => age + 1)
    .filter((age) => age < 30)
    .reduce((sum, age, _, arr) => sum + age / arr.length);
console.log(oneLine);
