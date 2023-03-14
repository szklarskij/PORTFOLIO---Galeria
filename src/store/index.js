import { createStore } from "vuex";

import loginModule from "./modules/login/index.js";
import modalModule from "./modules/modal/index.js";
import galleryModule from "./modules/gallery/index.js";

const store = createStore({
  modules: {
    login: loginModule,
    modal: modalModule,
    gallery: galleryModule,
  },
});

export default store;
