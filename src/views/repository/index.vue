<template>
  <div class="app-container">
    <div class="icons-container">
      <el-dropdown v-for="item of svgIcons" :key="item" @command="handleCommand">
        <div class="icon-item">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="exchange">Chuyển đồ</el-dropdown-item>
            <el-dropdown-item command="delete">Xóa</el-dropdown-item>
          </el-dropdown-menu>
          <svg-icon :icon-class="item" />
          <span>{{ item }}</span>
        </div>
      </el-dropdown>
    </div>

    <el-dialog title="Chuyển đồ" :visible.sync="exchangeFormVisible">
      <el-form ref="exchangeForm" :model="itemData" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item label="Người nhận" prop="receiveUser">
          <el-input v-model="itemData.receiveUser" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSend">
          Cancel
        </el-button>
        <el-button type="primary" @click="handleSendItem">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import svgIcons from './svg-icons'
export default {
  name: 'Icons',
  data() {
    return {
      exchangeFormVisible: false,
      svgIcons,
      itemData: {
        sendUser: undefined,
        receiveUser: undefined,
        itemCode: undefined,
        itemName: undefined,
        itemImage: undefined,
        createAt: undefined,
        updateAt: undefined
      }
    }
  },
  methods: {
    resetSendData() {
      this.itemData = {
        sendUser: undefined,
        receiveUser: undefined,
        itemCode: undefined,
        itemName: undefined,
        itemImage: undefined,
        createAt: undefined,
        updateAt: undefined
      }
    },
    handleCommand(command) {
      if (command === 'exchange') {
        this.exchangeFormVisible = true
      } else if (command === 'delete') {
        this.$confirm(`Bạn có chắc chắn muốn xóa item này?`, 'Cảnh báo', {
          confirmButtonText: 'Đồng ý',
          cancelButtonText: 'Hủy',
          type: 'error'
        })
      }
    },
    handleCancelSend() {
      this.exchangeFormVisible = false
      this.resetSendData()
      this.$refs['exchangeForm'].clearValidate()
    },
    handleSendItem() {

    }
  }
}
</script>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  span {
    display: block;
    font-size: 16px;
    margin-top: 20px;
  }

  .icon-item {
    margin: 30px;
    height: 50px;
    text-align: center;
    width: 80px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }
}
</style>
