import { scaleLinear } from 'd3-scale'

export function renderMap ({ canvasData, grid, period1, range1, domain1 }) {
  const domain = [domain1[0], (domain1[0] + domain1[1]) * 0.5, domain1[1]]
  const colorScale = scaleLinear()
    // .range(['#071A29', '#39C88A', '#071A29'])
    .range(range1)
    .domain(domain)
  colorScale.clamp(true)
  // console.log(period1, grid)
  for (let y = 0; y < 360; y++) {
    for (let x = 0; x < 720; x++) {
      const value = grid[y][x]
      // if (value > 8) {
      // this.ctx.fillStyle = colorScale(value)
      const rgb = colorScale(value).match(/\((.*)\)/)[1].split(', ')
      const index = (x + (359 - y) * 720) * 4
      for (let i = 0; i < 3; i++) {
        canvasData.data[index + i] = rgb[i]
      }
      // }
    }
  }
  return canvasData
}
