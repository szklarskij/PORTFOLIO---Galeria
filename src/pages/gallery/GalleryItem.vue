<template>
  <section class="page-layout" :class="{ 'page-layout--edit-mode': editMode }">
    <div v-if="loadStage === 0 && !currentImg" class="cont col-12">
      <base-spinner
        class="align-items-center pe-1 d-flex spinner"
      ></base-spinner>
    </div>
    <main v-else class="d-lg-flex main-flex">
      <button
        v-if="!mobileView && !editMode && !zoomed"
        @click="arrowClick('prev')"
        type="button"
        class="btn btn-prev d-flex"
        :class="{
          'arrow-disabled': currentPosition === 0,
        }"
        aria-label="poprzedni slajd"
      >
        <svg
          width="30px"
          height="30px"
          viewBox="0 0 1024 1024"
          class="align-self-center"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432
          56.768L364.928 512z" fill="currentColor" stroke:= "currentColor" />
        </svg>
      </button>
      <div id="main-container" :class="{ 'vh-max': zoomed && mobileView }">
        <div
          class="img-wrapper opacity-animation"
          key="img2"
          @mouseover="showZoomInfo(true)"
          @mouseout="showZoomInfo(false)"
        >
          <vue-image-zoomer
            v-if="!editMode"
            :regular="loadStage === 1 ? thumbUrl : imgUrl"
            :zoom-amount="3"
            :click-zoom="true"
            img-class="mainimg"
            :alt="currentImg.title"
            @regular-loaded="handleThumbnail"
            click-message="Kliknij, aby powiększyć"
            touch-message="Dotknij, aby powiększyć"
            message-pos="top"
            @on-zoom="
              (fullWidth = true),
                (zoomed = true),
                onZooming(),
                hideNav(true),
                sliderOpen ? (slide(), (sliderWasOpened = true)) : ''
            "
            @off-zoom="
              (fullWidth = false),
                (zoomed = false),
                resetZoom(),
                hideNav(false),
                sliderWasOpened ? (slide(), (sliderWasOpened = false)) : ''
            "
          />
          <img v-else :src="imgUrl" :alt="currentImg.title" id="editingImg" />
          <div class="btn-close-mobile-fix"></div>
        </div>

        <menu v-if="mobileView" class="d-flex justify-content-between">
          <button
            v-if="!editMode && !zoomed"
            @click="arrowClick('prev')"
            type="button"
            class="btn btn-prev d-flex"
            :class="{
              'arrow-disabled': currentPosition === 0,
            }"
            aria-label="poprzedni slajd"
          >
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 1024 1024"
              class="align-self-center"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432
              56.768L364.928 512z" fill="currentColor" stroke:= "currentColor"
              />
            </svg>
          </button>
          <aside
            id="slider"
            v-if="!editMode && mobileView"
            :class="{ 'd-none': zoomed || currentThumbArrayLength === 1 }"
          >
            <the-slider
              :smallGallery="galleryProp"
              :currentId="currentImg.id"
              :arrowClicked="arrowClicked"
              @fetchNextSlide="setPic"
              @emitSlide="slide"
            ></the-slider>
          </aside>
          <button
            v-if="!editMode && !zoomed"
            @click="arrowClick('next')"
            type="button"
            class="btn btn-next d-flex"
            :class="{
              'arrow-disabled': currentPosition === currentThumbArrayLength - 1,
            }"
            aria-label="następny slajd"
          >
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 1024 1024"
              class="align-self-center"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232
              659.072 512z" fill="currentColor" stroke:= "currentColor"/>
            </svg>
          </button>
        </menu>

        <section id="img-description" v-show="!fullWidth" key="desc">
          <div v-if="!editMode" class="desc text opacity-animation">
            <div class="d-flex flex-column text-nowrap">
              <h2 class="d-flex mb-4">
                {{ currentImg.title }}
              </h2>
              <div
                v-if="currentImg.text"
                class="textbox p-4 fs-5 text-left mb-4"
              >
                {{ textComputed }}
              </div>
              <p class="img-descrip--item">Rok: {{ dateOfWork }}</p>
              <p v-if="currentImg.size" class="img-descrip--item">
                Wymiary: {{ currentImg.size }}
              </p>
              <p v-if="currentImg.technique" class="img-descrip--item">
                Technika: {{ currentImg.technique }}
              </p>

              <p v-if="currentImg.price" class="img-descrip--item">
                Cena: {{ currentImg.price }} zł
              </p>
            </div>
          </div>
          <div v-else>
            <edit-panel
              @imgPreview="changePreview"
              @cancel="cancelEdit"
              @save="saveEdit"
              :currImg="currentImg"
              :editMode="true"
              :imgId="currentImg.id"
            ></edit-panel>
          </div>
        </section>
      </div>
      <button
        v-if="!mobileView && !editMode && !zoomed"
        @click="arrowClick('next')"
        type="button"
        class="btn btn-next d-flex"
        :class="{
          'arrow-disabled':
            currentPosition === currentThumbArrayLength - 1 ||
            currentThumbArrayLength === 0,
        }"
        aria-label="następny slajd"
      >
        <svg
          width="30px"
          height="30px"
          viewBox="0 0 1024 1024"
          class="align-self-center"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232
          659.072 512z" fill="currentColor" stroke:= "currentColor"/>
        </svg>
      </button>
      <transition name="backdrop">
        <div
          v-show="zoomed"
          class="backdrop"
          :class="{ 'backdrop-anim': zoomed }"
        ></div>
      </transition>
    </main>
    <aside
      id="slider"
      v-if="!editMode && !mobileView"
      :class="{
        'd-none': zoomed || currentThumbArrayLength === 1,
        hidden: !sliderOpen,
      }"
    >
      <the-slider
        :smallGallery="galleryProp"
        :currentId="currentImg.id"
        :arrowClicked="arrowClicked"
        @fetchNextSlide="setPic"
        @emitSlide="slide"
      ></the-slider>
    </aside>
    <button
      v-if="!mobileView"
      class="btn btn-primary btn-bar flex-nowrap fs-5 btn-anim"
      @click="slide"
      :class="{
        hideArrow: sliderOpen || zoomed,
        'd-none': editMode || currentThumbArrayLength === 1,
      }"
      aria-label="pokaż wybraną kolekcję"
    >
      <i class="bi bi-box-arrow-up"></i>
      <p class="cloud cloud-1 position-absolute">Pokaż wybraną kolekcję</p>
    </button>
    <button
      v-if="!mobileView"
      class="btn btn-primary btn-back flex-nowrap fs-4 btn-anim"
      @click="zoomed ? '' : backToGallery()"
      :class="{ hidden: zoomed }"
      aria-label="powrót do galerii"
    >
      <i class="bi bi-arrow-return-left fs-5"></i>
      <p class="cloud cloud-2 position-absolute">Powrót do galerii</p>
    </button>
    <aside class="admin-menu" v-if="isAdminLogged && !editMode && !zoomed">
      <button
        class="btn btn-edit btn-outline-primary text-nowrap"
        @click="editMode = !editMode"
        aria-label="edytuj"
      >
        Edytuj
      </button>

      <div class="d-flex" v-if="!editMode">
        <button
          class="btn btn-edit btn-outline-primary text-nowrap flex-grow-1"
          @click="delMode = !delMode"
          aria-label="usuń"
        >
          {{ delMode ? "Anuluj" : "Usuń" }}
        </button>
        <button
          v-if="delMode"
          class="btn btn-edit btn-outline-primary text-nowrap btn-edit-absolute"
          @click="fetchDelete"
          aria-label="potwierdź usunięcie"
        >
          Potwierdź usunięcie
        </button>
      </div>
    </aside>
  </section>
