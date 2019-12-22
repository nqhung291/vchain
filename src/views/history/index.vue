<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="15">
        <el-col :md="8" :sm="12" :xs="24">
          <el-input v-model="elasticQuery.id" placeholder="ID giao dịch" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-input v-model="elasticQuery.sendUser" placeholder="Tên người gửi" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-input v-model="elasticQuery.receiveUser" placeholder="Tên người nhận" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-input v-model="elasticQuery.itemCode" placeholder="Mã vật phẩm" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-input v-model="elasticQuery.itemName" placeholder="Tên vật phẩm" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-date-picker
            v-model="elasticQuery.timestamp"
            class="filter-item full-width"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
          />
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Search
          </el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="transactionList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID giao dịch" prop="staff_code" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Người gửi" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.sendUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Người nhận" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.receiveUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Mã giao dịch blockchain" min-width="400" align="center">
        <template slot-scope="{row}">
          <span>{{ row.transactionIdBlockchain }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="Thời gian" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ new Date(row.timestamp * 1000).toLocaleString() }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { elasticQuery } from '@/api/exchange'

export default {
  name: 'StaffTable',
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      transactionList: null,
      total: 0,
      listLoading: true,
      elasticQuery: {
        query: {
          bool: {
            should: [],
            must: [],
            filter: [],
            must_not: []
          }
        }
      },
      transactionFilter: {
        id: null,
        sendUser: null,
        receiveUser: null,
        itemCode: null,
        itemName: null,
        timestamp: null
      }
    }
  },
  created() {
    this.getTransactionHistory()
  },
  methods: {
    getTransactionHistory() {
      this.listLoading = true
      this.elasticQuery.query.bool.should.push(
        {
          match: {
            sendUser: this.$store.state.user.name
          }
        },
        {
          match: {
            receiveUser: this.$store.state.user.name
          }
        }
      )
      elasticQuery(this.elasticQuery).then(response => {
        this.transactionList = response
        this.listLoading = false
      })
    },
    handleFilter() {

    }
  }
}
</script>
