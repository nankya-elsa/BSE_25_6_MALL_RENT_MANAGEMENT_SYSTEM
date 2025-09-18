// src/utils/index.js
function sum(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) throw new Error("Division by zero is not allowed");
  return a / b;
}

function isEven(n) {
  return n % 2 === 0;
}

function maxOfArray(arr) {
  return Math.max(...arr);
}

function average(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export { sum, multiply, divide, isEven, maxOfArray, average };
