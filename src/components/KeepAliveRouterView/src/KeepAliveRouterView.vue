<template>
  <router-view v-slot="{ Component }">
    <KeepAlive :exclude="excludeNames.concat(',')">
      <component :is="Component" />
    </KeepAlive>
  </router-view>
</template>

<script lang="ts" setup>

import { get } from 'lodash';
import { reactive, toRefs, watch } from 'vue';
import { useRoute } from "vue-router";

interface KeepAliveRouterViewState {
  excludeNames: string[];
}
/**
> exclude 中需要以数组`[]`的形式或者 "name1 | name2 | name3" 形式
> 3.2.34+ 版本在 setup 语法使用的单文件组件会自动根据文件名生成对应的组件名
*/
const states = reactive<KeepAliveRouterViewState>({
  excludeNames: [],
});


const { excludeNames } = toRefs(states)


watch(useRoute(), (newValue, _) => {
  if (false === get(newValue, "meta.keepAlive", true)) {
    const cmpName = get(newValue, "meta.cmpName", "") as string;
    if (cmpName && -1 == states.excludeNames.indexOf(cmpName)) {
      states.excludeNames.push(cmpName);
    }
  }
})


</script>

<style lang="scss" scoped></style>
