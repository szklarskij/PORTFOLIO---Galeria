import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  namespaced: true,
  state() {
    return {
      currentGallery: null,
      currentImage: null,
      currentGalleryItems: null,
      animationDelay: 0,
      animationCount: 0,
      hiddenClouds: [],
      itemQuery: null,
      forceFetch: false,
      thumbnailParams: null,
      thumbnailArray: [],
      scrollOnReturn: false,
    };
  },
  actions,
  mutations,
  getters,
};
