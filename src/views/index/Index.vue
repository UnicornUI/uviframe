<template>
  <div class="index-w">
    <div class="title">Index.vue</div>
    <KeepAliveRouterView />
    <ul class="g-flex-rsbc">
      <li>
        <!--
          home 虽然是 index 的子菜单(默认菜单) 但是在 router-link 
          中为了保证跳转的顺利进行，不能使用父级路由(index)，需要使用真正的路由 home
        -->
        <router-link :to="{ name: 'home' }">{{ lpk('page.index.home') }}</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'blog-index' }">{{ lpk("page.blog.index") }}</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'mine' }">{{ lpk('page.index.profile') }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import UserApi from '@/api/UserApi';


onMounted(async () => {
  const user = await UserApi.get({ id: 1 })
  console.log("获取到的用户数据", user);
});

</script>

<style lang="scss" scoped>
.index-w {
  background: #ee3ed1;
  padding: 20px;

  .title {
    margin: 30px;
  }

}
</style>

