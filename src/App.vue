<script setup lang="ts">
import '@/scss/grid.scss';
import '@/scss/shapes.scss';
import '@/scss/menu.scss';

import { computed, onMounted, useTemplateRef, ref } from 'vue';
import { usePlot } from '@/composables/usePlot';
import { Shapes } from '@/utils/shapes';

const showMenu = ref(true);

const showGrid = ref(true);

const canvas = useTemplateRef<SVGSVGElement>("canvas");
const plot = usePlot(canvas);
const points: { x: number, y: number }[] = [];

function plotClick(event: MouseEvent) {
  const { x, y } = { x: event?.clientX || 0, y: event?.clientY || 0 }
  const circle = Shapes.circle(x, y, 6)
  plot.add(circle, "c-circle")
  points.push({ x, y })

  if (points.length === 2) {
    const [p1, p2] = points;
    const line = Shapes.line(p1.x, p1.y, p2.x, p2.y);
    plot.add(line, "c-line--between")
    points.splice(0)
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

  Shapes.grid(canvas.value.clientWidth, canvas.value.clientHeight, 40).forEach((line) => {
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
      </div>
    </div>
  </div>

  <svg class="canvas" :class="classes" ref="canvas"></svg>
</template>

<style lang="scss">
.canvas--hide-grid .c-grid-line {
  stroke: none;
}
</style>
