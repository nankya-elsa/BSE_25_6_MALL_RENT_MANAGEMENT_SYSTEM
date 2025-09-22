// tests
import { sum, multiply, divide, isEven, maxOfArray, average } from "../src/utils/index";
test("adds 2 + 3 to equal 5", () => {
  expect(sum(2, 3)).toBe(5);
});

test("multiplies 4 * 5 to equal 20", () => {
  expect(multiply(4, 5)).toBe(20);
});

test("divides 10 / 2 to equal 5", () => {
  expect(divide(10, 2)).toBe(5);
});

test("throws error on division by zero", () => {
  expect(() => divide(10, 0)).toThrow("Division by zero is not allowed");
});

test("checks if number is even", () => {
  expect(isEven(4)).toBe(true);
  expect(isEven(5)).toBe(false);
});

test("finds maximum of array", () => {
  expect(maxOfArray([1, 2, 9, 3])).toBe(9);
});

test("calculates average of array", () => {
  expect(average([2, 4, 6, 8])).toBe(5);
});
