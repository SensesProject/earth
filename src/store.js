import Vue from 'vue'
import Vuex from 'vuex'
import fetch from 'unfetch'
import pako from 'pako'
// import { scaleLinear } from 'd3-scale'
import { format } from 'd3-format'
import grids from '@/assets/data/grids.json'

const indicators = [...new Set(grids.files.map(f => f.indicator))]
const impactModels = [...new Set(grids.files.map(f => f.im))]
const climateModels = [...new Set(grids.files.map(f => f.cm))]
const temperatures = [...new Set(grids.files.map(f => f.wl))]

Vue.use(Vuex)

const defaults = {
  variable: 'land-area-affected'
  // indicator: 'crop-failure'
}

export default new Vuex.Store({
  state: {
    width: window.innerWidth,
    height: window.innerHeight,
    mode: 'explore',
    showOptions: false,
    showCountryDetails: null,
    modes: ['explore', 'indicator', 'global-warming-level', 'climate-model', 'impact-model'],
    variable: null,
    indicator: indicators[0],
    indicators,
    impactModel: impactModels[0],
    impactModels,
    climateModel: climateModels[0],
    climateModels,
    temperature: temperatures[temperatures.length - 1],
    temperatures,
    files: grids.files,
    variable1: 'tas',
    variable2: 'pr',
    period1: 2095,
    period2: 2005,
    range1: ['#070019', '#B035C9'],
    domain1: [0, 1],
    scales: grids.scales,
    scale2: {
      range: ['#000', '#4E40B2'],
      domain: [0, 1000]
    },
    dataset: {},
    dataset1: {},
    dataset2: {},
    grids: {},
    map: null,
    mapComparison: null,
    title: null,
    compareOption: null,
    compareValue: null
  },
  getters: {
    impactModels: state => {
      const { files, indicator } = state
      return [...new Set(files.filter(f => f.indicator === indicator).map(f => f.im))]
      // x === 'years' ? { domain: null, name: 'Year', unit: '', variable: 'years' } : variables.find(v => v.variable === x)
    },
    globalWarmingLevels: state => {
      const { temperatures } = state
      return temperatures.map(t => ({
        value: t,
        label: `+${format('.1f')(t)}°C`
      }))
      // x === 'years' ? { domain: null, name: 'Year', unit: '', variable: 'years' } : variables.find(v => v.variable === x)
    },
    scale: state => {
      const { scales, indicator } = state
      return scales[indicator]
    }
  },
  mutations: {
    set (state, { prop, value }) {
      state[prop] = value
    },
    clear (state, prop) {
      state[prop] = {}
    },
    setMap (state, map) {
      state.map = map
    },
    setMapComparison (state, map) {
      state.mapComparison = map
    },
    addMap (state, { map, temperature }) {
      state.dataset[temperature] = map
    },
    addGrid (state, { grid, period }) {
      state.grids[period] = grid
    }
  },
  actions: {
    setDefaults ({ dispatch }, d) {
      Object.keys(defaults).forEach(k => {
        dispatch('update', { value: defaults[k], prop: k })
      })
    },
    update ({ commit, dispatch }, d) {
      commit('set', d)
      switch (d.prop) {
        case 'variable':
        case 'indicator':
          commit('clear', 'dataset1')
          commit('clear', 'grids')
          dispatch('updateMetadata')
          break
        case 'variable1':
        case 'climateModel':
        case 'impactModel':
        case 'files':
          commit('clear', 'dataset')
        case 'domain1':
          commit('clear', 'grids')
        case 'temperature':
        case 'period1':
        case 'period2':
        case 'compareValue':
          dispatch('updateMap')
          break
      }
    },
    updateMetadata ({ commit, state, dispatch, getters }) {
      dispatch('updateMap')

      // if (variable == null || indicator == null) return
      // fetch(`./impacts/${variable}-by-${indicator}/${variable}-by-${indicator}_ISIMIP-projections_world_frequency_map_vs_temperature.json`)
      //   .then(r => r.json())
      //   .then(d => {
      //     // commit('set', { prop: 'title', value: d.map_title })
      //     // commit('set', { prop: 'climateModels', value: d.climate_model_list })
      //     // commit('set', { prop: 'impactModels', value: d.impact_model_list })
      //     // commit('set', { prop: 'temperatures', value: d.temperature_list })
      //     // if (d.climate_model_list.indexOf(climateModel) === -1) commit('set', { prop: 'climateModel', value: d.climate_model_list[0] })
      //     // if (d.temperature_list.indexOf(temperature) === -1) commit('set', { prop: 'temperature', value: d.temperature_list[0] })
      //     // if (Object.keys(d.frequency_maps[state.temperature][state.climateModel]).indexOf(impactModel) === -1) {
      //     //   commit('set', { prop: 'impactModel', value: Object.keys(d.frequency_maps[state.temperature][state.climateModel])[0] })
      //     // }
      //     // dispatch('update', { prop: 'files', value: d.frequency_maps })
      //     // dispatch('updateMap')
      //   })
    },
    updateSize ({ commit }) {
      commit('set', { prop: 'width', value: window.innerWidth })
      commit('set', { prop: 'height', value: window.innerHeight })
    },
    updateMap ({ commit, state }) {
      const { files, indicator, climateModel, impactModel, temperature } = state
      let file = files.find(f => f.indicator === indicator && f.cm === climateModel && f.im === impactModel && f.wl === temperature)
      if (file == null) {
        file = files.find(f => f.indicator === indicator && f.cm === climateModel && f.wl === temperature)
        commit('set', { prop: 'impactModel', value: file.im })
      }

      fetch(`./temp/${file.name}`)
        .then(r => r.text())
        .then(d => {
          // try {
          const data = pako.inflate(d, { to: 'string' })
          const map = []
          for (let y = 359; y >= 0; y--) {
            const lat = []
            const line = data.split('\n')[y]
            for (let x = 0; x < 720; x++) {
              lat.push(charcodeToValue(line.charCodeAt(x)))
            }
            map.push(lat)
          }
          // if (state.variable === variable && state.indicator === indicator && state.temperature === temperature) {
          commit('setMap', map)
          // }
        })

      // const { climateModel, impactModel, temperature, variable, indicator, compareOption, compareValue } = state
      // if (climateModel != null && impactModel != null && temperature != null) {
      //   if (state.files[state.temperature][state.climateModel][state.impactModel] == null) return
      //   fetch(`./impacts/${variable}-by-${indicator}/${state.files[state.temperature][state.climateModel][state.impactModel]}`)
      //     .then(r => r.json())
      //     .then(data => {
      //       const map = []
      //       for (let y = 359; y >= 0; y--) {
      //         const lat = []
      //         const line = data.grid[y]
      //         for (let x = 0; x < 720; x++) {
      //           lat.push(charcodeToValue(line.charCodeAt(y === 0 ? x : x + 1)))
      //         }
      //         map.push(lat)
      //       }
      //       if (state.variable === variable && state.indicator === indicator && state.temperature === temperature) {
      //         commit('setMap', map)
      //       }
      //     })
      //   if (compareValue != null) {
      //     const compareTemp = compareOption === 'global-warming-level' ? compareValue : state.temperature
      //     const compareClimateModel = compareOption === 'climate-model' ? compareValue : state.climateModel
      //     const compareImpactModel = compareOption === 'impact-model' ? compareValue : state.impactModel
      //     fetch(`./impacts/${variable}-by-${indicator}/${state.files[compareTemp][compareClimateModel][compareImpactModel]}`)
      //       .then(r => r.json())
      //       .then(data => {
      //         const map = []
      //         for (let y = 359; y >= 0; y--) {
      //           const lat = []
      //           const line = data.grid[y]
      //           for (let x = 0; x < 720; x++) {
      //             lat.push(charcodeToValue(line.charCodeAt(y === 0 ? x : x + 1)))
      //           }
      //           map.push(lat)
      //         }
      //         if (state.variable === variable && state.indicator === indicator && state.temperature === temperature) {
      //           commit('setMapComparison', map)
      //         }
      //       })
      //   }
      // }
    },
    addGrid ({ commit }, { grid, period }) {
      commit('addGrid', { grid, period })
    }
  }
})

function charcodeToValue (code) {
  if (code >= 93) code--
  if (code >= 35) code--
  return code - 32
}
