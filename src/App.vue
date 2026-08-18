<script setup lang="ts">
import { onMounted, useTemplateRef, ref } from "vue";

const singleLine = ref(true);

const SIZE = 40;
const canvas = useTemplateRef("canvas");

let line = null;
let circles: SVGCircleElement[] = [];

function drawGrid() {
  if (!canvas.value) return;

  const width = canvas.value.clientWidth;
  const height = canvas.value.clientHeight;

  for (let x = 0; x < width; x += SIZE) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x.toString());
    line.setAttribute("y1", "0");
    line.setAttribute("x2", x.toString());
    line.setAttribute("y2", height.toString());
    line.setAttribute("stroke", "#ddd");
    canvas.value.appendChild(line);
  }

  for (let y = 0; y < height; y += SIZE) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "0");
    line.setAttribute("y1", y.toString());
    line.setAttribute("x2", width.toString());
    line.setAttribute("y2", y.toString());
    line.setAttribute("stroke", "#ddd");
    canvas.value.appendChild(line);
  }
}

function drawLineBetweenPoints(circles: SVGCircleElement[]) {
  if (!canvas.value) return

  const x1 = circles[0].getAttribute("cx");
  const y1 = circles[0].getAttribute("cy");
  const x2 = circles[1].getAttribute("cx");
  const y2 = circles[1].getAttribute("cy");

  line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1.toString());
  line.setAttribute("y1", y1.toString());
  line.setAttribute("x2", x2.toString());
  line.setAttribute("y2", y2.toString());
  line.setAttribute("stroke", "#3f6aa8");
  line.classList.add('removable');
  line.classList.add('removable');

  canvas.value.appendChild(line);
  canvas.value.removeChild(circles[0]);
  canvas.value.removeChild(circles[1]);
  canvas.value.appendChild(circles[0]);
  canvas.value.appendChild(circles[1]);

}
function drawCircle() {
  if (!canvas.value) return;

  if (circles.length >= 2) {
    if (singleLine.value) {
      const items = document.querySelectorAll('.removable');
      items.forEach((item) => canvas.value?.removeChild(item));
      line = null;
    }
    circles = [];
  }

  const rect = canvas.value.getBoundingClientRect();
  const x = Math.round((event.clientX - rect.left) / SIZE) * SIZE;
  const y = Math.round((event.clientY - rect.top) / SIZE) * SIZE;

  console.log(`Clicked at: (${x}, ${y})`);

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x.toString());
  circle.setAttribute("cy", y.toString());
  circle.setAttribute("r", (SIZE / 8).toString());
  circle.setAttribute("fill", "#e8f1fa");
  circle.setAttribute("stroke", "#3f6aa8");
  circle.classList.add('removable')
  circle.classList.add('circle');

  canvas.value.appendChild(circle);

  circles.push(circle);

  if (circles.length === 2) {
    drawLineBetweenPoints(circles);
  }
}

onMounted(() => {
  if (canvas.value) {
    drawGrid();

    canvas.value.addEventListener("click", (event) => {
      drawCircle();
    });
  }
});
</script>

<template>
  <svg id="canvas" ref="canvas"></svg>
  <div id="controls">
    <label>
      <input type="checkbox" v-model="singleLine"> Single line
    </label>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

html,
body,
#app,
#canvas {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

html {
  font-family: arial;
}

#canvas {
  background-color: #fcfcfb;
}

#controls {
  position: fixed;
  left: 40px;
  top: 40px;
  background: #e8f1fa99;
  width: 160px;
  height: 240px;
  padding: 20px;
}
</style>
