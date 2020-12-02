const fs = require('fs')
const rimraf = require('rimraf')
const scale = require('d3-scale').scaleLinear
const pako = require('pako')

// clean up
rimraf.sync('./data/out')
fs.mkdirSync('./data/out')
rimraf.sync('../public/grids')
fs.mkdirSync('../public/grids')

const indicators = ['crop-failure', 'drought', 'heatwave', 'river-flood', 'tropical-cyclone', 'wildfire']
// const indicators = ['wildfire']
const allFiles = []
const scales = {}
indicators.forEach(i => {
  const files = fs.readdirSync(`./data/extreme-events/${i}-abs`)
  const fileComponents = files.map(file => file.match(/^all_(.*)\.csv/)[1].split('_'))
  let cms = [...new Set(fileComponents.map(c => c[0]))] // .filter((c, i) => i < 1)
  if (cms.indexOf('median') !== -1) { cms = ['median', ...cms.filter(c => c !== 'median')] }
  let ims = [...new Set(fileComponents.map(c => c[1]))].filter((c, i, all) => all.length > 2 || c !== 'median')
  if (ims.indexOf('median') !== -1) { ims = ['median', ...ims.filter(c => c !== 'median')] }
  // const wls = [...new Set(fileComponents.map(c => c[2]))].filter((c, i) => i < 5 && c !== '0.5')
  const wls = ['0.0', '0.5', '1.0', '1.5', '2.0', '2.5', '3.0']
  console.log(i, cms, ims, wls)
  // console.log(`${i}: file availabilty check ${files.length === cms.length * ims.length * wls.length ? 'passed' : 'failed'}`)
  cms.forEach(cm => {
    ims.forEach(im => {
      const maxValues = []
      const selectedFiles = wls.map(wl => {
        return {
          name: `${cm}_${im}_${wl}`,
          new: `${i}_${cm}_${im}_${wl}`,
          indicator: i,
          cm,
          im,
          wl
        }
      }).flat(2)

      selectedFiles.forEach(f => {
        const abs = fs.readFileSync(`./data/extreme-events/${i}-abs/all_${f.name}.csv`, 'utf8').trim().split('\n').map(line => line.split(','))
        const height = abs.length
        const width = abs[0].length
        const data = []
        for (let y = 0; y < height; y++) {
          const row = []
          for (let x = 0; x < width; x++) {
            row.push(+abs[y][x])
          }
          data.push(row)
        }

        const max = Math.max(...data.map(row => Math.max(...row)))
        f.available = max !== 0
        maxValues.push(max)
      })
      const binning = false
      const domain = [0, Math.ceil(Math.max(...maxValues, 1) / 10) * 10]
      const s = scale().domain(domain).nice(2).clamp(true)
      const bins = binning ? s.ticks(5).length : s.domain()[1]
      const range = [0, bins]
      s.range(range)
      allFiles.push(...selectedFiles.map(f => {
        return {
          ...f,
          name: `${f.new}.txt`,
          scale: { domain: s.domain(), range }
        }
      }))
      console.log(i, s.domain(), domain, [0, Math.max(...maxValues)])
      selectedFiles.forEach(f => {
        const abs = fs.readFileSync(`./data/extreme-events/${i}-abs/all_${f.name}.csv`, 'utf8').trim().split('\n').map(line => line.split(','))
        const height = abs.length
        const width = abs[0].length
        const data = []
        for (let y = 0; y < height; y++) {
          const row = []
          for (let x = 0; x < width; x++) {
            let value = s(+abs[y][x])
            value = Math.floor(value)
            if (value === bins) value -= 1
            value += 32
            if (value >= 34) value += 1
            if (value >= 92) value += 1
            row.push(String.fromCharCode(value))
          }
          data.push(row.join(''))
        }
        // fs.writeFileSync(`../public/grids/${f.new}.txt`, data.join('\n'))
        fs.writeFileSync(`../public/grids/${f.new}.txt`, pako.deflate(data.join('\n'), { to: 'string' }))
      })
    })
  })
})
fs.writeFileSync(`../src/assets/data/grids.json`, JSON.stringify({
  files: allFiles,
  scales
}))
//
// fs.readFileSync()
