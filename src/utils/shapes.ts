export const Shapes = {
  /**
   * Creates an SVGCircleElement and sets its x and y position as well as its radius.
   */
  circle(x: number, y: number, r: number) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', x.toString())
    circle.setAttribute('cy', y.toString())
    circle.setAttribute('r', r.toString())

    return circle
  },
  /**
   * Creates a grid by an array of overlapping horizontal and vertical SVGLineElement items.
   */
  grid(width: number, height: number, size: number) {
    const lines: SVGLineElement[] = []

    for (let x = 0; x < width; x += size) {
      const line = Shapes.line(x, 0, x, height)
      lines.push(line)
    }

    for (let y = 0; y < height; y += size) {
      const line = Shapes.line(0, y, width, y)
      lines.push(line)
    }

    return lines
  },
  /**
   * Creates an SVGLineElement and sets its x and y positions
   */
  line(x1: number, y1: number, x2: number, y2: number) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', x1.toString())
    line.setAttribute('y1', y1.toString())
    line.setAttribute('x2', x2.toString())
    line.setAttribute('y2', y2.toString())

    return line
  },
}
