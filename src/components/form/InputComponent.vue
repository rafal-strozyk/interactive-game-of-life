<template>
  <div class="input">
    <label :for="id">{{ label }}</label>
    <br />
    <input :id :type :placeholder :min :max :pattern :required v-model="model" />
  </div>
</template>

<script setup lang="ts">
type InputProps = {
  id: string;
  type?: string;
  label: string;
  min?: number;
  max?: number;
  pattern?: string;
  required?: boolean;
  placeholder: string;
};

withDefaults(defineProps<InputProps>(), {
  type: "text",
});

const model = defineModel<string | number>({
  required: true,
});
</script>

<style scoped lang="scss">
.input {
  @apply w-full text-white text-base;

  label {
    @apply text-white inline-block mb-1;
  }

  input {
    @apply w-full transition bg-transparent px-2 py-1 border-solid border-2 border-white border-opacity-50 focus:border-opacity-100 focus:border-white focus:outline-none;

    &:invalid {
      @apply border-red-600 border-opacity-100;
    }

    &[type="color"] {
      @apply p-0 min-h-9;
    }

    &::-webkit-inner-spin-button {
      appearance: none;
    }
  }
}
</style>
