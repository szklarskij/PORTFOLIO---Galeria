<template>
  <base-spinner v-if="isLoading"></base-spinner>

  <div v-else class="container-fluid">
    <form @submit.prevent="sumbitLogin">
      <label for="password">Hasło: </label>
      <input
        id="password"
        type="password"
        v-model.trim="password"
        autocomplete="on"
      />
      <button
        type="submit"
        class="btn btn-primary"
        :class="isEmptyPassword ? 'no' : 'disabled'"
      >
        Zaloguj
      </button>
    </form>
  </div>
</template>
<script>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { setNav } from "../../helpers.js";

export default {
  setup() {
    //////////////////////////////////////////////////////////////////////////////////////////////// Setup

    onMounted(() => {
      document.querySelector("body").scrollTo(0, 0);
    });
    const store = useStore();
    const router = useRouter();
    const isLoading = ref(false);

    //////////////////////////////////////////////////////////////////////////////////////////////// Fetch login

    const password = ref("");
    const isEmptyPassword = computed(() => {
      return password.value;
    });

    const sumbitLogin = async function () {
      if (password.value === "") return;
      isLoading.value = true;

      try {
        await store.dispatch("login/adminLogin", password.value);
        store.dispatch("modal/setModalTitle", "Sukces!");
        store.dispatch(
          "modal/setModalFeedback",
          "Administrator pomyślnie zalogowany."
        );

        setNav();

        router.replace("/");
      } catch (err) {
        password.value = "";
        store.dispatch("modal/setModalFeedback", err.message);
        store.dispatch("modal/setModalTitle", "Błąd!");
      }
      isLoading.value = false;
    };

    return { password, sumbitLogin, isEmptyPassword, isLoading };
  },
};
</script>
<style scoped>
* {
  margin: 0.5rem;
}
</style>
