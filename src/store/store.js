import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    pics: [],
    filters: {
      date: false,
      cam: false
    },
    camChr: {
      options: {
        labels: ['N/a']
      },
      series: [1]
    },
    dayChr: {
      options: {
        labels: ['N/a']
      },
      series: [1]
    }
  },
  getters: {
    fPics: state => {
      return state.pics.filter(pic => {
        let selected = true
        if (state.filters.date !== false && state.filters.date !== pic.earth_date) {
          selected = false
        }
        if (state.filters.cam !== false && state.filters.cam !== pic.camera.name) {
          selected = false
        }
        return selected
      }).slice(0, 12)
    },
    camData: state => {
      return state.camChr
    },
    dayData: state => {
      return state.dayChr
    },
    filters: state => {
      return state.filters
    }
  },
  mutations: {
    camChrFormat: (state) => {
      let cams = []

      state.pics.map(pic => {
        if (pic.camera !== undefined) { cams[pic.camera.name] = (cams[pic.camera.name] === undefined) ? 1 : cams[pic.camera.name] + 1 }
      })

      state.camChr = {
        options: {
          labels: Object.keys(cams)
        },
        series: Object.values(cams)
      }
    },
    dayChrFormat: (state) => {
      let days = []

      state.pics.map(pic => {
        if (pic.earth_date !== undefined) { days[pic.earth_date] = (days[pic.earth_date] === undefined) ? 1 : days[pic.earth_date] + 1 }
      })

      state.dayChr = {
        options: {
          labels: Object.keys(days)
        },
        series: Object.values(days)
      }
    },
    addPics: (state, pics) => {
      state.pics = [...state.pics, ...pics]
    },
    clearPics: state => {
      state.pics = []
    },
    filterDay: (state, day) => {
      state.filters.date = state.dayChr.options.labels[day]
    },
    filterCam: (state, cam) => {
      state.filters.cam = state.camChr.options.labels[cam]
    },
    clearFilters: state => {
      state.filters = {
        date: false,
        cam: false
      }
    }
  },
  actions: {
    selectDay: (ctx, data) => {
      ctx.commit('filterDay', data)
    },
    selectCam: (ctx, data) => {
      ctx.commit('filterCam', data)
    },
    clearFilters: ctx => {
      ctx.commit('clearFilters')
    },
    getData: ctx => {
      let mdate = new Date()
      mdate.setDate(mdate.getDate() - 3)

      ctx.commit('clearPics')

      // Api needs few calls for each day to fill 7 days period
      for (let i = 0; i < 7; i++) {
        mdate.setDate(mdate.getDate() - 1)
        let strDate = mdate.toISOString().split('T')[0]
        if (localStorage.getItem('pics_' + strDate)) {
          // check if there is cached data for that date
          // cache is also there to fix day call limit of 40
          ctx.commit('addPics', JSON.parse(localStorage.getItem('pics_' + strDate)))
          ctx.commit('camChrFormat')
          ctx.commit('dayChrFormat')
        } else {
          axios.get('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=' + strDate + '&api_key=DEMO_KEY')
            .then(response => {
            // caching results
              localStorage.setItem('pics_' + strDate, JSON.stringify(response.data.photos))
              ctx.commit('addPics', response.data.photos)
              ctx.commit('camChrFormat')
              ctx.commit('dayChrFormat')
            })
            .catch(error => {
              console.log(error)
            })
        }
      }
    }
  }
})
