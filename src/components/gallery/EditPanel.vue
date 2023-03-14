<template>
  <form class="edit-form">
    <div class="form-group">
      <label for="title" class="form-label"
        >Duży format - wysokość 1000px (niewymagany w razie edycji)
      </label>

      <input
        class="form-control"
        id="file"
        type="file"
        accept=".webp"
        @change="imageBrowsed"
        ref="inputFile"
        @blur="clearError"
      />
      <label for="title2" class="form-label"
        >Mały format - wysokość: 300px (niewymagany w razie edycji)
      </label>

      <input
        class="form-control"
        id="file2"
        type="file"
        accept=".webp"
        @change="imageBrowsed2"
        ref="inputFile2"
        @blur="clearError"
      />
      <label for="title3" class="form-label"
        >Miniaturka wyskość: 96px (niewymagany w razie edycji)
      </label>

      <input
        class="form-control"
        id="file3"
        type="file"
        accept=".webp"
        @change="imageBrowsed3"
        ref="inputFile3"
        @blur="clearError"
      />
    </div>
    <div class="form-group">
      <label for="title width-100" class="form-label"
        >Tytuł (wymagane, max 30 znaków)</label
      >
      <input
        class="form-control"
        id="title"
        type="text"
        ref="inputTitle"
        required
        @blur="clearError"
      />
    </div>
    <div class="form-group">
      <label for="text" class="form-label">Tekst </label>
      <textarea
        class="form-control"
        id="text"
        name="text"
        rows="4"
        ref="inputText"
      />
    </div>
    <div class="form-group">
      <label for="date" class="form-label">Data wykonania (wymagane)</label>
      <input
        class="form-control"
        id="date"
        type="date"
        ref="inputDate"
        required
        @blur="clearError"
      />
    </div>
    <div class="form-group">
      <label for="size" class="form-label">Wymiary</label>
      <div class="d-flex gap-1 align-items-center">
        <input
          class="form-control"
          id="size"
          type="number"
          ref="inputXDimension"
          min="1"
          @blur="clearError"
        />
        <p class="text-nowrap">cm na</p>
        <input
          class="form-control"
          id="size2"
          type="number"
          ref="inputYDimension"
          min="1"
          @blur="clearError"
        />cm
      </div>
    </div>
    <div class="form-group">
      <label for="technique" class="form-label">Technika</label>
      <input
        class="form-control"
        id="technique"
        type="text"
        ref="inputTechnique"
        @blur="clearError"
      />
    </div>

    <div class="form-group">
      <label for="price" class="form-label">Cena</label>
      <div class="d-flex gap-1 align-items-center">
        <input
          class="form-control"
          id="price"
          type="number"
          ref="inputPrice"
          min="1"
          @blur="clearError"
        />
        <p>zł</p>
      </div>
    </div>

    <div class="form-group">
      <label for="tag" class="form-label">Tagi (po przecinku)</label>
      <input
        class="form-control"
        id="tag"
        type="text"
        ref="inputTag"
        @blur="clearError"
      />
    </div>
    <div class="form-group">
      <div class="d-flex gap-1 align-items-center">
        <button
          v-if="editMod"
          @click.prevent="cancel"
          class="btn btn-outline-primary"
        >
          Anuluj
        </button>

        <button
          @click.prevent="save"
          class="btn btn-primary"
          :disabled="isLoading"
        >
          <p v-if="!isLoading">
            {{ editMod ? "Zapisz zmiany" : "Wgraj obraz" }}
          </p>
          <base-spinner v-else class=""></base-spinner>
        </button>
      </div>
    </div>
  </form>
