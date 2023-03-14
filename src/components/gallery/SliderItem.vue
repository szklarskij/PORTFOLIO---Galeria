<template>
  <div class="thumbnail-wrapper" ref="thumbnail"></div>
</template>

<script>
import { API } from "../../config.js";
import { ref, computed, onMounted, inject, watch } from "vue";

export default {
  props: { itemId: { type: Number }, thumbUrl: { type: String } },
  setup(props) {
    const currentId = inject("currentId");
    watch(currentId, () => {
      handleCurrentThumb();
    });
    const thumb = ref(props.item);
    const thumbnail = ref(null);
    const handleCurrentThumb = () => {
      thumbnail.value.classList.remove("thumb-activated");

      if (props.itemId === currentId.value.id) {
        thumbnail.value.classList.add("thumb-activated");
      }
    };

    onMounted(() => {
      thumbnail.value.style.backgroundImage = `url(${API}${props.thumbUrl})`;

      handleCurrentThumb();
    });

    const apiComputed = computed(function () {
      return API;
    });

    return {
      apiComputed,
      thumb,
      thumbnail,
      currentId,
    };
  },
};
</script>
<style scoped>
.thumbnail-wrapper {
  height: 6.2rem;
  width: 6.2rem;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  transition: all 0.3s ease-out;
  margin: 1rem 0;
}

.thumb-activated {
  box-shadow: 0px 0px 0px 4px rgba(255, 255, 255, 0.432) inset;
  -webkit-box-shadow: 0px 0px 0px 4px rgba(255, 255, 255, 0.432) inset;
  -moz-box-shadow: 0px 0px 0px 4px rgba(255, 255, 255, 0.432) inset;
  transform: scale(0.87);
}
@media (max-width: 992px) {
  .thumbnail-wrapper {
    height: 5.2rem;
    width: 5.2rem;
  }
}
@media (max-width: 576px) {
  .thumbnail-wrapper {
    height: 4rem;
    width: 4rem;
  }
}
</style>
