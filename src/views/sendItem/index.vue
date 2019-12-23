<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" style="text-align: center">
        <h3>Thông tin gửi đồ</h3>
      </el-col>
    </el-row>
    <el-form ref="importFile" :rules="rule" :model="sendData" label-width="150px" label-position="left">
      <div style="margin-top: 20px;">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="{'span': 12, 'offset': 6}" class="border border-gray">
            <el-card class="box-card">
              <el-form-item label="Người gửi:">
                <span>{{ sendData.sendUser }}</span>
              </el-form-item>
              <el-form-item label="Người nhận:" prop="receiveUser">
                <el-input v-model="sendData.receiveUser" />
              </el-form-item>
              <el-form-item label="Tên item:" prop="itemName">
                <el-select v-model="sendData.itemName" placeholder="Tên Item" clearable filterable class="filter-item full-width" @change="selectChange">
                  <el-option v-for="(item, index) in itemList" :key="index" :label="item.itemName" :value="item.itemName" />
                </el-select>
              </el-form-item>
              <el-form-item label="Mã item:">
                <span>{{ sendData.itemCode }}</span>
              </el-form-item>
            </el-card>
            <div class="right-align" style="margin-top:20px">
              <el-button type="info" size="large" @click="handleCancelSend">
                Hủy
              </el-button>
              <el-button type="primary" size="large" @click="handleSendItem">
                Gửi
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-form></div>
</template>

<script>
import { mapGetters } from 'vuex'
import { sendItem } from '@/api/exchange'
import { elasticQuery } from '@/api/exchange'
export default {
  data() {
    return {
      rule: {
        receiveUser: [{ required: true, trigger: 'change', message: 'Người nhận không được bỏ trống' }],
        itemName: [{ required: true, trigger: 'change', message: 'Tên item không được bỏ trống' }]
      },
      sendData: {
        sendUser: this.$store.state.user.name,
        receiveUser: null,
        itemCode: null,
        itemName: null
        // itemImage: null
      },
      // imageSrc: null,s
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
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getItemList()
  },
  methods: {
    resetForm() {
      this.sendData = {
        sendUser: this.$store.state.user.name,
        receiveUser: undefined,
        itemCode: undefined,
        itemName: undefined
      }
    },
    handleCancelSend() {
      this.resetForm()
    },
    selectChange() {
      this.sendData.itemCode = this.itemList.find(e => e.itemName === this.sendData.itemName).itemCode
    },
    handleSendItem() {
      this.sendData.createAt = new Date().toJSON()
      sendItem(this.sendData).then(res => {
        console.log(res)
        this.$router.push({ path: `/history` })
        this.$notify({
          title: 'Thành công',
          message: 'Tạo giao dịch thành công',
          type: 'success'
        })
        this.resetForm()
      })
    },
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
        if (sendNumber > 0) {
          this.itemList.push({
            itemCode: key,
            itemName: this.itemMapping.find(e => e.itemCode === key).itemName,
            quantity: receiveNumber - sendNumber
          })
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
  .item {
    display: block;
    overflow: hidden;
    margin-bottom: 14px;
    line-height: 24px;
  }

  .right-align {
    display: flex;
    justify-content: flex-end;
  }

  img {
    display: flex;
    justify-content: flex-start;
    width : 150px;
    height: auto;
  }
</style>
