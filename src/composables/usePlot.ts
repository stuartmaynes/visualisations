import { type Ref } from 'vue'

export function usePlot(plotRef: Ref<SVGSVGElement | null>, gridSize: number) {
  function add(item: SVGElement, ...classes: string[]) {
    item.classList.add(...classes)
    plotRef.value?.appendChild(item)
    return item
  }

  function snap(value: number, x: number = gridSize): number {
    return Math.round(value / x) * x
  }

  function visible(item: SVGElement, sibling: SVGElement) {
    if (!plotRef.value?.clientWidth) return

    const canvasWidth = plotRef.value.clientWidth
    let itemBounding = item.getBoundingClientRect()
    let siblingBounding = { width: 0, height: 0 }

    if (sibling) {
      siblingBounding = sibling.getBoundingClientRect()
    }

    item.setAttribute('x', (itemBounding.x + siblingBounding.width).toString())
    item.setAttribute('y', (itemBounding.y + siblingBounding.height).toString())

    itemBounding = item.getBoundingClientRect()

    if (itemBounding.x + itemBounding.width >= canvasWidth) {
      item.setAttribute(
        'x',
        (itemBounding.x - (itemBounding.width + siblingBounding.width * 2)).toString(),
      )
    }

    if (itemBounding.y <= 0) {
      item.setAttribute(
        'y',
        (itemBounding.y + (itemBounding.height + siblingBounding.height)).toString(),
      )
    }

    return item
  }

  return { add, visible, snap }
}
