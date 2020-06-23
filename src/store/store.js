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
    // filtered pictures
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
    // Get formated data for camera chart
    camData: state => {
      return state.camChr
    },
    // Get formated data fro day chart
    dayData: state => {
      return state.dayChr
    },
    // Selected filters for filtering fPics
    filters: state => {
      return state.filters
    }
  },
  mutations: {
    // Format data for cameta chart
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
    // Format data for day chart
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
    // Add day pictures array existing pictures to pictures array
    addPics: (state, pics) => {
      state.pics = [...state.pics, ...pics]
    },
    // Clears pictures array
    clearPics: state => {
      state.pics = []
    },
    // Sets filtering by day
    filterDay: (state, day) => {
      state.filters.date = state.dayChr.options.labels[day]
    },
    // Sets filtering by camera
    filterCam: (state, cam) => {
      state.filters.cam = state.camChr.options.labels[cam]
    },
    // Clears all filters
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
    // Initial loading of pictures from API
    getData: ctx => {
      let mdate = new Date()

      // Seting start day to 3 days ago.
      // API was missing last 2 days of pictures
      mdate.setDate(mdate.getDate() - 3)

      // Clearing current pics list
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
          // Get picture array from API
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
