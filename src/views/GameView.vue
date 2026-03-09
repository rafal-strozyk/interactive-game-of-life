<template>
  <main>
    <canvas @click="runGame()" ref="game-canvas"></canvas>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from "vue";

type CellsMatrix = Array<Array<boolean>>;

const gameCanvas = useTemplateRef<HTMLCanvasElement | null>("game-canvas");
const gameMatrix = ref<CellsMatrix>();
const nextMatrix = ref<CellsMatrix>();

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

  const rows = Math.floor(gameCanvas.value.height / cellSize.value);
  const cols = Math.floor(gameCanvas.value.width / cellSize.value);

  gameMatrix.value = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() < aliveCellChance.value),
  );

  nextMatrix.value = Array.from({ length: rows }, () => new Array(cols).fill(false));
}

function getNeighborsSum(grid: Array<Array<boolean>>, rowIndex: number, colIndex: number) {
  let sum = 0;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue;
      }

      sum += grid[rowIndex + i]?.[colIndex + j] ? 1 : 0;
    }
  }

  return sum;
}

function runGame() {
  // let gameLoop = setInterval(() => {
  const game = gameMatrix.value;
  const next = nextMatrix.value;

  if (game === undefined || next === undefined) {
    //handle errors
    // clearTimeout(gameLoop);
    return;
  }

  for (const [rowIndex, row] of game.entries()) {
    for (const [colIndex, cell] of row.entries()) {
      if (next[rowIndex]?.[colIndex] === undefined) {
        //handle errors
        console.log("błąd");
        return;
      }

      const livingNeighbors = getNeighborsSum(game, rowIndex, colIndex);

      if (!cell) {
        next[rowIndex][colIndex] = livingNeighbors === 3;
        continue;
      }

      next[rowIndex][colIndex] = livingNeighbors === 2 || livingNeighbors === 3;
    }
  }

  console.log("swap");
  [gameMatrix.value, nextMatrix.value] = [nextMatrix.value, gameMatrix.value];
  // }, 1000);
}

function drawCells(cells: CellsMatrix | undefined): void {
  if (gameCanvas.value === null || cells === undefined) {
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
