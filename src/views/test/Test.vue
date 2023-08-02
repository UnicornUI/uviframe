<script setup lang="ts">
let show: boolean = true
console.log(show)
</script>

<template>
  <div class="app-w">
    OpenSourceClient
    <br />
    {{ app.getConfig("baseUrl") }}
    <Icon icon="icon-bianji" />
    <br />
    {{ tools.LocalStorage.setItem("hello", "world") }}
    {{ lpk("Index") }}
  </div>
  <van-button type="primary">按钮</van-button>
  <!-- <van-calendar v-model:show="show"/> -->
  <div class="theme">
    <div class="theme-item" v-for="index in 3">{{ index }}</div>
  </div>
</template>

<style lang='scss' scoped>
.app-w {
  display: flex;
  color: #f00;
}

.theme {
  display: flex;
  justify-content: space-between;

  .theme-item {
    margin: 18px 20px;
    width: 30%;
    padding: 80px 0px;
    text-align: center;
    background-color: var(--primary-bg);
    color: var(--primary-color);
    /*
    @include fontSize("big-size");
    @include bg();
    @include color();
    background: #F00; 
    color: #FFF; 
    */
  }
}
</style>


