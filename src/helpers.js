export const setNav = function () {
  const height = document.getElementById("nav").clientHeight;
  const r = document.querySelector(":root");
  r.style.setProperty("--nav-height", height + "px");
};
