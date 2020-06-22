import { store } from '@/store/store'
import { api } from '../mock'

describe('Vuex store', () => {
  store.commit('addPics', api.pics)

  it('have mockData', () => {
    expect(store.state.pics.length).toBeGreaterThan(0)
  })

  it('format cam chart data', () => {
    expect(store.state.camChr.options.labels.length).toBe(1)
    store.commit('camChrFormat')
    expect(store.state.camChr.options.labels.length).toBeGreaterThan(1)
  })

  it('format day chart data', () => {
    expect(store.state.dayChr.options.labels.length).toBe(1)
    store.commit('dayChrFormat')
    expect(store.state.dayChr.options.labels.length).toBeGreaterThan(1)
  })

  it('filter pics by day', () => {
    // store.getters.fPics(store.state)
    store.commit('filterDay', 2)

    expect(store.getters.fPics.filter(
      pic => {
        return pic.earth_date === store.state.dayChr.options.labels[2]
      }
    ).length).toBe(store.getters.fPics.length)
  })
})