</template>

<script>
import { useStore } from "vuex";
import EditPanel from "../../components/gallery/EditPanel.vue";
import TheSlider from "../../components/layouts/TheSlider.vue";
import {
  ref,
  computed,
  watch,
  onMounted,
  inject,
  provide,
  onBeforeUnmount,
} from "vue";
import { useRoute } from "vue-router";
import { API } from "../../config.js";
import { gsap } from "gsap";
import { Bounce } from "gsap";
import { VueImageZoomer } from "vue-image-zoomer";
import "vue-image-zoomer/dist/style.css";
import { useRouter } from "vue-router";

export default {
  name: "gallery-item",
  components: {
    VueImageZoomer,
    EditPanel,
    TheSlider,
  },
  setup(_, context) {
    //////////////////////////////////////////////////////////////////////////////////////////////// Setup
    gsap.registerPlugin(Bounce);

    const isAdminLogged = computed(function () {
      return store.getters["login/isAdminLogged"];
    });

    const isImgReadyToShow = ref(false);

    const isImgFullyLoaded = ref(false);
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const mobileView = inject("mobile-view");
    const dateOfWork = computed(function () {
      const year = currentImg.value.dateOfWork.slice(0, 4);
      return `${year} `;
    });

    const textComputed = computed(() => {
      return currentImg.value.text.replace("\r\n", "\n");
    });
    const currentImg = ref("");
    const smallGallery = ref(null);
    const galleryProp = computed(() => {
      return smallGallery.value;
    });
    const apiComputed = computed(function () {
      return API;
    });
    const imgUrl = computed(() => {
      return `${API}${currentImg.value.imageUrl}`;
    });
    const thumbUrl = computed(() => {
      return `${API}${currentImg.value.smallImageUrl}`;
    });
    const imgSrc = computed(() => {
      if (!thumbLoaded.value) {
        return thumbUrl.value;
      } else return imgUrl.value;
    });

    const zoomed = ref(false);
    const sliderWasOpened = ref(false);
    //////////////////////////////////////////////////////////////////////////////////////////////// Fetch
    const fetchImage = async (id) => {
      document.querySelector("body").scrollTo({ top: 0, behavior: "smooth" });
      try {
        await store.dispatch("gallery/fetchImage", id);
        currentImg.value = store.getters["gallery/getCurrentImage"];

        loadStage.value = 1;
        if (currentThumbArrayLength.value) getPosition();
      } catch (err) {
        router.replace("/brak");
        store.dispatch("modal/setModalTitle", "Błąd!");
        store.dispatch("modal/setModalFeedback", err.message);
      }
    };
    //////////////////////////////////////////////////////////////////////////////////////////////// animations

    const showZoomInfo = (bool) => {
      const el = document.querySelector(".vh--message");
      if (!el || mobileView) return;
      if (bool) {
        gsap.fromTo(
          el,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.1,
          }
        );
      } else {
        gsap.fromTo(
          el,
          {
            opacity: 1,
          },
          {
            opacity: 0,
            duration: 0.1,
          }
        );
      }
    };
    const showZoomInfoOnMobile = () => {
      const el = document.querySelector(".vh--message");
      el.style.opacity = "1";
      gsap.to(
        el,

        {
          opacity: 1,
          duration: 0.4,
          onComplete: () => {
            gsap.to(el, {
              opacity: 0,
              duration: 0.4,
            });
          },
        }
      );
    };

    const hideNav = (bool) => {
      context.emit("hideNav", bool);
    };
    const showBubbles = () => {
      const bubbles = document.getElementsByClassName("cloud");
      let limitDoubleSlide = false;
      [...bubbles].forEach((el) => {
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
        gsap.to(el, {
          opacity: 0,
          delay: 3,
          onComplete: () => {
            if (!limitDoubleSlide) {
              limitDoubleSlide = true;
              if (!sliderOpen.value && !zoomed.value) slide();
            }
          },
        });
      });
      store.dispatch("gallery/hideCloud", "gallery-item");
    };
    const transitionName = ref("none");

    const makeVisible = function () {
      const els = document.querySelectorAll(".opacity-animation");
      els.forEach((el) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.3,
          }
        );
        // el.style.opacity = 1;
      });
    };
    const makeInvisible = function () {
      const els = document.querySelectorAll(".opacity-animation");
      els.forEach((el) => {
        el.style.opacity = 0;
      });
    };
    const removeBlur = function () {
      const el = document.querySelector(".mainimg");
      el.classList.add("blur-off");
    };
    const resetBlur = function () {
      const el = document.querySelector(".mainimg");
      el.classList.remove("blur-off");
    };
    //////////////////////////////////////////////////////////////////////////////////////////////// zooming

    const onZooming = function () {
      const el = document.querySelector(".vh--holder");
      store.dispatch("gallery/setZoomState", 1);

      el.style.cursor = "zoom-out";
      const wrapper = document.querySelector(".img-wrapper");
      wrapper.classList.add("wrapper-fix");
      const container = document.querySelector("#main-container");
      container.classList.add("vh-max");
      const img = document.querySelector(".mainimg");
      img.classList.add("fullHeight");

      const layout = document.querySelector(".page-layout");
      layout.classList.add("fullHeight");
      if (!mobileView.value) {
        const arrow = document.querySelector(".btn-bar");
        arrow.style.position = "fixed";
      }
    };
    const resetZoom = function () {
      store.dispatch("gallery/setZoomState", 0);

      const el = document.querySelector(".vh--holder");
      el.style.cursor = "zoom-in";
      const wrapper = document.querySelector(".img-wrapper");
      wrapper.classList.remove("wrapper-fix");
      const container = document.querySelector("#main-container");
      container.classList.remove("vh-max");
      const img = document.querySelector(".mainimg");
      img.classList.remove("fullHeight");
      const layout = document.querySelector(".page-layout");
      layout.classList.remove("fullHeight");
      if (!mobileView.value) {
        const arrow = document.querySelector(".btn-bar");
        arrow.style.position = "absolute";
      }
    };
    const zoomState = computed(() => {
      return store.getters["gallery/getZoomState"];
    });
    watch(zoomState, () => {
      if (zoomState.value === 2) {
        zoomed.value = false;
        resetZoom();
        store.dispatch("gallery/setZoomState", 0);
        (fullWidth.value = false),
          hideNav(false),
          sliderWasOpened.value
            ? (slide(), (sliderWasOpened.value = false))
            : "";
      }
    });

    onBeforeUnmount(() => {
      store.dispatch("gallery/setZoomState", 0);
    });

    //////////////////////////////////////////////////////////////////////////////////////////////// fetch thumbs
    // const redirectToMain = () => {
    //   console.log("test redirect");
    // };
    // window.onpopstate = function () {
    //   alert("browser-back");
    // };
    provide("currentId", currentImg);
    onMounted(async () => {
      document.querySelector("body").scrollTo({ top: 0 });

      if (thumbArray.value.length === 0) {
        try {
          await store.dispatch("gallery/fetchThumbnails");
        } catch (err) {
          store.dispatch("modal/setModalTitle", "Błąd!");
          store.dispatch("modal/setModalFeedback", err.message);
        }
      }

      getPosition();
    });
    //////////////////////////////////////////////////////////////////////////////////////////////// control

    watch(route, () => {
      const id = route.params.id;
      if (id) fetchImage(id);
    });

    const fullWidth = ref(false);

    const thumbArray = computed(() => {
      return store.getters["gallery/getThumbnailArray"];
    });
    const setPic = function (id) {
      if (id === currentImg.value.id) return;
      makeInvisible();
      resetBlur();

      loadStage.value = 0;

      isImgFullyLoaded.value = false;
      isImgReadyToShow.value = false;
      transitionName.value = "none";
      router.push("/galeria/" + id);
    };
    const currentPosition = ref(null);
    const currentThumbArrayLength = ref(null);

    const getPosition = function () {
      const currId = currentImg.value.id;
      let currIndex = 0;

      thumbArray.value.forEach((thumb, index) => {
        if (thumb.id === currId) {
          currIndex = index;
        }
      });
      currentPosition.value = currIndex;
      currentThumbArrayLength.value = thumbArray.value.length;
    };

    const arrowClicked = ref(null);
    const arrowClick = (dir) => {
      arrowClicked.value = dir;

      let currIndex = currentPosition.value;

      const nextItem = thumbArray.value[currIndex + 1];
      const prevItem = thumbArray.value[currIndex - 1];

      if (dir === "next" && nextItem) {
        setPic(nextItem.id);
      } else if (dir === "prev" && prevItem) {
        setPic(prevItem.id);
      }
    };

    const backToGallery = function () {
      if (isAdminLogged.value) {
        store.dispatch("gallery/setForceFetch", true);
      }

      router.push("/galeria");
    };

    //////////////////////////////////////////////////////////////////////////////////////////////// slider

    const sliderOpen = ref(false);
    const slide = () => {
      const img = document.querySelector(".mainimg");
      const main = document.querySelector(".main-flex");
      if (sliderOpen.value === false) {
        img.classList.add("scale-down");
        main.classList.add("main-basis");

        sliderOpen.value = true;
      } else {
        img.classList.remove("scale-down");
        main.classList.remove("main-basis");

        sliderOpen.value = false;
      }
    };

    //////////////////////////////////////////////////////////////////////////////////////////////// Edit

    const editMode = ref(false);
    const delMode = ref(false);
    const changePreview = (url) => {
      const img = document.querySelector("#editingImg");
      img.src = url;
    };

    const saveEdit = () => {
      editMode.value = false;
      delMode.value = false;
      fetchImage(route.params.id);
      makeVisible();
    };

    const cancelEdit = () => {
      editMode.value = false;
      delMode.value = false;
      makeVisible();
    };

    const fetchDelete = async function () {
      try {
        await store.dispatch("gallery/fetchDeleteImage", currentImg.value.id);
        store.dispatch("modal/setModalTitle", "Sukces!");
        store.dispatch(
          "modal/setModalFeedback",
          "Obraz pomyślnie usunięty z galerii."
        );
      } catch (err) {
        store.dispatch("modal/setModalTitle", "Błąd!");
        store.dispatch("modal/setModalFeedback", err.message);
      }

      await store.dispatch("gallery/setForceFetch", true);

      router.push("/galeria");
    };

    //////////////////////////////////////////////////////////////////////////////////////////////// Init

    fetchImage(route.params.id);

    const thumbLoaded = ref(false);
    const loadStage = ref(0);
    const handleThumbnail = () => {
      if (loadStage.value === 2) {
        loadStage.value++;

        removeBlur();
      } else if (loadStage.value === 1) {
        thumbLoaded.value = true;
        loadStage.value++;
        if (mobileView) showZoomInfoOnMobile();
        makeVisible();

        if (
          !store.getters["gallery/getHiddenClouds"].includes("gallery-item")
        ) {
          showBubbles();
        }
      }
    };

    return {
      currentImg,
      imgUrl,
      thumbUrl,
      dateOfWork,
      smallGallery,
      apiComputed,
      setPic,
      arrowClick,
      slide,
      sliderOpen,
      isImgFullyLoaded,
      imgSrc,
      thumbLoaded,
      fullWidth,
      transitionName,
      onZooming,
      resetZoom,
      zoomed,
      hideNav,
      backToGallery,
      showZoomInfo,
      mobileView,
      textComputed,
      isAdminLogged,
      delMode,
      fetchDelete,
      editMode,
      changePreview,
      cancelEdit,
      saveEdit,
      galleryProp,
      arrowClicked,
      currentPosition,
      currentThumbArrayLength,
      isImgReadyToShow,
      loadStage,
      handleThumbnail,
      sliderWasOpened,
    };
  },
};
</script>

