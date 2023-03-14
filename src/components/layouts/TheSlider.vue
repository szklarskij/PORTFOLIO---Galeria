<template>
  <div class="slider-wrap" id="slider-wrap">
    <Carousel
      v-if="thumbArray.length > 0"
      id="thumbnails"
      :settings="settings"
      ref="carousel"
      v-model="currentSlide"
      :breakpoints="breakpoints"
    >
      <Slide v-for="slide in thumbArray" :key="slide.id">
        <div class="" @click="fetchNextSlide(slide.id)">
          <slider-item :itemId="slide.id" :thumbUrl="slide.thumbImageUrl" />
        </div>
      </Slide>
    </Carousel>
    <i v-if="!mobileView" class="bi bi-x fs-3" @click="emitSlide"></i>
  </div>
</template>

<script>
import "vue3-carousel/dist/carousel.css";

import { Carousel, Slide } from "vue3-carousel";

import SliderItem from "../gallery/SliderItem.vue";
import { useStore } from "vuex";

import { ref, computed, watch, inject } from "vue";
export default {
  name: "GallerySlider",
  components: {
    Carousel,
    Slide,
    SliderItem,
  },
  props: { currentId: { type: Number }, arrowClicked: { type: String } },

  setup(props, context) {
    const store = useStore();
    const settings = ref({
      itemsToShow: 7,
      snapAlign: "center",
    });
    const emitSlide = () => {
      context.emit("emitSlide");
    };
    const mobileView = inject("mobile-view");
    const thumbArray = computed(() => {
      return store.getters["gallery/getThumbnailArray"];
    });
    const carousel = ref(null);

    const currentId = inject("currentId");
    watch([currentId], () => {
      if (!carousel.value) return;
      let goTo = 0;
      if (!thumbArray.value || thumbArray.value.length === 0) return;
      carousel.value.updateSlideWidth();
      carousel.value.updateBreakpointsConfigs();

      thumbArray.value.forEach((thumb, index) => {
        if (thumb.id === currentId.value.id) {
          goTo = index;
        }
      });
      currentSlide.value = goTo;
    });

    watch(carousel, () => {
      carousel.value.updateBreakpointsConfigs();
      carousel.value.updateSlidesData();

      thumbArray.value.forEach((thumb, index) => {
        if (thumb.id === currentId.value.id) {
          currentSlide.value = index;
        }
      });
      fetchNextSlide(currentId.value.id);
    });

    const breakpoints = ref({
      0: {
        itemsToShow: 3,
        snapAlign: "center-odd",
      },
      630: {
        itemsToShow: 4,
        snapAlign: "center-even",
      },
      768: {
        itemsToShow: 6,
        snapAlign: "center-even",
      },
      992: {
        itemsToShow: 7,
        snapAlign: "center-odd",
      },
    });
    const currId = ref(props.currentId);

    const slide = ref(0);
    const isCarouselReady = computed(() => {
      if (carousel.value) {
        if (carousel.value.data.slideWidth.value !== 0) {
          return carousel.value.data.slideWidth.value;
        } else return null;
      } else return null;
    });

    const screenWidth = inject("screen-width");

    const offset = () => {
      if (!carousel.value) return;
      let itemsOnPage = thumbArray.value.length;
      if (carousel.value.data.config.itemsToShow < itemsOnPage) {
        itemsOnPage = carousel.value.data.config.itemsToShow;
        document
          .querySelector(".carousel__track")
          .classList.remove("track-fix");
      } else {
        document.querySelector(".carousel__track").classList.add("track-fix");
      }
      if (carousel.value) carousel.value.updateSlideWidth();
      setTimeout(() => {
        if (carousel.value) carousel.value.updateSlideWidth();
      }, 200);
    };

    watch([isCarouselReady, screenWidth], () => {
      offset();
    });

    // const arrowClick = ref(props.arrowClicked);

    // watch(arrowClick, () => {});

    const fetchNextSlide = (id) => {
      context.emit("fetchNextSlide", id);
    };
    const currentSlide = ref(0);
    // const currentSlide = computed(() => {
    //   if (!carousel.value || thumbArray.value.length === 0) return 0;
    //   let slideIndex = 0;
    //   thumbArray.value.forEach((thumb, index) => {
    //     if (thumb.id === currentId.value.id) {
    //       slideIndex = index;
    //     }
    //   });
    //   return slideIndex;
    // });

    const slideTo = (val) => {
      currentSlide.value = val;
    };

    return {
      thumbArray,
      slideTo,
      currentSlide,
      carousel,
      slide,
      settings,
      emitSlide,
      currId,
      fetchNextSlide,
      breakpoints,
      mobileView,
    };
  },
};
</script>

<style scoped>
.bi-x {
  transition: all 0.3s ease;
  cursor: pointer;
  top: 0rem;
  right: -1.7rem;
  position: absolute;
}

.slider-wrap {
  /* display: flex; */
  /* position: absolute; */
  /* left: 50%; */
  /* transform: translateX(-50%); */
  /* margin-left: var(--slider-margin); */
  /* margin: 0 auto; */
  position: absolute;
  align-self: center;

  width: 50rem;
  transition: all 0.3s ease;
  /* align-self: center; */
  /* display: flex; */
}
@media (max-width: 992px) {
  .slider-wrap {
    width: 40rem;
    position: unset;
    transform: none;

    /* align-self: center; */
  }
}
@media (max-width: 768px) {
  .slider-wrap {
    width: 26rem;
    /* align-self: center; */
  }
  @media (max-width: 576px) {
    .slider-wrap {
      width: 15rem;
      /* align-self: center; */
    }
  }
}
</style>
<style>
.track-fix {
  transform: none !important;
  justify-content: center;
}
</style>
