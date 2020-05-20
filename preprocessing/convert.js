const fs = require('fs')
const rimraf = require('rimraf')
const scale = require('d3-scale').scaleLinear
const pako = require('pako')

// clean up
rimraf.sync('./data/out')
fs.mkdirSync('./data/out')
rimraf.sync('../public/temp')
fs.mkdirSync('../public/temp')

const indicators = ['crop-failure', 'drought', 'heatwave', 'river-flood', 'tropical-cyclone', 'wildfire']
// const indicators = ['wildfire']
const allFiles = []
const scales = {}
indicators.forEach(i => {
  const files = fs.readdirSync(`./data/ISIpedia/${i}-abs`)
  const fileComponents = files.map(file => file.match(/^all_(.*)\.csv/)[1].split('_'))
  let cms = [...new Set(fileComponents.map(c => c[0]))] // .filter((c, i) => i < 1)
  if (cms.indexOf('median') !== -1) { cms = ['median', ...cms.filter(c => c !== 'median')] }
  let ims = [...new Set(fileComponents.map(c => c[1]))].filter((c, i, all) => all.length > 2 || c !== 'median')
  if (ims.indexOf('median') !== -1) { ims = ['median', ...ims.filter(c => c !== 'median')] }
  const wls = [...new Set(fileComponents.map(c => c[2]))].filter((c, i) => i < 5 && c !== '0.5')
  const maxValues = []
  const minValues = []
  console.log(i, cms, ims, wls)
  // console.log(`${i}: file availabilty check ${files.length === cms.length * ims.length * wls.length ? 'passed' : 'failed'}`)
  const selectedFiles = cms.map(cm => {
    return ims.map(im => {
      return wls.map(wl => {
        return {
          name: `${cm}_${im}_${wl}`,
          new: `${i}_${cm}_${im}_${wl}`,
          indicator: i,
          cm,
          im,
          wl
        }
      })
    })
  }).flat(2)
  allFiles.push(...selectedFiles.map(f => {
    return {
      ...f,
      name: `${f.new}.txt`,
      scale: { domain: s.domain(), range }
    }
  }))
  selectedFiles.forEach(f => {
    const abs = fs.readFileSync(`./data/ISIpedia/${i}-abs/all_${f.name}.csv`, 'utf8').trim().split('\n').map(line => line.split(','))
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

    maxValues.push(Math.max(...data.map(row => Math.max(...row))))
    minValues.push(Math.min(...data.map(row => Math.min(...row))))
  })
  const binning = false
  const domain = [0, Math.max(...maxValues)]
  const s = scale().domain(domain).nice(5).clamp(true)
  const bins = binning ? s.ticks(5).length : s.domain()[1]
  const range = [0, bins]
  s.range(range)
  scales[i] = { domain: s.domain(), range }
  console.log(i, scales[i])
  selectedFiles.forEach(f => {
    const abs = fs.readFileSync(`./data/ISIpedia/${i}-abs/all_${f.name}.csv`, 'utf8').trim().split('\n').map(line => line.split(','))
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
    fs.writeFileSync(`../public/temp/${f.new}.txt`, pako.deflate(data.join('\n'), { to: 'string' }))
  })
})
fs.writeFileSync(`../src/assets/data/grids.json`, JSON.stringify({
  files: allFiles,
  scales
}))
//
// fs.readFileSync()
