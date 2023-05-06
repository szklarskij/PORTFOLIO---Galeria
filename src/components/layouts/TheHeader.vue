<template>
  <nav
    id="nav"
    class="navbar navbar-expand-lg bg-body-tertiary sticky d-flex flex-column"
    v-if="!navHidden"
  >
    <the-admin v-if="isAdminLogged"></the-admin>

    <div class="container-fluid">
      <router-link class="navbar-brand nav-link d-flex dir" to="/">
        <img
          src="./../../assets/ambasada_kultury.webp"
          width="60"
          height="60"
          alt=""
        />
        <p class="text-break d-none d-md-block align-self-center text-primary">
          Spichlerz Form i Kształtów
        </p>
        <div class="d-flex flex-column d-md-none align-items-start">
          <p class="text-break">Spichlerz</p>
          <p class="fs-6">Form i Kształtów</p>
        </div>
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav">
          <router-link
            @click="disableScroll"
            class="nav-link"
            to="/galeria"
            :data-target="mobileView ? '#navbarNav' : ''"
            :data-toggle="mobileView ? 'collapse' : ''"
            >Galeria</router-link
          >
          <router-link
            class="nav-link"
            to="/kontakt"
            :data-target="mobileView ? '#navbarNav' : ''"
            :data-toggle="mobileView ? 'collapse' : ''"
            >Kontakt</router-link
          >
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed, inject, defineAsyncComponent } from "vue";
import { useStore } from "vuex";

const TheAdmin = defineAsyncComponent(() => import("./TheAdmin.vue"));

export default {
  components: { TheAdmin },
  props: ["hideNav"],
  setup(props) {
    const store = useStore();
    const isAdminLogged = computed(function () {
      return store.getters["login/isAdminLogged"];
    });
    const mobileView = inject("mobile-view");

    const close = function () {
      const nav = document.getElementById("nav");
      nav.classList.remove("show");
    };
    const navHidden = computed(() => {
      return props.hideNav;
    });

    const disableScroll = () => {
      store.dispatch("gallery/setScrollOnReturn", true);
      store.dispatch("gallery/setForceFetch", true);
    };
    return {
      close,
      navHidden,
      mobileView,
      disableScroll,
      isAdminLogged,
    };
  },
};
</script>

<style scoped>
.brand-text-1 {
  text-transform: uppercase;
  letter-spacing: 5px;
}
.brand-text-2 {
  font-family: "Oswald", sans-serif;
}
.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}
.navbar {
  background-color: white;
  z-index: 4;
  padding: 0.1rem 0 !important;
}
.navbar-brand {
  margin-right: 1.5rem !important;
  padding-top: 0.4rem;
}

.nav-enter-active,
.nav-leave-active {
  transition: opacity 0.5s ease;
}

.nav-enter-from,
.nav-leave-to {
  opacity: 0;
  position: absolute;
  top: 100%;
}
.container-fluid {
  padding: 0 1.5rem;
}
img {
  margin-right: 1.5rem;
}
p {
  margin: 0;
}

@media (max-width: 576px) {
  .container-fluid {
    padding: 0 0.5rem;
  }
  img {
    margin-right: 0.5rem;
  }
}
</style>
