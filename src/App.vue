<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { usePlot } from '@/composables/usePlot';
import { Shapes } from '@/utils/shapes';

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
  <svg class="canvas" ref="canvas"></svg>
</template>

<style>
* {
  box-sizing: border-box;
}

html,
body,
#app,
.canvas {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

html {
  font-family: arial;
}

.canvas {
  background-color: #fcfcfb;
}

.controls {
  position: fixed;
  left: 40px;
  top: 40px;
  background: #e8f1fa99;
  width: 160px;
  height: 240px;
  padding: 20px;
}

.c-grid-line {
  stroke: #ddd;
}

.c-circle {
  fill: #e8f1fa;
  stroke: #3f6aa8;
}

.c-line--between {
  stroke: #3f6aa8;
}
</style>
