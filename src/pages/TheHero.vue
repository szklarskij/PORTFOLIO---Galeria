<template>
  <main
    class="d-flex align-items-center justify-content-center position-relative"
  >
    <div class="translate hero-wrapper">
      <img
        src="./../assets/ambasada_kultury.webp"
        width="40"
        height="40"
        alt="logo"
        class="mb-4"
      />
      <h1 class="text-primary">Spichlerz Form i Kształtów</h1>
      <h2 class="text-secondary fs-4 mb-4">Tadeusz Szklarski</h2>
      <router-link class="text-secondary fs-4" to="/galeria">Wejdź</router-link>
    </div>
    <div v-if="!mobileView">
      <div class="rectangle rectangle-1">
        <img
          src="./../assets/rectangle1.webp"
          width="534"
          height="822"
          alt="rectangle"
          @load="load++"
          class="d-none"
        />
      </div>
      <div class="rectangle rectangle-2">
        <img
          src="./../assets/rectangle2.webp"
          width="534"
          height="822"
          alt="rectangle"
          @load="load++"
          class="d-none"
        />
      </div>
      <div class="rectangle rectangle-3">
        <img
          src="./../assets/rectangle3.webp"
          width="534"
          height="822"
          alt="rectangle"
          @load="load++"
          class="d-none"
        />
      </div>
      <div class="rectangle rectangle-4">
        <img
          src="./../assets/rectangle4.webp"
          width="534"
          height="822"
          alt="rectangle"
          @load="load++"
          class="d-none"
        />
      </div>
      <div class="rectangle rectangle-5">
        <img
          src="./../assets/rectangle5.webp"
          width="534"
          height="822"
          alt="rectangle"
          @load="load++"
          class="d-none"
        />
      </div>
      <div class="rectangle rectangle-6">
        <img
          src="./../assets/rectangle6.webp"
          width="534"
          height="822"
          alt="rectangle"
          @load="load++"
          class="d-none"
        />
      </div>
    </div>
    <div v-else>
      <div
        class="rectangle rectangle-1"
        :class="{ 'rectangle-mobile': mobileView }"
      >
        <img
          src="./../assets/rectangle1.webp"
          width="534"
          height="822"
          alt="rectangle"
          @load="load++"
          class="d-none"
        />
      </div>
      <div
        class="rectangle rectangle-2-mobile"
        :class="{ 'rectangle-mobile': mobileView }"
      >
        <img
          src="./../assets/rectangle2.webp"
          width="534"
          height="822"
          alt="rectangle"
          @load="load++"
          class="d-none"
        />
      </div>
      <div
        class="rectangle rectangle-3-mobile"
        :class="{ 'rectangle-mobile': mobileView }"
      >
        <img
          src="./../assets/rectangle3.webp"
          width="534"
          height="822"
          alt="rectangle"
          @load="load++"
          class="d-none"
        />
      </div>
      <div
        class="rectangle rectangle-4-mobile"
        :class="{ 'rectangle-mobile': mobileView }"
      >
        <img
          src="./../assets/rectangle4.webp"
          width="534"
          height="822"
          alt="rectangle"
          @load="load++"
          class="d-none"
        />
      </div>
    </div>
  </main>
</template>
<script>
import { onMounted, inject, ref, watch } from "vue";
import { randomIntFromInterval } from "../helpers.js";

export default {
  setup() {
    const mobileView = inject("mobile-view");

    onMounted(() => {
      document.querySelector("body").scrollTo(0, 0);
    });

    const load = ref(0);
    watch(load, () => {
      if (
        (load.value === 6 && !mobileView) ||
        (load.value === 4 && mobileView)
      ) {
        heroAnimation();
      }
    });
    const heroAnimation = () => {
      const heightArray = ["1", "2", "3", "4", "5", "6"];
      const rectangles = document.querySelectorAll(".rectangle");

      rectangles.forEach((rect) => {
        const randomNum = randomIntFromInterval(0.5, 1).toFixed(2);
        rect.style.transition = `${randomNum}s all ease`;
        rect.style.opacity = 1;

        const val = heightArray[Math.floor(Math.random() * heightArray.length)];
        heightArray.forEach((e, index) => {
          if (e === val) heightArray.splice(index, 1);
          rect.classList.add(`heigh-4`);
        });
      });
    };
    return { mobileView, load };
  },
};
</script>
<style scoped>
h1 {
  word-spacing: 0.35rem;
}
main {
  overflow: hidden;
}

.heigh-1 {
  transform: translateY(-13vh);
}
.heigh-2 {
  transform: translateY(-15vh);
}
.heigh-3 {
  transform: translateY(-17vh);
}
.heigh-4 {
  transform: translateY(-19vh);
}
.heigh-5 {
  transform: translateY(-21vh);
}
.heigh-6 {
  transform: translateY(-23vh);
}

.hero-wrapper {
  overflow: hidden;
}
h4 {
  margin-bottom: 3rem;
}
.btn {
  padding: 0.2rem 1.5rem;
}
.rectangle {
  /* border: 1px solid rgb(0, 0, 0); */
  position: absolute;
  opacity: 0;
  top: 100%;
  height: 50rem;
  background-size: contain;
  width: 16.66%;
  filter: blur(0.5px);
}
.rectangle-mobile {
  top: 109%;
  width: 25%;
  background-size: contain;
}
.rectangle-1 {
  left: 0;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.3)
    ),
    url("../assets/rectangle1.webp");
  background-size: contain;
}

.rectangle-2 {
  left: 16.66%;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.3)
    ),
    url("../assets/rectangle2.webp");
  background-size: contain;
}
.rectangle-2-mobile {
  left: 25%;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.3)
    ),
    url("../assets/rectangle2.webp");
  background-size: contain;
}
.rectangle-3 {
  left: 33.33%;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.3)
    ),
    url("../assets/rectangle3.webp");
  background-size: contain;
}
.rectangle-3-mobile {
  left: 50%;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.3)
    ),
    url("../assets/rectangle4.webp");
  background-size: contain;
}
.rectangle-4 {
  left: 50%;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.3)
    ),
    url("../assets/rectangle4.webp");
  background-size: contain;
}
.rectangle-4-mobile {
  left: 75%;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.3)
    ),
    url("../assets/rectangle4.webp");
  background-size: contain;
}
.rectangle-5 {
  left: 66.66%;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.3)
    ),
    url("../assets/rectangle5.webp");
  background-size: contain;
}
.rectangle-6 {
  left: 83.33%;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.3)
    ),
    url("../assets/rectangle6.webp");
  background-size: contain;
}
</style>
