<template>
  <div class="container-fluid d-flex align-items-center justify-content-center">
    <main class="translate">
      <h2>Kontakt</h2>
      <p>Tadeusz Szklarski</p>
      E-mail:
      <a class="text-secondary" href="mailto:tadeusztensam@gmail.com"
        >tadeusztensam@gmail.com</a
      >
      <br />
      Telefon:
      <a class="text-secondary" href="tel:510371052">510371052</a>
      <br />
      <a class="text-secondary fs-1" href="https://www.facebook.com/Tadeusz.eS"
        ><i class="bi bi-facebook"></i
      ></a>
    </main>
  </div>
</template>

<script>
import { onMounted } from "vue";
export default {
  setup() {
    onMounted(() => {
      document.querySelector("body").scrollTo(0, 0);
    });
  },
};
</script>
<style scoped>
h2 {
  margin-bottom: 2rem;
}
</style>
