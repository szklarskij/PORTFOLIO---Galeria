<template>
  <section class="page-layout mb-3">
    <div id="main-container">
      <div v-if="!imgSrc" class="no-image"></div>
      <img v-else :src="imgSrc" class="mainimg" />

      <edit-panel :editMode="false" @imgPreview="setPic"></edit-panel>
    </div>
  </section>
</template>

<script>
import EditPanel from "../../components/gallery/EditPanel.vue";
import { ref, onMounted } from "vue";
export default {
  components: {
    EditPanel,
  },
  setup() {
    onMounted(() => {
      document.querySelector("body").scrollTo(0, 0);
    });

    const imgSrc = ref(null);

    const setPic = function (url) {
      imgSrc.value = url;
    };
    return {
      setPic,
      imgSrc,
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
.no-image {
  height: 100%;
  width: 40rem;
  background-color: #eee;
  display: flex;
  box-shadow: inset 0px 0px 0px 5px #eee, inset 0px 0px 0px 20px #ffffff;
  -webkit-box-shadow: inset 0px 0px 0px 5px #eee, inset 0px 0px 0px 20px #ffffff;
}
#main-container {
  display: flex;
  justify-content: center;

  margin: 0 auto;

  padding: 0 1rem;
  gap: 1.5rem;
}
.mainimg {
  z-index: 3;
  filter: none !important;
  max-height: calc(100vh - 1rem - var(--nav-height));
  height: calc(100dvh - 1rem - var(--nav-height));
}
@media (max-width: 992px) {
  .no-image {
    display: none;
  }
  .page-layout {
    height: unset;
    width: 100%;
    margin: 0 auto;
    overflow-y: unset !important;
    flex-direction: column;
  }
  #main-container {
    max-height: none;
    height: unset;
    flex-direction: column;
    height: unset;
    gap: 0.5rem;
  }
  .img-descrip {
    min-width: unset;
  }
}
@media (min-width: 992px) {
  .container {
    max-width: 1600px;
  }
}
</style>
