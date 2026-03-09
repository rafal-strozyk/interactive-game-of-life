<template>
  <main>
    <canvas ref="game-canvas"></canvas>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from "vue";

const gameCanvas = useTemplateRef<HTMLCanvasElement | null>("game-canvas");
const gameMatrix = ref();
const nextMatrix = ref();

const aliveCellChance = ref(0.3);
const cellSize = ref(10);
const cellColors = {
  dead: "#000",
  alive: "#fff",
};

function setupCanvas(): void {
  if (gameCanvas.value === null) {
    //handle errors
    return;
  }

  const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const viewportHeight = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0,
  );

  gameCanvas.value.width = viewportWidth;
  gameCanvas.value.height = viewportHeight;
}

function setupGame(): void {
  if (cellSize.value <= 0 || gameCanvas.value === null) {
    //handle errors
    return;
  }

  const rows = Math.ceil(gameCanvas.value.height / cellSize.value);
  const cols = Math.ceil(gameCanvas.value.width / cellSize.value);

  gameMatrix.value = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() < aliveCellChance.value),
  );

  console.log(gameMatrix.value);
  nextMatrix.value = new Array(rows).fill(new Array(cols));
}

function deepCopyArray<T = unknown>(array: Array<T>): Array<T> | T {
  const copy = [] as Array<T>;
  array.forEach((item: T) => {
    if (Array.isArray(item)) {
      copy.push(deepCopyArray(item));
    } else {
      copy.push(item);
    }
  });
  return copy;
}

function drawCells(cells: Array<Array<number>>): void {
  if (gameCanvas.value === null) {
    //handle errors
    return;
  }

  const context = gameCanvas.value.getContext("2d");

  if (context === null) {
    //handle errors
    return;
  }

  context.fillStyle = cellColors.dead;
  context.fillRect(0, 0, cellSize.value, cellSize.value);

  cells.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      context.fillStyle = value ? cellColors.alive : cellColors.dead;
      context.fillRect(
        columnIndex * cellSize.value,
        rowIndex * cellSize.value,
        cellSize.value,
        cellSize.value,
      );
    });
  });
}

onMounted(() => {
  setupCanvas();
  setupGame();
});

watch(gameMatrix, () => {
  drawCells(gameMatrix.value);
});
</script>

<style lang="scss" scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  canvas {
    width: 100%;
    height: 100%;
    flex-grow: 1;
    display: block;
    object-fit: cover;
  }
}
</style>
