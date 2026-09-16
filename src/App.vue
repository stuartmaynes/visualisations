<script setup lang="ts">
import '@/scss/grid.scss';
import '@/scss/shapes.scss';
import '@/scss/menu.scss';

import { computed, onMounted, useTemplateRef, ref } from 'vue';
import { usePlot } from '@/composables/usePlot';
import { Shapes } from '@/utils/shapes';

const GRID_SIZE = 40;

const showMenu = ref(true);

const showGrid = ref(true);
const snapToGrid = ref(true);

const canvas = useTemplateRef<SVGSVGElement>("canvas");
const plot = usePlot(canvas, GRID_SIZE);
const points: { x: number, y: number }[] = [];

function addPoint(x: number, y: number) {
  const point = Shapes.circle(x, y, 4)

  plot.add(point, "c-point")


  return point;
}

function addPointLabel(point) {
  const { x, y } = point.getBoundingClientRect()
  const label = Shapes.text(x, y, `(${x}, ${y})`)

  plot.add(label, "c-point-label");
  plot.visible(label, point)

  return label;
}

function addLine(p1, p2) {
  const line = Shapes.line(p1.x, p1.y, p2.x, p2.y);
  plot.add(line, "c-line")
  points.splice(0)
}

function plotClick(event: MouseEvent) {
  const { x, y } = {
    x: plot.snap(event?.clientX || 0), y: plot.snap(event?.clientY || 0)
  }

  const point = addPoint(x, y);
  addPointLabel(point);

  points.push({ x, y })

  if (points.length === 2) {
    const [p1, p2] = points;
    addLine(p1, p2)
  }
}

const classes = computed(() => {
  return { "canvas--hide-grid": !showGrid.value }
});

onMounted(() => {
  if (!canvas.value) {
    console.error("No SVG element with template ref 'canvas' found");
    return;
  }

  Shapes.grid(canvas.value.clientWidth * 10, canvas.value.clientHeight * 10, GRID_SIZE).forEach((line) => {
    plot.add(line, "c-grid-line")
  })

  canvas.value.addEventListener("click", plotClick);
})
</script>

<template>
  <div class="menu" :class="{ 'menu--hide': !showMenu }">
    <button class="menu__header" @click="showMenu = !showMenu" type="button">
      <h1 class="menu__title">Plot</h1>
      <svg fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="4" cy="4" r="3" class="menu-circle"></circle>
        <circle cx="12" cy="4" r="3" class="menu-circle"></circle>
        <circle cx="20" cy="4" r="3" class="menu-circle"></circle>
      </svg>
    </button>

    <div class="menu__content">
      <div class="menu__description">
        Click on the canvas to add points. After adding two points, a line will be drawn between them.
      </div>
      <div class="menu__options">
        <label class="menu__option" for="showGrid">
          <input type="checkbox" v-model="showGrid" id="showGrid" />
          Show Grid
        </label>
        <label class="menu__option" for="snapToGrid">
          <input type="checkbox" v-model="snapToGrid" id="snapToGrid" />
          Snap to Grid
        </label>
      </div>
    </div>
  </div>

  <svg class="canvas" :class="classes" ref="canvas"></svg>
</template>

<style lang="scss">
body {
  overflow: hidden;
}

.canvas--hide-grid .c-grid-line {
  stroke: none;
}
</style>
