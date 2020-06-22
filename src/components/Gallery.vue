<template>
  <div class="card">
    <div class="card-header">
      <h2>Galery</h2>
    </div>
  <div class="card-body">
    <div class="row">
       <div v-for="pic in fPics" :key="pic.id" class="col-sm-6 col-md-3">
          <div class = "thumbnail">
            <img :src="pic.img_src" :alt="pic.id" @click="selectedImage = pic" class="img-thumbnail float-left mx-auto d-block"  data-toggle="modal" data-target="#fullimg">
          </div>
          <div class = "caption">
            <h3>{{ pic.id }}</h3>
            <p> {{ pic.earth_date}} - {{ pic.camera.name }} </p>
          </div>
       </div>
    </div>
    </div>

    <div class="modal" tabindex="-1" role="dialog" id="fullimg">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">ID:{{ selectedImage.id }} - CAM:{{ selectedImage.camera.name }} - DATE:{{ selectedImage.earth_date }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="selectedImage.img_src" class="img-fluid" alt="Responsive image">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apexCharts from 'vue-apexcharts'

import { mapGetters } from 'vuex'

export default {
  name: 'Gallery',
  components: {
    apexCharts
  },
  data () {
    return {
      selectedImage: {id: 0, camera: {name: ''}, earth_date: ''}
    }
  },
  computed: {
    ...mapGetters(['fPics'])
  }
}
</script>

<style scoped>
.img-thumbnail {
  cursor: pointer;
}
</style>
