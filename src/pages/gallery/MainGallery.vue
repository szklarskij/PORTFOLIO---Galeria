<template>
  <div class="page-layout">
    <base-spinner
      v-if="allImagesReadytoShow === 0"
      class="spinner"
    ></base-spinner>

    <div class="d-flex justify-content-center gallery-container">
      <side-bar
        @passParams="passParams"
        :forceSlide="forceSlide"
        :reset="reset"
        :passUrl="passUrl"
      ></side-bar>
      <div class="no-items">
        <div
          v-if="rowArrayComputed.length > 0"
          id="gContainer"
          ref="gContainer"
        >
          <ul
            v-for="(galleryRow, i) in rowArrayComputed"
            :key="galleryRow[i] + 'row'"
          >
            <li class="d-flex">
              <div
                :id="'thumb' + galleryPost.id"
                class="d-flex flex-grow-1 flex-shrink-1"
                v-for="galleryPost in galleryRow"
                :key="galleryPost.id + 'key'"
              >
                <thumbnail-item
                  :isDummy="galleryPost.isDummy"
                  :smallImgUrl="galleryPost.smallImageUrl"
                  :thumbImgUrl="galleryPost.thumbImageUrl"
                  :title="galleryPost.title"
                  :totalImgs="countImages"
                  :id="'item' + galleryPost.id"
                  :sortBy="fetchParams.sortBy"
                  class="d-flex"
                  @animationFinished="showLoadMoreBtn"
                  @imgReady="imgReady"
                  @swapRight="swapRight"
                  @swapLeft="swapLeft"
                  :itemQuery="galleryItemQuery"
                  :allImagesReadytoShow="allImagesReadytoShow"
                ></thumbnail-item>
              </div>
            </li>
          </ul>
          <button
            v-if="
              rowArrayComputed.length > 0 && totalPages > fetchParams.pageNumber
            "
            class="btn btn-primary btn-anim"
            @click="loadMore"
            id="loadmore"
            :style="{ opacity: btnOpacity }"
          >
            Pokaż więcej
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "../../components/layouts/TheSidebar.vue";

import ThumbnailItem from "../../components/gallery/ThumbnailItem.vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

import {
  reactive,
  ref,
  watch,
  computed,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
} from "@vue/runtime-core";

