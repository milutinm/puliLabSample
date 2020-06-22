<template>
<div class="card">
  <div class="card-header">
    <h2>Filters</h2>
  </div>
  <div class="card-body">
    <div class="row">
    <div class="col-sm-6 col-md-4">
        <apexCharts
          width="95%"
          type="pie"
          :options="dayData.options"
          :series="dayData.series"
          v-on:dataPointSelection="preSelectDay"
        ></apexCharts>
      </div>
    <div class="col-sm-6 col-md-4">
        <apexCharts
          width="100%"
          type="pie"
          :options="camData.options"
          :series="camData.series"
          v-on:dataPointSelection="preSelectCam"
        ></apexCharts>
    </div>
    <div class="col-sm-12 col-md-4">
        <div class="row">
          <button type="button" class="btn btn-primary" @click="clearFilters">clear filters</button>
        </div>
        <div class="row">
          filters: {{ filters }}
        </div>
    </div>
    </div>
  </div>
</div>
</template>

<script>
import apexCharts from 'vue-apexcharts'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Filters',
  components: {
    apexCharts
  },
  computed: {
    ...mapGetters(['filters', 'dayData', 'camData'])
  },
  methods: {
    preSelectDay (event, chartContext, config) {
      this.selectDay(config.dataPointIndex)
    },
    preSelectCam (event, chartContext, config) {
      this.selectCam(config.dataPointIndex)
    },
    ...mapActions(['clearFilters', 'selectDay', 'selectCam'])
  }

}
</script>

<style scoped>

</style>
