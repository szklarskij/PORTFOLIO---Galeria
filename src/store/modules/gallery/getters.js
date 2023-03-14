export default {
  getParams(state) {
    return state.galleryParams;
  },
  getCurrentGallery(state) {
    return state.currentGallery;
  },
  getThumbnailParams(state) {
    return state.thumbnailParams;
  },
  getCurrentImage(state) {
    return state.currentImage;
  },
  getCurrentGalleryItems(state) {
    return state.currentGallery;
  },
  getAnimationDelay(state) {
    return state.animationDelay;
  },
  getAnimationCount(state) {
    return state.animationCount;
  },
  getHiddenClouds(state) {
    return state.hiddenClouds;
  },
  getItemQuery(state) {
    return state.itemQuery;
  },
  getForceFetch(state) {
    return state.forceFetch;
  },
  getThumbnailArray(state) {
    return state.thumbnailArray;
  },
  getScrollOnReturn(state) {
    return state.scrollOnReturn;
  },
};
