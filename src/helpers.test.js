import { it, expect, describe } from "vitest";

import { randomIntFromInterval } from "./helpers.js";

describe("randomIntFromInterval()", () => {
  it("should return random number between min and max", () => {
    const min = 1;
    const max = 4;
    expect(randomIntFromInterval(min, max)).toBeGreaterThanOrEqual(1);
    expect(randomIntFromInterval(min, max)).toBeLessThanOrEqual(4);
  });
  it("should throw an error when min value is greater than max"),
    () => {
      const min = 4;
      const max = 3;
      const validationFn = () => randomIntFromInterval(min, max);
      expect(validationFn).toThrow();
    };
});

describe("scrollTo()", () => {
  it("should throw an error when value is lower than 0"),
    () => {
      const y = -100;
      const validationFn = () => scrollTo(y);
      expect(validationFn).toThrow();
    };
});
describe("setNav()", () => {
  it("should throw an error when element with id 'nav' is missing"),
    () => {
      const validationFn = () => setNav();
      expect(validationFn).not.toThrow();
    };
});
