<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="15">
        <el-col :md="8" :sm="12" :xs="24">
          <el-input v-model="elasticQuery.staff_code" placeholder="ID giao dịch" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-input v-model="elasticQuery.full_name" placeholder="Tên người gửi" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-input v-model="elasticQuery.full_name" placeholder="Tên người nhận" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-select v-model="elasticQuery.status" placeholder="--- Loại giao dịch ---" clearable class="filter-item full-width">
            <el-option v-for="item in statusOptions" :key="item.status" :label="item.description" :value="item.status" />
          </el-select>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-date-picker
            v-model="elasticQuery.to_date"
            type="date"
            format="dd/MM/yyyy"
            value-format="dd/MM/yyyy"
            placeholder="Thời gian"
            class="filter-item full-width"
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
      <!-- <el-table-column label="STT" prop="id" align="center" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row.$index }}</span>
        </template>
      </el-table-column> -->
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

    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page-sizes="[10, 25, 50, 100]"
      :page.sync="elasticQuery.page"
      :limit.sync="elasticQuery.page_size"
      @pagination="getTransactionHistory"
    /> -->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import { elasticQuery } from '@/api/exchange'

export default {
  name: 'StaffTable',
  directives: { waves },
  components: { Pagination },
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
      statusOptions: [
        {
          status: -1,
          description: 'Chuyển đồ'
        },
        {
          status: 1,
          description: 'Nhận đồ'
        }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
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
      this.elasticQuery.page = 1
      this.getTransactionHistory()
    },
    handleDetail(staffId) {
      this.$router.push({ path: `/management-staff/staff-detail/${staffId}/` })
    }
  }
}
</script>