<style scoped>
.page-layout {
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-content: space-around;
}
.page-layout--edit-mode {
  height: 90vh !important;
}
.img-wrapper {
  z-index: 3;
  position: relative;
  /* transition: all 0.3s ease; */
}
#slider {
  width: 100vw;
}
#main-container {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  padding: 0 1rem;
  gap: 1.5rem;
}

.small-gallery-wrapper {
  position: absolute;
  width: 100%;
}
.smallGallery {
  white-space: nowrap;
  margin-bottom: 0;
  align-items: center;
  transition: all 0.3s ease;
}

.img-descrip {
  min-width: 20rem;
}
.text {
  text-align: left;
}
.textbox {
  max-height: calc(80vh - var(--nav-height) - 133px);

  overflow-y: auto;
  font-style: italic;
  white-space: pre-line !important;
  width: 100%;
  max-width: 22rem;
  background-color: rgb(245, 245, 245);
  -webkit-box-shadow: 5px 5px 20px -5px rgba(136, 136, 136, 1);
  -moz-box-shadow: 5px 5px 20px -5px rgba(136, 136, 136, 1);
  box-shadow: 5px 5px 20px -5px rgba(136, 136, 136, 1);
  white-space: nowrap;
}
.img-descrip--item {
  margin-bottom: 1rem;
}

