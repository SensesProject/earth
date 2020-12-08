import Vue from 'vue'
import Vuex from 'vuex'
import fetch from 'unfetch'
import grids from '@/assets/data/grids.json'

const indicators = [...new Set(grids.files.map(f => f.indicator))]
const impactModels = [...new Set(grids.files.map(f => f.im))]
const climateModels = [...new Set(grids.files.map(f => f.cm))]
const warmingLevels = [...new Set(grids.files.map(f => f.wl))]

Vue.use(Vuex)

let indicator = 'heatwave'
if (indicators.indexOf(location.hash.split('#')[1]) !== -1) {
  indicator = location.hash.split('#')[1]
  location.hash = ''
}

export default new Vuex.Store({
  state: {
    showAbout: false,
    showCountryDetails: null,
    indicator,
    indicators,
    impactModel: impactModels[0],
    impactModels,
    climateModel: climateModels[0],
    climateModels,
    warmingLevel: warmingLevels[warmingLevels.length - 1],
    warmingLevels,
    files: grids.files,
    scales: grids.scales,
    grid: null,
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
      dispatch('updateGrid')
    },
    update ({ commit, dispatch }, d) {
      commit('set', d)
      switch (d.prop) {
        case 'indicator':
        case 'climateModel':
        case 'impactModel':
        case 'warmingLevel':
          dispatch('updateGrid')
          break
      }
    },
    updateGrid ({ commit, state }) {
      const { files, indicator, climateModel, impactModel, warmingLevel } = state
      let file = files.find(f => f.indicator === indicator && f.cm === climateModel && f.im === impactModel && f.wl === warmingLevel)
      if (file == null) {
        file = files.find(f => f.indicator === indicator && f.cm === climateModel && f.wl === warmingLevel)
        commit('set', { prop: 'impactModel', value: file.im })
      }

      fetch(`./grids/${file.name}`)
        .then(r => r.text())
        .then(d => {
          commit('set', { prop: 'grid', value: d })
        })
    }
  }
})
