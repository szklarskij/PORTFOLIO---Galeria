<template>
  <transition name="modal">
    <div
      v-if="content"
      class="modal d-block"
      id="modal"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" :class="titleColor" id="modalLabel">
              {{ title }}
            </h5>
          </div>
          <div class="modal-body">{{ content }}</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="tryClose">
              Zamknij
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <transition name="backdrop">
    <div v-if="content" @click="tryClose" class="backdrop"></div>
  </transition>
</template>

<script>
import { computed } from "vue";
export default {
  props: {
    content: {
      required: true,
    },
    title: {
      required: true,
    },
  },
  emits: ["handle"],

  setup(props, context) {
    const titleColor = computed(() => {
      if (props.title === "Błąd!") {
        return "text-danger";
      } else if (props.title === "Sukces!") {
        return "text-success";
      } else return "";
    });

    const tryClose = () => {
      context.emit("handle");
    };
    return { tryClose, titleColor };
  },
};
</script>
<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 10;
}

.modal-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}
.modal-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.modal-enter-active {
  transition: all 0.3s ease-out;
}
.modal-leave-active {
  transition: all 0.3s ease-in;
}
.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}
</style>