#slider {
  flex: 1;
  position: relative;
  opacity: 1;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-self: center;
  flex-basis: auto;
}
.main-flex {
  flex-basis: calc(100vh - var(--nav-height));
  transition: all 0.3s ease;
}
.main-basis {
  flex-basis: calc(100vh - 8.3rem - var(--nav-height));
}
.btn-bar {
  transition: all 0.3s ease;
  z-index: 666;
  position: absolute;
  bottom: 0%;
  left: 94%;
  transform: translateY(0);
}
.btn-back {
  transition: all 0.3s ease;
  z-index: 666;
  position: fixed;
  left: 0%;
  top: calc(var(--nav-height) + 50px);
  z-index: 999;
  transform: translateY(0);
}
.hideArrow {
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -ms-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(5rem);
}

.btn-next,
.btn-prev {
  border: none !important;
  font-size: 2rem;
  padding: 0.5rem 0.1rem;
  z-index: 6;
  flex: 0 0;
  margin: auto 0;
}

.arrow-disabled {
  opacity: 0;
  cursor: unset !important;
}

.btn-prev {
  margin-left: 1rem;
}
.btn-next {
  margin-right: 1rem;
}
.gallery-fill {
  flex: 1;
  background-color: rgb(255, 255, 255);
  display: flex;
  z-index: 5;
}

