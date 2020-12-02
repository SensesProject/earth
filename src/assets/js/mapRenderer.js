import pako from 'pako'
export function renderMap ({ colors, grid }) {
  // let time = new Date().getTime()
  const inflated = pako.inflate(grid, { to: 'string' })
  // console.log(new Date().getTime() - time)
  // time = new Date().getTime()
  const values = []
  const lines = inflated.split('\n')
  for (let y = 359; y >= 0; y--) {
    const lat = []
    const line = lines[y]
    for (let x = 0; x < 720; x++) {
      lat.push(charcodeToValue(line.charCodeAt(x)))
    }
    values.push(lat)
  }
  // console.log(new Date().getTime() - time)
  // time = new Date().getTime()
  const width = 720
  const height = 360
  const data = new Uint8Array(3 * width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let rgb = colors[values[y][x]]
      if (rgb === undefined) rgb = colors[colors.length - 1]
      const index = (x + y * width) * 3
      for (let i = 0; i < 3; i++) {
        data[index + i] = rgb[i]
      }
    }
  }
  // console.log(new Date().getTime() - time)
  return { data, width, height }
}

function charcodeToValue (code) {
  if (code >= 93) code--
  if (code >= 35) code--
  return code - 32
}
