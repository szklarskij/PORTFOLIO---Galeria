import { it, expect, describe } from "vitest";

import {
  calculateColumns,
  getNextElementId,
  getCurrentId,
} from "./mainGalleryUtils.js";

describe("calculateColumns()", () => {
  it("should return 5 columns of images if screen width is more than 992 px", () => {
    const windowWidth = 1000;
    expect(calculateColumns(windowWidth)).toBe(5);
  });
});
describe("getNextElementId()", () => {
  it("should return id of the first element in a second row if current id is the last element in a first row", () => {
    const rowArray = [
      [{ id: 1 }, { id: 2 }],
      [{ id: 3 }, { id: 4 }],
    ];
    const currId = 2;
    const direction = "right";
    expect(getNextElementId(rowArray, currId, direction)).toBe(3);
  });
  it("should return id of the last element in a first row if current id is the first element in a second row", () => {
    const rowArray = [
      [{ id: 1 }, { id: 2 }],
      [{ id: 3 }, { id: 4 }],
    ];
    const currId = 3;
    const direction = "left";
    expect(getNextElementId(rowArray, currId, direction)).toBe(2);
  });
  it("should return next id in the same row", () => {
    const rowArray = [[{ id: 1 }, { id: 2 }]];
    const currId = 1;
    const direction = "right";
    expect(getNextElementId(rowArray, currId, direction)).toBe(2);
  });
});
describe("getCurrentId()", () => {
  it("should return integer from pattern of element id (item(number))", () => {
    const id = "item999";
    expect(getCurrentId(id)).toBe(999);
  });
});
