export function renderMap ({ colors, grid, comparing, gridComparison }) {
  const width = 720
  const height = 360
  const data = new Uint8Array(3 * width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // const cs = [[0, 0, 0], [128, 128, 128], [255, 255, 0], [0, 255, 255], [255, 0, 255]]
      // const value1 = grid[y][x]
      // let value0 = value1
      // if (comparing && gridComparison) {
      //   value0 = gridComparison[y][x]
      // }
      // if (value0 >= 0 || value1 >= 0) {
      const rgb = colors[grid[y][x]]
      const index = (x + y * width) * 3
      for (let i = 0; i < 3; i++) {
        data[index + i] = rgb[i]
      }
      // }
    }
  }
  return { data, width, height }
}
