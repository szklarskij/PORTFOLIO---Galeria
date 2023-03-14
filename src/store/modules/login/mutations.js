export default {
  adminLogin(state, payload) {
    state.adminLogged = true;
    state.token = payload;
  },
  adminLogout(state) {
    state.adminLogged = false;
    state.token = "";
  },
};
