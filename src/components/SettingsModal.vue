<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="open" class="modal" role="dialog">
        <div class="modal-container">
          <h1>Conway's Game of&nbsp;Life</h1>
          <p>Welcome to an interactive version of Conway's Game of&nbsp;Life.</p>
          <p>Below you can change the simulations settings:</p>
          <form>
            <div></div>
          </form>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";

type ModalModel = {
  frameTime: number;
  aliveCellChance: number;
  cellSize: number;
  cellColors: {
    dead: string;
    alive: string;
  };
};

const open = ref(true);

const model = defineModel<ModalModel>({
  required: true,
});

defineEmits(["confirm"]);
</script>

<style scoped lang="scss">
.modal {
  @apply fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 max-w-full;
  width: 550px;

  &-container {
    @apply bg-black border-4 border-white outline-4 outline-black py-6 px-4 sm:px-8 text-white;

    p {
      @apply text-xl sm:text-2xl leading-none my-2;
    }
  }
}
</style>