ul {
  padding: 0;
  margin: 0;
}
li {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
p {
  margin: 0;
}
.selected-thumbnail {
  -webkit-box-shadow: 0px 14px 12px -6px rgba(0, 0, 0, 0.41);
  -moz-box-shadow: 0px 14px 12px -6px rgba(0, 0, 0, 0.41);
  box-shadow: 0px 14px 12px -6px rgba(0, 0, 0, 0.41);
  transform: scale(1.15);
  margin-left: 1rem !important;
  margin-right: 1rem !important;
}
.arrow {
  height: 100%;
}
.arrow-icon {
  border: solid rgb(49, 49, 49);
  border-width: 0 5px 5px 0;
  display: inline-block;
  padding: 3px;
  transform: scale(4);
}

.right {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.left {
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}
.btn-close-mobile-fix {
  position: absolute;
  width: 4rem;
  height: 4rem;

  z-index: 999;
  top: 0;
  left: 0;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  height: 100dvh;

  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 2;
  transition: all 0.3s ease;
}

.admin-menu {
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  top: 10rem;
  right: 0;
  z-index: 4;
}

.btn-edit {
  background-color: white;
  z-index: 2;
}
.btn-edit:hover {
  background-color: rgb(0, 0, 0);
}
.btn-edit-absolute {
  position: absolute;
  left: -250%;
}
.thumb-item {
  transition: all 0.3s ease;
  display: inline-block;
  height: 6rem;
  margin: 0 0.2rem;
  cursor: pointer;
}
.thumb-move {
  transition: all 0.3s ease;
}

.thumb-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.thumb-leave-to {
  opacity: 0;
}
.thumb-leave-active {
  position: absolute;
  transition: all 0.3s ease;
}

.thumb-enter-active {
  transition: all 0.3s ease;
}
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.5s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

@media (max-width: 992px) {
  .textbox {
    max-width: unset;
    max-height: unset;
    margin-bottom: 3rem !important;
  }
  .page-layout {
    height: unset;
    width: 100%;
    margin: 0 auto;
    overflow-y: unset !important;
    flex-direction: column;
  }
  .btn-next,
  .btn-prev {
    margin: 0 !important;
  }
  .admin-menu {
    top: 50%;
  }
  #img-description {
    margin-top: 1rem;
  }
  #main-container {
    max-height: none;
    height: unset;
    flex-direction: column;
    height: unset;
    gap: 0.5rem;
    padding: 0 1.5rem;
  }
  .img-descrip {
    min-width: unset;
  }
  #img-description {
    margin-bottom: 5rem;
  }
}
@media (min-width: 992px) {
  .container {
    max-width: 1600px;
  }
}
@media (max-width: 576px) {
  #main-container {
    padding: 0 0.5rem;
  }
}
@media (max-width: 992) {
}
</style>
<style>
.opacity-animation {
  opacity: 0;
  /* transition: all 1s ease; */
}
.opacity-show {
  /* opacity: 1 !important; */
}
.blur-off {
  filter: blur(0px) !important;
}
.mainimg {
  filter: blur(5px);
  max-width: 100%;
  object-fit: contain;
  height: 100%;
  max-height: calc(100vh - 1rem - var(--nav-height));
  height: calc(100dvh - 1rem - var(--nav-height));
  transition: all 0.3s ease;
  object-position: 50% 0%;
  z-index: 9;
}
#editingImg {
  max-width: 100%;
  object-fit: contain;
  height: calc(100vh - 1rem - var(--nav-height));
  height: calc(100dvh - 1rem - var(--nav-height));
  object-position: 50% 0%;
  z-index: 9;
  margin-bottom: 1rem;
}
.scale-down {
  height: calc(100vh - var(--nav-height) - 8.3rem) !important;
  height: calc(100dvh - var(--nav-height) - 8.3rem) !important;
}
.fullHeight {
  max-height: 100vh;
  height: 100vh;
}
.vh-max {
  height: 100vh !important;
}
.wrapper-fix {
  display: flex;
  align-items: center;
}
.vh--none > * {
  object-position: center;
}
.vh--image {
  height: 200% !important;
  width: auto !important;
}
.vh--message {
  opacity: 0;
  transition: all 0.3s ease;
}
.opacity1 {
  opacity: 1 !important;
}
@media (max-width: 992px) {
  .mainimg {
    height: 100%;
    width: 100vw;
  }
}
svg {
  color: var(--bs-primary);
  transition: all 0.3s ease;
}
svg:hover {
  color: var(--bs-secondary);
  transform: scale(1.1);
}
</style>
