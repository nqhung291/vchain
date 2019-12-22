<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="15">
        <el-col :md="8" :sm="12" :xs="24">
          <el-input v-model="transactionFilter.id" placeholder="ID giao dịch" clearable class="filter-item" />
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-input v-model="transactionFilter.sendUser" placeholder="Tên người gửi" clearable class="filter-item" />
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-input v-model="transactionFilter.receiveUser" placeholder="Tên người nhận" clearable class="filter-item" />
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-input v-model="transactionFilter.itemCode" placeholder="Mã vật phẩm" clearable class="filter-item" />
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-input v-model="transactionFilter.itemName" placeholder="Tên vật phẩm" clearable class="filter-item" />
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-date-picker
            v-model="transactionFilter.timestamp"
            class="filter-item full-width"
            type="daterange"
            range-separator="đến"
            value-format="timestamp"
            start-placeholder="Từ ngày"
            end-placeholder="ngày"
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
            should: [
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
            ]
          }
        }
      },
      transactionFilter: {
        id: '',
        sendUser: '',
        receiveUser: '',
        itemCode: '',
        itemName: '',
        timestamp: ''
      }
    }
  },
  created() {
    this.getTransactionHistory()
  },
  methods: {
    getTransactionHistory() {
      this.listLoading = true
      elasticQuery(this.elasticQuery).then(response => {
        this.transactionList = response
        this.listLoading = false
      })
    },
    handleFilter() {
      this.elasticQuery.query.bool.must = []
      Object.keys(this.transactionFilter).forEach(key => {
        if (key === 'timestamp' && Array.isArray(this.transactionFilter[key])) {
          this.elasticQuery.query.bool.must.push({
            range: {
              timestamp: { gte: this.transactionFilter.timestamp[0] / 1000, lte: this.transactionFilter.timestamp[1] / 1000 }
            }
          })
        } else if (this.transactionFilter[key] != null && this.transactionFilter[key] !== '') {
          this.elasticQuery.query.bool.must.push({
            match: {
              [key]: this.transactionFilter[key]
            }
          })
        }
      })
      this.listLoading = true
      elasticQuery(this.elasticQuery).then(response => {
        this.transactionList = response
        this.listLoading = false
      })
    }
  }
}
</script>
