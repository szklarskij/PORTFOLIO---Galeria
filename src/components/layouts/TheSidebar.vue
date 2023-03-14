<template>
  <div class="sidebar-wrapper" :class="{ showBar: showSideBar }">
    <div class="sidebar-inner" :class="{ sidebarInnerOpen: showSideBar }">
      <nav class="d-flex navbar-light">
        <div
          class="white-backdrop"
          :class="{ 'white-backdrop--activated': showSideBar }"
        ></div>
        <div class="form-group">
          <div class="nav-item d-flex justify-content-end m-0 p-0">
            <i class="bi bi-x fs-3 trans hover" @click="slide"></i>
          </div>
          <ul class="navbar-nav mr-auto d-flex gap-4">
            <li class="nav-item active d-flex">
              <input
                type="text"
                class="form-control"
                id="searchInput"
                placeholder="Wyszukaj frazę"
                v-model="searchingPhrase"
              />
              <button
                @click="clearInput"
                class="btn btn-trash"
                type="button"
                v-if="searchingPhrase !== ''"
              >
                <i class="bi bi-trash3"></i>
              </button>
            </li>
            <li class="nav-item wb">
              <div class="dropdown">
                <button
                  class="btn btn-outline-secondary dropdown-toggle menu"
                  type="button"
                  id="dropdownMenu2"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {{ sortLabel }}
                </button>
                <div
                  class="dropdown-menu menu dropdown-fix"
                  aria-labelledby="dropdownMenu2"
                >
                  <button
                    class="dropdown-item"
                    type="button"
                    @click="setSort('Id')"
                  >
                    Brak
                  </button>
                  <button
                    class="dropdown-item"
                    type="button"
                    @click="setSort('DateOfWork')"
                  >
                    Data stworzenia
                  </button>
                  <button
                    class="dropdown-item"
                    type="button"
                    @click="setSort('CreatedDate')"
                  >
                    Data dodania
                  </button>
                  <button
                    class="dropdown-item"
                    type="button"
                    @click="setSort('Title')"
                  >
                    Tytuł
                  </button>
                  <button
                    class="dropdown-item"
                    type="button"
                    @click="setSort('SizeMultiplied')"
                  >
                    Wymiary
                  </button>
                </div>
              </div>
            </li>

            <li class="nav-item" v-show="params.sortBy !== 'Id'">
              <div
                class="btn-group btn-group-toggle menu wb"
                data-toggle="buttons"
              >
                <label
                  class="btn btn-outline-secondary active"
                  @click="setOrder('ASC')"
                  id="option1"
                >
                  <input
                    type="radio"
                    name="options"
                    autocomplete="off"
                    checked
                  />{{
                    params.sortBy === "DateOfWork" ||
                    params.sortBy === "CreatedDate"
                      ? "Najstarsze"
                      : params.sortBy === "Title"
                      ? "A-Z"
                      : params.sortBy === "SizeMultiplied"
                      ? "Najmniejsze"
                      : "Rosnąco"
                  }}
                </label>
                <label
                  class="btn btn-outline-secondary"
                  @click="setOrder('DESC')"
                  id="option2"
                >
                  <input type="radio" name="options" autocomplete="off" />
                  {{
                    params.sortBy === "DateOfWork" ||
                    params.sortBy === "CreatedDate"
                      ? "Najnowsze"
                      : params.sortBy === "Title"
                      ? "Z-A"
                      : params.sortBy === "SizeMultiplied"
                      ? "Największe"
                      : "Rosnąco"
                  }}
                </label>
              </div>
            </li>
            <li v-if="showNoGalleryItems">
              <p>Brak pozycji dla wybranych parametrów.</p>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    <button
      class="btn btn-primary btn-m btn-anim flex-nowrap fs-4"
      @click="slide"
      :class="{
        hideArrow: showSideBar,
        translateBtn: mobileView && !showSideBar,
      }"
    >
      <i
        class="bi bi-box-arrow-right"
        :class="{ translateBtnIcon: mobileView }"
      ></i>
      <p
        id="cloud"
        class="cloud cloud-2 position-absolute"
        :class="{ hidden: showSideBar, translateCloud: mobileView }"
      >
        Dostosuj kolekcję
      </p>
    </button>
  </div>
