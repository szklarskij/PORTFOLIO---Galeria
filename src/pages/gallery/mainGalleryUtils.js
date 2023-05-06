export function getWidth() {
  return document.documentElement.clientWidth;
}

export function getCurrentId(id) {
  return +id.substring(id.indexOf("item") + 4);
}

export function getNextElementId(rowArray, currId, direction) {
  let nextElId;

  rowArray.forEach((row, rowIndex) => {
    if (direction === "right") {
      row.forEach((item, index) => {
        if (item.id == currId) {
          if (row[index + 1]) {
            nextElId = row[index + 1].id;
          } else if (rowArray[rowIndex + 1]) {
            nextElId = rowArray[rowIndex + 1][0].id;
          }
        }
      });
    } else {
      row.forEach((item, index) => {
        if (item.id == currId) {
          if (row[index - 1]) {
            nextElId = row[index - 1].id;
          } else if (rowIndex > 0) {
            nextElId = rowArray[rowIndex - 1][row.length - 1].id;
          }
        }
      });
    }
  });

  return nextElId;
}
export function calculateColumns(windowWidth, currentColumnNumber) {
  if (windowWidth < 576 && currentColumnNumber !== 2) {
    return 2;
  } else if (
    windowWidth < 992 &&
    windowWidth >= 576 &&
    currentColumnNumber !== 4
  ) {
    return 4;
  } else if (windowWidth >= 992 && currentColumnNumber !== 5) {
    return 5;
  } else if (!currentColumnNumber) {
    return 5;
  } else return currentColumnNumber;
}
