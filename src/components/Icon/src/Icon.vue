<template>
  <i :class="`iconfont ${icon}`" />
</template>

<script lang="ts" setup>

interface IconProps {
  icon: string,
}

const props = defineProps<IconProps>()
const { icon } = toRefs(props)


</script>

<style lang="scss" scoped></style>
