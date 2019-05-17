import Vue from 'vue'
import Vuex from 'vuex'
import fetch from 'unfetch'
// import { scaleLinear } from 'd3-scale'
import { format } from 'd3-format'

Vue.use(Vuex)

const defaults = {
  variable: 'land-area-affected',
  indicator: 'crop-failure'
}

export default new Vuex.Store({
  state: {
    width: window.innerWidth,
    height: window.innerHeight,
    mode: 'explore',
    showOptions: false,
    modes: ['explore', 'indicator', 'global-warming-level', 'climate-model', 'impact-model'],
    variable: null,
    indicator: null,
    impactModel: null,
    impactModels: [],
    climateModel: null,
    climateModels: [],
    temperature: null,
    temperatures: [],
    files: null,
    variable1: 'tas',
    variable2: 'pr',
    scenario1: 'rcp60',
    scenario2: 'rcp26',
    period1: 2095,
    period2: 2005,
    range1: ['#070019', '#B035C9'],
    domain1: [0, 1],
    scale2: {
      range: ['#000', '#4E40B2'],
      domain: [0, 1000]
    },
    dataset: {},
    dataset1: {},
    dataset2: {},
    grids: {},
    map: null,
    title: null,
    compareOption: null,
    compareValue: null
  },
  getters: {
    impactModels: state => {
      const { climateModel, files, temperature } = state
      if (files == null) return []
      return Object.keys(files[temperature][climateModel])
      // x === 'years' ? { domain: null, name: 'Year', unit: '', variable: 'years' } : variables.find(v => v.variable === x)
    },
    globalWarmingLevels: state => {
      const { temperatures } = state
      return temperatures.map(t => ({
        value: t,
        label: `+${format('.1f')(t)}°C`
      }))
      // x === 'years' ? { domain: null, name: 'Year', unit: '', variable: 'years' } : variables.find(v => v.variable === x)
    }
  },
  mutations: {
    set (state, { prop, value }) {
      state[prop] = value
    },
    clear (state, prop) {
      state[prop] = {}
    },
    setMap (state) {
      state.map = state.dataset[state.temperature]
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
        case 'scenario1':
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
          dispatch('updateMap')
          break
      }
    },
    updateMetadata ({ commit, state, dispatch }) {
      const { variable, indicator, climateModel, impactModel, temperature } = state
      if (variable == null || indicator == null) return
      fetch(`./impacts/${variable}-by-${indicator}/${variable}-by-${indicator}_ISIMIP-projections_world_frequency_map_vs_temperature.json`)
        .then(r => r.json())
        .then(d => {
          commit('set', { prop: 'title', value: d.map_title })
          commit('set', { prop: 'climateModels', value: d.climate_model_list })
          commit('set', { prop: 'impactModels', value: d.impact_model_list })
          commit('set', { prop: 'temperatures', value: d.temperature_list })
          if (d.climate_model_list.indexOf(climateModel) === -1) commit('set', { prop: 'climateModel', value: d.climate_model_list[0] })
          if (d.impact_model_list.indexOf(impactModel) === -1) commit('set', { prop: 'impactModel', value: d.impact_model_list[0] })
          if (d.temperature_list.indexOf(temperature) === -1) commit('set', { prop: 'temperature', value: d.temperature_list[0] })
          dispatch('update', { prop: 'files', value: d.frequency_maps })
          // dispatch('updateMap')
        })
    },
    updateSize ({ commit }) {
      commit('set', { prop: 'width', value: window.innerWidth })
      commit('set', { prop: 'height', value: window.innerHeight })
    },
    updateMap ({ commit, state }) {
      const { climateModel, impactModel, temperature, dataset, variable, indicator } = state
      if (climateModel != null && impactModel != null && temperature != null) {
        if (dataset[temperature] === undefined) {
          if (state.files[state.temperature][state.climateModel][state.impactModel] == null) return
          fetch(`./impacts/${variable}-by-${indicator}/${state.files[state.temperature][state.climateModel][state.impactModel]}`)
            .then(r => r.json())
            .then(data => {
              const map = []
              // const scale = scaleLinear()
              //   .domain(data.domain)
              //   .range(data.range)
              for (let y = 359; y >= 0; y--) {
                const lat = []
                const line = data.grid[y]
                for (let x = 0; x < 720; x++) {
                  lat.push(charcodeToValue(line.charCodeAt(y === 0 ? x : x + 1)))
                }
                map.push(lat)
              }
              if (state.variable === variable && state.indicator === indicator) {
                commit('addMap', { map, temperature })
                if (state.temperature === temperature) {
                  commit('setMap')
                }
              }
            })
        } else {
          commit('setMap')
        }
      }
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
