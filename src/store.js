import Vue from 'vue'
import Vuex from 'vuex'
import fetch from 'unfetch'
import { scaleLinear } from 'd3-scale'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    variable: 'tas',
    scenario: 'rcp60',
    year: 2025,
    map: null,
    maps: {}
  },
  mutations: {
    set (state, { prop, value }) {
      state[prop] = value
    },
    setVariable (state, variable) {
      state.variable = variable
    },
    setScenario (state, scenario) {
      state.scenario = scenario
    },
    setYear (state, year) {
      state.year = year
    },
    setMap (state) {
      state.map = state.maps[`${state.variable}-${state.scenario}-${state.year}`]
    },
    addMap (state, { map, mapName }) {
      state.maps[mapName] = map
    }
  },
  actions: {
    update ({ commit }, d) {
      commit('set', d)
    },
    updateVariable ({ commit }, variable) {
      commit('setVariable', variable)
    },
    updateScenario ({ commit, dispatch }, scenario) {
      commit('setScenario', scenario)
      dispatch('updateMap')
    },
    updateYear ({ commit, dispatch }, year) {
      commit('setYear', year)
      dispatch('updateMap')
    },
    updateMap ({ commit, state }) {
      if (state.maps[`${state.variable}-${state.scenario}-${state.year}`] === undefined) {
        fetch(`/data/${state.variable}-${state.scenario}-${state.year}.json`)
          .then(r => r.json())
          .then(data => {
            const map = []
            const scale = scaleLinear()
              .domain(data.domain)
              .range(data.range)
            for (let y = 359; y >= 0; y--) {
              const lat = []
              const line = data.grid[0][y]
              for (let x = 0; x < 720; x++) {
                lat.push(scale(charcodeToValue(line.charCodeAt(x))))
              }
              map.push(lat)
            }
            commit('addMap', { map, mapName: `${state.variable}-${state.scenario}-${state.year}` })
            commit('setMap')
          })
      } else {
        commit('setMap')
      }
    }
  }
})

function charcodeToValue (code) {
  if (code >= 93) code--
  if (code >= 35) code--
  return code - 32
}
