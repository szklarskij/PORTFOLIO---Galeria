import { API } from "../../../config.js";

export default {
  async adminLogin(context, payload) {
    let url = `${API}/api/admin/login`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: payload,
      }),
    });

    if (!response.ok) {
      const error = new Error("Podano złe hasło.");
      throw error;
    }
    const token = await response.text();
    context.commit("adminLogin", token);

    const expirationDate = Date.now() + 1000 * 60 * 60;
    localStorage.setItem("tgtokenExpiration", expirationDate);
    localStorage.setItem("tgtoken", token);
  },
  tryLogin(context) {
    const token = localStorage.getItem("tgtoken");
    const tokenExpieration = localStorage.getItem("tgtokenExpiration");
    const now = Date.now();

    if (+tokenExpieration < now) {
      return;
    }
    if (token) {
      context.commit("adminLogin", token);
    }
  },
  adminLogout(context) {
    localStorage.removeItem("tgtoken");
    localStorage.removeItem("tgtokenExpiration");
    context.commit("adminLogout");
  },

  async changePass(context, payload) {
    let url = `${API}/api/admin/update`;
    const tokenQuery = "Bearer " + context.rootGetters["login/getToken"];
    const body = {
      Password: payload,
    };

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenQuery,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = new Error("Hasło musi mieć conajmniej 6 znaków.");
      throw error;
    }
  },
};
