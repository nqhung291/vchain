<template>
  <span>
    <el-tag
      v-for="item in status"
      :key="item.code"
      :type="item.type"
      effect="dark"
    >
      {{ item.description }}
    </el-tag>
  </span>
</template>

<script>
import { listStatus } from '../constants'

export default {
  name: 'ConvertStatus',

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
