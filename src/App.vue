<template>
  <div id="app">
    <Filters></Filters>
    <Gallery></Gallery>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import Gallery from './components/Gallery'
import Filters from './components/Filters'

export default {
  name: 'App',
  components: {
    Gallery,
    Filters
  },
  methods: {
    ...mapActions(['getData'])
  },
  mounted () {
    this.getData()
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