export default {
  name: "main-gallery",
  components: {
    ThumbnailItem,
    SideBar,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const isLoading = ref(false);
    const gallaryColNum = ref(null);

    //////////////////////////////////////////////////////////////////////////////////////////////// btn anim

    const btnOpacity = ref(0);
    const showLoadMoreBtn = function () {
      btnOpacity.value = 1;
    };

    //////////////////////////////////////////////////////////////////////////////////////////////// Fetch and show
    const allImagesReadytoShow = ref(0);
    const countReadyImages = ref(0);
    const imgReady = function () {
      countReadyImages.value++;
      if (countReadyImages.value === countImages.value) {
        allImagesReadytoShow.value++;
      }
    };

    const fetchParams = reactive({
      searchPhrase: null,
      pageSize: 20,
      pageNumber: 1,
      sortBy: "Id",
      sortDirection: "ASC",
    });
    const galleryItemQuery = reactive({
      searchPhrase: fetchParams.searchPhrase,
      sortBy: fetchParams.sortBy,
      sortDirection: fetchParams.sortDirection,
    });
    const totalPages = ref(0);
    const countImages = ref(0);
    const rowArray = ref([]);
    const rowArrayComputed = computed(function () {
      return rowArray.value;
    });
    const appendGallery = ref([]);
    const areParams = ref(false);
    const passParams = function (params) {
      areParams.value = true;
      isLoading.value = true;
      fetchParams.searchPhrase = params.searchPhrase;
      fetchParams.sortBy = params.sortBy;
      fetchParams.sortDirection = params.sortDirection;
      fetchParams.pageNumber = 1;
      rowArray.value = [];
      appendGallery.value = [];
      store.dispatch("gallery/setItemQuery", {
        searchPhrase: fetchParams.searchPhrase,
        sortBy: fetchParams.sortBy,
        sortDirection: fetchParams.sortDirection,
      });
      let paramUrl = `${
        params.searchPhrase ? `search=${params.searchPhrase.trim()}` : ""
      }
      `;
      if (params.sortBy !== "Id") {
        paramUrl =
          paramUrl.trim() +
          "&sort=" +
          params.sortBy +
          "&dir=" +
          params.sortDirection;
      }

      if (
        (params.searchPhrase === "" || !params.searchPhrase) &&
        params.sortBy === "Id"
      ) {
        router.replace("/galeria");
      } else {
        router.replace(`/galeria?${paramUrl.trim()}`);
      }

      fetchGallery();
      scroll(0);
    };
    const preventDoubleFetch = ref(false);
    const fetchGallery = async function () {
      // holdUrl.value = route.fullPath;

      if (preventDoubleFetch.value) return;
      preventDoubleFetch.value = true;
      btnOpacity.value = 0;
      isLoading.value = true;
      try {
        if (fetchParams.sortBy === "Id") {
          fetchParams.sortDirection = "DESC";
        }

        await store.dispatch("gallery/fetchGallery", fetchParams);

        appendGallery.value = store.getters["gallery/getCurrentGallery"].items;

        totalPages.value =
          store.getters["gallery/getCurrentGallery"].totalPages;

        holdUrl.value = route.fullPath;

        refreshGallery();
      } catch (err) {
        store.dispatch("modal/setModalTitle", "Błąd!");
        store.dispatch("modal/setModalFeedback", err.message);
      }
      isLoading.value = false;
      preventDoubleFetch.value = false;
    };

    const loadMore = async function () {
      fetchParams.pageNumber++;
      scroll(getCoords(document.querySelector("#loadmore")));

      await fetchGallery();
      function getCoords(elem) {
        var box = elem.getBoundingClientRect();
        var body = document.body;
        var docEl = document.documentElement;
        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var clientTop = docEl.clientTop || body.clientTop || 0;
        var top = box.top + scrollTop - clientTop;
        const navProperty = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--nav-height");
        const navHeight = +navProperty.split("p")[0];
        return Math.round(top - navHeight);
      }
    };

    const refreshGallery = function () {
      const elementsToRefresh = appendGallery.value;
      for (let i = 0; i < elementsToRefresh.length / gallaryColNum.value; i++) {
        const row = elementsToRefresh.slice(
          i * gallaryColNum.value,
          i * gallaryColNum.value + gallaryColNum.value
        );
        countImages.value += row.length;
        while (row.length < gallaryColNum.value) {
          row.push({ isDummy: true });
        }
        rowArray.value.push(row);
      }
    };

    const scroll = async function (y) {
      setTimeout(() => {
        document.querySelector("body").scrollTo({ top: y, behavior: "smooth" });
      }, 100);
    };

    //////////////////////////////////////////////////////////////////////////////////////////////// Watch window

    const getWidth = function () {
      windowWidth.value = document.documentElement.clientWidth;
    };
    const windowWidth = ref(window.innerWidth);
    window.addEventListener("resize", getWidth);
    watch(windowWidth, () => {
      setGalleryCols("fetch");
      // fetchGallery();
    });
    const setGalleryCols = (f) => {
      if (windowWidth.value < 576 && gallaryColNum.value !== 2) {
        gallaryColNum.value = 2;
        fetchParams.pageNumber = 1;
        rowArray.value = [];
        if (f === "fetch") fetchGallery();
      } else if (
        windowWidth.value < 992 &&
        windowWidth.value >= 576 &&
        gallaryColNum.value !== 4
      ) {
        gallaryColNum.value = 4;
        fetchParams.pageNumber = 1;
        rowArray.value = [];
        if (f === "fetch") fetchGallery();
      } else if (windowWidth.value >= 992 && gallaryColNum.value !== 5) {
        gallaryColNum.value = 5;
        fetchParams.pageNumber = 1;
        rowArray.value = [];
        if (f === "fetch") fetchGallery();
      } else if (!gallaryColNum.value) {
        gallaryColNum.value = 5;
        if (f === "fetch") fetchGallery();
      }
    };

    //////////////////////////////////////////////////////////////////////////////////////////////// Gallery swap

    const swapRight = (id) => {
      const currId = +id.substring(id.indexOf("item") + 4);

      let nextElId;

      rowArray.value.forEach((row, rowIndex) => {
        row.forEach((item, index) => {
          if (item.id == currId) {
            if (row[index + 1]) {
              nextElId = row[index + 1].id;
            } else if (rowArray.value[rowIndex + 1]) {
              nextElId = rowArray.value[rowIndex + 1][0].id;
            }
          }
        });
      });
      if (!nextElId) return;
      swapGallery(currId, nextElId);
    };
    const swapLeft = (id) => {
      const currId = +id.substring(id.indexOf("item") + 4);

      let nextElId;

      rowArray.value.forEach((row, rowIndex) => {
        row.forEach((item, index) => {
          if (item.id == currId) {
            if (row[index - 1]) {
              nextElId = row[index - 1].id;
            } else if (rowIndex > 0) {
              nextElId = rowArray.value[rowIndex - 1][row.length - 1].id;
            }
          }
        });
      });
      if (!nextElId) return;
      swapGallery(currId, nextElId);
    };
    const swapGallery = async (currId, idToSwap) => {
      try {
        await store.dispatch("gallery/swapGallery", `${currId}/${idToSwap}`);
      } catch (err) {
        store.dispatch("modal/setModalTitle", "Błąd!");
        store.dispatch("modal/setModalFeedback", err.message);
      }
      fetchParams.pageNumber = 1;
      rowArray.value = [];
      fetchGallery();
    };
    //////////////////////////////////////////////////////////////////////////////////////////////// Init
    const firstMount = ref(true);
    const scrollPosition = ref(null);
    const forceSlide = ref(0);
    const reset = ref(0);

    onUnmounted(() => {
      store.dispatch("gallery/setAnimationDelay", 0);
    });
    onActivated(() => {
      if (holdUrl.value) router.replace(holdUrl.value);
      if (!firstMount.value && !store.getters["gallery/getScrollOnReturn"]) {
        setGalleryCols();
        scroll(scrollPosition.value);
        if (areParams.value) forceSlide.value++;
      } else {
        scroll(0);
        store.dispatch("gallery/setScrollOnReturn", false);
      }

      if (store.getters["gallery/getForceFetch"]) {
        reset.value++;
        store.dispatch("gallery/setForceFetch", false);
        fetchParams.pageNumber = 1;
        fetchParams.searchPhrase = null;
        fetchParams.sortDirection = "DESC";
        fetchParams.sortBy = "Id";
        rowArray.value = [];
        fetchGallery();
      }
    });
    const passUrl = ref(null);
    const holdUrl = ref(null);

    onMounted(() => {
      setGalleryCols();

      const paramUrl = route.fullPath;
      holdUrl.value = route.fullPath;
      let searchPhrase = null;
      let sortDirection = null;
      let sortBy = null;
      if (paramUrl.includes("sort=")) {
        if (paramUrl.includes("search=")) {
          searchPhrase = paramUrl.substring(
            paramUrl.indexOf("search=") + 7,
            paramUrl.indexOf("&sort=")
          );
        }
      } else if (paramUrl.includes("search=")) {
        searchPhrase = paramUrl.substring(paramUrl.indexOf("search=") + 7);
      }
      if (paramUrl.includes("sort=")) {
        sortBy = paramUrl.substring(
          paramUrl.indexOf("sort=") + 5,
          paramUrl.indexOf("&dir=")
        );
        sortDirection = paramUrl.substring(paramUrl.indexOf("dir=") + 4);
      }
      if (searchPhrase) fetchParams.searchPhrase = searchPhrase;
      if (sortBy) {
        (fetchParams.sortBy = sortBy),
          (fetchParams.sortDirection = sortDirection);
      }

      if (searchPhrase || sortBy) {
        passUrl.value = {
          searchPhrase,
          sortBy,
          sortDirection,
        };
      } else {
        fetchGallery();
      }
    });
    onDeactivated(() => {
      const el = document.querySelector("body");

      scrollPosition.value = el.scrollTop;
      // store.dispatch("gallery/saveUrl", 0);

      store.dispatch("gallery/setAnimationDelay", 0);

      firstMount.value = false;
    });

    return {
      isLoading,
      rowArray,
      forceSlide,
      totalPages,
      loadMore,
      fetchParams,
      passParams,
      fetchGallery,
      countImages,
      showLoadMoreBtn,
      btnOpacity,
      rowArrayComputed,
      swapRight,
      swapLeft,
      galleryItemQuery,
      imgReady,
      allImagesReadytoShow,
      reset,
      passUrl,
    };
  },
};
</script>
<style scoped>
.page-layout {
  margin: 0 1rem;
  padding-top: 0.2rem;
}
ul {
  margin: 0;
  padding: 0;
}
.spinner {
  transform: translateY(40dvh);
  transform: translateY(40vh);
}
.parent {
  display: flex;
  flex-wrap: wrap;
}

.sidebar {
  height: 100vh;
  flex: 0 1 15rem;
  background-color: chartreuse;
}
.gall {
  height: 100vh;
  background-color: brown;
  flex: 1;
}
.gallery-container {
  max-width: 2500px;
  margin: 0 auto;
}
.no-items {
  width: 100%;
  margin: 0 auto;
}
.fill-container {
  background-color: red;
  margin-bottom: 1416px;
}
.btn-anim {
  transition: all 0.3s ease-out;
}
#gContainer {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
button {
  margin: 0 0.5rem;
  align-self: stretch;
}
@media (max-width: 576px) {
  .page-layout {
    margin: 0;
  }
}
</style>
