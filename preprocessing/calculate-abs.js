const fs = require('fs')
const rimraf = require('rimraf')
// var pako = require('pako')

// clean up
rimraf.sync('./data/out')
fs.mkdirSync('./data/out')
rimraf.sync('../public/temp')
fs.mkdirSync('../public/temp')

const indicators = ['crop-failure', 'drought', 'heatwave', 'river-flood', 'tropical-cyclone', 'wildfire']
// const indicators = ['wildfire']
const allFiles = []
const issueFiles = []
indicators.forEach(i => {
  const files = fs.readdirSync(`./data/ISIpedia/${i}-abs`)
  const fileComponents = files.map(file => file.match(/^all_(.*)\.csv/)[1].split('_'))
  const cms = [...new Set(fileComponents.map(c => c[0]))].filter((c, i) => i < 1)
  const ims = [...new Set(fileComponents.map(c => c[1]))].filter((c, i) => c === 'median')
  const wls = [...new Set(fileComponents.map(c => c[2]))].filter((c, i) => i < 5)
  console.log(cms, ims, wls)
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
      name: `${i}_${f.name}.txt`
    }
  }))
  const issues = []
  selectedFiles.forEach(f => {
    const abs = fs.readFileSync(`./data/ISIpedia/${i}-abs/all_${f.name}.csv`, 'utf8').trim().split('\n').map(line => line.split(','))
    const rel = fs.readFileSync(`./data/ISIpedia/${i}-rel/all_${f.name}.csv`, 'utf8').trim().split('\n').map(line => line.split(','))
    const height = abs.length
    const width = abs[0].length
    const data = []
    for (let y = 0; y < height; y++) {
      const row = []
      for (let x = 0; x < width; x++) {
        const a = abs[y][x]
        const r = rel[y][x]
        if (a === '' && r === '') {
          row.push(0)
        } else if (a !== '' && r !== '') {
          row.push(+a)
          // if (+r === 18617610000000000000) {
          //   console.log(+a, +r, +a * +r * 0.01)
          // }
        } else if (a === '') {
          row.push(0)
          // if (+r > 10) {
          //   row.push(4)
          //   issues.push(f.new)
          // } else {
          //   row.push(2)
          // }
        } else {
          row.push(0)
        }
      }
      data.push(row)
    }

    console.log(Math.max(...data.map(row => Math.max(...row))), Math.min(...data.map(row => Math.min(...row))))

    // const grid = data.map(row => {
    //   return row.map(value => {
    //     value += 32
    //     if (value >= 34) value += 1
    //     if (value >= 92) value += 1
    //     return String.fromCharCode(value)
    //   }).join('')
    // }).join('\n')

    // console.log(grid)

    // fs.writeFileSync(`../public/temp/${f.new}.txt`, pako.deflate(JSON.stringify({ grid, mapping: [0, 10] }), { to: 'string' }))
    // zip.file(`../public/temp/${f.new}.txt`, grid)
  })
  // console.log(Math.max(...issues))
  issueFiles.push(...new Set(issues))
  console.log(i, [...new Set(issues)].length, issues.length)
})
fs.writeFileSync(`./data/out/issues.csv`, issueFiles.join('\n'))
fs.writeFileSync(`../src/assets/data/files.json`, JSON.stringify(allFiles))
//
// fs.readFileSync()
