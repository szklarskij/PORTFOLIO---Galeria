export default {
  setGallery(state, payload) {
    state.currentGallery = payload;
    state.currentGalleryItems = payload.items;
  },
  setThumbnailsParams(state, payload) {
    state.thumbnailParams = payload;
  },
  setThumbnailArray(state, payload) {
    state.thumbnailArray = payload;
  },
  setCurrentImage(state, payload) {
    state.currentImage = payload;
  },
  setParams(state, payload) {
    state.galleryParams = payload;
  },
  setItemQuery(state, payload) {
    state.itemQuery = payload;
  },

  setAnimationDelay(state, payload) {
    state.animationDelay = payload;
  },
  setAnimationCount(state, payload) {
    state.animationCount = payload;
  },
  countAnimation(state) {
    state.animationCount++;
  },
  hideCloud(state, payload) {
    state.hiddenClouds.push(payload);
  },
  setForceFetch(state, payload) {
    state.forceFetch = payload;
  },
  setScrollOnReturn(state, payload) {
    state.scrollOnReturn = payload;
  },
};
