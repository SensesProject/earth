// import { scaleLinear } from 'd3-scale'

export function renderMap ({ canvasData, grid, temperature, range1, domain1, colors, comparing, gridComparison }) {
  // const domain = [domain1[0], (domain1[0] + domain1[1]) * 0.5, domain1[1]]
  // const colorScale = scaleLinear()
  //   // .range(['#071A29', '#39C88A', '#071A29'])
  //   .range(range1)
  //   .domain(domain)
  // colorScale.clamp(true)
  // console.log(temperature, grid)
  for (let y = 0; y < 360; y++) {
    for (let x = 0; x < 720; x++) {
      const value1 = grid[y][x] - 2
      let value0 = value1
      if (comparing && gridComparison) {
        value0 = gridComparison[y][x] - 2
      }
      if (value0 >= 0 || value1 >= 0) {
        const rgb = colors[value0][value1]
        const index = (x + (359 - y) * 720) * 4
        for (let i = 0; i < 3; i++) {
          canvasData.data[index + i] = rgb[i]
        }
      }
      // }
    }
  }
  return canvasData
}
