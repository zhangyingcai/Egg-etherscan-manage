<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item mb-1" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新建
      </el-button>
      <el-input style="width:400px" v-model="address" placeholder="请输入地址"></el-input>
      <el-button v-show="address" class="filter-item mb-1" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleSearch">
        search
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + limit * (page-1) + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="address">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.value | tokenMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column label="百分比" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.percentage }} %
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="信息" align="center">
        <template slot-scope="scope">
          {{ scope.row.tag }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" :limit.sync="limit" :page.sync="page" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px">
        <el-form-item label="address" prop="address">
          <el-input v-model="temp.address" />
        </el-form-item>
        <el-form-item label="数量" prop="value">
          <el-input v-model="temp.value" />
        </el-form-item>
        <el-form-item label="百分比" prop="percentage">
          <el-input v-model="temp.percentage" />
        </el-form-item>
        <el-form-item label="信息" prop="tag">
          <el-input v-model="temp.tag" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, update, postCreate, holderDelete, holderSearch } from '@/api/holder'
import Pagination from '@/components/Pagination'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    tokenMoney(value) {
      const arr = value.toString().split('.')
      let last = ''
      if (arr.length > 1) {
        last = '.' + arr[1]
      }
      return arr[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + last
    }
  },
  components: {
    Pagination
  },
  data() {
    return {
      list: [],
      listLoading: true,
      limit: 10,
      page: 1,
      total: 0,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogFormVisible: false,
      temp: {
        address: '',
        value: '',
        tag: '',
        percentage: 0
      },
      rules: {},
      address: ''
    }
  },
  created() {
    this.page = 1
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList({ page: this.page, limit: this.limit }).then(response => {
        this.list = response.result || []
        this.total = response.total || 0
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.listLoading = false
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    handleUpdate(row) {
      const temp = Object.assign({}, row)
      this.temp = temp
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    handleDelete(row) {
      this.listLoading = true
      holderDelete(row).then(res => {
        this.fetchData()
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.listLoading = false
      })
    },
    createData() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          const data = { ...this.temp }
          this.listLoading = true
          postCreate(data).then(res => {
            this.dialogFormVisible = false
            this.fetchData()
          }).catch(e => {
            console.log(e)
          }).finally(() => {
            this.listLoading = false
          })
        }
      })
    },
    updateData() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          const data = { ...this.temp }
          this.listLoading = true
          update(data).then(res => {
            this.dialogFormVisible = false
            this.fetchData()
          }).catch(e => {
            console.log(e)
          }).finally(() => {
            this.listLoading = false
          })
        }
      })
    },
    handleSearch() {
      this.listLoading = true
      holderSearch({ page: this.page, limit: this.limit, address: this.address }).then(res => {
        this.list = res.result || []
        this.total = res.total || 1
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        address: '',
        value: '',
        tag: '',
        percentage: 0
      }
    }
  }
}
</script>
