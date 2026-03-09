<template>
  <button @click.prevent="$emit('click')" :disabled>
    <slot />
  </button>
</template>

<script setup lang="ts">
type GenericButtonProps = {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

withDefaults(defineProps<GenericButtonProps>(), {
  type: "button",
});
defineEmits(["click"]);
</script>

<style scoped lang="scss">
button {
  @apply transition-all duration-300 cursor-pointer text-white bg-black border-solid border-2 border-white outline outline-2 outline-black px-4 py-2 uppercase font-bold text-base disabled:cursor-not-allowed disabled:opacity-50;

  &:not(:disabled) {
    @apply hover:text-black hover:bg-white hover:border-black hover:outline-white;
  }
}
</style>
