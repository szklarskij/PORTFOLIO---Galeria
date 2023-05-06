<template>
  <div class="bg-success p-2 sticky nav-admin">
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-center"
    >
      <p class="text-light d-flex m-0 fs-5">Zalogowano</p>

      <div
        class="flex-column flex-sm-row flex-md-row d-flex justify-content-end gap-1"
      >
        <button
          class="btn btn-light text-nowrap"
          @click="goToUpload(), (adminExpanded = false)"
        >
          Wgraj obraz
        </button>

        <button
          class="btn btn-outline-light text-nowrap text-nowrap"
          @click="
            changePass(),
              (adminExpanded = true),
              (showChangePass = true),
              (showConfirmDelete = false)
          "
        >
          Zmień hasło
        </button>

        <button class="btn btn-outline-light text-nowrap" @click="logout">
          Wyloguj
        </button>
        <div
          class="admin-nav-expand bg-success p-2 d-flex gap-1 align-items-center"
          v-if="adminExpanded"
        >
          <base-spinner
            class="align-items-center justify-content-center pe-1"
            v-if="isLoading"
          ></base-spinner>
          <div v-if="showChangePass">
            <form>
              <input
                id="changePass"
                type="password"
                v-model.trim="passwordQuery"
                placeholder="Minimum 6 znaków"
                v-if="!isLoading"
                autocomplete
              />
            </form>
          </div>
          <button
            form="changePass"
            class="btn btn-outline-light text-nowrap"
            @click="fetchChangePass"
            :class="isValidPassword"
            :disabled="isLoading"
            v-if="showChangePass"
          >
            Potwierdź
          </button>

          <button
            class="btn btn-outline-light text-nowrap"
            @click="
              (showChangePass = false),
                (showConfirmDelete = false),
                (adminExpanded = false)
            "
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import { setNav } from "./../../helpers";

import { useRouter } from "vue-router";

export default {
  setup() {
    //////////////////////////////////////////////////////////////////////////////////////////////// Setup
    const store = useStore();
    const isAdminLogged = computed(function () {
      return store.getters["login/isAdminLogged"];
    });
    const isLoading = ref(false);
    const router = useRouter();
    const adminExpanded = ref(false);
    const showConfirmDelete = ref(false);

    //////////////////////////////////////////////////////////////////////////////////////////////// Logout
    const logout = function () {
      store.dispatch("login/adminLogout");
      store.dispatch("modal/setModalTitle", "Info");
      store.dispatch("modal/setModalFeedback", "Administrator wylogowany.");

      setNav();
      router.push("/");
    };

    const goToUpload = () => {
      router.push("/admin/upload");
    };
    //////////////////////////////////////////////////////////////////////////////////////////////// change password

    const isValidPassword = computed(() => {
      if (isLoading.value || passwordQuery.value.length < 6) {
        return "disabled";
      } else return "";
    });

    const showChangePass = ref(false);
    const passwordQuery = ref("");
    const changePass = function () {
      showChangePass.value = true;
    };
    const fetchChangePass = async () => {
      isLoading.value = true;
      try {
        await store.dispatch("login/changePass", passwordQuery.value);
        store.dispatch("modal/setModalTitle", "Sukces!");
        store.dispatch("modal/setModalFeedback", "Pomyślnie zmieniono hasło.");
      } catch (err) {
        store.dispatch("modal/setModalTitle", "Błąd!");
        store.dispatch("modal/setModalFeedback", err.message);
      }
      isLoading.value = false;
      adminExpanded.value = false;
    };
    const fetchDeleteAll = async () => {
      isLoading.value = true;
      try {
        await store.dispatch("gallery/fetchDeleteAll");
        store.dispatch("modal/setModalTitle", "Sukces!");
        store.dispatch(
          "modal/setModalFeedback",
          "Pomyślnie wyczyszcono galerię."
        );
        store.dispatch("gallery/setForceFetch", true);
        router.push("/");
      } catch (err) {
        store.dispatch("modal/setModalTitle", "Błąd!");
        store.dispatch("modal/setModalFeedback", err.message);
      }
      isLoading.value = false;
      adminExpanded.value = false;
    };

    return {
      isAdminLogged,
      logout,
      showChangePass,
      changePass,
      fetchChangePass,
      passwordQuery,
      isValidPassword,
      isLoading,
      goToUpload,
      adminExpanded,
      showConfirmDelete,
      fetchDeleteAll,
    };
  },
};
</script>
<style scoped>
.nav-admin {
  width: 100%;
}
.admin-nav-expand {
  position: absolute;
  right: 0;
  top: 100%;
}
</style>
