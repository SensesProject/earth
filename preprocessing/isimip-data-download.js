const SFTP = require('ssh2-sftp-client')
const client = new SFTP()
const rimraf = require('rimraf')
const fs = require('fs')
const credentials = require('./credentials.json')

// clean up
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data')
}
rimraf.sync('./data/ISIpedia')
fs.mkdirSync('./data/ISIpedia')

const indicators = ['crop-failure', 'drought', 'heatwave', 'river-flood', 'tropical-cyclone', 'wildfire']
// const path = '/home/ft/data'
client.connect({
  host: '46.101.169.39',
  port: '22',
  username: credentials.username,
  password: credentials.password
}).then(() => {
//   return client.list(`${path}/country_data`)
// }).then(data => {
//   const countries = data.map(d => d.name)
//   countries.forEach(c => fs.mkdirSync(`./data/ISIpedia/${c}`))
  let downloads = []

  indicators.forEach(i => {
    // countries.forEach(c => { // land-area-exposed-to-crop-failure_future-projections_versus-temperature-change
    const src = `/home/ft/data/${i}/land-area-exposed-to-${i}_future-projections_versus-temperature-change`
    const dst = `./data/ISIpedia/${i}-abs`
    downloads.push(client.downloadDir(src, dst))
    // src = `/work/bb0820/ISIpedia/data_cube/${i}/ISIMIP-projections/world/maps/land-area-affected-by-${i}-relative-changes_ISIMIP-projections_versus-temperature-change`
    // dst = `./data/ISIpedia/${i}-rel`
    // downloads.push(client.downloadDir(src, dst))
    // const landPath = `${path}/${i}/ISIMIP-projections/${c}/land-area-affected-by-${i}_ISIMIP-projections_versus-temperature-change_${c}.json`
    // downloads.push(client.fastGet(landPath, `./data/ISIpedia/${c}/${i}-land.json`))
    // })
  })

  Promise.all(downloads).then(() => client.end())
}).catch(err => {
  console.log(err, 'catch error')
})
