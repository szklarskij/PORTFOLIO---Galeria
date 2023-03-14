import { API } from "../../../config.js";
import router from "@/router";

export default {
  ////////////////////////////////////////////////////////////////////////////////////////////////// fetch gallery

  async fetchGallery(context, payload) {
    const params = payload;

    let url = `${API}/api/gallery/?`;

    url = `${API}/api/gallery/?${
      params.searchPhrase ? `searchPhrase=${params.searchPhrase}&` : ""
    }pageSize=${params.pageSize}&pageNumber=${params.pageNumber}${
      params.sortBy ? `&sortBy=${params.sortBy}` : ""
    }${params.sortDirection ? `&sortDirection=${params.sortDirection}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const error = new Error(`Błąd połączenia z galerią.`);
      throw error;
    }
    const responseData = await response.json();
    const newGallery = JSON.parse(JSON.stringify(responseData));
    context.commit("setGallery", newGallery);
    context.commit("setThumbnailsParams", params);
  },
  ////////////////////////////////////////////////////////////////////////////////////////////////// fetch thumbnails
  async fetchThumbnails(context) {
    const params = context.rootGetters["gallery/getThumbnailParams"];

    let url = `${API}/api/gallery/thumbnails/?pageNumber=1`;
    if (params) {
      url = `${API}/api/gallery/thumbnails/?${
        params.searchPhrase ? `searchPhrase=${params.searchPhrase}&` : ""
      }&pageNumber=1${params.sortBy ? `&sortBy=${params.sortBy}` : ""}${
        params.sortDirection ? `&sortDirection=${params.sortDirection}` : ""
      }`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const error = new Error(`Błąd połączenia z galerią.`);
      throw error;
    }
    const responseData = await response.json();
    const thumbArray = JSON.parse(JSON.stringify(responseData));
    context.commit("setThumbnailArray", thumbArray);
  },
  ////////////////////////////////////////////////////////////////////////////////////////////////// fetch image
  async fetchImage(context, payload) {
    const params = context.rootGetters["gallery/getItemQuery"];

    let url = `${API}/api/gallery/${payload}`;
    if (params) {
      url = `${API}/api/gallery/${payload}?${
        params.searchPhrase ? `searchPhrase=${params.searchPhrase}&` : ""
      }${params.sortBy ? `&sortBy=${params.sortBy}` : ""}${
        params.sortDirection ? `&sortDirection=${params.sortDirection}` : ""
      }`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 404) {
      const error = new Error(`Brak obrazu o żądanym id.`);
      throw error;
    }
    if (!response.ok) {
      const error = new Error(`Błąd połączenia z galerią.`);
      throw error;
    }
    const responseData = await response.json();

    context.commit("setCurrentImage", responseData);
  },
  ////////////////////////////////////////////////////////////////////////////////////////////////// fetch delete image

  async fetchDeleteImage(context, payload) {
    const tokenQuery = "Bearer " + context.rootGetters["login/getToken"];

    let url = `${API}/api/gallery/${payload}`;

    const response = await fetch(url, {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        Authorization: tokenQuery,
      },
    });
    if (!response.ok) {
      const error = new Error(`Błąd połączenia z galerią.`);
      throw error;
    }
  },

  ////////////////////////////////////////////////////////////////////////////////////////////////// fetch update image
  async fetchUpdateImage(context, payload) {
    const formData = payload.formData;
    const id = payload.id;
    let url = `${API}/api/gallery/${id}`;
    const tokenQuery = "Bearer " + context.rootGetters["login/getToken"];

    const response = await fetch(url, {
      method: "put",
      body: formData,
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: tokenQuery,
      },
    });
    if (!response.ok) {
      if (response.status === 599) {
        const error = new Error(
          `Błąd w strukturze pliku. Spróbuj przekonwertować plik obrazu.`
        );
        throw error;
      } else {
        const error = new Error(`Błąd połączenia z galerią.`);
        throw error;
      }
    }
    // const responseData = await response.json();
  },
  ////////////////////////////////////////////////////////////////////////////////////////////////// fetch create image

  async fetchCreateImage(context, payload) {
    const formData = payload.formData;
    let url = `${API}/api/gallery/`;
    const tokenQuery = "Bearer " + context.rootGetters["login/getToken"];

    const response = await fetch(url, {
      method: "post",
      body: formData,
      headers: {
        Authorization: tokenQuery,
      },
    });
    if (!response.ok) {
      if (response.status === 599) {
        const error = new Error(
          `Błąd w strukturze pliku. Spróbuj przekonwertować plik obrazu.`
        );
        throw error;
      } else {
        const error = new Error(`Błąd połączenia z galerią.`);
        throw error;
      }
    }

    for (var pair of response.headers.entries()) {
      if (pair[0] === "location") {
        router.push({ name: "gallery-item", params: { id: pair[1] } });
      }
    }
  },
  ////////////////////////////////////////////////////////////////////////////////////////////////// fetch delete all

  async fetchDeleteAll(context) {
    let url = `${API}/api/gallery/deleteAll`;
    const tokenQuery = "Bearer " + context.rootGetters["login/getToken"];

    const response = await fetch(url, {
      method: "delete",
      headers: {
        Authorization: tokenQuery,
      },
    });
    if (!response.ok) {
      const error = new Error(`Błąd połączenia z galerią.`);
      throw error;
    }
  },
  ////////////////////////////////////////////////////////////////////////////////////////////////// fetch spaw gallery

  async swapGallery(context, payload) {
    const tokenQuery = "Bearer " + context.rootGetters["login/getToken"];

    const url = `${API}/api/gallery/${payload}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenQuery,
      },
    });
    if (!response.ok) {
      const error = new Error(`Błąd połączenia z galerią.`);
      throw error;
    }
  },

  ////////////////////////////////////////////////////////////////////////////////////////////////// simple actions

  setItemQuery(context, payload) {
    context.commit("setItemQuery", payload);
  },
  setParams(context, payload) {
    context.commit("setParams", payload);
  },

  setAnimationDelay(context, payload) {
    context.commit("setAnimationDelay", payload);
  },
  setAnimationCount(context, payload) {
    context.commit("setAnimationCount", payload);
  },
  countAnimation(context) {
    context.commit("countAnimation");
  },

  hideCloud(context, payload) {
    context.commit("hideCloud", payload);
  },
  setForceFetch(context, payload) {
    context.commit("setForceFetch", payload);
  },

  setScrollOnReturn(context, payload) {
    context.commit("setScrollOnReturn", payload);
  },
};
