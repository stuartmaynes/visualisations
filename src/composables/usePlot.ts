import { type Ref } from 'vue'

export function usePlot(plotRef: Ref<SVGSVGElement | null>) {
  function add(item: SVGElement, ...classes: string[]) {
    item.classList.add(...classes)
    plotRef.value?.appendChild(item)
    return item
  }
  function snap(value: number, gridSize: number): number {
    return Math.round(value / gridSize) * gridSize
  }
  return { add, snap }
}