</template>
<script>
import { ref, computed, reactive, watch, onMounted, inject } from "vue";
import { useStore } from "vuex";
import { gsap } from "gsap";
import { Bounce } from "gsap";
export default {
  emits: ["passParams"],
  props: ["forceSlide", "reset", "passUrl"],
  setup(props, context) {
    gsap.registerPlugin(Bounce);

    const store = useStore();

    const showSideBar = ref(false);
    const forceSlide = computed(() => {
      return props.forceSlide;
    });

    watch(forceSlide, () => {
      if (!showSideBar.value) {
        slide();
      }
    });

    const slide = () => {
      showSideBar.value = !showSideBar.value;
    };
    const showNoGalleryItems = computed(function () {
      if (
        store.getters["gallery/getCurrentGallery"] &&
        store.getters["gallery/getCurrentGallery"].items.length === 0
      ) {
        return true;
      } else return false;
    });

    const reset = computed(() => {
      return props.reset;
    });
    const passedUrl = computed(() => {
      return props.passUrl;
    });
    watch(passedUrl, () => {
      if (passedUrl.value.searchPhrase) {
        searchingPhrase.value = passedUrl.value.searchPhrase;

        if (passedUrl.value.sortBy) params.sortBy = passedUrl.value.sortBy;
        if (passedUrl.value.sortDirection) {
          params.sortDirection = passedUrl.value.sortDirection;
          if (params.sortDirection === "DESC") {
            document.querySelector("#option1").classList.remove("active");
            document.querySelector("#option2").classList.add("active");
          }
        }
      } else {
        if (passedUrl.value.sortBy) params.sortBy = passedUrl.value.sortBy;
        if (passedUrl.value.sortDirection) {
          params.sortDirection = passedUrl.value.sortDirection;
          if (params.sortDirection === "DESC") {
            document.querySelector("#option1").classList.remove("active");
            document.querySelector("#option2").classList.add("active");
          }
        }

        context.emit("passParams", params);
      }
    });

    watch(reset, () => {
      (params.searchingPhrase = null),
        (params.sortBy = "Id"),
        (params.sortDirection = "ASC");
      showSideBar.value = false;
      searchingPhrase.value = "";
    });

    const params = reactive({
      searchingPhrase: null,
      sortBy: "Id",
      sortDirection: "ASC",
    });

    const sortLabel = computed(function () {
      if (params.sortBy === "CreatedDate") return "Data dodania";
      if (params.sortBy === "DateOfWork") return "Data stworzenia";
      if (params.sortBy === "Title") return "Tytuł";
      if (params.sortBy === "SizeMultiplied") return "Wymiary";
      else return "Sortuj";
    });
    const setSort = function (sort) {
      params.sortBy = sort;
      context.emit("passParams", params);
    };
    const setOrder = function (order) {
      params.sortDirection = order;
      context.emit("passParams", params);
    };
    const searchingPhrase = ref("");

    const clearInput = () => {
      searchingPhrase.value = "";
      params.searchPhrase = null;
    };

    watch(searchingPhrase, (newVal) => {
      if (newVal.length > 2) {
        params.searchPhrase = newVal;
        countdownOnKeyStroke();
      }
      if (newVal.length === 0) {
        params.searchPhrase = null;

        context.emit("passParams", params);
      }
    });

    const countdownOnKeyStroke = async function () {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        context.emit("passParams", params);
      }, 500);
    };
    let timer;

    const showBubbles = () => {
      const el = document.getElementById("cloud");
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: -100,
        },
        {
          opacity: 1,
          duration: 1,
          ease: Bounce.easeOut,
          y: 0,
        }
      );

      gsap.to(el, { opacity: 0, delay: 3 });

      store.dispatch("gallery/hideCloud", "main-page");
    };
    const mobileView = inject("mobile-view");

    onMounted(() => {
      if (!store.getters["gallery/getHiddenClouds"].includes("main-page")) {
        showBubbles();
      }
    });
    return {
      slide,
      showSideBar,
      setSort,
      sortLabel,
      setOrder,
      searchingPhrase,
      showNoGalleryItems,
      params,
      clearInput,
      mobileView,
    };
  },
};
</script>

