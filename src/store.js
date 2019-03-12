import Vue from 'vue'
import Vuex from 'vuex'
import fetch from 'unfetch'
import { scaleLinear } from 'd3-scale'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    width: window.innerWidth,
    height: window.innerHeight,
    mode: 0,
    variable1: 'tas',
    variable2: 'pr',
    scenario1: 'rcp60',
    scenario2: 'rcp26',
    period1: 2095,
    period2: 2005,
    range1: ['#00CC84', '#D2FEFF', '#4E40B2'],
    domain1: [-40, 0, 40],
    scale2: {
      range: ['#000', '#4E40B2'],
      domain: [0, 1000]
    },
    dataset1: {},
    dataset2: {},
    grids: {},
    map: null
  },
  mutations: {
    set (state, { prop, value }) {
      state[prop] = value
    },
    clear (state, prop) {
      state[prop] = {}
    },
    setMap (state) {
      state.map = state.dataset1[state.period1]
    },
    addMap (state, { map, period }) {
      state.dataset1[period] = map
    },
    addGrid (state, { grid, period }) {
      state.grids[period] = grid
    }
  },
  actions: {
    update ({ commit, dispatch }, d) {
      commit('set', d)
      switch (d.prop) {
        case 'scenario1':
        case 'variable1':
          commit('clear', 'dataset1')
        case 'domain1':
          commit('clear', 'grids')
        case 'period1':
        case 'period2':
          dispatch('updateMap')
          break
      }
    },
    updateSize ({ commit }) {
      commit('set', { prop: 'width', value: window.innerWidth })
      commit('set', { prop: 'height', value: window.innerHeight })
    },
    updateMap ({ commit, state }) {
      const { dataset1, period1, variable1, scenario1 } = state
      if (dataset1[period1] === undefined) {
        fetch(`/data/${variable1}-${scenario1}-${period1}.json`)
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
            if (state.variable1 === variable1 && state.scenario1 === scenario1) {
              commit('addMap', { map, period: period1 })
              if (state.period1 === period1) {
                commit('setMap')
              }
            }
          })
      } else {
        commit('setMap')
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
