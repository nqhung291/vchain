<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="itemList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      {{ itemList }}
      <el-table-column label="Mã vật phẩm" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.itemCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Tên vật phẩm" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.itemName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Số lượng" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.quantity }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { elasticQuery } from '@/api/exchange'
export default {
  data() {
    return {
      tableKey: 0,
      listLoading: false,
      itemList: [],
      sendItem: null,
      receiveItem: null,
      sendItemQuantity: new Map(),
      receiveItemQuantity: new Map(),
      itemQuantity: null,
      elasticQuery: {
        query: {
          bool: {
            must: []
          }
        }
      },
      itemMapping: [
        {
          itemCode: 'sung001',
          itemName: 'AK'
        },
        {
          itemCode: 'sung002',
          itemName: 'M416'
        }
      ]
    }
  },
  created() {
    this.getItemList()
  },
  methods: {
    async getItemList() {
      this.elasticQuery.query.bool.must = [
        {
          match: {
            sendUser: this.$store.state.user.name
          }
        }
      ]
      await elasticQuery(this.elasticQuery).then(response => {
        this.sendItem = response
        this.sendItem.forEach(e => {
          if (this.sendItemQuantity.has(e.itemCode)) {
            this.sendItemQuantity.set(e.itemCode, this.sendItemQuantity.get(e.itemCode) + 1)
          } else {
            this.sendItemQuantity.set(e.itemCode, 1)
          }
        })
      })
      this.elasticQuery.query.bool.must = [
        {
          match: {
            receiveUser: this.$store.state.user.name
          }
        }
      ]
      await elasticQuery(this.elasticQuery).then(response => {
        this.receiveItem = response
        this.receiveItem.forEach(e => {
          if (this.receiveItemQuantity.has(e.itemCode)) {
            this.receiveItemQuantity.set(e.itemCode, this.receiveItemQuantity.get(e.itemCode) + 1)
          } else {
            this.receiveItemQuantity.set(e.itemCode, 1)
          }
        })
      })
      console.log('send', this.sendItemQuantity)
      console.log('receive', this.receiveItemQuantity)

      this.receiveItemQuantity.forEach((value, key, map) => {
        const receiveNumber = value
        let sendNumber = 0
        if (this.sendItemQuantity.has(key)) {
          sendNumber = this.sendItemQuantity.get(key)
        }
        this.itemList.push({
          itemCode: key,
          itemName: this.itemMapping.find(e => e.itemCode === key).itemName,
          quantity: receiveNumber - sendNumber
        })
      })
      // for (const [key, value] of Object.entries(this.receiveItemQuantity)) {
      //   const receiveNumber = this.receiveItemQuantity[key]
      //   const sendNumber = this.sendItemQuantity[key] ? this.sendItemQuantity[key] : 0
      //   console.log(key, receiveNumber - sendNumber)
      //   this.itemList.push({
      //     itemCode: key,
      //     quantity: receiveNumber - sendNumber
      //   })
      // }

      // console.log(this.itemList)
    }

  }
}

</script>

<style lang="scss" scoped>

</style>
