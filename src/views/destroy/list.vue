<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item mb-1" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新建
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
      <el-table-column label="hash">
        <template slot-scope="scope">
          {{ scope.row.hash }}
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.value | tokenMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.timeStamp | parseTime('{y}-{m}-{d}') }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="信息" align="center">
        <template slot-scope="scope">
          {{ scope.row.message }}
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
        <el-form-item label="hash" prop="hash">
          <el-input v-model="temp.hash" />
        </el-form-item>
        <el-form-item label="数量" prop="value">
          <el-input v-model="temp.value" />
        </el-form-item>
        <el-form-item label="时间" prop="timeStamp">
          <el-date-picker v-model="temp.timeStamp" value-format="timestamp" type="date" />
        </el-form-item>
        <el-form-item label="原因" prop="message">
          <el-input v-model="temp.message" type="textarea" :rows="2" />
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
import { getList, update, postCreate, destroyDelete } from '@/api/destroy'
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
        hash: '',
        value: '',
        message: '',
        timeStamp: Date.now()
      },
      rules: {}
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
      temp.timeStamp = temp.timeStamp * 1000
      this.temp = temp
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    handleDelete(row) {
      destroyDelete(row).then(res => {
        this.fetchData()
      }).catch(e => {
        console.log(e)
      })
    },
    createData() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          const data = { ...this.temp }
          data.timeStamp = data.timeStamp / 1000
          postCreate(data).then(res => {
            this.dialogFormVisible = false
            this.fetchData()
          }).catch(e => {
            console.log(e)
          })
        }
      })
    },
    updateData() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          const data = { ...this.temp }
          data.timeStamp = data.timeStamp / 1000
          update(data).then(res => {
            this.dialogFormVisible = false
            this.fetchData()
          }).catch(e => {
            console.log(e)
          })
        }
      })
    },
    resetTemp() {
      this.temp = {
        hash: '',
        value: '',
        message: '',
        timeStamp: Date.now()
      }
    }
  }
}
</script>