</template>
<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  name: "upload-panel",
  props: ["currImg", "editMode", "imgId"],
  emits: ["cancel", "save", "imgPreview"],

  setup(props, context) {
    const isLoading = ref(false);
    const store = useStore();
    const inputTitle = ref(null);
    const inputText = ref(null);
    const inputXDimension = ref(null);
    const inputYDimension = ref(null);
    const inputPrice = ref(null);
    const inputTag = ref(null);
    const inputTechnique = ref(null);
    const inputDate = ref(null);
    const inputFile = ref(null);
    const inputFile2 = ref(null);
    const inputFile3 = ref(null);

    const editMod = ref(props.editMode);

    const cancel = function () {
      context.emit("cancel");
    };
    const currentImage = ref(props.currImg);
    onMounted(() => {
      setFields();
    });
    const setFields = function () {
      if (!editMod.value) return;
      if (currentImage.value.technique)
        inputTechnique.value.value = currentImage.value.technique;
      if (currentImage.value.title)
        inputTitle.value.value = currentImage.value.title;
      if (currentImage.value.text)
        inputText.value.value = currentImage.value.text;
      if (currentImage.value.size)
        inputXDimension.value.value = formatXDimension.value;
      inputYDimension.value.value = formatYDimension.value;
      if (currentImage.value.dateOfWork)
        inputDate.value.value = formatDate.value;
      if (currentImage.value.price)
        inputPrice.value.value = currentImage.value.price;
      if (currentImage.value.tag) inputTag.value.value = currentImage.value.tag;
    };

    const formatDate = computed(() => {
      const date = currentImage.value?.dateOfWork;
      if (!date) return "";
      return date.split("T")[0];
    });
    const formatXDimension = computed(() => {
      const size = currentImage.value?.size;
      if (!size) return "";
      const x = size.split(" x ")[0];
      return x;
    });
    const formatYDimension = computed(() => {
      const size = currentImage.value?.size;
      if (!size) return "";
      const y = size.split(" x ")[1].split(" cm")[0];
      return y;
    });

    const imageBrowsed = (e) => {
      const files = e.target.files;
      var fr = new FileReader();
      fr.onload = function () {
        const imgUrl = fr.result;

        context.emit("imgPreview", imgUrl);
      };
      fr.readAsDataURL(files[0]);
    };

    const validate = () => {
      let validateOk = true;

      const ignoreFile = props.editMode;

      if (!ignoreFile && inputFile.value.value.length === 0) {
        inputFile.value.classList.add("is-invalid");
        validateOk = false;
      }
      if (!ignoreFile && inputFile2.value.value.length === 0) {
        inputFile2.value.classList.add("is-invalid");
        validateOk = false;
      }
      if (!ignoreFile && inputFile3.value.value.length === 0) {
        inputFile3.value.classList.add("is-invalid");
        validateOk = false;
      }
      if (editMod.value) {
        if (
          inputFile.value.value.length === 0 &&
          inputFile2.value.value.length === 0 &&
          inputFile3.value.value.length === 0
        ) {
          validateOk = true;
        } else {
          // if (
          //   (ignoreFile &&
          //     (inputFile.value.value.length !== 0 ||
          //       inputFile2.value.value.length !== 0 ||
          //       inputFile3.value.value.length !== 0) &&
          //     inputFile.value.value.length === 0) ||
          //   inputFile2.value.value.length === 0 ||
          //   inputFile3.value.value.length === 0
          // )
          {
            if (inputFile.value.value.length === 0) {
              validateOk = false;
              inputFile.value.classList.add("is-invalid");
            }
            if (inputFile2.value.value.length === 0) {
              validateOk = false;
              inputFile2.value.classList.add("is-invalid");
            }
            if (inputFile3.value.value.length === 0) {
              inputFile3.value.classList.add("is-invalid");
              validateOk = false;
            }
          }
        }
      }
      if (
        ignoreFile &&
        inputFile.value.value.length !== 0 &&
        inputFile2.value.value.length === 0
      ) {
        inputFile2.value.classList.add("is-invalid");
        validateOk = false;
      }

      if (inputTitle.value.value.length > 30 || inputTitle.value.value === "") {
        inputTitle.value.classList.add("is-invalid");
        validateOk = false;
      }
      if (inputDate.value.value == "") {
        inputDate.value.classList.add("is-invalid");
        validateOk = false;
      }
      if (inputPrice.value.value < 0) {
        inputPrice.value.classList.add("is-invalid");
        validateOk = false;
      }
      if (
        inputXDimension.value.value < 0 ||
        (inputXDimension.value.value === "" &&
          inputYDimension.value.value !== "")
      ) {
        inputXDimension.value.classList.add("is-invalid");
        validateOk = false;
      }
      if (
        inputXDimension.value.value < 0 ||
        (inputXDimension.value.value !== "" &&
          inputYDimension.value.value === "")
      ) {
        inputYDimension.value.classList.add("is-invalid");
        validateOk = false;
      }
      const tagArray = inputTag.value.value.split(",");
      tagArray.forEach((tag) => {
        const trimmed = tag.trim();
        if (hasWhiteSpace(trimmed)) {
          validateOk = false;
          inputTag.value.classList.add("is-invalid");
        }
      });
      function hasWhiteSpace(s) {
        return /\s/.test(s);
      }

      if (validateOk) {
        return true;
      } else {
        store.dispatch("modal/setModalTitle", "Błąd!");
        store.dispatch(
          "modal/setModalFeedback",
          "Sprawdź poprawność pól formularza"
        );
      }
      return false;
    };

    const clearError = (e) => {
      e.target.classList.remove("is-invalid");
    };

    const save = async function () {
      if (!validate()) return;

      const formData = new FormData();
      const fileField = inputFile.value;
      const file2Field = inputFile2.value;
      const file3Field = inputFile3.value;

      if (fileField.files[0]) {
        formData.append("File", fileField.files[0]);
        formData.append("File2", file2Field.files[0]);
        formData.append("File3", file3Field.files[0]);
      }
      formData.append("Title", inputTitle.value.value);

      formData.append("Text", inputText.value.value);

      formData.append("DateOfWork", inputDate.value.value);
      if (
        inputXDimension.value.value !== "" &&
        !inputYDimension.value.value !== ""
      )
        formData.append(
          "Size",
          `${inputXDimension.value.value} x ${inputYDimension.value.value} cm`
        );
      formData.append(
        "SizeMultiplied",
        inputXDimension.value.value * inputYDimension.value.value
      );

      if (inputPrice.value.value === "") {
        formData.append("Price", 0);
      } else {
        formData.append("Price", inputPrice.value.value);
      }

      formData.append("Technique", inputTechnique.value.value);

      let tagArray = [];
      inputTag.value.value.split(",").forEach((el) => {
        tagArray.push(el.trim());
      });

      formData.append("Tag", tagArray);

      isLoading.value = true;
      try {
        const id = props.imgId;
        if (editMod.value) {
          await store.dispatch("gallery/fetchUpdateImage", { formData, id });
          store.dispatch("modal/setModalTitle", "Sukces!");
          store.dispatch(
            "modal/setModalFeedback",
            "Post pomyślnie zmodyfikowany."
          );
        } else {
          await store.dispatch("gallery/fetchCreateImage", { formData, id });
          store.dispatch("modal/setModalTitle", "Sukces!");
          store.dispatch("modal/setModalFeedback", "Post pomyślnie dodany.");
        }

        isLoading.value = false;
        context.emit("save");
      } catch (err) {
        store.dispatch("modal/setModalTitle", "Błąd!");
        store.dispatch("modal/setModalFeedback", err.message);
      }
      store.dispatch("gallery/setForceFetch", true);
      isLoading.value = false;
    };

    return {
      cancel,
      save,
      imageBrowsed,
      currentImage,
      formatDate,
      formatXDimension,
      formatYDimension,
      isLoading,
      inputTitle,
      inputText,
      inputXDimension,
      inputYDimension,
      inputPrice,
      inputTag,
      inputTechnique,
      inputDate,
      inputFile,
      inputFile2,
      inputFile3,
      clearError,
      editMod,
    };
  },
};
</script>

<style scoped>
.edit-form {
  height: 88dvh;
  height: 88vh;
  overflow-y: scroll;
  display: grid;
  gap: 1.25rem;
  min-width: 20rem;
}
.form-group {
  display: grid;
}
.dimensions {
  display: flex !important;
}
p {
  margin: 0;
}
input {
  width: 100%;
}
label {
  text-align: start;
}
@media (max-width: 992px) {
  .edit-form {
    width: 100%;
  }
}
</style>
