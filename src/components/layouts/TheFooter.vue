<template>
  <footer
    v-if="!footerHidden"
    class="d-flex flex-column flex-md-row align-items-center justify-content-center gap-1 gap-md-2 text-primary"
  >
    <p>Spichlerz Form i Kształtów 2023</p>
    <p class="d-none d-md-block">|</p>
    <p>
      Autor:
      <a class="text-secondary" href="mailto:tadeusztensam@gmail.com"
        >Tadeusz Szklarski</a
      >
    </p>
    <p class="d-none d-md-block">|</p>
    <p>
      Stronę wykonał:

      <a class="text-secondary" href="mailto:jakubszklarski1@gmail.com"
        >Jakub Szklarski</a
      >
    </p>
  </footer>
</template>

<script>
import { computed } from "vue";
export default {
  props: ["hideFooter"],
  setup(props) {
    const footerHidden = computed(() => {
      return props.hideFooter;
    });
    return { footerHidden };
  },
};
</script>

<style scoped>
footer {
  padding: 1rem 0;
  background-color: rgb(245, 245, 245);
}
@media (max-width: 992px) {
  p {
    font-size: 0.8rem;
  }
}
</style>
