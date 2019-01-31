import { scaleLinear } from 'd3-scale'

export function renderMap ({ canvasData, grid, period1 }) {
  const colorScale = scaleLinear()
    // .range(['#071A29', '#39C88A', '#071A29'])
    .range(['#00CC84', '#D2FEFF', '#4E40B2'])
    .domain([10, 11, 12])
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
