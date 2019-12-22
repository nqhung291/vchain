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
      itemList: [
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
