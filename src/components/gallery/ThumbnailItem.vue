<template>
  <li class="item" ref="imgDom" :class="{ hidden: !allImagesReady }">
    <img
      v-if="!isDummyImg"
      class="smallIMG"
      :src="smallImg"
      :alt="title"
      :id="id"
      @click="goToImage"
      @load="setImageReady"
    />

    <img v-else class="dummy" alt="whitespace" src="../../assets/dummy.webp" />
    <div
      v-if="isAdminLogged && isSorted === 'Id' && !isDummyImg"
      class="left-arrow-container"
      @click="swapLeft"
    >
      <i class="bi bi-arrow-left text-white fs-3 bg-success"></i>
    </div>
    <div
      v-if="isAdminLogged && isSorted === 'Id' && !isDummyImg"
      class="right-arrow-container"
      @click="swapRight"
    >
      <i class="bi bi-arrow-right text-white fs-3 bg-success"></i>
    </div>
  </li>
</template>
<script>
import { API } from "../../config.js";
import { ref, onMounted, computed, watch } from "vue";

import gsap from "gsap";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  props: [
    "id",
    "smallImgUrl",
    "title",
    "isDummy",
    "totalImgs",
    "sortBy",
    "itemQuery",
    "allImagesReadytoShow",
  ],
  emits: ["animationFinished", "swapRight", "swapLeft", "imgReady"],

  setup(props, context) {
    //////////////////////////////////////////////////////////////////////////////////////////////// Setup
    const router = useRouter();

    const store = useStore();
    const isAdminLogged = computed(function () {
      return store.getters["login/isAdminLogged"];
    });
    const isSorted = ref(props.sortBy);
    const thumbUrl = ref(null);
    const thisImageFullyLoaded = ref(false);

    const allImagesReady = computed(() => {
      return props.allImagesReadytoShow;
    });

    watch(allImagesReady, () => {
      if (!thisImageFullyLoaded.value && !isDummyImg.value) {
        doAnimation();
      }
      thisImageFullyLoaded.value = true;
    });

    const imgDom = ref(null);
    const isDummyImg = ref(props.isDummy);
    const imgReady = ref(false);
    const smallImg = ref(API + props.smallImgUrl);
    //////////////////////////////////////////////////////////////////////////////////////////////// Animation
    function doAnimation() {
      const totalItems = props.totalImgs;
      store.dispatch("gallery/countAnimation");
      const countedItems = store.getters["gallery/getAnimationCount"];
      const delay = store.getters["gallery/getAnimationDelay"];
      const el = imgDom.value;

      gsap.fromTo(
        el,
        {
          opacity: 0,
          scale: 1.05,
        },
        {
          opacity: 1,
          scale: 1,
          delay: isAdminLogged.value ? 0 : delay / 30,
          onComplete() {
            if (countedItems === totalItems) {
              context.emit("animationFinished");
            }
          },
        }
      );

      const addDelay = delay + 1;
      store.dispatch("gallery/setAnimationDelay", addDelay);
      if (countedItems >= totalItems) {
        store.dispatch("gallery/setAnimationDelay", 0);
      }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////// Control

    const goToImage = async () => {
      try {
        await store.dispatch("gallery/fetchThumbnails");
        const currId = props.id.substring(props.id.indexOf("item") + 4);
        router.push("/galeria/" + currId);
      } catch (err) {
        store.dispatch("modal/setModalTitle", "Błąd!");
        store.dispatch("modal/setModalFeedback", err.message);
      }
    };
    const setImageReady = () => {
      imgReady.value = true;
      context.emit("imgReady");
    };
    onMounted(() => {
      imgDom.value.style.opacity = 0;
      if (isDummyImg.value) return;
      const img = document.getElementById(props.id);
      if (!img) return;
      img.onload = function () {};
    });
    const swapLeft = function () {
      context.emit("swapLeft", props.id);
    };
    const swapRight = function () {
      context.emit("swapRight", props.id);
    };
    return {
      smallImg,
      imgReady,
      isDummyImg,
      imgDom,
      isAdminLogged,
      swapLeft,
      swapRight,
      isSorted,
      goToImage,
      thumbUrl,
      setImageReady,
      allImagesReady,
    };
  },
};
</script>
<style scoped>
img {
  /* height: min-content; */
  width: 100%;
  height: 100%;

  /* object-fit: contain; */
  /* object-position: center; */
  transition: all 0.5s ease-out;
  max-height: 500px;
}
.item {
  flex-grow: 1;
  margin: 0 0.5rem 1rem;
  transition: all 0.5s ease-out;
}
.smallIMG {
  -webkit-box-shadow: 18px 18px 20px -18px rgba(136, 136, 136, 1);
  -moz-box-shadow: 18px 18px 20px -18px rgba(136, 136, 136, 1);
  box-shadow: 18px 18px 20px -18px rgba(136, 136, 136, 1);
  transition: all 0.5s ease;
  /* max-height: 300px; */
}
.smallIMG:hover {
  cursor: pointer;
  transform: scale(1.02);
  transition: all 0.5s ease-out;
}
.dummy {
  opacity: 0;
}
.left-arrow-container {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
}
.right-arrow-container {
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translate(-100%, -50%);
}
.left-arrow-container:hover,
.right-arrow-container {
  cursor: pointer;
}
</style>
