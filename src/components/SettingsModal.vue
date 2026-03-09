<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="open" class="modal" role="dialog">
        <div class="modal-container">
          <h1>Conway's Game of&nbsp;Life</h1>
          <transition name="fade" mode="out-in">
            <div v-if="STEPS[step] === 'settings'">
              <p>Welcome to an interactive version of Conway's Game of&nbsp;Life.</p>
              <p>Below you can change the simulations settings:</p>
              <form ref="settingsFrom" class="space-y-4">
                <div class="grid sm:grid-cols-2 gap-4">
                  <input-component
                    id="alive-cell-chance"
                    type="number"
                    :min="1"
                    :max="100"
                    pattern="[0-9]{1,}"
                    label="Initial alive cell chance (%):"
                    required
                    placeholder=""
                    v-model.number="model.aliveCellChance"
                  />
                  <input-component
                    id="cell-size"
                    type="number"
                    :min="1"
                    pattern="[0-9]{1,}"
                    label="Cell size (px):"
                    required
                    placeholder=""
                    v-model.number="model.cellSize"
                  />
                </div>
                <div class="grid sm:grid-cols-2 gap-4">
                  <input-component
                    id="cell-alive-color"
                    type="color"
                    label="Alive cell color:"
                    required
                    placeholder=""
                    v-model="model.cellColors.alive"
                  />
                  <input-component
                    id="cell-dead-color"
                    type="color"
                    label="Dead cell color:"
                    required
                    placeholder=""
                    v-model="model.cellColors.dead"
                  />
                </div>
                <div class="grid sm:grid-cols-2 gap-4">
                  <input-component
                    id="grid-color"
                    type="color"
                    label="Grid color:"
                    required
                    placeholder=""
                    v-model="model.gridColor"
                  />
                  <input-component
                    id="frame-time"
                    type="number"
                    :min="1"
                    pattern="[0-9]{1,}"
                    label="How many FPS:"
                    required
                    placeholder=""
                    v-model.number="model.framesPerSecond"
                  />
                </div>
              </form>
            </div>
            <div v-else-if="STEPS[step] === 'controls'">
              <p>Below is a list of all the controls available to you:</p>
              <ul>
                <li>
                  "Space"
                  <ul>
                    <li>Pauses the simulation</li>
                  </ul>
                </li>
                <li>
                  "G"
                  <ul>
                    <li>Toggle grid view</li>
                  </ul>
                </li>
                <li>
                  "R"
                  <ul>
                    <li>Reset the simulation</li>
                  </ul>
                </li>
                <li>
                  "N"
                  <ul>
                    <li>Next step (work only when the simulation is paused)</li>
                  </ul>
                </li>
              </ul>
            </div>
          </transition>
          <div class="grid grid-cols-2 w-fit mx-auto gap-4 justify-center items-center mt-6">
            <generic-button @click="step--" :disabled="step <= 0"> Previous </generic-button>
            <generic-button
              v-if="step < STEPS.length - 1"
              @click="step++"
              :disabled="STEPS[step] === 'settings' && !formValid"
            >
              Next
            </generic-button>
            <generic-button v-else @click="step++"> Start game </generic-button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watch } from "vue";
import InputComponent from "@/components/form/InputComponent.vue";
import GenericButton from "@/components/GenericButton.vue";

type ModalModel = {
  framesPerSecond: number;
  aliveCellChance: number;
  cellSize: number;
  gridColor: string;
  cellColors: {
    dead: string;
    alive: string;
  };
};

const STEPS = ["settings", "controls"] as const;

const open = ref(true);
const step = ref(0);

const settingsFrom = useTemplateRef<HTMLFormElement | null>("settingsFrom");

const formValid = ref(true);

const model = defineModel<ModalModel>({
  required: true,
});

const emits = defineEmits(["redraw"]);

let redrawTimeout = NaN;

watch(
  model,
  () => {
    clearTimeout(redrawTimeout);
    formValid.value = settingsFrom.value?.checkValidity() ?? false;
    if (!formValid.value) {
      return;
    }

    redrawTimeout = setTimeout(() => {
      emits("redraw");
    }, 300);
  },
  {
    deep: true,
  },
);
</script>

<style scoped lang="scss">
.modal {
  @apply fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 max-w-full;
  width: 640px;

  &-container {
    @apply bg-black border-4 border-white outline-4 outline-black outline py-6 px-4 sm:px-6 text-white;

    p {
      @apply text-lg sm:text-xl leading-none my-2;
    }
  }
}
</style>
