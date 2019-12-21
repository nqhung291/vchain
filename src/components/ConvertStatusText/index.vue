<template>
  <div>
    <span v-for="item in status" :key="item.code">{{ item.description }}</span>
  </div>
</template>

<script>
import { listStatus } from '../constants'
export default {
  name: 'ConvertStatusText',
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  computed: {
    status() {
      // TODO: switch value to icon
      return listStatus.filter(obj => {
        return obj.code === this.value
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
