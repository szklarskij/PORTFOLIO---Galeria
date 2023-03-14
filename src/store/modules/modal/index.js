export default {
  namespaced: true,
  state() {
    return {
      modalFeedback: null,
      modalTitle: null,
    };
  },
  mutations: {
    setModalFeedback(state, payload) {
      state.modalFeedback = payload;
    },
    setModalTitle(state, payload) {
      state.modalTitle = payload;
    },
  },
  actions: {
    setModalFeedback(context, payload) {
      context.commit("setModalFeedback", payload);
    },
    setModalTitle(context, payload) {
      context.commit("setModalTitle", payload);
    },
  },
  getters: {
    getModalFeedback(state) {
      return state.modalFeedback;
    },
    getModalTitle(state) {
      return state.modalTitle;
    },
  },
};
