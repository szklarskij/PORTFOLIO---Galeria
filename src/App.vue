<template>
  <base-modal
    :content="isFeedback"
    :title="modalTitle"
    @handle="modalHandle"
  ></base-modal>

  <main class="main-layout">
    <the-header :hideNav="navHidden"></the-header>

    <router-view v-slot="{ Component }">
      <transition name="component">
        <KeepAlive include="main-gallery">
          <component :is="Component" @hideNav="hideNav" />
        </KeepAlive>
      </transition>
    </router-view>
  </main>
  <the-footer :hideFooter="navHidden">></the-footer>
</template>

<script>
import TheHeader from "./components/layouts/TheHeader.vue";
import TheFooter from "./components/layouts/TheFooter.vue";
import { useStore } from "vuex";
import { computed, ref, provide, onMounted } from "vue";
import { setNav } from "./helpers";

export default {
  name: "App",
  components: {
    TheHeader,
    TheFooter,
  },

  setup() {
    //////////////////////////////////////////////////////////////////////////////////////////////// setup

    onMounted(() => {
      setNav();
    });

    const store = useStore();
    store.dispatch("login/tryLogin");

    const isAdminLogged = computed(function () {
      return store.getters["login/isAdminLogged"];
    });
    const navH = ref(null);

    //////////////////////////////////////////////////////////////////////////////////////////////// window

    const screenWidth = ref(window.innerWidth);
    const handleResize = function () {
      screenWidth.value = window.innerWidth;

      if (navH.value) {
        const nav = document.querySelector("#nav");
        if (nav) navH.value = nav.offsetHeight;
        document
          .querySelector(":root")
          .style.setProperty("--nav-height", `${navH.value}px`);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    const mobileView = computed(function () {
      return screenWidth.value <= 992;
    });
    provide("screen-width", screenWidth);

    provide("mobile-view", mobileView);

    //////////////////////////////////////////////////////////////////////////////////////////////// modal
    const modalTitle = computed(function () {
      return store.getters["modal/getModalTitle"];
    });
    const isFeedback = computed(function () {
      return store.getters["modal/getModalFeedback"];
    });
    const modalHandle = () => {
      store.dispatch("modal/setModalFeedback", null);
      store.dispatch("modal/setModalTitle", null);
    };
    const navHidden = ref(false);
    const hideNav = function (bool) {
      navHidden.value = bool;
    };

    //////////////////////////////////////////////////////////////////////////////////////////////// nav height

    onMounted(() => {
      navH.value = document.getElementById("nav").offsetHeight;
    });
    return {
      isAdminLogged,
      isFeedback,
      modalHandle,
      modalTitle,
      hideNav,
      navHidden,
      navH,
    };
  },
};
</script>

<style>
:root {
  --nav-height: 73px;
}

.hidden {
  opacity: 0 !important;
}
#app {
  font-family: Raleway, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #332d2d;
}
* *:not(.spinner-border) {
  border-radius: 0 !important;
}

body {
  overflow-x: hidden;
  /* overflow-y: scroll; */
}
html,
body {
  height: 100%;
}
figure,
aside,
p,
menu {
  margin: 0 !important;
  padding: 0;
}
html {
  overflow: hidden;
}

.main-layout {
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr;
  max-width: 2000px;
  margin: 0 auto;
}
.cloud {
  border-radius: 1rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.3),
    0 0.0625rem 0.125rem rgba(0, 0, 0, 0.2);
}
.cloud {
  background-color: rgba(0, 0, 0, 0.75);
  top: -100%;
  font-size: 1rem;
  padding: 0.2rem 1rem;
  white-space: nowrap;
  opacity: 0;
}
.cloud-1 {
  right: 0%;
}
.cloud-2 {
  top: -92% !important;

  left: 10%;
}
.cloud::before {
  content: "";
  position: absolute;
  top: 100%;
  transform: rotate(180deg);
  border: 0.75rem solid transparent;

  border-bottom-color: rgba(0, 0, 0, 0.75);
  filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, 0.2));
}
.cloud-1::before {
  left: 84%;
}
.cloud-2::before {
  left: 10%;
}

.component-enter-active {
  transition: opacity 0.3s ease;
}

.component-enter-from {
  opacity: 0;
}
.translate {
  transform: translateY(-10vh);
}
.btn-anim {
  border: none;
  background: linear-gradient(
    -45deg,
    var(--bs-primary) 0%,
    var(--bs-primary) 40%,

    #616161 50%,
    var(--bs-primary) 60%,
    var(--bs-primary) 100%
  );
  background-size: 400% 400%;
  animation: gradient 2s ease infinite;
}
@keyframes gradient {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}
</style>
