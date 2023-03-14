import "./css/main.min.css";
import "bootstrap";
import { createApp, defineAsyncComponent } from "vue";
import App from "./App.vue";
import router from "./router.js";
import store from "./store/index.js";
import BaseSpinner from "./components/ui/BaseSpinner.vue";
import TheAdmin from "./components/layouts/TheAdmin.vue";

import VueImageZoomer from "vue-image-zoomer";

const app = createApp(App);

const BaseModal = defineAsyncComponent(() =>
  import("./components/ui/BaseModal.vue")
);

app.use(store);
app.use(VueImageZoomer);
app.use(router);
app.component("base-spinner", BaseSpinner);
app.component("the-admin", TheAdmin);
app.component("base-modal", BaseModal);
app.mount("#app");
