<template>
  <main>
    <canvas ref="game-canvas"></canvas>
    <settings-modal v-model="gameSettings" @redraw="drawCells()" @start="startGame()" />
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import SettingsModal from "@/components/SettingsModal.vue";

type CellsMatrix = Array<Array<boolean>>;

const gameCanvas = useTemplateRef<HTMLCanvasElement | null>("game-canvas");
const gameMatrix = ref<CellsMatrix>();
const nextMatrix = ref<CellsMatrix>();

let showGrid = true;
let animationFrameId = NaN;

const gameSettings = ref({
  framesPerSecond: 30,
  aliveCellChance: 30,
  cellSize: 10,
  gridColor: "#FF00FF",
  cellColors: {
    dead: "#000000",
    alive: "#ffffff",
  },
});

function stopAnimation() {
  cancelAnimationFrame(animationFrameId);
  animationFrameId = NaN;
}

function newGame() {
  stopAnimation();
  setupGame();
}

function togglePause() {
  if (Number.isNaN(animationFrameId)) {
    startGame();
    return;
  }
  stopAnimation();
}

function keyboardListeners(event: KeyboardEvent) {
  switch (event.key) {
    case "g": {
      showGrid = !showGrid;
      drawCells();
      return;
    }

    case "r": {
      newGame();
      return;
    }

    case "n": {
      if (Number.isNaN(animationFrameId)) {
        calculateNextFrame();
        drawCells();
      }
      return;
    }

    case " ": {
      togglePause();
      return;
    }
  }
}

function setupControls(): void {
  document.addEventListener("keydown", keyboardListeners);
  gameCanvas.value?.addEventListener("touchstart", togglePause);
}

function removeControls(): void {
  document.addEventListener("keydown", keyboardListeners);
  gameCanvas.value?.removeEventListener("touchstart", togglePause);
}

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
  if (gameSettings.value.cellSize <= 0 || gameCanvas.value === null) {
    //handle errors
    return;
  }

  const cellSize = gameSettings.value.cellSize;

  const rows = Math.ceil(gameCanvas.value.height / cellSize);
  const cols = Math.ceil(gameCanvas.value.width / cellSize);

  gameMatrix.value = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() < gameSettings.value.aliveCellChance / 100),
  );

  nextMatrix.value = Array.from({ length: rows }, () => new Array(cols).fill(false));

  drawCells();
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

function calculateNextFrame() {
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

  [gameMatrix.value, nextMatrix.value] = [nextMatrix.value, gameMatrix.value];
}

function drawCells(): void {
  if (gameCanvas.value === null || gameMatrix.value === undefined) {
    //handle errors
    return;
  }

  const context = gameCanvas.value.getContext("2d");

  if (context === null) {
    //handle errors
    return;
  }

  const cellColors = gameSettings.value.cellColors;
  const cellSize = gameSettings.value.cellSize;

  context.translate(0.5, 0.5);
  context.fillStyle = cellColors.dead;
  context.fillRect(0, 0, gameCanvas.value.width, gameCanvas.value.height);

  // grid
  if (showGrid) {
    const canvasWidth = gameCanvas.value.width;
    const canvasHeight = gameCanvas.value.height;

    const rows = Math.floor(canvasHeight / cellSize);
    const columns = Math.floor(canvasWidth / cellSize);

    context.strokeStyle = gameSettings.value.gridColor;
    context.lineWidth = 1;

    context.beginPath();

    for (let row = 0; row <= rows; row++) {
      context.moveTo(0, row * cellSize);
      context.lineTo(canvasWidth, row * cellSize);
    }

    for (let column = 0; column <= columns; column++) {
      context.moveTo(column * cellSize, 0);
      context.lineTo(column * cellSize, canvasHeight);
    }

    context.stroke();
  }

  // cells
  context.fillStyle = cellColors.alive;
  gameMatrix.value.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      if (!value) {
        return;
      }
      context.fillRect(columnIndex * cellSize, rowIndex * cellSize, cellSize, cellSize);
    });
  });

  context.translate(-0.5, -0.5);
}

let lastFrameTimestamp = 0;

function gameLoop(timestamp: number) {
  const delta = timestamp - lastFrameTimestamp;
  const frameInterval = 1000 / gameSettings.value.framesPerSecond;

  if (delta >= frameInterval) {
    calculateNextFrame();
    drawCells();
    lastFrameTimestamp = timestamp - (delta % frameInterval);
  }

  animationFrameId = requestAnimationFrame(gameLoop);
}

function startGame() {
  requestAnimationFrame(gameLoop);
}

onMounted(() => {
  setupControls();
  setupCanvas();
  setupGame();
});

onUnmounted(() => {
  removeControls();
});
</script>

<style lang="scss" scoped>
main {
  @apply flex justify-center items-center size-full;

  canvas {
    @apply size-full flex-grow block object-cover;
    image-rendering: pixelated;
  }
}
</style>
