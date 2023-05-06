export function setNav() {
  const height = document.getElementById("nav").clientHeight;
  const r = document.querySelector(":root");
  r.style.setProperty("--nav-height", height + "px");
}

export async function scrollTo(y) {
  setTimeout(() => {
    document.querySelector("body").scrollTo({ top: y, behavior: "smooth" });
  }, 100);
}

export function getCoords(elem) {
  const box = elem.getBoundingClientRect();
  const body = document.body;
  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const clientTop = docEl.clientTop || body.clientTop || 0;
  const top = box.top + scrollTop - clientTop;
  const navProperty = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--nav-height");
  const navHeight = +navProperty.split("p")[0];
  return Math.round(top - navHeight);
}

export function randomIntFromInterval(min, max) {
  return Math.random() * (max - min + 1) + min;
}
