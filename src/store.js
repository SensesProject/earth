import Vue from 'vue'
import Vuex from 'vuex'
import fetch from 'unfetch'
import pako from 'pako'
import grids from '@/assets/data/grids.json'

const indicators = [...new Set(grids.files.map(f => f.indicator))]
const impactModels = [...new Set(grids.files.map(f => f.im))]
const climateModels = [...new Set(grids.files.map(f => f.cm))]
const warmingLevels = [...new Set(grids.files.map(f => f.wl))]

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    width: window.innerWidth,
    height: window.innerHeight,
    showAbout: false,
    showCountryDetails: null,
    indicator: 'heatwave',
    indicators,
    impactModel: impactModels[0],
    impactModels,
    climateModel: climateModels[0],
    climateModels,
    warmingLevel: warmingLevels[warmingLevels.length - 1],
    warmingLevels,
    files: grids.files,
    scales: grids.scales,
    map: null,
    title: null
  },
  getters: {
    impactModels: state => {
      const { files, indicator } = state
      return [...new Set(files.filter(f => f.indicator === indicator).map(f => f.im))]
    },
    scale: state => {
      const { files, indicator, impactModel, climateModel } = state
      if (files.find(f => f.indicator === indicator && f.cm === climateModel && f.im === impactModel) == null) return { range: [0, 1] }
      return files.find(f => f.indicator === indicator && f.cm === climateModel && f.im === impactModel).scale
    }
  },
  mutations: {
    set (state, { prop, value }) {
      state[prop] = value
    }
  },
  actions: {
    init ({ dispatch }, d) {
      dispatch('updateMap')
    },
    update ({ commit, dispatch }, d) {
      commit('set', d)
      switch (d.prop) {
        case 'indicator':
        case 'climateModel':
        case 'impactModel':
        case 'warmingLevel':
          dispatch('updateMap')
          break
      }
    },
    updateSize ({ commit }) {
      commit('set', { prop: 'width', value: window.innerWidth })
      commit('set', { prop: 'height', value: window.innerHeight })
    },
    updateMap ({ commit, state }) {
      const { files, indicator, climateModel, impactModel, warmingLevel } = state
      let file = files.find(f => f.indicator === indicator && f.cm === climateModel && f.im === impactModel && f.wl === warmingLevel)
      if (file == null) {
        file = files.find(f => f.indicator === indicator && f.cm === climateModel && f.wl === warmingLevel)
        commit('set', { prop: 'impactModel', value: file.im })
      }

      fetch(`./grids/${file.name}`)
        .then(r => r.text())
        .then(d => {
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
          commit('set', { prop: 'map', value: map })
        })
    }
  }
})

function charcodeToValue (code) {
  if (code >= 93) code--
  if (code >= 35) code--
  return code - 32
}