<style scoped>
.sidebar-wrapper {
  transition: all 0.3s ease-in-out;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  flex: 0 0 0;
  width: 0;
  position: relative;
}
.sidebar-inner {
  overflow-x: hidden;
  position: absolute;
  opacity: 0;
  display: flex;
  left: -15rem;
  transition: all 0.3s ease-in-out;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
}
.form-group {
  position: fixed;
  width: 15rem;
  padding-right: 0.5rem;
}
.dropdown-fix {
  transform: none !important;
  top: unset !important;
  border-color: black;
}
.sidebarInnerOpen {
  left: 0rem;
  opacity: 1;
  transition: all 0.3s ease-in-out;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  width: 15rem;
  flex-shrink: 0;
  display: flex;
}
.navbar-light {
  width: 15rem;
  justify-content: center;
  flex-shrink: 0;
}
.showBar {
  flex: 0 0 15rem;
}
.btn-trash {
  border: 1px solid #ced4da;
  color: #ced4da;
  transform: translateX(-1px);
}
.btn-m {
  transition: all 0.3s ease-in-out;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;

  z-index: 666;
  position: fixed;
  left: 0%;
  top: calc(var(--nav-height) + 50px);

  z-index: 999;
  transform: translateY(0);
}
.menu {
  width: 100%;
}
.trans {
  transform: translateX(0.5rem);
}

input[type="radio"] {
  -webkit-appearance: none;
  appearance: none;

  margin: 0;
}
.hideArrow {
  transition: all 0.3s ease-in-out;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;

  transform: translateX(-10rem);
}
.hover:hover {
  cursor: pointer;
}

.wb {
  background-color: white;
}
.sidebar-helper {
  height: 100vh;
  height: 100dvh;
  width: 15rem;
  float: left;
}
.translateBtn {
  transform: translateX(-48%);
}
.translateBtnIcon::before {
  transform: translateX(50%);
}
.translateCloud {
  transform: translateX(8%);
}
.white-backdrop {
  background-color: rgba(255, 255, 255, 0.836);
  width: 0rem;
  position: fixed;
  height: 120vh;
  height: 120dvh;
  top: 0;
  left: 0;
  position: fixed;
}
@media (max-width: 992px) {
  .form-group {
    width: 16rem;
    margin-left: 1rem;
  }
  .sidebar-wrapper {
    position: absolute;
    width: 16rem;
    left: 0%;
    z-index: 4;
  }
  .sidebar-inner {
    width: 16rem;
  }
  .trans {
    transform: translateX(0.5rem);
    font-size: 3rem !important;
  }
  .white-backdrop--activated {
    width: 16rem;
  }
  .form-group {
    padding: 0 0.5rem;
  }
}
@media (max-width: 576px) {
  .form-group {
    margin-left: 0rem;
  }
  .sidebar-wrapper {
    width: 100vw !important;
    width: 100dvw !important;
  }
  .sidebarInnerOpen {
    justify-content: center;
  }
  .sidebar-inner {
    width: 100vw;
    width: 100dvw;
  }
  .trans {
    transform: translateX(1rem);
  }
  .white-backdrop--activated {
    width: 120vw;
    width: 120dvw;
  }
  .navbar-light {
    width: 100vw;
    width: 100dvw;
    justify-content: center;
  }
}
</style>
