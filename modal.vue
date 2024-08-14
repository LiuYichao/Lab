<template>
  <div class="modal-vue">
    <div class="overlay" v-if="showModal"></div>

    <!-- modal -->
    <div class="modal" v-if="showModal">
      <button class="close" @click="showModal = false">x</button>
      <h3>Title</h3>
      <div class="process-bar-wordpress" :style="{'--process': process}"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "modalCom",
  data() {
    return {
      showModal: true,
      process: '70%'
    };
  },
  methods: {},
  mounted() {},
};
</script>
<style>
.modal-vue {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}
.modal-vue .overlay {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-vue .modal {
  position: relative;
  width: 300px;
  z-index: 9999;
  margin: 0 auto;
  padding: 20px 30px;
  background-color: #fff;
}

.modal-vue .close {
  position: absolute;
  top: 10px;
  right: 10px;
}
.process-bar-wordpress{
  width: 100%;
  height: 20px;
  background-color: #eee;
  position: relative;
  border-radius: 10px;
}
.process-bar-wordpress:before{
  content: '';
  position: absolute;
  width: var(--process);;
  height: 20px;
  border-radius: 10px;
  background-color: #07a899;
  animation: processbar-wordpress 2s ease-in;
}

</style>
